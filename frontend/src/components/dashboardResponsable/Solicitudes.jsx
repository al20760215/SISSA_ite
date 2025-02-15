import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

// Función para generar un ID único simple (sólo para este ejemplo)
const generateId = () => Math.floor(Math.random() * 100000);

// Datos falsos iniciales de programas
const initialPrograms = [
  {
    id: 1,
    name: "Programa A",
    description: "Descripción del Programa A.",
    currentStudents: 0,
    maxStudents: 5,
    requests: [], // solicitudes pendientes
  },
  {
    id: 2,
    name: "Programa B",
    description: "Descripción del Programa B.",
    currentStudents: 2,
    maxStudents: 2, // programa lleno
    requests: [
      {
        id: 101,
        studentName: "Ana García",
        studentInfo: "Ingeniería Civil",
        requestDate: "14/02/2025",
        status: "pending",
      },
    ],
  },
  {
    id: 3,
    name: "Programa C",
    description: "Descripción del Programa C.",
    currentStudents: 1,
    maxStudents: 3,
    requests: [
      {
        id: 102,
        studentName: "Luis Rodríguez",
        studentInfo: "Medicina",
        requestDate: "13/02/2025",
        status: "pending",
      },
    ],
  },
];

// Algunos nombres y carreras aleatorias para simular solicitudes
const fakeStudents = [
  { name: "María López", info: "Arquitectura" },
  { name: "Carlos Pérez", info: "Administración" },
  { name: "Sofía Martínez", info: "Derecho" },
  { name: "Miguel Sánchez", info: "Ingeniería Industrial" },
  { name: "Laura Gómez", info: "Psicología" },
];

const Solicitudes = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [history, setHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Simula la llegada de una nueva solicitud para el programa con id específico
  const simulateNewRequestForProgram = (programId) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;
    // Seleccionar datos de un alumno aleatorio
    const randomStudent =
      fakeStudents[Math.floor(Math.random() * fakeStudents.length)];
    const newRequest = {
      id: generateId(),
      studentName: randomStudent.name,
      studentInfo: randomStudent.info,
      requestDate: new Date().toLocaleDateString(),
      status: "pending",
    };

    const updatedPrograms = programs.map((p) => {
      if (p.id === programId) {
        return { ...p, requests: [...p.requests, newRequest] };
      }
      return p;
    });
    setPrograms(updatedPrograms);
  };

  // Abre el diálogo para revisar la solicitud
  const handleReview = (program, request) => {
    setSelectedProgram(program);
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  // Procesa la aceptación o rechazo de la solicitud
  const processRequest = (action) => {
    if (!selectedProgram || !selectedRequest) return;
    // Si se intenta aceptar y el programa está lleno, se evita la acción
    if (
      action === "accept" &&
      selectedProgram.currentStudents >= selectedProgram.maxStudents
    ) {
      return;
    }

    // Actualizar el estado del programa removiendo la solicitud procesada
    const updatedPrograms = programs.map((p) => {
      if (p.id === selectedProgram.id) {
        const updatedRequests = p.requests.filter(
          (r) => r.id !== selectedRequest.id
        );
        const newCurrentStudents =
          action === "accept" ? p.currentStudents + 1 : p.currentStudents;
        return {
          ...p,
          requests: updatedRequests,
          currentStudents: newCurrentStudents,
        };
      }
      return p;
    });
    setPrograms(updatedPrograms);

    // Agregar la solicitud procesada al historial (con status actualizado)
    const processedRequest = {
      ...selectedRequest,
      status: action === "accept" ? "aceptada" : "rechazada",
      programName: selectedProgram.name,
    };
    setHistory((prevHistory) => {
      const newHistory = [processedRequest, ...prevHistory];
      // Mantener solo las últimas 5 solicitudes en el historial
      //   return newHistory.slice(0, 5);
      return newHistory;
    });

    // Cerrar diálogo
    setOpenDialog(false);
    setSelectedProgram(null);
    setSelectedRequest(null);
  };

  // Cierra el diálogo sin procesar la solicitud
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setSelectedRequest(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Solicitudes
      </Typography>

      {/* Listado de programas y solicitudes */}
      <Grid container spacing={2}>
        {programs.map((program) => {
          // Mostrar solo las 3 solicitudes más recientes (mostrando primero las más nuevas)
          const recentRequests = [...program.requests];
          return (
            <Grid item xs={12} md={6} key={program.id}>
              <Paper sx={{ p: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Box>
                    <Typography variant="h6">{program.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {program.description}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="subtitle2">
                      {program.currentStudents}/{program.maxStudents} alumnos
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => simulateNewRequestForProgram(program.id)}
                      sx={{ mt: 1 }}
                    >
                      Simular solicitud
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                {/* Contenedor con scroll vertical si hay más de 3 solicitudes */}
                <Box
                  sx={
                    program.requests.length > 3
                      ? { maxHeight: 280, overflowY: "auto" }
                      : {}
                  }
                >
                  <List>
                    {recentRequests.length > 0 ? (
                      recentRequests.map((request) => {
                        const isProgramFull =
                          program.currentStudents >= program.maxStudents;
                        return (
                          <ListItem
                            key={request.id}
                            sx={{
                              bgcolor: isProgramFull
                                ? "grey.300"
                                : "background.paper",
                              mb: 1,
                              borderRadius: 1,
                            }}
                          >
                            <Grid container alignItems="center">
                              <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                  {request.studentName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {request.studentInfo}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant="caption">
                                  {request.requestDate}
                                </Typography>
                              </Grid>
                              <Grid item xs={3} textAlign="right">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleReview(program, request)}
                                >
                                  Revisar
                                </Button>
                              </Grid>
                            </Grid>
                          </ListItem>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay solicitudes pendientes.
                      </Typography>
                    )}
                  </List>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Diálogo de confirmación para revisar la solicitud */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar solicitud</DialogTitle>
        <DialogContent dividers>
          {selectedProgram && selectedRequest && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Alumno:</strong> {selectedRequest.studentName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Información:</strong> {selectedRequest.studentInfo}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Fecha de solicitud:</strong>{" "}
                {selectedRequest.requestDate}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Programa:</strong> {selectedProgram.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedProgram.description}
              </Typography>
              {selectedProgram.currentStudents >=
              selectedProgram.maxStudents ? (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  sx={{ mt: 2 }}
                >
                  El programa se encuentra lleno, por lo que ya no se pueden
                  aceptar solicitudes.
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  sx={{ mt: 2 }}
                >
                  Una vez aceptado, no podrá expulsar al alumno del programa a
                  menos que contacte con la oficina del servicio social del ITE.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => processRequest("rechazar")}
            color="error"
            variant="outlined"
          >
            Rechazar
          </Button>
          <Button
            onClick={() => processRequest("accept")}
            variant="contained"
            disabled={
              selectedProgram &&
              selectedProgram.currentStudents >= selectedProgram.maxStudents
            }
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Historial de solicitudes procesadas */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Historial de solicitudes
        </Typography>
        <Paper sx={{ maxHeight: 200, overflowY: "auto", p: 2 }}>
          {history.length > 0 ? (
            <List>
              {history.map((item) => (
                <ListItem key={item.id} divider>
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        {item.studentName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        {item.programName}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">
                        {item.requestDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} textAlign="right">
                      <Typography
                        variant="body2"
                        color={
                          item.status === "aceptada"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {item.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay solicitudes procesadas.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Solicitudes;
