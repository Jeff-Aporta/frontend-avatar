import React from 'react';
import { Typography, Grid } from '@mui/material';
import { DivM, PaperP } from '@containers';
import {
  Speed as SpeedIcon,
  People as PeopleIcon,
  PhoneIphone as PhoneIphoneIcon,
  SupportAgent as SupportAgentIcon,
} from '@mui/icons-material';

export default function Features() {
  const items = [
    { icon: <SpeedIcon fontSize="large" color="primary" />, label: 'Automatización inteligente' },
    { icon: <PeopleIcon fontSize="large" color="primary" />, label: 'Gestión de proyectos' },
    { icon: <PhoneIphoneIcon fontSize="large" color="primary" />, label: 'Onboarding interactivo' },
    { icon: <SupportAgentIcon fontSize="large" color="primary" />, label: 'Chatbot 24/7' },
  ];
  return (
    <PaperP sx={{ py: 8 }}>
      <DivM>
        <Typography variant="h4" align="center" gutterBottom>
          Características Principales
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {items.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i} textAlign="center">
              {item.icon}
              <Typography variant="h6" mt={2}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DivM>
    </PaperP>
  );
}
