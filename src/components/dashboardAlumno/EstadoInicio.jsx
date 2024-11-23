import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function EstadoInicio() {
  const estudianteInicial = {
    avatar: "",
    numeroControl: "12345678",
    nombreCompleto: "Juan Pérez López",
    carrera: "Ingeniería en Sistemas Computacionales",
    semestre: "7°",
    creditosAcumulados: 180,
    creditosTotales: 240,
    estadoAlumno: "Inscrito",
  };

  const [estudiante, setEstudiante] = useState(estudianteInicial);

  const [requisitos, setRequisitos] = useState({
    inscrito: estudiante.estadoAlumno === "Inscrito",
    porcentajeCreditos:
      estudiante.creditosAcumulados / estudiante.creditosTotales >= 0.7,
    platicaInduccion: false,
  });

  useEffect(() => {
    setRequisitos({
      inscrito: estudiante.estadoAlumno === "Inscrito",
      porcentajeCreditos:
        estudiante.creditosAcumulados / estudiante.creditosTotales >= 0.7,
      platicaInduccion: requisitos.platicaInduccion,
    });
  }, [estudiante]);

  const handleChangeCreditos = (event) => {
    const nuevosCreditos = Number(event.target.value);
    setEstudiante((prev) => ({
      ...prev,
      creditosAcumulados: nuevosCreditos,
    }));
  };

  const toggleRequisito = (requisito) => {
    if (requisito !== "inscrito" && requisito !== "porcentajeCreditos") {
      setRequisitos((prev) => ({
        ...prev,
        [requisito]: !prev[requisito],
      }));
    }
  };

  const toggleEstadoAlumno = () => {
    setEstudiante((prev) => ({
      ...prev,
      estadoAlumno:
        prev.estadoAlumno === "Inscrito" ? "No Inscrito" : "Inscrito",
    }));
  };

  const calcularProgreso = () => {
    const valores = Object.values(requisitos);
    const cumplidos = valores.filter((cumple) => cumple).length;
    return (cumplidos / valores.length) * 100;
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar src={estudiante.avatar}>
            {estudiante.nombreCompleto.charAt(0)}
          </Avatar>
        }
        title={estudiante.nombreCompleto}
        subheader={estudiante.carrera}
      />
      <CardContent>
        <Typography variant="body1">
          <strong>Número de Control:</strong> {estudiante.numeroControl}
        </Typography>
        <Typography variant="body1">
          <strong>Semestre:</strong> {estudiante.semestre}
        </Typography>
        <Typography variant="body1">
          <strong>Créditos Acumulados:</strong> {estudiante.creditosAcumulados}/
          {estudiante.creditosTotales}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Estado Actual:</strong> {estudiante.estadoAlumno}
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Requisitos para solicitar:</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                {requisitos.inscrito ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Estar inscrito en el semestre"
                secondary={requisitos.inscrito ? "Cumplido" : "No cumplido"}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {requisitos.porcentajeCreditos ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Tener 70% o más de créditos totales"
                secondary={
                  requisitos.porcentajeCreditos ? "Cumplido" : "No cumplido"
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {requisitos.platicaInduccion ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Asistir a la plática de inducción"
                secondary={
                  requisitos.platicaInduccion ? "Cumplido" : "No cumplido"
                }
              />
            </ListItem>
          </List>
        </Box>
        <Divider />
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <CircularProgress
            variant="determinate"
            value={calcularProgreso()}
            size={50}
            thickness={4}
            color="primary"
          />
          <Typography sx={{ ml: 2 }} variant="body1">
            Progreso: {calcularProgreso().toFixed(0)}%
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Grid2 container spacing={2} justifyContent="center">
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              label="Créditos Acumulados"
              type="number"
              value={estudiante.creditosAcumulados}
              onChange={handleChangeCreditos}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color={requisitos.platicaInduccion ? "success" : "error"}
              onClick={() => toggleRequisito("platicaInduccion")}
              fullWidth
            >
              {requisitos.platicaInduccion ? "Cumple Inducción" : "No Cumple"}
            </Button>
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color={
                estudiante.estadoAlumno === "Inscrito" ? "success" : "error"
              }
              onClick={toggleEstadoAlumno}
              fullWidth
            >
              {estudiante.estadoAlumno === "Inscrito"
                ? "Marcar No Inscrito"
                : "Marcar Inscrito"}
            </Button>
          </Grid2>
        </Grid2>
      </CardActions>
    </Card>
  );
}
