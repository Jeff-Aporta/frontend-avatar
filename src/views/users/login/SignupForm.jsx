import React, { useState } from 'react';
import { Box, TextField, Button, Link, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function SignupForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, confirm });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Registro</Typography>
      <TextField
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="secondary" startIcon={<PersonAddIcon />} fullWidth>
        Crear cuenta
      </Button>
      <Typography variant="body2" align="center">
        ¿Ya tienes cuenta? <Link href="#">Iniciar sesión</Link>
      </Typography>
    </Box>
  );
}
