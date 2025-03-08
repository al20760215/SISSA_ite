import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from "@mui/material";

// Datos simulados del alumno (posteriormente se obtendrán de una API)
const student = {
  id: "123456",
  nombre: "Juan",
  apellidos: "Pérez",
  carrera: "Ing. Sistemas Computacionales",
  semestre: 5,
  creditos: 80,
  isInscrito: true,
  answeredQuestionnaire: true,
};

// Validación de requisitos: inscrito, 70 o más créditos y cuestionario contestado
const checkEligibility = (student) =>
  student.isInscrito && student.creditos >= 70 && student.answeredQuestionnaire;

const ProgramasDisp = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Estado de la solicitud: "enviada", "disponible", "bloqueada por requisitos", "no disponible actualmente"
  const [requestState, setRequestState] = useState("disponible");

  // Estados para el envío de la solicitud y manejo del diálogo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    // Se obtiene el archivo JSON desde la carpeta public
    fetch("/src/components/dashboardAdmin/ProgramasVSS_Ene2025_test.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los programas");
        }
        return response.json();
      })
      .then((data) => {
        // Ordenar alfabéticamente por "Nombre del Programa de SS"
        data.sort((a, b) =>
          a["Nombre del Programa de SS"].localeCompare(
            b["Nombre del Programa de SS"]
          )
        );
        setPrograms(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setFetchError(err.message);
        setIsLoading(false);
        setRequestState("no disponible actualmente");
      });
  }, []);

  useEffect(() => {
    if (!checkEligibility(student)) {
      setRequestState("bloqueada por requisitos");
    } else {
      setRequestState("disponible");
    }
  }, []);

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setSubmissionError(null);
  };

  const handleRequestClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Simulación de envío de solicitud al backend
  const handleConfirmRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const success = true;
      if (success) {
        setRequestState("enviada");
        setIsSubmitting(false);
        setOpenDialog(false);
      } else {
        setSubmissionError("Error al enviar la solicitud. Intente de nuevo.");
        setIsSubmitting(false);
        setOpenDialog(false);
      }
    }, 2000);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Título con mayor separación */}
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Estado de la solicitud: {requestState}
      </Typography>

      {isLoading ? (
        <Typography>Cargando programas...</Typography>
      ) : fetchError ? (
        <Alert severity="error">{fetchError}</Alert>
      ) : (
        <Grid container spacing={2}>
          {/* Lista de programas */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Lista de Programas
            </Typography>
            <List
              sx={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
            >
              {programs.map((program) => (
                <ListItem key={program.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleProgramClick(program)}
                    selected={
                      selectedProgram && selectedProgram.id === program.id
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "secondary.light",
                        "&:hover": {
                          backgroundColor: "secondary.main",
                        },
                      },
                    }}
                  >
                    <Typography variant="body1">
                      {program["Nombre del Programa de SS"]}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Detalle del programa seleccionado */}
          <Grid item xs={12} md={8} mt={5}>
            {selectedProgram ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedProgram["Nombre del Programa de SS"]}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dependencia:</strong> {selectedProgram.Dependencia}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Domicilio:</strong> {selectedProgram.Domicilio}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {selectedProgram["Teléfono"]}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Responsable:</strong>{" "}
                    {
                      selectedProgram[
                        "Nombre del responsable del programa de SS"
                      ]
                    }
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cargo del responsable:</strong>{" "}
                    {
                      selectedProgram[
                        "Puesto del responsable del programa de SS"
                      ]
                    }
                  </Typography>
                  <Typography variant="body2">
                    <strong>Correo:</strong>{" "}
                    {
                      selectedProgram[
                        "Correo electrónico del responsable del SS"
                      ]
                    }
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Objetivo:</strong>{" "}
                    {selectedProgram["Objetivo del Programa de SS"]}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Actividades:</strong>
                  </Typography>
                  <List>
                    {selectedProgram[
                      "Desglose de actividades a realizar en el SS"
                    ].map((actividad, index) => (
                      <ListItem key={index} sx={{ pl: 4 }}>
                        <Typography variant="body2">- {actividad}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRequestClick}
                      disabled={isSubmitting || requestState !== "disponible"}
                    >
                      {isSubmitting
                        ? "Enviando solicitud"
                        : "Solicitar Programa"}
                    </Button>
                    {submissionError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {submissionError}
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Typography>
                Seleccione un programa para ver los detalles
              </Typography>
            )}
          </Grid>
        </Grid>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmación de solicitud</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que desea aplicar para el programa{" "}
            {selectedProgram
              ? selectedProgram["Nombre del Programa de SS"]
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={isSubmitting}>
            No
          </Button>
          <Button
            onClick={handleConfirmRequest}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando solicitud" : "Sí"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramasDisp;
