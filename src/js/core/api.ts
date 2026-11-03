/**
 * api.ts — el cliente DER del front: plugins `avatar` (las entidades + sus paths), `identity` (login JWT,
 * usuarios), `permissions` (roles), `archivos` y `errores` armados con `createClient` contra el API. Los tokens viven en la bóveda
 * de cuentas (`core/cuentas.ts`) y el del perfil activo viaja en todas las peticiones. Nada de fetch suelto: todo pasa por los controllers y las `ops`.
 */
import { archivosPlugin, avatar, type ClientController, type ClientPlugin, createClient, erroresPlugin, identity, passwordDePin, permissions, registry } from '@avatar/vendor';
import { apiUrl } from '../consts/config.js';
import { z } from '../base/zod.js';
import { type Perfil, type PerfilPrueba, PerfilPruebaSchema, PerfilSchema, type Yo, YoSchema } from '../consts/schemas/api.schemas.js';
import { activar, guardarCuenta, quitarActiva, tokenActivo } from './cuentas.js';
import { estado, fijar } from './estado.js';
import { usarVectorizador } from './semantica.js';

/** El cliente de identidad avisa cada token nuevo: va a la bóveda (`core/cuentas.ts`) a nombre de su dueño. */
function guardarToken(t: string | null): void {
  if (t) guardarCuenta(t);
  else quitarActiva();
  fijar({ token: t });
}

let plugins: { dominio: ClientPlugin; auth: ClientPlugin; permisos: ClientPlugin; archivos: ClientPlugin; errores: ClientPlugin } | null = null;

/** Cabeceras de toda petición: el token si lo hay. */
function cabeceras(): HeadersInit {
  const t = estado.token;
  return t ? { authorization: `Bearer ${t}` } : {};
}

/** Arma (una vez) los plugins del cliente contra la URL del API. */
export function conectar(baseUrl = apiUrl()): void {
  const token = tokenActivo();
  fijar({ token });
  plugins = {
    auth: createClient(identity, { baseUrl, token, onToken: guardarToken }),
    dominio: createClient(avatar, { baseUrl, headers: cabeceras }),
    permisos: createClient(permissions, { baseUrl, headers: cabeceras }),
    archivos: createClient(archivosPlugin, { baseUrl, headers: cabeceras }),
    errores: createClient(erroresPlugin, { baseUrl, headers: cabeceras }),
  };
  // Búsqueda por significado: las consultas las vectoriza el API (`ia/embeber`, bge-m3); sin sesión, búsqueda léxica.
  usarVectorizador(async (textos) => {
    if (!estado.token) throw new Error('sin sesión');
    const r = (await plugins!.dominio['embeber']!(textos)) as { vectores: number[][] };
    return r.vectores;
  });
}

function armados() {
  if (!plugins) conectar();
  return plugins!;
}

/** El plugin del dominio Avatar (`controllers.tareas`, `enviar(icanal, …)`, `tablero(iproyecto)`, `yo()`…). */
export const dominio = (): ClientPlugin => armados().dominio;
/** Plugin de identidad (`controllers.usuarios`, `login`, `logout`, `changePassword`, `sessions`). */
export const auth = (): ClientPlugin => armados().auth;
/** Plugin de permisos (`profile`, `load`, `catalog`, `controllers.roles`…). */
export const permisos = (): ClientPlugin => armados().permisos;

/** Plugin de gestión de archivos (`subirArchivo`, `urlArchivo`, `arbolArchivos`…). */
export const archivos = (): ClientPlugin => armados().archivos;
/** Plugin de reportes de error (`reportarError`, `adjuntarError`, `errorListo`, `seguimientoError`). */
export const reportes = (): ClientPlugin => armados().errores;

/** ClientController de una entidad del dominio por su clave de plugin (`tareas`, `canales`, …). */
export function controller(clave: string): ClientController<any> {
  const c = armados().dominio.controllers[clave];
  if (!c) throw new Error(`No hay controller "${clave}" en el plugin avatar`);
  return c;
}

/** Entidad registrada por su plural (`tareas`, `usuarios`, `permisos/roles`), o `null`. */
export function entidad(plural: string) {
  return registry.has(plural) ? registry.entity(plural) : null;
}

/** Carga perfil (`empresas/yo`) y permisos (`GET /permisos`) al estado. Un 401 limpia la sesión. */
export async function cargarPerfil(): Promise<Yo | null> {
  if (!estado.token) return null;
  try {
    const [yo, perfil] = await Promise.all([armados().dominio['yo'](), armados().permisos['profile']()]);
    const y = YoSchema.safeParse(yo);
    const p = PerfilSchema.safeParse(perfil);
    if (!y.success) throw new Error(`Perfil inválido: ${y.error.message}`);
    fijar({ yo: y.data, perfil: p.success ? p.data : null });
    return y.data;
  } catch (err) {
    if (/401|vencido|inválido|Sesión/i.test(mensajeDe(err))) await cerrarSesion();
    throw err;
  }
}

/** Inicia sesión (POST usuarios/login vía el plugin: mismo Zod que el server) y carga el perfil. */
export async function iniciarSesion(usuario: string, password: string): Promise<Yo> {
  // Un perfil de prueba entra con su PIN: la contraseña real sale de `passwordDePin`, el mismo cálculo de la siembra.
  await armados().auth['login']({ usuario, password: /^\d{4}$/.test(password) ? passwordDePin(password) : password });
  const yo = await cargarPerfil();
  if (!yo) throw new Error('No se pudo cargar el perfil');
  return yo;
}

/** Cierra la sesión (revoca en el server si se puede) y limpia el estado. */
export async function cerrarSesion(): Promise<void> {
  try {
    await armados().auth['logout']();
  } catch {
    /* sin red o ya vencida: igual se limpia */
  } finally {
    guardarToken(null);
    fijar({ yo: null, perfil: null });
  }
}

/** Una sola petición aunque varios componentes muestren los perfiles. */
let listaPerfiles: Promise<PerfilPrueba[]> | null = null;

/** Perfiles de prueba públicos (`perfiles/lista`): no pide sesión. */
export function perfilesPrueba(): Promise<PerfilPrueba[]> {
  listaPerfiles ??= (async () => z.array(PerfilPruebaSchema).parse(await dominio()['perfilesPrueba']!()))().catch((err: unknown) => {
    listaPerfiles = null;
    throw err;
  });
  return listaPerfiles;
}

/** Cambia al perfil ya guardado en la bóveda: la página arranca de nuevo con su sesión. */
export function cambiarPerfil(usuario: string): void {
  activar(usuario);
  location.reload();
}

/** Perfil de permisos refrescado (tras cambiar roles). */
export async function refrescarPermisos(): Promise<Perfil | null> {
  const p = PerfilSchema.safeParse(await armados().permisos['profile']());
  fijar({ perfil: p.success ? p.data : null });
  return estado.perfil;
}

/** Mensaje de un error cualquiera (DER lanza `HttpError`/`ValidationError` con `message`). */
export function mensajeDe(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
