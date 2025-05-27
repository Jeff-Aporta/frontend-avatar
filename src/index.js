import React, { useState, useEffect } from "react";

import { init } from "@src/polyfill";
import { href } from "@jeff-aporta/theme-manager";
import { createRoot } from "react-dom/client";
import { RoutingManagement } from "@jeff-aporta/router";
import package_json from "@root/package.json";
import { routeCheck } from "@app/routeCheck";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import { Notifier } from "@templates";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { PaperP } from "@containers";


const componentsContext = require.context("./views", true, /\.jsx$/);

init();

// Cargar usuario automáticamente desde localStorage en window.currentUser
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
if (storedUser) {
  window["currentUser"] = storedUser;
}

// Progreso circular con etiqueta
function CircularProgressWithLabel(props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <CircularProgress
        size="100px"
        variant="determinate"
        {...{
          ...props,
          value: (props.value / props.maxvalue) * 100,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
}

// Componente de cuenta regresiva y redirección
function CountdownRedirect({ message }) {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    window.location.href = href({ view: "/" });
  }, [counter]);

  return (
    <>
      <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
        {message}. Será redirigido en {counter} segundos.
      </Alert>
      <PaperP
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgressWithLabel
          value={counter}
          maxvalue={10}
          label={counter.toString().padStart(2, "0") + "s"}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => (window.location.href = href({ view: "/" }))}
        >
          Ir al inicio
        </Button>
      </PaperP>
    </>
  );
}

// Componente de error de ruta usando capa Notifier
function RouteError({ message }) {
  return (
    <Notifier>
      <CountdownRedirect message={message} />
    </Notifier>
  );
}

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
      routeCheck, // Función verificadora de errores en ruta
      routeError: (check) => {
        toast.error(check.message); // Tratamiento de error
      },
      componentError: (check) => <RouteError message={check.message} />,
      customRoutes: { custom: <h1>Hola desde custom</h1> },
      startIgnore: [
        package_json.repository.url
          .replace("http://", "")
          .split("/")
          .filter(Boolean)[3],
      ],
    }}
  />
);
