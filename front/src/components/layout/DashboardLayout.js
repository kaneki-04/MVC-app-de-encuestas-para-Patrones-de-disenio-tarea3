import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  NoteAdd as CreateIcon,
  FactCheck as RespuestasIcon,
  Logout as LogoutIcon,
  Poll as PollIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Inicio', path: '/encuestas', icon: <DashboardIcon /> },
  { label: 'Crear Encuesta', path: '/encuestas/create', icon: <CreateIcon /> },
  { label: 'Mis Respuestas', path: '/mis-respuestas', icon: <RespuestasIcon /> },
];

const SidebarContent = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userName = user?.username || user?.nombre || 'Usuario';
  const userRole = user?.rol || '';

  const handleClick = (path) => {
    onNavigate && onNavigate();
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 2.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)',
            color: '#fff',
          }}
        >
          <PollIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            EncuestasApp
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Panel de control
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navegación */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleClick(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2.5,
                  py: 1.1,
                  color: active ? 'primary.main' : 'text.primary',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(21, 101, 192, 0.10)',
                    '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.16)' },
                  },
                  '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.06)' },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 38, color: active ? 'primary.main' : 'inherit' }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: 14.5,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Usuario + Logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'primary.main',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ fontWeight: 700, fontSize: 14 }}
            >
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userRole || 'Usuario'}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Cerrar sesión">
          <IconButton
            color="error"
            onClick={handleLogout}
            sx={{
              width: '100%',
              borderRadius: 2.5,
              py: 1,
              border: '1px solid',
              borderColor: 'error.light',
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const userName = user?.username || user?.nombre || 'Usuario';

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Drawer escritorio */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E3E9F2',
            bgcolor: '#FFFFFF',
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent onNavigate={toggleDrawer} />
      </Drawer>

      {/* Contenido */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="inherit"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #E3E9F2',
          }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <IconButton
              edge="start"
              onClick={toggleDrawer}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'text.primary', flexGrow: 1 }}
            >
              Hola, {userName} 👋
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
