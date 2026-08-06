import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Tooltip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  RadioButtonChecked as OpcionUnicaIcon,
  CheckBox as OpcionMultipleIcon,
  ShortText as TextoIcon,
  LinearScale as EscalaIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { preguntasService } from '../../services/api';

const PreguntasManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPreguntaId, setCurrentPreguntaId] = useState(null);

  const [formData, setFormData] = useState({
    enunciado: '',
    tipoPregunta: 'Texto',
    obligatorio: false,
    opciones: ['Opción 1', 'Opción 2']
  });

  useEffect(() => {
    loadPreguntas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPreguntas = async () => {
    try {
      setLoading(true);
      const data = await preguntasService.getPreguntasByEncuesta(id);
      setPreguntas(data);
    } catch (error) {
      setError('Error al cargar las preguntas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditMode(false);
    setCurrentPreguntaId(null);
    setFormData({ 
      enunciado: '', 
      tipoPregunta: 'Texto', 
      obligatorio: false,
      opciones: ['Opción 1', 'Opción 2']
    });
    setOpenDialog(true);
  };

  const handleEdit = (pregunta) => {
    setEditMode(true);
    setCurrentPreguntaId(pregunta.id);
    setFormData({
      enunciado: pregunta.enunciado,
      tipoPregunta: pregunta.tipoPregunta,
      obligatorio: pregunta.obligatorio,
      opciones: pregunta.opciones && pregunta.opciones.length > 0 
        ? pregunta.opciones.map(o => o.label) 
        : ['Opción 1', 'Opción 2']
    });
    setOpenDialog(true);
  };

  const handleOpcionChange = (index, value) => {
    const newOpciones = [...formData.opciones];
    newOpciones[index] = value;
    setFormData({ ...formData, opciones: newOpciones });
  };

  const handleAddOpcion = () => {
    setFormData({ ...formData, opciones: [...formData.opciones, `Opción ${formData.opciones.length + 1}`] });
  };

  const handleRemoveOpcion = (index) => {
    const newOpciones = formData.opciones.filter((_, i) => i !== index);
    setFormData({ ...formData, opciones: newOpciones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const dataToSend = {
        ...formData,
        encuestaId: parseInt(id),
        opciones: (formData.tipoPregunta === 'SeleccionUnica' || formData.tipoPregunta === 'OpcionMultiple') 
          ? formData.opciones 
          : []
      };

      if (editMode) {
        await preguntasService.updatePregunta(currentPreguntaId, dataToSend);
      } else {
        await preguntasService.createPregunta(id, dataToSend);
      }

      setOpenDialog(false);
      await loadPreguntas();
    } catch (error) {
      setError('Error al guardar la pregunta: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleDelete = async (preguntaId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta pregunta? Esta acción es irreversible.')) {
      try {
        await preguntasService.deletePregunta(preguntaId);
        await loadPreguntas();
      } catch {
        setError('Error al eliminar la pregunta');
      }
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'SeleccionUnica': return <OpcionUnicaIcon />;
      case 'OpcionMultiple': return <OpcionMultipleIcon />;
      case 'Texto': return <TextoIcon />;
      case 'Escala': return <EscalaIcon />;
      default: return <TextoIcon />;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'SeleccionUnica': return 'Selección Única';
      case 'OpcionMultiple': return 'Opción Múltiple';
      case 'Texto': return 'Texto Libre';
      case 'Escala': return 'Escala Numérica';
      default: return 'Texto';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'SeleccionUnica': return 'primary';
      case 'OpcionMultiple': return 'secondary';
      case 'Texto': return 'info';
      case 'Escala': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Migas de pan */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/encuestas" underline="hover" color="inherit">
          Encuestas
        </Link>
        <Typography color="text.primary" fontWeight={600}>
          Preguntas
        </Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton onClick={() => navigate('/encuestas')} title="Volver">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4">Preguntas de la Encuesta</Typography>
            <Typography variant="body1" color="text.secondary">
              Administra las preguntas y opciones de tu encuesta
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Agregar Pregunta
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{error}</Alert>}

      {preguntas.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', border: '2px dashed #B9C6DD', boxShadow: 'none' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aún no hay preguntas.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            ¡Comienza a construir tu encuesta añadiendo la primera pregunta!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Agregar Primera Pregunta
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {preguntas.map((pregunta) => (
            <Grid item xs={12} md={6} xl={4} key={pregunta.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #E3E9F2',
                  borderLeft: `5px solid`,
                  borderLeftColor: `${getTipoColor(pregunta.tipoPregunta)}.main`,
                  transition: '0.25s',
                  '&:hover': {
                    boxShadow: '0 12px 28px rgba(21, 101, 192, 0.10)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                    <Box display="flex" alignItems="flex-start" gap={1.5} minWidth={0}>
                      <Box color={`${getTipoColor(pregunta.tipoPregunta)}.main`} sx={{ mt: 0.5 }}>
                        {getTipoIcon(pregunta.tipoPregunta)}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {pregunta.enunciado}
                      </Typography>
                    </Box>
                    {pregunta.obligatorio && (
                      <Tooltip title="Esta pregunta es obligatoria">
                        <Chip label="Obligatoria" color="error" size="small" variant="outlined" sx={{ flexShrink: 0 }} />
                      </Tooltip>
                    )}
                  </Box>

                  <Box mt={1.5} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip
                      label={getTipoLabel(pregunta.tipoPregunta)}
                      color={getTipoColor(pregunta.tipoPregunta)}
                      size="small"
                    />
                    {pregunta.opciones && pregunta.opciones.length > 0 && (
                      <Chip
                        label={`Opciones: ${pregunta.opciones.length}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {pregunta.opciones && pregunta.opciones.length > 0 && (
                    <Typography
                      variant="caption"
                      display="block"
                      mt={1.5}
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Opciones: {pregunta.opciones.map(o => o.label).join(', ')}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip title="Editar Pregunta">
                      <IconButton color="primary" onClick={() => handleEdit(pregunta)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Pregunta">
                      <IconButton color="error" onClick={() => handleDelete(pregunta.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de Creación / Edición */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editMode ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <TextField
              label="Enunciado de la Pregunta"
              fullWidth
              multiline
              rows={2}
              required
              value={formData.enunciado}
              onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
              variant="outlined"
            />
            <TextField
              select
              label="Tipo de Pregunta"
              fullWidth
              required
              value={formData.tipoPregunta}
              onChange={(e) => setFormData({ ...formData, tipoPregunta: e.target.value })}
              variant="outlined"
            >
              <MenuItem value="Texto">Texto Libre</MenuItem>
              <MenuItem value="SeleccionUnica">Selección Única</MenuItem>
              <MenuItem value="OpcionMultiple">Opción Múltiple</MenuItem>
              <MenuItem value="Escala">Escala Numérica</MenuItem>
            </TextField>

            {(formData.tipoPregunta === 'SeleccionUnica' || formData.tipoPregunta === 'OpcionMultiple') && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E3E9F2' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Opciones de respuesta</Typography>
                {formData.opciones.map((op, idx) => (
                  <Box key={idx} display="flex" gap={1} alignItems="center">
                    <TextField
                      size="small"
                      fullWidth
                      value={op}
                      onChange={(e) => handleOpcionChange(idx, e.target.value)}
                      placeholder={`Opción ${idx + 1}`}
                      required
                    />
                    {formData.opciones.length > 1 && (
                      <IconButton color="error" size="small" onClick={() => handleRemoveOpcion(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddOpcion}
                  sx={{ alignSelf: 'flex-start', mt: 0.5 }}
                >
                  Añadir Opción
                </Button>
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.obligatorio}
                  onChange={(e) => setFormData({ ...formData, obligatorio: e.target.checked })}
                  color="primary"
                />
              }
              label="Marcar como Pregunta Obligatoria"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #EEE' }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={editMode ? <EditIcon /> : <AddIcon />}
            >
              {editMode ? 'Guardar Cambios' : 'Crear Pregunta'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PreguntasManager;
