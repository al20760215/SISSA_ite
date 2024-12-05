import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Container,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import NotifIcon from "@mui/icons-material/Notifications";
import BallotIcon from "@mui/icons-material/Ballot";
import SchoolIcon from "@mui/icons-material/School";
import FaceIcon from "@mui/icons-material/Face";
import ArticleIcon from "@mui/icons-material/Article";
import { useState } from "react";
import ProgramasServicio from "../components/dashboardAdmin/Programas";

const drawerWidth = 240;

export default function ClippedDrawer() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [activeSection, setActiveSection] = useState(""); // Estado para la seccion activa

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section); // Cambia la sección activa
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Inicio":
        return <Typography variant="h5">Contenido de Inicio</Typography>;
      case "Lista de Programas":
        return (
          <Container display="flex">
            <Typography variant="h5" sx={{ mb: 2 }}>
              Contenido de Lista de Programas
            </Typography>
            <ProgramasServicio />
          </Container>
        );
      case "Solicitudes":
        return <Typography variant="h5">Contenido de Solicitudes</Typography>;
      case "Notificaciones":
        return (
          <Typography variant="h5">Contenido de Notificaciones</Typography>
        );
      case "Alumnos":
        return <Typography variant="h5">Lista de Alumnos</Typography>;
      case "Tutores":
        return <Typography variant="h5">Lista de Tutores</Typography>;
      case "Logs":
        return <Typography variant="h5">Contenido de Logs</Typography>;
      default:
        return (
          <>
            <Typography variant="h3" sx={{ marginBottom: 2 }}>
              Dashboard del Administrador
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
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            SISSA Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem key="inicio" disablePadding>
              <ListItemButton onClick={() => handleSectionChange("Inicio")}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Inicio"} />
              </ListItemButton>
            </ListItem>
            <ListItem key="listaprogramas" disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("Lista de Programas")}
              >
                <ListItemIcon>
                  <BallotIcon />
                </ListItemIcon>
                <ListItemText primary={"Programas"} />
              </ListItemButton>
            </ListItem>
            <ListItem key="solicitudes" disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("Solicitudes")}
              >
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={"Solicitudes"} />
              </ListItemButton>
            </ListItem>
            <ListItem key="notificaciones" disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("Notificaciones")}
              >
                <ListItemIcon>
                  <NotifIcon />
                </ListItemIcon>
                <ListItemText primary={"Notificaciones"} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key="alumnos" disablePadding>
              <ListItemButton onClick={() => handleSectionChange("Alumnos")}>
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText primary={"Alumnos"} />
              </ListItemButton>
            </ListItem>
            <ListItem key="tutores" disablePadding>
              <ListItemButton onClick={() => handleSectionChange("Tutores")}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary={"Tutores"} />
              </ListItemButton>
            </ListItem>
            <ListItem key="logs" disablePadding>
              <ListItemButton onClick={() => handleSectionChange("Logs")}>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary={"Logs"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
