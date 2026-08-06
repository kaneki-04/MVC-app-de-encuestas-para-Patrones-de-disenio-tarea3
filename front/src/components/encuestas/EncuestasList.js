import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Container,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as ChartIcon,
  MoreVert as MoreIcon,
  QuestionAnswer as PreguntasIcon,
  PlayArrow as ResponderIcon,
  List as RespuestasIcon,
  FileDownload as FileDownloadIcon,
  AccessTime as AccessTimeIcon,
  AccountTree as StructureIcon,
  Poll as PollIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { encuestasService } from '../../services/api';
import ExportEncuestaModal from './ExportEncuestaModal';

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Activa': return 'success';
    case 'Inactiva': return 'warning';
    case 'Finalizada': return 'error';
    default: return 'default';
  }
};

const EncuestasList = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState(null);
  const [openExportModal, setOpenExportModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadEncuestas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEncuestas = async () => {
    try {
      setLoading(true);
      const data = await encuestasService.getEncuestas();
      setEncuestas(data);
    } catch (error) {
      setError('Error al cargar las encuestas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => navigate('/encuestas/create');
  const handleEdit = (id) => navigate(`/encuestas/edit/${id}`);
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) {
      try {
        await encuestasService.deleteEncuesta(id);
        await loadEncuestas();
      } catch {
        setError('Error al eliminar la encuesta...');
      }
    }
  };
  const handleMenuOpen = (event, encuesta) => {
    setMenuAnchor(event.currentTarget);
    setEncuestaSeleccionada(encuesta);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setEncuestaSeleccionada(null);
  };
  const handleGestionPreguntas = () => {
    handleMenuClose();
    encuestaSeleccionada && navigate(`/encuestas/${encuestaSeleccionada.id}/preguntas`);
  };
  const handleVerEstadisticas = () => {
    handleMenuClose();
    encuestaSeleccionada && navigate(`/encuestas/${encuestaSeleccionada.id}/estadisticas`);
  };
  const handleResponderEncuesta = () => {
    handleMenuClose();
    encuestaSeleccionada && navigate(`/encuestas/${encuestaSeleccionada.id}/responder`);
  };
  const handleMisRespuestas = () => navigate('/mis-respuestas');

  const totalRespuestas = encuestas.reduce((acc, e) => acc + (e.totalRespuestas || 0), 0);
  const activas = encuestas.filter((e) => e.estado === 'Activa').length;

  const stats = [
    { label: 'Encuestas totales', value: encuestas.length, icon: <PollIcon />, color: '#1565C0' },
    { label: 'Encuestas activas', value: activas, icon: <ResponderIcon />, color: '#2E7D32' },
    { label: 'Respuestas recibidas', value: totalRespuestas, icon: <RespuestasIcon />, color: '#0288D1' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
      {/* Encabezado */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Mis Encuestas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona y analiza todas tus encuestas
          </Typography>
        </Box>

        <Box display="flex" gap={1.5} flexWrap="wrap" justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<RespuestasIcon />}
            onClick={handleMisRespuestas}
          >
            Mis Respuestas
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setOpenExportModal(true)}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Crear Encuesta
          </Button>
        </Box>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Paper
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid #E3E9F2',
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: `${stat.color}18`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>{error}</Alert>
      )}

      {/* Listado de Encuestas */}
      <Grid container spacing={3}>
        {encuestas.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                border: '2px dashed #B9C6DD',
                boxShadow: 'none',
              }}
            >
              <PollIcon sx={{ fontSize: 64, color: 'primary.main', mb: 1.5 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Crea tu Primera Encuesta
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                No tienes encuestas todavía. Usa el botón para comenzar.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Comenzar
              </Button>
            </Paper>
          </Grid>
        ) : (
          encuestas.map((encuesta) => (
            <Grid item xs={12} md={6} xl={4} key={encuesta.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.25s',
                  border: '1px solid #E3E9F2',
                  '&:hover': {
                    boxShadow: '0 12px 28px rgba(21, 101, 192, 0.12)',
                    transform: 'translateY(-4px)',
                    borderColor: '#90CAF9',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, pr: 1 }}>
                      {encuesta.titulo}
                    </Typography>
                    <Chip
                      label={encuesta.estado}
                      color={getEstadoColor(encuesta.estado)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: '40px',
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {encuesta.descripcion || 'Sin descripción.'}
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <RespuestasIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          {encuesta.totalRespuestas || 0} Respuestas
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <StructureIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          {encuesta.totalPreguntas || 0} Preguntas
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Cierra: {encuesta.cierraEn ? new Date(encuesta.cierraEn).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Acciones */}
                <Box sx={{ px: 1.5, pb: 1.5, borderTop: '1px solid #EEF2F8', pt: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/encuestas/${encuesta.id}/responder`)}
                        title="Responder Encuesta"
                      >
                        <ResponderIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/encuestas/${encuesta.id}/estadisticas`)}
                        title="Ver Estadísticas"
                      >
                        <ChartIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(encuesta.id)}
                        title="Editar Encuesta"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(encuesta.id)}
                        title="Eliminar Encuesta"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, encuesta)}
                        title="Más opciones"
                        color="inherit"
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Menú de opciones adicionales */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleGestionPreguntas}>
          <PreguntasIcon sx={{ mr: 1, color: 'primary.main' }} />
          Gestionar Preguntas
        </MenuItem>
        <MenuItem onClick={handleVerEstadisticas}>
          <ChartIcon sx={{ mr: 1, color: 'info.main' }} />
          Ver Estadísticas
        </MenuItem>
        <MenuItem onClick={handleResponderEncuesta}>
          <ResponderIcon sx={{ mr: 1, color: 'primary.main' }} />
          Responder Encuesta
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => encuestaSeleccionada && handleDelete(encuestaSeleccionada.id)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar (Menú)
        </MenuItem>
      </Menu>

      {/* Modal de exportación */}
      <ExportEncuestaModal open={openExportModal} onClose={() => setOpenExportModal(false)} />
    </Container>
  );
};

export default EncuestasList;
