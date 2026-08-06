import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Alert,
  CircularProgress,
  Container,
  Slider,
  Chip,
  Breadcrumbs,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { respuestasService, encuestasService, preguntasService } from '../../services/api';

const ResponderEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadEncuesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEncuesta = async () => {
    try {
      setLoading(true);
      setError('');

      const encuestaData = await encuestasService.getEncuesta(id);
      setEncuesta(encuestaData);

      const preguntasData = await preguntasService.getPreguntasByEncuesta(id);

      if (!preguntasData || preguntasData.length === 0) {
        setError('Esta encuesta no tiene preguntas configuradas.');
        setPreguntas([]);
        return;
      }

      setPreguntas(preguntasData);

      const respuestasIniciales = {};
      preguntasData.forEach(pregunta => {
        if (pregunta.tipoPregunta === 'OpcionMultiple') {
          respuestasIniciales[pregunta.id] = [];
        } else {
          respuestasIniciales[pregunta.id] = '';
        }
      });
      setRespuestas(respuestasIniciales);
    } catch (error) {
      console.error('Error al cargar la encuesta:', error);
      setError(`Error al cargar la encuesta: ${error.message}`);
      setPreguntas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRespuestaChange = (preguntaId, value) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: value
    }));
  };

  const handleOpcionMultipleChange = (preguntaId, opcionValue, checked) => {
    setRespuestas(prev => {
      const currentValues = prev[preguntaId] || [];
      let newValues;

      if (checked) {
        newValues = [...currentValues, opcionValue];
      } else {
        newValues = currentValues.filter(v => v !== opcionValue);
      }

      return {
        ...prev,
        [preguntaId]: newValues
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preguntasObligatorias = preguntas.filter(p => p.obligatorio);
    const errores = preguntasObligatorias.filter(p => {
      const respuesta = respuestas[p.id];
      return !respuesta || (Array.isArray(respuesta) && respuesta.length === 0);
    });

    if (errores.length > 0) {
      setError(`Debes responder las preguntas obligatorias: ${errores.map(p => p.enunciado).join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const respuestasFormateadas = preguntas.map(pregunta => ({
        preguntaId: pregunta.id,
        respuestaTexto: Array.isArray(respuestas[pregunta.id])
          ? respuestas[pregunta.id].join(', ')
          : respuestas[pregunta.id],
        respuestaOpcionId: !Array.isArray(respuestas[pregunta.id]) && respuestas[pregunta.id] ? respuestas[pregunta.id] : ''
      }));

      await respuestasService.responderEncuesta(id, respuestasFormateadas);

      setSuccess('¡Encuesta respondida exitosamente!');
      setTimeout(() => {
        navigate('/encuestas');
      }, 2000);
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      setError(`Error al enviar las respuestas: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderPregunta = (pregunta) => {
    switch (pregunta.tipoPregunta) {
      case 'Texto':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Escribe tu respuesta aquí..."
            value={respuestas[pregunta.id] || ''}
            onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
            variant="outlined"
          />
        );

      case 'SeleccionUnica':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={respuestas[pregunta.id] || ''}
              onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
            >
              {pregunta.opciones.map((opcion) => (
                <FormControlLabel
                  key={opcion.id}
                  value={opcion.value}
                  control={<Radio color="primary" />}
                  label={opcion.label}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'OpcionMultiple':
        return (
          <Box>
            {pregunta.opciones.map((opcion) => (
              <FormControlLabel
                key={opcion.id}
                control={
                  <Checkbox
                    color="primary"
                    checked={(respuestas[pregunta.id] || []).includes(opcion.value)}
                    onChange={(e) => handleOpcionMultipleChange(
                      pregunta.id,
                      opcion.value,
                      e.target.checked
                    )}
                  />
                }
                label={opcion.label}
                sx={{ mb: 0.5 }}
              />
            ))}
          </Box>
        );

      case 'Escala':
        return (
          <Box sx={{ px: 2, pt: 2 }}>
            <Slider
              color="primary"
              value={respuestas[pregunta.id] ? parseInt(respuestas[pregunta.id]) : 3}
              onChange={(_, value) => handleRespuestaChange(pregunta.id, value.toString())}
              min={1}
              max={5}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' }
              ]}
              valueLabelDisplay="auto"
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption">Muy Malo</Typography>
              <Typography variant="caption">Excelente</Typography>
            </Box>
          </Box>
        );

      default:
        return <Typography color="error">Tipo de pregunta no soportado</Typography>;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando encuesta...</Typography>
      </Box>
    );
  }

  if (!encuesta) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>
          Encuesta no encontrada o no está disponible
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/encuestas')}
        >
          Volver a Encuestas
        </Button>
      </Container>
    );
  }

  if (preguntas.length === 0 && error) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2.5 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/encuestas')}
        >
          Volver a Encuestas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
          Encuestas
        </Link>
        <Typography color="text.primary" fontWeight={600}>
          Responder
        </Typography>
      </Breadcrumbs>

      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <IconButton onClick={() => navigate('/encuestas')} title="Volver">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">{encuesta.titulo}</Typography>
          {encuesta.descripcion && (
            <Typography variant="body1" color="text.secondary">
              {encuesta.descripcion}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Chip
          label={encuesta.estado || 'Activa'}
          color={encuesta.estado === 'Activa' ? 'success' : 'default'}
          size="small"
        />
        {encuesta.cierraEn && (
          <Chip
            label={`Cierra: ${new Date(encuesta.cierraEn).toLocaleDateString()}`}
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>{success}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box>
          {preguntas.map((pregunta, index) => (
            <Paper
              key={pregunta.id}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                mb: 3,
                border: '1px solid #E3E9F2',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {index + 1}. {pregunta.enunciado}
                {pregunta.obligatorio && (
                  <Chip
                    label="Obligatorio"
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                {pregunta.tipoPregunta}
              </Typography>

              {renderPregunta(pregunta)}
            </Paper>
          ))}
        </Box>

        <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 4, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/encuestas')}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || preguntas.length === 0}
            size="large"
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Enviar Respuestas'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ResponderEncuesta;
