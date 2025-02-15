import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Button,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ViewIcon from "@mui/icons-material/Pageview";
import VoiceIcon from "@mui/icons-material/RecordVoiceOver";
import MenuIcon from "@mui/icons-material/Menu";
import NotifIcon from "@mui/icons-material/Notifications";
import BallotIcon from "@mui/icons-material/Ballot";
import SignIcon from "@mui/icons-material/DriveFileRenameOutline";
import NoteIcon from "@mui/icons-material/NoteAlt";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import logoite from "../assets/itelogo.png";
import { Link, useNavigate } from "react-router-dom";
import Inicio from "../components/dashboardResponsable/Inicio";
import Solicitudes from "../components/dashboardResponsable/Solicitudes";
import axios from "axios";
import EstadoSolicitud from "../components/dashboardAlumno/EstadoSolicitud";
import ReportesBimestrales from "../components/dashboardAlumno/ReportesBimestrales";
import ReporteFinal from "../components/dashboardAlumno/ReporteFinal";
import TerminacionServicio from "../components/dashboardAlumno/TerminacionServicio";
import NotifResponsable from "../components/dashboardResponsable/NotifResponsable";
import DocumentTests from "../components/dashboardResponsable/DocumentTests";
const drawerWidth = 240;

export default function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState(""); // Estado para la seccion activa
  const [usuario, setUsuario] = React.useState({});
  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("usuarioLocal"));
    if (datosGuardados) {
      setUsuario(fetchProtected(datosGuardados.token));
    }
  });

  const fetchProtected = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/protected",
        null,
        { Authorization: `Bearer ${token}` }
      );
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleSolicitarClick = async () => {
    console.log(await fetchProtected());
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget); // abrir menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // cerrar menu
  };

  const handleMenuItemClick = (action) => {
    console.log(`${action} clicked`); // manejar click del menu
    navigate("/");
    handleMenuClose(); // cerrar menu luego de accion
  };

  const handleSectionChange = (section) => {
    setActiveSection(section); // Cambia la sección activa
    setMobileOpen(false); // Cierra el drawer en dispositivos móviles
  };

  const drawer = (
    <Box sx={{ display: "auto", bgcolor: "#e8edff" }}>
      {/* <Box
        component={Link}
        to="/alumno/dashboard"
        underline="none"
        sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
      > */}

      <Box
        onClick={() => handleSectionChange("Inicio")}
        underline="none"
        sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
      >
        <img
          src={logoite}
          alt="Logo ITE"
          style={{
            width: "60px",
            height: "60px",
            marginRight: "8px",
            cursor: "pointer",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          SISSA
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem key="inicio" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Inicio")}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={"Inicio"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="notificaciones" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Notificaciones")}>
            <ListItemIcon>
              <VoiceIcon />
            </ListItemIcon>
            <ListItemText primary={"Notificaciones"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="solicitudes" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Solicitudes")}>
            <ListItemIcon>
              <BallotIcon />
            </ListItemIcon>
            <ListItemText primary={"Solicitudes y Programas"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="documentos" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Revision documentos")}
          >
            <ListItemIcon>
              <ViewIcon />
            </ListItemIcon>
            <ListItemText primary={"Revision de documentos"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {/* <ListItem key="evidencias" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Evidencias")}>
            <ListItemIcon>
              <WallpaperIcon />
            </ListItemIcon>
            <ListItemText primary={"Evidencias"} />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "Inicio":
        return (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Contenido de Inicio
            </Typography>
            <Inicio usuario handleSectionChange={handleSectionChange} />
          </>
        );
      case "Notificaciones":
        return (
          <Container display="flex">
            <NotifResponsable />
          </Container>
        );
      case "Solicitudes":
        return (
          <Container display="flex">
            <Typography variant="h5" sx={{ mb: 2 }}>
              Solicitudes
            </Typography>
            <Solicitudes />
          </Container>
        );
      case "Revision documentos":
        return (
          <Container display="flex">
            <DocumentTests />
          </Container>
        );
      case "Terminacion del Servicio":
        return <TerminacionServicio />;
      case "Reportes Bimestrales":
        return <ReportesBimestrales />;
      case "Reporte Final":
        return <ReporteFinal />;
      default:
        return (
          <>
            <Typography variant="h3" sx={{ marginBottom: 2 }}>
              Panel para Responsables de Programa del Servicio Social
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>Parrafo 1</Typography>
            <Typography sx={{ marginBottom: 2 }}>Parrafo 2</Typography>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/alumno/dashboard")}
            sx={{ marginRight: 2 }}
          >
            Dashboard Alumno
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/dashboard")}
            sx={{ marginRight: 2 }}
          >
            Dashboard Admin
          </Button>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema Integral de Servicio Social
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleUserIconClick}
            aria-label="user menu"
          >
            <Avatar alt="User Avatar" src="" />{" "}
          </IconButton>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("Profile")}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("My account")}>
            My account
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Logout")}>
            Logout
          </MenuItem>
        </Menu>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Mejora el rendimiento en dispositivos moviles
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
