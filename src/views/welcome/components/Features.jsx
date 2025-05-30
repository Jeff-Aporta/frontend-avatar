import React from "react";
import { Typography, Grid } from "@mui/material";
import { PaperP } from "@containers";
import {
  Speed as SpeedIcon,
  People as PeopleIcon,
  PhoneIphone as PhoneIphoneIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";

import { ItemPromo } from "./$refactor";

export default function Features() {
  const items = [
    {
      icon: (sz) => <SpeedIcon fontSize={sz} color="primary" />,
      label: "Automatización inteligente",
    },
    {
      icon: (sz) => <PeopleIcon fontSize={sz} color="primary" />,
      label: "Gestión de proyectos",
    },
    {
      icon: (sz) => <PhoneIphoneIcon fontSize={sz} color="primary" />,
      label: "Onboarding interactivo",
    },
    {
      icon: (sz) => <SupportAgentIcon fontSize={sz} color="primary" />,
      label: "Chatbot 24/7",
    },
  ];
  return (
    <PaperP elevation={0} sx={{ py: 8 }} className="br-0">
      <Typography variant="h4" align="center" gutterBottom>
        Características Principales
      </Typography>
      <hr />
      <br />
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, i) => (
          <ItemPromo item={item} xs={12} sm={6} md={3} key={i}/>
        ))}
      </Grid>
    </PaperP>
  );
}
