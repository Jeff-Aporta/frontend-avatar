import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PaperP } from '@containers';
import {
  CloudQueue as CloudIcon,
  Memory as AiIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

export default function Technology() {
  const items = [
    { icon: <CloudIcon fontSize="large" color="primary" />, label: 'Servicios en la nube' },
    { icon: <AiIcon fontSize="large" color="primary" />, label: 'Inteligencia Artificial' },
    { icon: <StorageIcon fontSize="large" color="primary" />, label: 'APIs robustas' },
  ];
  return (
    <PaperP sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tecnología
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
