import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { encuestasService } from '../../services/api';

const CreateEncuesta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Activa',
    cierraEn: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const cierraEn = new Date();
      cierraEn.setDate(cierraEn.getDate() + 7);

      const encuestaData = {
        ...formData,
        cierraEn: formData.cierraEn || cierraEn.toISOString().split('T')[0],
      };

      const result = await encuestasService.createEncuesta(encuestaData);

      if (result.success) {
        setSuccess('Encuesta creada exitosamente. Redirigiendo...');
        setTimeout(() => {
          if (result.id) {
            navigate(`/encuestas/${result.id}/preguntas`);
          } else {
            navigate('/encuestas');
          }
        }, 2000);
      } else {
        setError('Error al crear la encuesta: ' + (result.message || 'Error desconocido'));
      }
    } catch (error) {
      setError('Error al crear la encuesta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      {/* Migas de pan */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
          Encuestas
        </Link>
        <Typography color="text.primary" fontWeight={600}>
          Nueva Encuesta
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Crear nueva encuesta
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Completa los datos básicos y después podrás añadir las preguntas.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2.5 }}>{success}</Alert>
      )}

      <Paper sx={{ p: { xs: 3, sm: 4 }, border: '1px solid #E3E9F2' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="titulo"
                label="Título de la Encuesta"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                helperText="Ingresa un título descriptivo"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="descripcion"
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                helperText="Describe brevemente el propósito de la encuesta"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="estado"
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <MenuItem value="Activa">Activa</MenuItem>
                <MenuItem value="Inactiva">Inactiva</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="cierraEn"
                label="Fecha de Cierre"
                name="cierraEn"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.cierraEn}
                onChange={handleChange}
                helperText="Fecha en que finalizará la encuesta"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/encuestas')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Siguiente'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEncuesta;
