import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";

const Inicio = ({ handleSectionChange }) => {
  // Datos de prueba simulando respuesta del backend
  const responsable = {
    nombre: "María López",
    cargo: "Coordinadora del Servicio Social",
    fotoUrl: "", // En caso de no tener foto, dejar vacío
    dependencia: {
      nombre: "Universidad ABC",
      logoUrl: "", // En caso de no tener logo, dejar vacío para usar placeholder
    },
  };

  const programas = [
    { nombre: "Programa de Voluntariado", alumnosCount: 10 },
    { nombre: "Programa de Investigación", alumnosCount: 15 },
    { nombre: "Programa de Extensión", alumnosCount: 8 },
    { nombre: "Programa de Tutorías", alumnosCount: 12 },
  ];

  // Datos simulados de notificaciones pendientes (esto podría venir del backend)
  const notificacionesPendientes = 3;

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardContent>
        {/* Sección de datos del responsable */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={responsable.fotoUrl || ""}
            alt={responsable.nombre}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {responsable.nombre ? responsable.nombre.charAt(0) : ""}
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {responsable.nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {responsable.cargo}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              {responsable.dependencia.logoUrl ? (
                <Box
                  component="img"
                  src={responsable.dependencia.logoUrl}
                  alt={responsable.dependencia.nombre}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
              ) : (
                <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
                  {responsable.dependencia.nombre
                    ? responsable.dependencia.nombre.charAt(0)
                    : ""}
                </Avatar>
              )}
              <Typography variant="body1">
                {responsable.dependencia.nombre}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Sección de programas a cargo */}
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Programas a cargo
          </Typography>
          <List>
            {programas && programas.length > 0 ? (
              programas.slice(0, 5).map((programa, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={`${programa.nombre} - ${programa.alumnosCount} alumnos`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay programas asignados.
              </Typography>
            )}
          </List>
        </Box>

        {/* Botón para ver más detalles de programas */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSectionChange("Solicitudes")}
          sx={{ mb: 2 }}
        >
          Ver más detalles
        </Button>

        {/* Sección de notificaciones */}
        <Box mt={3} p={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tienes {notificacionesPendientes} notificaciones pendientes.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSectionChange("Notificaciones")}
          >
            Ir a Notificaciones
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Inicio;
