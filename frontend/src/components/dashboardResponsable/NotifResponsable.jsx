import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";

const NotifResponsable = () => {
  // Estados para notificaciones activas e historial
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [historyNotifications, setHistoryNotifications] = useState([]);

  // Variantes de mensajes para notificaciones informativas y urgentes
  const informativaVariants = [
    "El alumno Juan ha avanzado en su proyecto.",
    "El alumno Pedro ha entregado su informe de avance.",
    "El alumno Ana ha completado su actividad de laboratorio.",
    "El alumno Luis ha subido su reporte semanal.",
    "El alumno Carla ha actualizado su progreso en el sistema.",
  ];

  const urgenteVariants = [
    "El alumno María tiene atraso en la entrega de avances.",
    "El alumno Carlos presenta un retraso crítico.",
    "El alumno Elena no ha actualizado su progreso desde hace días.",
    "El alumno Jorge necesita atención urgente por atraso.",
    "El alumno Sofía ha incumplido con la entrega de reportes.",
  ];

  // Función para agregar notificaciones simuladas
  const addNotification = (type) => {
    const message =
      type === "informativa"
        ? informativaVariants[
            Math.floor(Math.random() * informativaVariants.length)
          ]
        : urgenteVariants[Math.floor(Math.random() * urgenteVariants.length)];
    const newNotif = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleString(),
    };
    setActiveNotifications((prev) => [newNotif, ...prev]);
  };

  // Función para marcar una notificación informativa como leída (mover al historial)
  const handleAcknowledge = (id) => {
    const notif = activeNotifications.find((n) => n.id === id);
    if (notif) {
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
      setHistoryNotifications((prev) => [notif, ...prev]);
    }
  };

  // Función para resolver una notificación urgente (mover al historial)
  const handleResolve = (id) => {
    const notif = activeNotifications.find((n) => n.id === id);
    if (notif) {
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
      setHistoryNotifications((prev) => [notif, ...prev]);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" mb={2}>
        Notificaciones
      </Typography>

      {/* Sección para simular notificaciones */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Simular notificación
        </Typography>
        <Button
          variant="contained"
          color="info"
          onClick={() => addNotification("informativa")}
          sx={{ mr: 1 }}
        >
          Notificación Informativa
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => addNotification("urgente")}
        >
          Notificación Urgente
        </Button>
      </Box>

      {/* Sección de Notificaciones Activas */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notificaciones Activas
          </Typography>
          {activeNotifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones activas por el momento.
            </Typography>
          ) : (
            <List sx={{ maxHeight: 335, overflowY: "auto" }}>
              {activeNotifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    py: 1,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Chip
                      label={
                        notif.type === "urgente" ? "Urgente" : "Informativa"
                      }
                      color={notif.type === "urgente" ? "error" : "info"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <ListItemText
                      primary={notif.message}
                      secondary={notif.timestamp}
                    />
                  </Box>
                  <Box>
                    {notif.type === "informativa" && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleAcknowledge(notif.id)}
                      >
                        Marcar como leída
                      </Button>
                    )}
                    {notif.type === "urgente" && (
                      <Button
                        variant="outlined"
                        sx={{ color: "gray" }}
                        onClick={() => handleResolve(notif.id)}
                      >
                        Resolver
                      </Button>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Sección del Historial de Notificaciones */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial de Notificaciones
          </Typography>
          {historyNotifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay historial de notificaciones.
            </Typography>
          ) : (
            <List sx={{ maxHeight: 630, overflowY: "auto" }}>
              {historyNotifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    py: 1,
                  }}
                >
                  <Chip
                    label={notif.type === "urgente" ? "Urgente" : "Informativa"}
                    color={notif.type === "urgente" ? "error" : "info"}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={notif.message}
                    secondary={notif.timestamp}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotifResponsable;
