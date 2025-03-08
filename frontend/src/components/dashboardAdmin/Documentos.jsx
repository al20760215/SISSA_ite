import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  ListItemButton,
} from "@mui/material";

// Función auxiliar para calcular la fecha tentativa (6 meses después de la fecha de inicio)
const calcularFechaTentativa = (fechaInicio) => {
  const inicio = new Date(fechaInicio);
  inicio.setMonth(inicio.getMonth() + 6);
  return inicio.toISOString().split("T")[0];
};

const Documentos = () => {
  // Datos falsos iniciales para cada categoría
  const [solicitudAnexoData, setSolicitudAnexoData] = useState([
    {
      id: 1,
      folio: "SA-001",
      date: "2023-01-01 08:00",
      studentName: "Juan Pérez",
      programName: "Servicio Social 1",
      responsibleName: "Dr. García",
      startDate: "2023-01-01",
    },
    {
      id: 2,
      folio: "SA-002",
      date: "2023-01-03 09:15",
      studentName: "Ana Martínez",
      programName: "Servicio Social 1",
      responsibleName: "Dr. García",
      startDate: "2023-01-03",
    },
  ]);

  const [cartaCompromisoData, setCartaCompromisoData] = useState([
    {
      id: 3,
      folio: "CC-001",
      date: "2023-01-02 10:30",
      studentName: "María López",
      programName: "Servicio Social 2",
      responsibleName: "Dra. Sánchez",
      startDate: "2023-01-02",
      signatureUrl: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      folio: "CC-002",
      date: "2023-01-04 11:00",
      studentName: "Pedro Gómez",
      programName: "Servicio Social 2",
      responsibleName: "Dra. Sánchez",
      startDate: "2023-01-04",
      signatureUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [reporteBimestralData, setReporteBimestralData] = useState([
    {
      id: 5,
      folio: "RB-001",
      date: "2023-01-05 12:00",
      studentName: "Carlos Ramírez",
      programName: "Servicio Social 3",
      responsibleName: "Dr. Fernández",
      startDate: "2023-01-05",
      signatureAlumno: "https://via.placeholder.com/150",
      signatureResponsable: "https://via.placeholder.com/150",
      stampResponsable: "https://via.placeholder.com/150",
      informeAlumno: "Informe del alumno sobre avances y dificultades.",
      informeResponsable:
        "Informe del responsable con comentarios y observaciones.",
    },
  ]);

  // Historial de documentos revisados (se muestran hasta 10 elementos)
  const [historialData, setHistorialData] = useState([]);

  // Estados para manejar la ventana modal de revisión
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  // Función para abrir la ventana modal al hacer click en un documento
  const handleListItemClick = (doc, category) => {
    const fechaTentativa = calcularFechaTentativa(doc.startDate);
    const documentoConFecha = { ...doc, tentativeEndDate: fechaTentativa };
    setActiveDocument(documentoConFecha);
    setActiveCategory(category);
    setModalOpen(true);
  };

  // Funciones para aprobar o rechazar un documento
  const handleAction = (accion) => {
    const nuevoHistorial = {
      documentType:
        activeCategory === "solicitud"
          ? "Solicitud Anexo"
          : activeCategory === "carta"
          ? "Carta Compromiso"
          : "Reporte Bimestral",
      folio: activeDocument.folio,
      studentName: activeDocument.studentName,
      status: accion === "approve" ? "Aprobado" : "Rechazado",
      receivedDate: activeDocument.date,
      reviewDate: new Date().toLocaleString(),
    };
    // Agregamos el nuevo registro al inicio del historial y limitamos a 10 registros
    setHistorialData((prev) => [nuevoHistorial, ...prev].slice(0, 10));

    // Removemos el documento de la lista correspondiente
    if (activeCategory === "solicitud") {
      setSolicitudAnexoData((prev) =>
        prev.filter((doc) => doc.id !== activeDocument.id)
      );
    } else if (activeCategory === "carta") {
      setCartaCompromisoData((prev) =>
        prev.filter((doc) => doc.id !== activeDocument.id)
      );
    } else if (activeCategory === "reporte") {
      setReporteBimestralData((prev) =>
        prev.filter((doc) => doc.id !== activeDocument.id)
      );
    }
    setModalOpen(false);
    setActiveDocument(null);
  };

  // Funciones para generar documentos de prueba
  const generateSolicitudDoc = () => {
    const newDoc = {
      id: 99,
      folio: `SA-099`,
      date: new Date().toLocaleString(),
      studentName: `William Reynoso`,
      programName: "Servicio Social 1",
      responsibleName: "Dr. García",
      startDate: new Date().toISOString().split("T")[0],
    };
    setSolicitudAnexoData((prev) => [...prev, newDoc]);
  };

  const generateCartaDoc = () => {
    const newDoc = {
      id: 99,
      folio: `CC-099`,
      date: new Date().toLocaleString(),
      studentName: `Fabian Ortega`,
      programName: "Servicio Social 2",
      responsibleName: "Dra. Sánchez",
      startDate: new Date().toISOString().split("T")[0],
      signatureUrl: "https://via.placeholder.com/150",
    };
    setCartaCompromisoData((prev) => [...prev, newDoc]);
  };

  const generateReporteDoc = () => {
    const newDoc = {
      id: 99,
      folio: `RB-099`,
      date: new Date().toLocaleString(),
      studentName: `Alex Vergara`,
      programName: "Servicio Social 3",
      responsibleName: "Dr. Fernández",
      startDate: new Date().toISOString().split("T")[0],
      signatureAlumno: "https://via.placeholder.com/150",
      signatureResponsable: "https://via.placeholder.com/150",
      stampResponsable: "https://via.placeholder.com/150",
      informeAlumno: "Informe de prueba del alumno.",
      informeResponsable: "Informe de prueba del responsable.",
    };
    setReporteBimestralData((prev) => [...prev, newDoc]);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Documentos
      </Typography>
      <Grid container spacing={2}>
        {/* Sección Solicitud Anexo */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Solicitud Anexo</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={generateSolicitudDoc}
              >
                Generar Doc. Prueba
              </Button>
            </Box>
            <List sx={{ height: 325, overflowY: "auto" }}>
              {solicitudAnexoData
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((doc) => (
                  <ListItemButton
                    key={doc.id}
                    onClick={() => handleListItemClick(doc, "solicitud")}
                  >
                    <ListItemText
                      primary={`${doc.studentName} - ${doc.folio}`}
                      secondary={`${doc.date} | ${doc.programName}`}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Paper>
        </Grid>
        {/* Sección Carta Compromiso */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "#e8f5e9" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Carta Compromiso</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={generateCartaDoc}
              >
                Generar Doc. Prueba
              </Button>
            </Box>
            <List sx={{ height: 325, overflowY: "auto" }}>
              {cartaCompromisoData
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((doc) => (
                  <ListItemButton
                    key={doc.id}
                    onClick={() => handleListItemClick(doc, "carta")}
                  >
                    <ListItemText
                      primary={`${doc.studentName} - ${doc.folio}`}
                      secondary={`${doc.date} | ${doc.programName}`}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Paper>
        </Grid>
        {/* Sección Reporte Bimestral */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "#fff3e0" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Reporte Bimestral</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={generateReporteDoc}
              >
                Generar Doc. Prueba
              </Button>
            </Box>
            <List sx={{ height: 325, overflowY: "auto" }}>
              {reporteBimestralData
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((doc) => (
                  <ListItemButton
                    key={doc.id}
                    onClick={() => handleListItemClick(doc, "reporte")}
                  >
                    <ListItemText
                      primary={`${doc.studentName} - ${doc.folio}`}
                      secondary={`${doc.date} | ${doc.programName}`}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Historial de revisiones */}
      <Box mt={4}>
        <Divider />
        <Typography variant="h5" mt={2} gutterBottom>
          Historial de Revisión
        </Typography>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
          <List sx={{ height: 300, overflowY: "auto" }}>
            {historialData.map((item, index) => (
              <ListItemButton
                key={index}
                sx={{
                  backgroundColor:
                    item.status === "Aprobado"
                      ? "#c8e6c9"
                      : item.status === "Rechazado"
                      ? "#ffcdd2"
                      : "inherit",
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={`[${item.documentType}] ${item.studentName} - ${item.status}`}
                  secondary={`Recibido: ${item.receivedDate} | Revisado: ${item.reviewDate} | Folio: ${item.folio}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Ventana modal para revisión de documento */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Revisión de{" "}
          {activeCategory === "solicitud"
            ? "Solicitud Anexo"
            : activeCategory === "carta"
            ? "Carta Compromiso"
            : "Reporte Bimestral"}
        </DialogTitle>
        <DialogContent dividers>
          {activeDocument && (
            <Box>
              <Typography variant="subtitle1">
                Folio: {activeDocument.folio}
              </Typography>
              <Typography variant="body1">
                Alumno: {activeDocument.studentName}
              </Typography>
              <Typography variant="body1">
                Programa: {activeDocument.programName}
              </Typography>
              <Typography variant="body1">
                Responsable: {activeDocument.responsibleName}
              </Typography>
              <Typography variant="body1">
                Fecha de Generación: {activeDocument.date}
              </Typography>
              <Typography variant="body1">
                Fecha de Inicio: {activeDocument.startDate}
              </Typography>
              <Typography variant="body1">
                Fecha Tentativa de Finalización:{" "}
                {activeDocument.tentativeEndDate}
              </Typography>

              {/* Para Carta Compromiso se muestra la firma del alumno */}
              {activeCategory === "carta" && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Firma del Alumno:</Typography>
                  <img
                    src={activeDocument.signatureUrl}
                    alt="Firma del alumno"
                    style={{ maxWidth: "100%" }}
                  />
                </Box>
              )}

              {/* Para Reporte Bimestral se separa la información en dos áreas */}
              {activeCategory === "reporte" && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">
                      Datos del Alumno:
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {activeDocument.informeAlumno}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="subtitle2">
                        Firma del Alumno:
                      </Typography>
                      <img
                        src={activeDocument.signatureAlumno}
                        alt="Firma del alumno"
                        style={{ maxWidth: "100%" }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">
                      Datos del Responsable:
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {activeDocument.informeResponsable}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="subtitle2">
                        Firma del Responsable:
                      </Typography>
                      <img
                        src={activeDocument.signatureResponsable}
                        alt="Firma del responsable"
                        style={{ maxWidth: "100%" }}
                      />
                    </Box>
                    <Box mt={1}>
                      <Typography variant="subtitle2">
                        Sello del Responsable:
                      </Typography>
                      <img
                        src={activeDocument.stampResponsable}
                        alt="Sello del responsable"
                        style={{ maxWidth: "100%" }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleAction("reject")}
            color="error"
            variant="contained"
          >
            Rechazar
          </Button>
          <Button
            onClick={() => handleAction("approve")}
            color="primary"
            variant="contained"
          >
            Aprobar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documentos;
