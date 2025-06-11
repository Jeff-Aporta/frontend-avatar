import React from "react";
import { Box, Grid, Card, CardHeader, CardContent, Typography, Paper } from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import TaskIcon from "@mui/icons-material/Task";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard principal
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader avatar={<PeopleOutlineIcon />} title="Clientes activos" />
            <CardContent>
              <Typography variant="h5">128</Typography>
              <Typography variant="body2" color="success.main">
                ↑ 12% vs mes anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader avatar={<BarChartIcon />} title="Ventas del mes" />
            <CardContent>
              <Typography variant="h5">$42,580</Typography>
              <Typography variant="body2" color="success.main">
                ↑ 8% vs mes anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader avatar={<TaskIcon />} title="Tareas pendientes" />
            <CardContent>
              <Typography variant="h5">24</Typography>
              <Typography variant="body2" color="error.main">
                ↓ 5% vs mes anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader avatar={<AttachMoneyIcon />} title="Ingresos anuales" />
            <CardContent>
              <Typography variant="h5">$349K</Typography>
              <Typography variant="body2" color="success.main">
                ↑ 22% vs año anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ height: 300, p: 2 }}>
              <Typography variant="h6">Análisis de ventas</Typography>
              <Box
                sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Gráfico de ventas por mes
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ height: 300, p: 2 }}>
              <Typography variant="h6">Distribución de clientes</Typography>
              <Box
                sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Gráfico de pastel
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
