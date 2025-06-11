import React from "react";
import { Grid, Card, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import VisibilityIcon from "@mui/icons-material/Visibility";

const companies = [
  { id: 1, name: 'Tech Titans S.A.', description: 'Empresa de desarrollo de software y soluciones tecnológicas.', contacts: 28, sales: 12, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: 'Global Finance', description: 'Servicios financieros y asesoría para inversiones.', contacts: 15, sales: 8, color: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { id: 3, name: 'Innovate Marketing', description: 'Agencia de marketing digital y publicidad.', contacts: 22, sales: 16, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 4, name: 'Eco Solutions', description: 'Productos ecológicos y soluciones sostenibles.', contacts: 18, sales: 7, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
];

export default function Empresas() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Gestión de Empresas</Typography>
      <Grid container spacing={3}>
        {companies.map((company) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ height: 100, backgroundImage: company.color }} />
              <CardContent>
                <Typography variant="h6" component="h3">
                  {company.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {company.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: 0.5, mr: 2 }}>
                    {company.contacts} Contactos
                  </Typography>
                  <MonetizationOnIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {company.sales} Ventas
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<AssessmentIcon />}>
                  Analizar
                </Button>
                <Button size="small" startIcon={<VisibilityIcon />}>
                  Ver Detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
