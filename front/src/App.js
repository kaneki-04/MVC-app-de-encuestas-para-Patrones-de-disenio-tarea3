import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Componentes de Autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Componentes de Encuestas
import EncuestasList from './components/encuestas/EncuestasList';
import CreateEncuesta from './components/encuestas/CreateEncuesta';
import EditEncuesta from './components/encuestas/EditEncuesta';
import PreguntasManager from './components/encuestas/PreguntasManager';
import EstadisticasEncuesta from './components/encuestas/EstadisticasEncuesta';

// Componentes de Respuestas
import ResponderEncuesta from './components/respuestas/ResponderEncuesta';
import MisRespuestas from './components/respuestas/MisRespuestas';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Autenticación */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/encuestas" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/encuestas" />}
      />

      {/* Encuestas */}
      <Route
        path="/encuestas"
        element={
          <ProtectedRoute>
            <DashboardLayout><EncuestasList /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/encuestas/create"
        element={
          <ProtectedRoute>
            <DashboardLayout><CreateEncuesta /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/encuestas/edit/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout><EditEncuesta /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/encuestas/:id/preguntas"
        element={
          <ProtectedRoute>
            <DashboardLayout><PreguntasManager /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/encuestas/:id/estadisticas"
        element={
          <ProtectedRoute>
            <DashboardLayout><EstadisticasEncuesta /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Respuestas */}
      <Route
        path="/encuestas/:id/responder"
        element={
          <ProtectedRoute>
            <DashboardLayout><ResponderEncuesta /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-respuestas"
        element={
          <ProtectedRoute>
            <DashboardLayout><MisRespuestas /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/encuestas" : "/login"} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
