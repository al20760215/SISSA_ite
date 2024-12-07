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
import ProgramasServicio from "../components/dashboardAlumno/ProgramasServicio";
import EstadoInicio from "../components/dashboardAlumno/EstadoInicio";
import PlaticaServicio from "../components/dashboardAlumno/PlaticaServicio";
import axios from "axios";
import EstadoSolicitud from "../components/dashboardAlumno/EstadoSolicitud";
import ReportesBimestrales from "../components/dashboardAlumno/ReportesBimestrales";
import ReporteFinal from "../components/dashboardAlumno/ReporteFinal";
import TerminacionServicio from "../components/dashboardAlumno/TerminacionServicio";
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
    handleMenuClose(); // cerrar menu luego de accion
  };

  const handleSectionChange = (section) => {
    setActiveSection(section); // Cambia la sección activa
    setMobileOpen(false); // Cierra el drawer en dispositivos móviles
  };

  const drawer = (
    <div>
      <Box
        component={Link}
        to="/admin/dashboard"
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
        <ListItem key="platicaservicio" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Platica Servicio")}
          >
            <ListItemIcon>
              <VoiceIcon />
            </ListItemIcon>
            <ListItemText primary={"Platica del Servicio"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="listaprogramas" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Lista de Programas")}
          >
            <ListItemIcon>
              <BallotIcon />
            </ListItemIcon>
            <ListItemText primary={"Lista de Programas"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="estadosolicitud" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Estado de Solicitud")}
          >
            <ListItemIcon>
              <ViewIcon />
            </ListItemIcon>
            <ListItemText primary={"Estado de Solicitud"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key="reportesbimestrales" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Reportes Bimestrales")}
          >
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Reportes bimestrales"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="reportefinal" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Reporte Final")}>
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Reporte final"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="terminacionservicio" disablePadding>
          <ListItemButton
            onClick={() => handleSectionChange("Terminacion del Servicio")}
          >
            <ListItemIcon>
              <SignIcon />
            </ListItemIcon>
            <ListItemText primary={"Terminacion del Servicio"} />
          </ListItemButton>
        </ListItem>
        {/* <ListItem key="evidencias" disablePadding>
          <ListItemButton onClick={() => handleSectionChange("Evidencias")}>
            <ListItemIcon>
              <WallpaperIcon />
            </ListItemIcon>
            <ListItemText primary={"Evidencias"} />
          </ListItemButton>
        </ListItem> */}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "Inicio":
        return (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Contenido de Inicio
            </Typography>
            <EstadoInicio usuario handleSectionChange={handleSectionChange} />
          </>
        );
      case "Lista de Programas":
        return (
          <Container display="flex">
            <Typography variant="h5" sx={{ mb: 2 }}>
              Contenido de Lista de Programas
            </Typography>
            <ProgramasServicio />
          </Container>
        );
      case "Platica Servicio":
        return (
          <Container display="flex">
            <Typography variant="h5" sx={{ mb: 2 }}>
              Platica del servicio social
            </Typography>
            <PlaticaServicio />
          </Container>
        );
      case "Estado de Solicitud":
        return (
          <Container display="flex">
            <EstadoSolicitud alumnoId={12345} />
          </Container>
        );
      case "Terminacion del Servicio":
        return <TerminacionServicio />;
      case "Reportes Bimestrales":
        return <ReportesBimestrales />;
      case "Reporte Final":
        return <ReporteFinal />;
      case "Evidencias":
        return <Typography variant="h5">Contenido de Evidencias</Typography>;
      default:
        return (
          <>
            <Typography variant="h3" sx={{ marginBottom: 2 }}>
              Bienvenido al Dashboard
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Rhoncus dolor purus non enim praesent elementum facilisis leo vel.
              Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
              gravida rutrum quisque non tellus. Convallis convallis tellus id
              interdum velit laoreet id donec ultrices. Odio morbi quis commodo
              odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum
              est ultricies integer quis. Cursus euismod quis viverra nibh cras.
              Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
              lobortis feugiat vivamus at augue. At augue eget arcu dictum
              varius duis at consectetur lorem. Velit sed ullamcorper morbi
              tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
              ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
              elementum integer enim neque volutpat ac tincidunt. Ornare
              suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
              Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
              ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
              aliquam sem et tortor. Habitant morbi tristique senectus et.
              Adipiscing elit duis tristique sollicitudin nibh sit. Ornare
              aenean euismod elementum nisi quis eleifend. Commodo viverra
              maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Typography>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
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
