import React from "react";
import { Box, Grid, Card, CardContent, CardActions, Typography, Button, Badge } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const features = [
  { id: 'contactos', title: 'Contactos', subtitle: 'Gestionar contactos y leads', icon: PeopleIcon },
  { id: 'oportunidades', title: 'Oportunidades', subtitle: 'Ver pipeline de ventas', icon: MonetizationOnIcon },
  { id: 'analisis', title: 'Análisis', subtitle: 'Reportes y estadísticas', icon: BarChartIcon },
  { id: 'ia-asistente', title: 'IA Asistente', subtitle: 'Análisis predictivo', icon: SmartToyIcon }
];

const pipeline = [
  {
    id: 'contacto-inicial',
    title: 'Contacto Inicial',
    items: [
      { title: 'Propuesta de servicio', company: 'Tech Titans S.A.', amount: '$5,200', owner: 'Juan Pérez', time: 'Hace 2 días' },
      { title: 'Actualización de sistema', company: 'Global Finance', amount: '$3,800', owner: 'María López', time: 'Hace 3 días' },
      { title: 'Consultoría marketing', company: 'Innovate Marketing', amount: '$2,500', owner: 'Carlos Ruiz', time: 'Hace 5 días' }
    ]
  },
  {
    id: 'propuesta',
    title: 'Propuesta',
    items: [
      { title: 'Implementación CRM', company: 'Eco Solutions', amount: '$7,500', owner: 'Ana Martínez', time: 'Hace 1 semana' },
      { title: 'Desarrollo web', company: 'Global Finance', amount: '$4,200', owner: 'Luis Torres', time: 'Hace 10 días' }
    ]
  },
  {
    id: 'negociacion',
    title: 'Negociación',
    items: [
      { title: 'Hosting anual', company: 'Tech Titans S.A.', amount: '$1,800', owner: 'Pedro Sánchez', time: 'Hace 2 semanas' },
      { title: 'Consultoría de procesos', company: 'Innovate Marketing', amount: '$6,500', owner: 'Laura Gómez', time: 'Hace 3 semanas' }
    ]
  }
];

export default function CRM() {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={3} key={f.id}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <f.icon fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {f.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Pipeline de Ventas
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {pipeline.map((stage) => (
          <Box key={stage.id} sx={{ flex: 1, bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {stage.title}
              </Typography>
              <Badge badgeContent={stage.items.length} color="primary" />
            </Box>
            {stage.items.map((item, idx) => (
              <Card key={idx} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.company}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {item.amount}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {item.owner}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.time}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
