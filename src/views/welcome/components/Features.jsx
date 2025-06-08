import React from "react";
import { Typography, Grid } from "@mui/material";
import {
  PaperP,
  PaperDesign,
  PaintBG,
  Layer,
  getColorBackground,
  Color,
} from "@jeff-aporta/camaleon";
import {
  Speed as SpeedIcon,
  People as PeopleIcon,
  PhoneIphone as PhoneIphoneIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";

import { ItemPromo } from "./$comun";

const items = [
  {
    icon: (sz) => <SpeedIcon fontSize={sz} color={window.view.icon} />,
    label: "Automatización inteligente",
  },
  {
    icon: (sz) => <PeopleIcon fontSize={sz} color={window.view.icon} />,
    label: "Gestión de proyectos",
  },
  {
    icon: (sz) => <PhoneIphoneIcon fontSize={sz} color={window.view.icon} />,
    label: "Onboarding interactivo",
  },
  {
    icon: (sz) => <SupportAgentIcon fontSize={sz} color={window.view.icon} />,
    label: "Chatbot 24/7",
  },
];

export default function Features() {
  return (
    <PaperDesign
      elevation={0}
      sx={{ py: 8 }}
      nobr
      style={{
        opacity: 0.9,
      }}
    >
      <Layer
        fill
        style={{
          background: PaintBG()
            .linearGradient({
              angle: "to bottom",
              colors: [
                "transparent",
                `rgba(${Color(getColorBackground())
                  .rgb()
                  .array()
                  .join(", ")}, 0.5)`,
              ],
            })
            .end(),
        }}
      />
      <Typography variant="h4" align="center" gutterBottom>
        Características Principales
      </Typography>
      <hr />
      <br />
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, i) => (
          <ItemPromo item={item} xs={12} sm={6} md={3} key={i} />
        ))}
      </Grid>
    </PaperDesign>
  );
}
