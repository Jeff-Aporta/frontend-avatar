import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PaperP } from '@containers';
import {
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';

export default function Productivity() {
  const items = [
    { icon: <SpeedIcon fontSize="large" color="primary" />, label: 'Optimización de procesos' },
    { icon: <VisibilityIcon fontSize="large" color="primary" />, label: 'Visión en tiempo real' },
    { icon: <BarChartIcon fontSize="large" color="primary" />, label: 'Reportes personalizados' },
  ];
  return (
    <PaperP sx={{ py: 8, bgcolor: 'background.default' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Productividad y eficiencia
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {items.map((item, i) => (
            <Grid item xs={12} sm={4} key={i} textAlign="center">
              {item.icon}
              <Typography variant="h6" mt={2}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
    </PaperP>
  );
}
