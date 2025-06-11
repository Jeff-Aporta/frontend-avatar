import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Tabs, Tab, TextField, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, IconButton, InputAdornment } from "@mui/material";
import { People, Today, PendingActions, AttachMoney, Search, FilterList, MoreVert, CheckCircle, Schedule } from "@mui/icons-material";

export default function RecursosHumanos() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (e, v) => setTabIndex(v);
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Gestión de Recursos Humanos</Typography>
      <Box mb={2}>
        <Button variant="outlined" sx={{ mr:1 }}>Informes</Button>
        <Button variant="outlined" sx={{ mr:1 }}>Horarios</Button>
        <Button variant="contained" color="primary">Nuevo Empleado</Button>
      </Box>
      <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        {['General','Empleados','Nómina','Asistencia','Vacaciones','Tareas','Cargos'].map(label=><Tab key={label} label={label} />)}
      </Tabs>
      {tabIndex===0 && (
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card><CardContent>
                <Box display="flex" justifyContent="space-between"><Typography>Total Empleados</Typography><People /></Box>
                <Typography variant="h5">147</Typography>
                <Box display="flex" alignItems="center" color="green"><Schedule sx={{transform: 'rotate(45deg)'}}/><Typography variant="body2">5.8% vs. mes anterior</Typography></Box>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card><CardContent>
                <Box display="flex" justifyContent="space-between"><Typography>Asistencia Hoy</Typography><Today /></Box>
                <Typography variant="h5">132</Typography>
                <Typography variant="body2" color="primary">89.8% del total</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card><CardContent>
                <Box display="flex" justifyContent="space-between"><Typography>Solicitudes Pendientes</Typography><PendingActions /></Box>
                <Typography variant="h5">8</Typography>
                <Typography variant="body2" color="warning.main">5 vacaciones, 3 permisos</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card><CardContent>
                <Box display="flex" justifyContent="space-between"><Typography>Nómina Mensual (MXN)</Typography><AttachMoney /></Box>
                <Typography variant="h5">$872,450</Typography>
                <Box display="flex" alignItems="center" color="green"><Schedule sx={{transform: 'rotate(45deg)'}}/><Typography variant="body2">3.2% vs. mes anterior</Typography></Box>
              </CardContent></Card>
            </Grid>
          </Grid>
          <Box display="flex" my={3} alignItems="center">
            <TextField size="small" placeholder="Buscar empleado..." InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} sx={{ mr:2 }} />
            <TextField select size="small" label="Departamento" sx={{ mr:2 }}>
              <MenuItem value="">Todos</MenuItem>
            </TextField>
            <TextField select size="small" label="Estado">
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Vacaciones">Vacaciones</MenuItem>
            </TextField>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                {['Empleado','Departamento','Cargo','Estado','Acciones'].map(h=><TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {[{name:'María Aguirre',email:'maría.aguirre@empresa.com',dep:'Diseño',role:'Diseñadora Senior',status:'Activo'},{name:'Juan Rodríguez',email:'juan.rodriguez@empresa.com',dep:'Desarrollo',role:'Desarrollador Full-Stack',status:'Vacaciones'},{name:'Laura Cortés',email:'laura.cortes@empresa.com',dep:'Marketing',role:'Directora de Marketing',status:'Activo'}].map((u,i)=>(
                <TableRow key={i}>
                  <TableCell>{u.name}<br/><Typography variant="body2" color="textSecondary">{u.email}</Typography></TableCell>
                  <TableCell>{u.dep}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell><Typography color={u.status==='Activo'?'success.main':'info.main'}>{u.status}</Typography></TableCell>
                  <TableCell><IconButton><MoreVert /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box display="flex" mt={4}>
            <Box flex={1} mr={2}>
              <Typography variant="h6">Seguimiento de Tareas</Typography>
              <Box mt={1}>
                <Box display="flex" alignItems="center" mb={1}><CheckCircle color="success" sx={{mr:1}}/><Box><Typography>Revisión de solicitudes</Typography><Typography variant="body2" color="textSecondary">Hoy - Admin</Typography></Box></Box>
                <Box display="flex" alignItems="center"><PendingActions color="action" sx={{mr:1}}/><Box><Typography>Proceso de nómina mensual</Typography><Typography variant="body2" color="textSecondary">25/04/2025 - Admin</Typography></Box></Box>
              </Box>
            </Box>
            <Box flex={1} ml={2}>
              <Typography variant="h6">Control de Asistencia</Typography>
              <Grid container spacing={1} mt={1}>
                <Grid item><Card><CardContent><Typography variant="h6">132</Typography><Typography>Presentes</Typography></CardContent></Card></Grid>
                <Grid item><Card><CardContent><Typography variant="h6">8</Typography><Typography>Ausentes</Typography></CardContent></Card></Grid>
                <Grid item><Card><CardContent><Typography variant="h6">7</Typography><Typography>Vacaciones</Typography></CardContent></Card></Grid>
                <Grid item><Card><CardContent><Typography variant="h6">0</Typography><Typography>Retardos</Typography></CardContent></Card></Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
