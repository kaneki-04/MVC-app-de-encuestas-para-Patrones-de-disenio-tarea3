import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { QuestionAnswer as PreguntasIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { encuestasService } from '../../services/api';

const EditEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Activa',
    cierraEn: ''
  });

  useEffect(() => {
    loadEncuesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEncuesta = async () => {
    try {
      setLoading(true);
      const encuesta = await encuestasService.getEncuesta(id);
      if (encuesta) {
        setFormData({
          titulo: encuesta.titulo,
          descripcion: encuesta.descripcion,
          estado: encuesta.estado,
          cierraEn: encuesta.cierraEn
        });
      } else {
        setError('Encuesta no encontrada');
      }
    } catch (error) {
      setError('Error al cargar la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await encuestasService.updateEncuesta(id, formData);
      setSuccess('Encuesta actualizada exitosamente');
      setTimeout(() => {
        navigate('/encuestas');
      }, 2000);
    } catch (error) {
      setError('Error al actualizar la encuesta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
          Encuestas
        </Link>
        <Typography color="text.primary" fontWeight={600}>
          Editar Encuesta
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Editar encuesta
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Actualiza los datos de tu encuesta.
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
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="space-between" flexWrap="wrap" sx={{ mt: 2 }}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/encuestas')}
                    disabled={saving}
                  >
                    Volver a Lista
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Encuesta'}
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PreguntasIcon />}
                  onClick={() => navigate(`/encuestas/${id}/preguntas`)}
                >
                  Añadir preguntas
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditEncuesta;
