import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DivM, PaperP } from '@containers';

export default function Hero() {
  return (
    <PaperP sx={{ py: 8 }}>
      <DivM textAlign="center">
        <Typography variant="h3" gutterBottom>
          Todo tu negocio en una sola plataforma
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Simplifica, automatiza y acelera tus procesos con Avatar
        </Typography>
        <Button variant="contained" size="large">
          Empieza ahora
        </Button>
      </DivM>
    </PaperP>
  );
}
