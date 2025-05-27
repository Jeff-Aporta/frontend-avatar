import React from 'react';
import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { DivM, PaperP } from '@containers';

export default function Pricing() {
  const plans = [
    { title: 'Mensual', price: '$100 USD/mes' },
    { title: 'Anual', price: '$1,000 USD/año' },
    { title: '3 años', price: '$2,100 USD' },
  ];
  return (
    <PaperP sx={{ py: 8 }}>
      <DivM>
        <Typography variant="h4" align="center" gutterBottom>
          Planes y precios
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={4} key={plan.title}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{plan.title}</Typography>
                  <Typography variant="h4" color="primary">
                    {plan.price}
                  </Typography>
                </CardContent>
                <Box textAlign="center" pb={2}>
                  <Button variant="contained">Suscribirse</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DivM>
    </PaperP>
  );
}
