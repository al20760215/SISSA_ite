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
  Stack,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const Notificaciones = ({ handleSectionChange }) => {
  // Estados para notificaciones activas e historial
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [historyNotifications, setHistoryNotifications] = useState([]);

  // Función para simular la llegada de una notificación desde el backend
  const simulateNotification = (type) => {
    let message = "";
    switch (type) {
      case "informativa":
        message =
          "Atención: El convenio con la Institución X se finalizará próximamente.";
        break;
      case "documentos":
        message = "Nuevo documento a validar";
        break;
      case "externa":
        message =
          "Se requiere enviar un correo a tutor por revisión de reportes.";
        break;
      default:
        message = "Notificación genérica";
    }
    const newNotif = {
      id: uuidv4(),
      type,
      message,
      // Se guarda la fecha de generación en formato legible
      timestamp: new Date().toLocaleString(),
      // Se guarda también la fecha en crudo para otros usos (si se requiriera)
      generationDate: new Date(),
    };
    setActiveNotifications((prev) => [newNotif, ...prev]);
  };

  // Para notificaciones informativas: se marcan como leídas (se mueven al historial)
  const handleAcknowledge = (id) => {
    const notif = activeNotifications.find((n) => n.id === id);
    if (notif) {
      notif.attendedTimestamp = new Date().toLocaleString();
      notif.attendedDate = new Date();
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
      setHistoryNotifications((prev) => [notif, ...prev]);
    }
  };

  // Para notificaciones de "documentos" y "externa": se marcan como completadas y se mueven al historial
  const handleComplete = (id) => {
    const notif = activeNotifications.find((n) => n.id === id);
    if (notif) {
      notif.attendedTimestamp = new Date().toLocaleString();
      notif.attendedDate = new Date();
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
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="info"
            onClick={() => simulateNotification("informativa")}
          >
            Notificación Informativa
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => simulateNotification("documentos")}
          >
            Notificación de Documentos
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => simulateNotification("externa")}
          >
            Notificación Externa
          </Button>
        </Stack>
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
                        notif.type === "informativa"
                          ? "Informativa"
                          : notif.type === "documentos"
                          ? "Documentos"
                          : "Externa"
                      }
                      color={
                        notif.type === "informativa"
                          ? "info"
                          : notif.type === "documentos"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <ListItemText
                      primary={notif.message}
                      secondary={`Generado: ${notif.timestamp}`}
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
                    {(notif.type === "documentos" ||
                      notif.type === "externa") && (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleComplete(notif.id)}
                          sx={{ mr: 1 }}
                        >
                          Marcar como completada
                        </Button>
                        {notif.type === "documentos" && (
                          <Button
                            variant="contained"
                            onClick={() => handleSectionChange("Documentos")}
                          >
                            Ir a Documentos
                          </Button>
                        )}
                      </>
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
                    label={
                      notif.type === "informativa"
                        ? "Informativa"
                        : notif.type === "documentos"
                        ? "Documentos"
                        : "Externa"
                    }
                    color={
                      notif.type === "informativa"
                        ? "info"
                        : notif.type === "documentos"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={notif.message}
                    secondary={`Generado: ${notif.timestamp} | Atendido: ${notif.attendedTimestamp}`}
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

export default Notificaciones;
