import React, { useState } from "react";
import { Box, Tabs, Tab, Card, CardContent, Typography, Grid, Button } from "@mui/material";
import { AttachMoney, Payment, Percent, CreditCard, Print, ShowChart, People, SmartToy } from "@mui/icons-material";

export default function Inventario() {
  const [subTab, setSubTab] = useState(0);
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Módulo de Inventarios</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6">Caja / POS</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Valor del Pedido: <strong>$1,250.00</strong>
              </Typography>
              <Typography variant="body2">Item 1 - $500.00<br/>Item 2 - $750.00</Typography>
              <Box mt={2} mb={1} sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<AttachMoney />}>Pagar</Button>
                <Button variant="outlined" startIcon={<Percent />}>Descontar</Button>
                <Button variant="outlined" startIcon={<CreditCard />}>Crédito</Button>
                <Button variant="outlined" startIcon={<Print />}>Imprimir</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button startIcon={<CreditCard />}>Tarjeta</Button>
                <Button startIcon={<AttachMoney />}>Efectivo</Button>
                <Button startIcon={<Payment />}>QR</Button>
                <Button startIcon={<SmartToy />}>Crypto</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grid container spacing={1}>
                {['1','2','3','4','5','6','7','8','9','0','.','C'].map((v,i)=>(
                  <Grid item xs={4} key={i}>
                    <Button fullWidth variant={v==='C'?'contained':'outlined'} color={v==='C'?'error':'inherit'}>
                      {v}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Tabs value={subTab} onChange={(e,v)=>setSubTab(v)} sx={{ mb: 2 }}>
        {['Documentación','Items','Pedidos','Solicitudes','Facturación','Diseñar Factura'].map((t,i)=><Tab key={t} label={t}/>)}
      </Tabs>
      {subTab === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb:1 }}>Gestión por Documentación</Typography>
          <Box sx={{ mb:2, display:'flex', gap:1 }}>
            <Button variant="contained">Subir Documento</Button>
            <Button variant="outlined">Ver Historial</Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card><CardContent>
                <ShowChart fontSize="large" sx={{ mr:1 }}/> <Typography component="span">Demanda / Consumo</Typography>
                <Box mt={1}><Button variant="outlined">Ver Análisis</Button></Box>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent>
                <People fontSize="large" sx={{ mr:1 }}/> <Typography component="span">Roles y Administración</Typography>
                <Box mt={1}><Button variant="outlined">Administrar Roles</Button></Box>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent>
                <SmartToy fontSize="large" sx={{ mr:1 }}/> <Typography component="span">IA y Automatización</Typography>
                <Box mt={1}><Button variant="outlined">Configurar IA</Button></Box>
              </CardContent></Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
