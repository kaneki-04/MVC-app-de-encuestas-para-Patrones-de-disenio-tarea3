import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Assignment as EncuestaIcon,
  QuestionAnswer as RespuestaIcon,
} from '@mui/icons-material';
import { respuestasService } from '../../services/api';

const MisRespuestas = () => {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRespuestas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRespuestas = async () => {
    try {
      setLoading(true);
      const data = await respuestasService.getMisRespuestas();
      setRespuestas(data);
    } catch (error) {
      setError('Error al cargar las respuestas');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Mis Respuestas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Historial de encuestas que has respondido.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
          {error}
        </Alert>
      )}

      {respuestas.length === 0 ? (
        <Card sx={{ border: '1px solid #E3E9F2', boxShadow: 'none' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <RespuestaIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No has respondido encuestas aún
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cuando respondas encuestas, podrás ver tu historial aquí.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Has respondido {respuestas.length} encuesta{respuestas.length !== 1 ? 's' : ''}
          </Typography>

          {respuestas.map((respuesta, index) => (
            <Paper
              key={respuesta.id}
              sx={{
                mb: 3,
                p: { xs: 2.5, sm: 3 },
                border: '1px solid #E3E9F2',
              }}
            >
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: 'rgba(21, 101, 192, 0.10)',
                    color: '#1565C0',
                  }}
                >
                  <EncuestaIcon />
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1}>
                    <Typography variant="h6" component="h2">
                      {respuesta.encuesta.titulo}
                    </Typography>
                    <Chip
                      label={formatFecha(respuesta.fechaRespuesta)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    Pregunta: {respuesta.pregunta.enunciado}
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: '#F8FAFD', borderRadius: 2.5 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tu respuesta:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {respuesta.texto || 'Sin respuesta'}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {index < respuestas.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MisRespuestas;
