import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Link, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, remember });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Iniciar sesión</Typography>
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
      <FormControlLabel
        control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
        label="Mantener sesión iniciada"
      />
      <Link href="#" variant="body2" underline="hover">
        ¿Olvidaste tu contraseña?
      </Link>
      <Button type="submit" variant="contained" color="primary" startIcon={<LoginIcon />} fullWidth>
        Entrar
      </Button>
      <Typography variant="body2" align="center">
        ¿No tienes cuenta? <Link href="#">Regístrate</Link>
      </Typography>
    </Box>
  );
}
