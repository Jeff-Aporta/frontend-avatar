import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { PaperP, Hm } from "@jeff-aporta/camaleon";

export default function Pricing() {
  const plans = [
    { title: "Mensual", price: "$100 USD/mes" },
    { title: "Anual", price: "$1,000 USD/año" },
    { title: "3 años", price: "$2,100 USD" },
  ];
  return (
    <PaperP>
      <Typography variant="h4" align="center" gutterBottom>
        Planes y precios
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="space-evenly"
        alignItems="center"
        wrap="wrap"
      >
        {plans.map((plan) => (
          <Grid item xs={12} sm={5} md={4} key={plan.title}>
            <Card elevation={0} variant="outlined" className="rz-overfx">
              <CardContent>
                <Typography variant="h6">{plan.title}</Typography>
                <hr />
                <Typography variant="h6" color={window.view.textaccent}>
                  {plan.price}
                </Typography>
              </CardContent>
              <br />
              <Box textAlign="center" pb={2}>
                <Button variant="contained" color="primaryl1">
                  Suscribirse
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PaperP>
  );
}
