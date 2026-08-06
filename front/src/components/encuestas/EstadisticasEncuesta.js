import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip as MuiTooltip,
  Breadcrumbs,
  Link,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { respuestasService, encuestasService } from '../../services/api';

const COLORS = ['#1565C0', '#1E88E5', '#42A5F5', '#00B4D8', '#0277BD', '#90CAF9'];

const EstadisticasEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [encuesta, setEncuesta] = useState(null);
  const [graficos, setGraficos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const [encuestaData, respuestasData] = await Promise.all([
        encuestasService.getEncuesta(id),
        respuestasService.getRespuestasByEncuesta(id)
      ]);

      setEncuesta(encuestaData);
      setEstadisticas(respuestasData);

      const graficosData = {};
      respuestasData.respuestas?.forEach((usuario) => {
        usuario.respuestas.forEach((r) => {
          const preguntaEnunciado = r.pregunta;
          const respuestaValor = r.respuesta;

          if (!graficosData[preguntaEnunciado]) graficosData[preguntaEnunciado] = {};

          graficosData[preguntaEnunciado][respuestaValor] =
            (graficosData[preguntaEnunciado][respuestaValor] || 0) + 1;
        });
      });

      const graficosMap = Object.keys(graficosData).map((pregunta) => ({
        pregunta,
        data: Object.entries(graficosData[pregunta]).map(([respuesta, count]) => ({
          name: respuesta,
          value: count,
        })),
      }));

      const graficosPorEnunciado = graficosMap.reduce((acc, curr) => {
        acc[curr.pregunta] = curr;
        return acc;
      }, {});

      const preguntasOrdenadas = encuestaData.preguntas || [];

      const graficosFinalesOrdenados = preguntasOrdenadas
        .map(p => graficosPorEnunciado[p.enunciado])
        .filter(grafico => grafico);

      setGraficos(graficosFinalesOrdenados.length > 0 ? graficosFinalesOrdenados : graficosMap);
    } catch (e) {
      console.error(e);
      setError('Error al cargar las estadísticas. Revise la consola para detalles.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ borderRadius: 2.5, mb: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!estadisticas || !estadisticas.respuestas?.length) {
    return (
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
            Encuestas
          </Link>
          <Typography color="text.primary" fontWeight={600}>Estadísticas</Typography>
        </Breadcrumbs>
        <Paper sx={{ p: 4, border: '1px solid #E3E9F2' }}>
          <Alert severity="info" sx={{ borderRadius: 2.5 }}>
            No hay respuestas registradas para esta encuesta.
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
          Encuestas
        </Link>
        <Typography color="text.primary" fontWeight={600}>Estadísticas</Typography>
      </Breadcrumbs>

      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <IconButton onClick={() => navigate('/encuestas')} title="Volver">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">{encuesta?.titulo || 'Estadísticas de Encuesta'}</Typography>
          <Typography variant="body1" color="text.secondary">
            {encuesta?.descripcion || 'Análisis de las respuestas recolectadas.'}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={1.5} flexWrap="wrap" mb={3}>
        <Chip label={`${estadisticas.respuestas?.length} Respuestas`} color="primary" />
        <Chip label={`Estado: ${encuesta?.estado}`} variant="outlined" />
      </Box>

      {/* Resumen de la encuesta */}
      <Paper sx={{ p: 3, border: '1px solid #E3E9F2', mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Preguntas y respuestas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {estadisticas.respuestas?.length} usuario(s) respondieron esta encuesta.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {graficos.length} pregunta(s) con datos recolectados.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Distribución de respuestas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revisa las gráficas por pregunta para ver la frecuencia de cada respuesta.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráficas por pregunta */}
      <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
        Gráficos
      </Typography>

      <Grid container spacing={3}>
        {graficos.map((grafico, index) => {
          const isSingleResponse = grafico.data.length === 1;

          return (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ border: '1px solid #E3E9F2' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {grafico.pregunta}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    {grafico.data.length > 2 || isSingleResponse ? (
                      <BarChart data={grafico.data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E3E9F2" />
                        <XAxis
                          dataKey="name"
                          interval={0}
                          angle={grafico.data.length > 3 ? -30 : 0}
                          textAnchor={grafico.data.length > 3 ? "end" : "middle"}
                          height={grafico.data.length > 3 ? 60 : 30}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS[0]} radius={[6, 6, 0, 0]} name="Respuestas" />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={grafico.data}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="value"
                          label={!isSingleResponse ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : false}
                        >
                          {grafico.data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respuestas`, 'Total']} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Respuestas detalladas */}
      <Typography variant="h5" sx={{ mt: 5, mb: 2.5, fontWeight: 700 }}>
        Respuestas Detalladas
      </Typography>

      <Paper sx={{ border: '1px solid #E3E9F2' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F4F7FB' }}>
                <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Pregunta</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Respuesta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estadisticas.respuestas.map((respuestaUsuario, index) =>
                respuestaUsuario.respuestas.map((respuesta, i) => (
                  <TableRow key={`${index}-${i}`} hover>
                    {i === 0 && (
                      <>
                        <TableCell rowSpan={respuestaUsuario.respuestas.length}>
                          {respuestaUsuario.usuario || `Usuario ${index + 1}`}
                        </TableCell>
                        <TableCell rowSpan={respuestaUsuario.respuestas.length}>
                          {new Date(respuestaUsuario.fecha).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{respuesta.pregunta}</TableCell>
                    <TableCell>
                      <MuiTooltip title={respuesta.respuesta} placement="top">
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            maxWidth: '250px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {respuesta.respuesta}
                        </Box>
                      </MuiTooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EstadisticasEncuesta;
