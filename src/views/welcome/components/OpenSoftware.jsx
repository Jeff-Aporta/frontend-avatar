import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { DivM, PaperP, Hm } from "@containers";
import { Complement } from "@templates";
import {
  Group as GroupIcon,
  Layers as LayersIcon,
  Build as BuildIcon,
  Extension as ExtensionIcon,
  LockOpen as LockOpenIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const items = [
  {
    icon: <GroupIcon fontSize="large" color="primary" />,
    title: "Tecnología abierta y colaborativa",
    content:
      "Avatar ha sido desarrollado junto a una comunidad activa de desarrolladores y empresas que creen en el poder del código abierto. Nuestro compromiso es claro: ofrecer una plataforma que transforme procesos, simplifique la gestión y potencie la productividad.",
  },
  {
    icon: <LayersIcon fontSize="large" color="primary" />,
    title: "Modalidades",
    content:
      "Avatar está disponible en dos modalidades:\n\nCommunity: 100% gratuita y abierta, ideal para exploración y PyMEs.\n\nEnterprise: Con infraestructura optimizada, soporte avanzado e integraciones adicionales.",
  },
  {
    icon: <BuildIcon fontSize="large" color="primary" />,
    title: "Personalización sin límites",
    content:
      "Con Avatar Studio, puedes automatizar procesos, adaptar interfaces, crear reportes visuales, activar flujos personalizados y conectar fácilmente con APIs externas y herramientas internas. Todo sin necesidad de modificar el núcleo del sistema.",
  },
  {
    icon: <ExtensionIcon fontSize="large" color="primary" />,
    title: "Ecosistema colaborativo",
    content:
      "Más de 40 mil integraciones y módulos han sido creados por la comunidad global. Desde inteligencia de negocio hasta gestión de RRHH, logística y marketing, Avatar permite construir una solución adaptada a cada necesidad empresarial.",
  },
  {
    icon: <LockOpenIcon fontSize="large" color="primary" />,
    title: "Sin restricciones ni ataduras",
    content:
      "Avatar trabaja con tecnologías abiertas como PostgreSQL y Node.js. Sin formatos propietarios, sin vender funciones por separado, sin contratos a largo plazo: solo acceso total al código, despliegue flexible (cloud o local) y precios justos.",
  },
  {
    icon: <StarIcon fontSize="large" color="primary" />,
    title: "Una propuesta de valor única",
    content:
      "Avatar combina potencia, simplicidad y flexibilidad. Nuestra visión no es encajar en el estándar corporativo, sino superarlo con una solución diseñada para escalar con tus ideas. Por eso, somos la opción preferida por empresas que piensan en el futuro.",
  },
];

export default function OpenSoftware() {
  return (
    <>
      <Hm />
      <Complement>
        <Typography variant="h4" align="center" gutterBottom>
          <b>Un software empresarial moderno, flexible y abierto</b>
        </Typography>
      </Complement>
      <Grid container spacing={4}>
        {items.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  {item.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
                {item.content.split("\\n\\n").map((para, j) => (
                  <Typography key={j} variant="body2" paragraph>
                    {para}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
