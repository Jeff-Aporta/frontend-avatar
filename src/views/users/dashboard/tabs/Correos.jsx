import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Button, Grid, Card, CardContent, IconButton, Avatar } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";

const stats = [
  { id: 1, value: '85%', label: 'Tasa de entrega' },
  { id: 2, value: '32%', label: 'Tasa de apertura' },
  { id: 3, value: '12%', label: 'Tasa de clics' }
];

const messages = [
  { id: 1, name: 'ML', title: 'Propuesta de colaboración', preview: 'Hola, estamos interesados en trabajar con Odys en...' }
];

export default function Correos() {
  const [tab, setTab] = useState('correos');

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestión de Correos y Marketing</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<BarChartIcon />}>Analíticas</Button>
          <Button variant="outlined" startIcon={<DescriptionIcon />}>Plantillas</Button>
          <Button variant="outlined" startIcon={<BuildIcon />}>Automatización</Button>
          <Button variant="contained" startIcon={<AddIcon />}>Nueva Campaña</Button>
        </Box>
      </Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
        <Tab label="Marketing" value="marketing" />
        <Tab label="Correos" value="correos" />
        <Tab label="Sitio Web" value="sitio-web" />
        <Tab label="Redes Sociales" value="redes-sociales" />
      </Tabs>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">Correos</Typography>
            </Box>
            <Box>
              <IconButton size="small"><SettingsIcon /></IconButton>
              <IconButton size="small"><RefreshIcon /></IconButton>
            </Box>
          </Box>
          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid item xs={12} sm={4} key={s.id}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{s.value}</Typography>
                    <Typography variant="body2" color="textSecondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            {messages.map((m) => (
              <Card key={m.id} sx={{ mt: 1 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>{m.name}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{m.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{m.preview}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
