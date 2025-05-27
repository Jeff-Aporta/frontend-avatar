import axios from "axios";

const urlapi = {
  local: {
    robot_backend: "http://localhost:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
  web: {
    robot_backend: "http://168.231.97.207:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
};

/**
 * Resolve full API URL by buildEndpoint using current context.
 */
function resolveUrl(buildEndpoint, service = "robot_backend") {
  const { context } = global.configApp;
  const env =
    global.IS_LOCAL && global.configApp.context === "dev" ? "local" : "web";
  const base = urlapi[env][service];
  return buildEndpoint({ baseUrl: base }).replace(/\s+/g, "");
}

/**
 * Convierte tabla (array de arrays) a array de objetos usando la primera fila como cabeceras.
 * @param {Array<Array<any>>} table
 * @returns {Array<Object>}
 */
function table2obj(table) {
  if (!Array.isArray(table) || table.length < 1) return [];
  const [headers, ...rows] = table;
  return rows.map((rowValues) =>
    headers.reduce((obj, header, i) => {
      obj[header] = rowValues[i];
      return obj;
    }, {})
  );
}

const responsePromises = {};
const responseResults = {};
const responseErrors = {};

export const getResponse = ({
  checkErrors = () => null,
  setError = () => {},
  setLoading = () => {},
  setApiData = () => {},
  buildEndpoint,
  service = "robot_backend",
  mock_default,
}) => {
  const error = checkErrors();
  if (error) {
    setError(error);
    return Promise.reject(error);
  }
  const url = resolveUrl(buildEndpoint, service);
  console.log(`[getResponse] resolved URL: ${url} service: ${service}`);
  return getSingletonResponse({
    url,
    setLoading,
    setApiData,
    setError,
    mock_default,
  });
};

function getSingletonResponse({
  url,
  setLoading = () => {},
  setApiData = () => {},
  setError = () => {},
  mock_default,
}) {
  if (!responsePromises[url]) {
    console.log(`[getSingletonResponse] fetching URL: ${url}`);
    setLoading(true);
    responsePromises[url] = axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...(global.configApp.context !== "dev" && { withCredentials: false }),
      })
      .then(({ data }) => {
        console.log(`[getSingletonResponse]`, { data });
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        const result = table2obj(data);
        responseResults[url] = result;
        setApiData(result);
        return result;
      })
      .catch((err) => {
        console.error(`[getSingletonResponse]`, { err });
        if (
          global.configApp.context === "dev" &&
          mock_default &&
          Array.isArray(mock_default.content)
        ) {
          const fallback = table2obj(mock_default.content);
          setApiData(fallback);
          return fallback;
        }
        responseErrors[url] = err;
        setError(err.message || err);
        throw err;
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          delete responsePromises[url];
          delete responseResults[url];
          delete responseErrors[url];
        }, 20000);
      });
  } else {
    console.log(`[getSingletonResponse] promise already exists for URL: ${url}`);
    // Reaplicar datos previos para mantener flujo
    if (responseResults[url]) {
      console.log(`[getSingletonResponse] using cached result for URL: ${url}`);
      setApiData(responseResults[url]);
    } else if (responseErrors[url]) {
      console.log(`[getSingletonResponse] using cached error for URL: ${url}`);
      const err = responseErrors[url];
      setError(err.message || err);
    }
  }
  return responsePromises[url];
}

export const request = async ({
  method = "post", // "post" o "put"
  buildEndpoint, // Función que construye la URL de la API.
  setError, // Función para manejar errores.
  payload = {}, // Payload para la petición.
  willEnd = () => 0, // Callback tras éxito.
  service = "robot_backend", // Servicio en urlapi.
  responseBodyReceived = () => {}, // Callback para recibir el body de la respuesta (success o error)
  isTable = false, // Si es true, transforma la respuesta con table2obj
}) => {
  setError(null);
  const requestUrl = resolveUrl(buildEndpoint, service);
  console.log(service);
  console.log(
    `[request] Enviando ${method.toUpperCase()} a ${requestUrl} con data:`,
    payload
  );
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(global.configApp.context !== "dev" && { withCredentials: false }),
  };
  try {
    const response = await axios[method.toLowerCase()](
      requestUrl,
      payload,
      axiosConfig
    );
    let data = response.data;
    if (isTable) data = table2obj(data);
    console.log(`[request] Éxito respuesta de ${requestUrl}:`, data);
    responseBodyReceived(data);
    willEnd();
    return data;
  } catch (err) {
    console.error(
      `[request] Error en ${method.toUpperCase()} a ${requestUrl}:`,
      err
    );
    setError(err.message || `Error al ejecutar ${method.toUpperCase()}`);
    responseBodyReceived(err.response?.data || err);
    throw err;
  }
};

export const postRequest = (params) => request({ ...params, method: "post" });
export const putRequest = (params) => request({ ...params, method: "put" });
