import React from "react";
import { Grid, Box, Typography, Button, Link } from "@mui/material";
import { PaperP } from "@containers";

export default function Hero() {
  return (
    <PaperP sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Todo tu negocio en una sola plataforma
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Simplifica, automatiza y acelera tus procesos con Avatar
            </Typography>
            <Button variant="contained" size="large">
              Empieza ahora
            </Button>
            <Box mt={2}>
              <Link href="#" underline="hover" className="color-accent-filter">
                Obtener información para empezar a generar ingresos &rarr;
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/img/ilustration2.svg"
              alt="Illustration"
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>
    </PaperP>
  );
}
