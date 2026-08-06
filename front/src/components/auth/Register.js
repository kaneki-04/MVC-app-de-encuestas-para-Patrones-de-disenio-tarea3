import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  Person,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Poll as PollIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      {/* Panel de marca (izquierda) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: '1 1 55%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 7,
          color: '#fff',
          background:
            'linear-gradient(150deg, #0D47A1 0%, #1565C0 45%, #1E88E5 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            top: -120,
            right: -120,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            bottom: -90,
            left: -90,
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.18)',
            }}
          >
            <PollIcon fontSize="large" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            EncuestasApp
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 460 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15, mb: 2 }}>
            Únete a EncuestasApp
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
            Crea tu cuenta y empieza a gestionar tus encuestas en segundos.
          </Typography>

          <Stack spacing={2} sx={{ mt: 5 }}>
            {[
              'Crea encuestas con preguntas a tu medida',
              'Recopila y analiza respuestas con gráficos',
              'Exporta resultados a Excel con un clic',
            ].map((text) => (
              <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#90CAF9',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', position: 'relative' }}>
          © {new Date().getFullYear()} EncuestasApp · Sistema de gestión de encuestas
        </Typography>
      </Box>

      {/* Formulario (derecha) */}
      <Box
        sx={{
          flex: '1 1 45%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Crear cuenta
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Registro rápido y sin complicaciones.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              label="Nombre"
              name="nombre"
              fullWidth
              required
              autoFocus
              value={formData.nombre}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              label="Correo Electrónico"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              label="Confirmar Contraseña"
              name="confirmarPassword"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              required
              value={formData.confirmarPassword}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((prev) => !prev)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Registrarme'}
            </Button>
          </Box>

          <Divider sx={{ my: 3.5 }}>
            <Typography variant="caption" color="text.secondary">
              ¿Ya tienes cuenta?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            component={Link}
            to="/login"
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
