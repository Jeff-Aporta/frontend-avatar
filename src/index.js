import React, { useState, useEffect } from "react";

import { init } from "@src/polyfill";
import { href } from "@jeff-aporta/camaleon";
import { createRoot } from "react-dom/client";
import { RoutingManagement } from "@jeff-aporta/camaleon";
import package_json from "@root/package.json";
import { routeCheck } from "@app/routeCheck";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import { Notifier } from "@jeff-aporta/camaleon";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { PaperP } from "@jeff-aporta/camaleon";

import { Unauthorize } from "@views/unauthorize";

const componentsContext = require.context("./views", true, /\.jsx$/);

init();

// Cargar usuario automáticamente desde localStorage en window.currentUser
window["currentUser"] = JSON.parse(localStorage.getItem("user") || "null");

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
      routeCheck, // Función verificadora de errores en ruta
      routeError: (check) => {
        toast.error(check.message); // Tratamiento de error
      },
      componentError: (check) => <Unauthorize message={check.message} />,
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
