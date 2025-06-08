import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { DivM, PaperP, Hm } from "@jeff-aporta/camaleon";
import { Complement } from "@jeff-aporta/camaleon";
import {
  Group as GroupIcon,
  Layers as LayersIcon,
  Build as BuildIcon,
  Extension as ExtensionIcon,
  LockOpen as LockOpenIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { fluidCSS } from "@jeff-aporta/camaleon";

export default function () {
  return (
    <>
      <Hm />
      <Complement>
        <Typography variant="h4" align="center" gutterBottom>
          <b>Un software empresarial moderno, flexible y abierto</b>
        </Typography>
      </Complement>
      <div className="wflex gap-10px space-between stretch">
        {items().map((item, idx) => (
          <div
            className={fluidCSS()
              .ltX("small", { width: ["100%", "calc(50% - 15px)"] })
              .end()}
            key={idx}
          >
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  {item.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
                <hr />
                <br />
                <Typography variant="caption">{item.content}</Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

function items() {
  const { view } = window;

  return [
    {
      icon: <GroupIcon fontSize="large" color={view.icon} />,
      title: "Tecnología abierta y colaborativa",
      content: (
        <>
          Avatar ha sido desarrollado junto a una comunidad activa de
          desarrolladores y empresas que creen en el poder del código abierto.
          <br />
          <br />
          Nuestro compromiso es claro: ofrecer una plataforma que transforme
          procesos, simplifique la gestión y potencie la productividad.
        </>
      ),
    },
    {
      icon: <LayersIcon fontSize="large" color={view.icon} />,
      title: "Modalidades",
      content: (
        <>
          Avatar está disponible en dos modalidades:
          <br />
          <br />
          <b>Community:</b> 100% gratuita y abierta, ideal para exploración y
          PyMEs.
          <br />
          <br />
          <b>Enterprise:</b> Con infraestructura optimizada, soporte avanzado e
          integraciones adicionales.
        </>
      ),
    },
    {
      icon: <BuildIcon fontSize="large" color={view.icon} />,
      title: "Personalización sin límites",
      content: (
        <>
          Con Avatar Studio, puedes automatizar procesos, adaptar interfaces,
          crear reportes visuales, activar flujos personalizados y conectar
          fácilmente con APIs externas y herramientas internas. Todo sin
          necesidad de modificar el núcleo del sistema.
        </>
      ),
    },
    {
      icon: <ExtensionIcon fontSize="large" color={view.icon} />,
      title: "Ecosistema colaborativo",
      content: (
        <>
          Más de 40 mil integraciones y módulos han sido creados por la
          comunidad global. Desde inteligencia de negocio hasta gestión de RRHH,
          logística y marketing, Avatar permite construir una solución adaptada
          a cada necesidad empresarial.
        </>
      ),
    },
    {
      icon: <LockOpenIcon fontSize="large" color={view.icon} />,
      title: "Sin restricciones ni ataduras",
      content: (
        <>
          Avatar trabaja con tecnologías abiertas como PostgreSQL y Node.js. Sin
          formatos propietarios, sin vender funciones por separado, sin
          contratos a largo plazo: solo acceso total al código, despliegue
          flexible (cloud o local) y precios justos.
        </>
      ),
    },
    {
      icon: <StarIcon fontSize="large" color={view.icon} />,
      title: "Una propuesta de valor única",
      content: (
        <>
          Avatar combina potencia, simplicidad y flexibilidad. Nuestra visión no
          es encajar en el estándar corporativo, sino superarlo con una solución
          diseñada para escalar con tus ideas. Por eso, somos la opción
          preferida por empresas que piensan en el futuro.
        </>
      ),
    },
  ];
}
