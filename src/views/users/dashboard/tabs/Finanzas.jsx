import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Tabs, Tab, TextField, Select, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { AttachMoney, TrendingUp, TrendingDown, HourglassEmpty, SwapHoriz, Book, Settings } from "@mui/icons-material";

export default function Finanzas() {
  const [tabIndex, setTabIndex] = useState(0);
  const [originAmount, setOriginAmount] = useState(1000);
  const [originCurrency, setOriginCurrency] = useState("MXN");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("58.2");

  const handleTabChange = (e, newVal) => setTabIndex(newVal);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Gestión de Finanzas y Contabilidad</Typography>
      <Box mb={2}>
        <Button variant="outlined" sx={{ mr:1 }}>Informes</Button>
        <Button variant="outlined" sx={{ mr:1 }}>Conciliación</Button>
        <Button variant="outlined" sx={{ mr:1 }}>Presupuestos</Button>
        <Button variant="contained" color="primary">Nueva Transacción</Button>
      </Box>
      <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="General" />
        <Tab label="Contabilidad" />
        <Tab label="Impuestos" />
        <Tab label="Facturas" />
        <Tab label="Pagos" />
        <Tab label="Reportes" />
      </Tabs>
      {tabIndex === 0 && (
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Ingresos (MXN)</Typography>
                    <AttachMoney color="action" />
                  </Box>
                  <Typography variant="h5">$125,430.00</Typography>
                  <Box display="flex" alignItems="center" color="green">
                    <TrendingUp />
                    <Typography variant="body2">12.5% vs. mes anterior</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Gastos (MXN)</Typography>
                    <AttachMoney color="action" />
                  </Box>
                  <Typography variant="h5">$84,250.00</Typography>
                  <Box display="flex" alignItems="center" color="red">
                    <TrendingDown />
                    <Typography variant="body2">5.3% vs. mes anterior</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Beneficio Neto (MXN)</Typography>
                    <AttachMoney color="action" />
                  </Box>
                  <Typography variant="h5">$41,180.00</Typography>
                  <Box display="flex" alignItems="center" color="green">
                    <TrendingUp />
                    <Typography variant="body2">20.1% vs. mes anterior</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Facturas Pendientes (MXN)</Typography>
                    <HourglassEmpty color="action" />
                  </Box>
                  <Typography variant="h5">$32,750.00</Typography>
                  <Box display="flex" alignItems="center" color="red">
                    <TrendingDown />
                    <Typography variant="body2">8.7% vs. mes anterior</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box mt={4} p={2} border={1} borderRadius={1} borderColor="grey.300">
            <Typography variant="h6">Convertidor de Monedas</Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <TextField
                label="Cantidad Origen"
                value={originAmount}
                onChange={(e) => setOriginAmount(e.target.value)}
                type="number"
                sx={{ mr: 2, width: 150 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={originCurrency}
                        onChange={(e) => setOriginCurrency(e.target.value)}
                      >
                        {["MXN", "USD", "EUR"].map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
              <IconButton><SwapHoriz /></IconButton>
              <TextField
                label="Cantidad Convertida"
                value={convertedAmount}
                sx={{ mx: 2, width: 150 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                      >
                        {["USD", "MXN", "EUR"].map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
          <Box mt={4} p={2} border={1} borderRadius={1} borderColor="grey.300">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Book color="action" sx={{ mr: 1 }} />
                <Typography variant="h6">Libro de Contabilidad</Typography>
              </Box>
              <IconButton><Settings /></IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
