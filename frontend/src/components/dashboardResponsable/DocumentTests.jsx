import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

// Datos de ejemplo para simular estudiantes
const sampleStudents = [
  { name: "Juan Pérez", id: "12345", program: "Ingeniería Industrial" },
  { name: "María García", id: "67890", program: "Arquitectura" },
  { name: "Carlos López", id: "54321", program: "Medicina" },
];

// URLs de ejemplo para firma y sello (imágenes con transparencia)
const sampleSignature = "https://via.placeholder.com/150?text=Firma";
const sampleStamp = "https://via.placeholder.com/150?text=Sello";

const DocumentTests = () => {
  // Estado para datos del alumno
  const [studentData, setStudentData] = useState(sampleStudents[0]);
  // Datos del responsable
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleTitle, setResponsibleTitle] = useState("");
  // Imágenes de firma y sello
  const [signatureImage, setSignatureImage] = useState("");
  const [stampImage, setStampImage] = useState("");
  // Estado para el diálogo de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const requiredConfirmationPhrase = "confirmar datos del documento";

  // Función para simular datos aleatorios del alumno
  const handleSimulateStudent = () => {
    const randomIndex = Math.floor(Math.random() * sampleStudents.length);
    setStudentData(sampleStudents[randomIndex]);
  };

  // Funciones para asignar las imágenes de ejemplo
  const handleSetSignature = () => {
    setSignatureImage(sampleSignature);
  };

  const handleSetStamp = () => {
    setStampImage(sampleStamp);
  };

  // Abrir el diálogo de confirmación
  const handleConfirmSend = () => {
    setConfirmDialogOpen(true);
  };

  // Función final de confirmación, se simula el envío
  const handleFinalConfirm = () => {
    if (confirmInput === requiredConfirmationPhrase) {
      alert("Documento enviado al alumno.");
      // Se pueden reiniciar estados si se desea
      setConfirmDialogOpen(false);
      setConfirmInput("");
    }
  };

  // Verificar que todos los campos requeridos estén llenos
  const isFormComplete = () => {
    return responsibleName && responsibleTitle && signatureImage && stampImage;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Sección Documentos - Carta Compromiso
      </Typography>

      {/* Vista previa de la carta compromiso */}
      <Paper sx={{ p: 3, mb: 2, position: "relative" }}>
        <Typography variant="h6" gutterBottom>
          Carta Compromiso
        </Typography>
        <Typography variant="body1">
          Yo, {studentData.name} (ID: {studentData.id}), alumno del programa de{" "}
          {studentData.program}, me comprometo a cumplir con mi participación y
          trabajo en el servicio social.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Programa de Servicio Social: {studentData.program}
        </Typography>

        {/* Datos del responsable que se mostrarán en el documento */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2">Responsable:</Typography>
          <Typography variant="body1">
            Nombre: {responsibleName || "________"}
          </Typography>
          <Typography variant="body1">
            Cargo: {responsibleTitle || "________"}
          </Typography>
        </Box>

        {/* Imágenes superpuestas para firma y sello */}
        {signatureImage && (
          <Box sx={{ position: "absolute", bottom: 20, left: 20 }}>
            <img
              src={signatureImage}
              alt="Firma"
              style={{ width: "150px", opacity: 0.8 }}
            />
          </Box>
        )}
        {stampImage && (
          <Box sx={{ position: "absolute", bottom: 20, right: 20 }}>
            <img
              src={stampImage}
              alt="Sello"
              style={{ width: "150px", opacity: 0.8 }}
            />
          </Box>
        )}
      </Paper>

      {/* Formulario para ingresar datos del responsable y botones de prueba */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Nombre del responsable"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cargo del responsable"
          value={responsibleTitle}
          onChange={(e) => setResponsibleTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={handleSetSignature}>
              Usar Firma de Ejemplo
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSetStamp}>
              Usar Sello de Ejemplo
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={handleSimulateStudent}>
              Simular Datos de Estudiante
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Botón para confirmar envío del documento */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmSend}
        disabled={!isFormComplete()}
      >
        Confirmar Envío del Documento
      </Button>

      {/* Diálogo de doble confirmación */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Revise bien el contenido del documento antes de enviarlo. Una vez
            enviado, no podrá realizar cambios y deberá contactar a la oficina
            de servicio social si requiere ajustes.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Escriba "confirmar datos del documento" para confirmar:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleFinalConfirm}
            variant="contained"
            color="primary"
            disabled={confirmInput !== requiredConfirmationPhrase}
          >
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentTests;
