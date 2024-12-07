import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";

const ReportesBimestrales = () => {
  const [alumno, setAlumno] = useState({
    nombre: "Juan",
    apellido1: "Pérez",
    apellido2: "Gómez",
    carrera: "Ingeniería en Sistemas",
    numeroControl: "12345678",
    fechaInicio: "2024-01-15",
    fechaBimestre1: "2024-03-15",
    dependencia: "Dependencia A",
    programa: "Programa A",
    resumenActividades: "Apoyo en proyectos de desarrollo web",
    horasBimestre: 120,
    horasAcumuladas: 120,
    estadoRevision: "Pendiente de revisión",
    autoevaluacionEnviada: false,
    solicitudAlumnoVigente: true,
  });

  const [fase1Respuestas, setFase1Respuestas] = useState({});
  const [fase2Respuestas, setFase2Respuestas] = useState({});
  const criteriosFase1 = [
    "Cumplí en tiempo y forma con las actividades encomendadas alcanzando los objetivos.",
    "Trabajé en equipo y me adapté a las nuevas situaciones.",
    "Mostré liderazgo en las actividades encomendadas.",
    "Organicé mi tiempo y trabajé de manera proactiva.",
    "Interpreté la realidad y me sensibilicé apartando soluciones a la problemática con la actividad complementaria.",
    "Realicé sugerencias innovadoras para beneficio o mejora del programa en el que participé.",
    "Tuve iniciativa para ayudar en las actividades encomendadas y mostré espíritu de servicio.",
  ];

  const criteriosFase2 = [
    "¿Consideras importante la realización de Servicio Social?",
    "¿Consideras que las actividades que realizaste son pertinentes a los fines del Servicio Social?",
    "¿Consideras que las actividades que realizaste contribuyen a tu formación integral?",
    "¿Contribuiste en actividades de beneficio social comunitario?",
    "¿Contribuiste en actividades de protección al medio ambiente?",
    "¿Cómo consideras que las competencias que adquiriste en la escuela contribuyeron a atender asertivamente las actividades de Servicio Social?",
    "¿Consideras que sería factible continuar con este proyecto de Servicio Social a un proyecto de Residencias Profesionales, proyecto integrador, proyecto de investigación o desarrollo tecnológico?",
    "¿Recomendarías a otro estudiante realizar su Servicio Social en la dependencia donde lo realizaste?",
  ];

  const opciones = [
    "Insuficiente",
    "Suficiente",
    "Bueno",
    "Notable",
    "Excelente",
  ];

  const manejarCambio = (fase, indice, valor) => {
    if (fase === 1) {
      setFase1Respuestas({ ...fase1Respuestas, [indice]: valor });
    } else {
      setFase2Respuestas({ ...fase2Respuestas, [indice]: valor });
    }
  };

  const enviarAutoevaluacion = async () => {
    const autoevaluacion = {
      fase1: fase1Respuestas,
      fase2: fase2Respuestas,
    };

    try {
      await axios.post("http://localhost:3000/reportealumno/1", autoevaluacion);
      setAlumno((prev) => ({ ...prev, autoevaluacionEnviada: true }));
      alert("Autoevaluación enviada exitosamente.");
    } catch (error) {
      console.error("Error al enviar la autoevaluación", error);
    }
  };

  const formularioLleno = () =>
    criteriosFase1.length === Object.keys(fase1Respuestas).length &&
    criteriosFase2.length === Object.keys(fase2Respuestas).length;

  if (!alumno.solicitudAlumnoVigente) {
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="info">
          Aún no puedes ver este contenido, tienes que tener una solicitud
          vigente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Reportes Bimestrales
      </Typography>
      <Box mb={4}>
        <Typography variant="h6">Información del Alumno</Typography>
        <Typography>
          Nombre: {`${alumno.nombre} ${alumno.apellido1} ${alumno.apellido2}`}
        </Typography>
        <Typography>Carrera: {alumno.carrera}</Typography>
        <Typography>Número de Control: {alumno.numeroControl}</Typography>
        <Typography>Fecha de Inicio: {alumno.fechaInicio}</Typography>
        <Typography>Fecha Bimestre 1: {alumno.fechaBimestre1}</Typography>
        <Typography>Dependencia: {alumno.dependencia}</Typography>
        <Typography>Programa: {alumno.programa}</Typography>
        <Typography>
          Resumen de Actividades: {alumno.resumenActividades}
        </Typography>
        <Typography>Horas del Bimestre: {alumno.horasBimestre}</Typography>
        <Typography>Horas Acumuladas: {alumno.horasAcumuladas}</Typography>
        <Typography>Estado de Revisión: {alumno.estadoRevision}</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Autoevaluación
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Fase 1</Typography>
          </Grid>
          {criteriosFase1.map((criterio, index) => (
            <Grid item xs={12} key={index}>
              <Typography>{criterio}</Typography>
              <RadioGroup
                row
                value={fase1Respuestas[index] || ""}
                onChange={(e) => manejarCambio(1, index, e.target.value)}
              >
                {opciones.map((opcion) => (
                  <FormControlLabel
                    key={opcion}
                    value={opcion}
                    control={<Radio />}
                    label={opcion}
                  />
                ))}
              </RadioGroup>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Fase 2</Typography>
          </Grid>
          {criteriosFase2.map((criterio, index) => (
            <Grid item xs={12} key={index}>
              <Typography>{criterio}</Typography>
              <RadioGroup
                row
                value={fase2Respuestas[index] || ""}
                onChange={(e) => manejarCambio(2, index, e.target.value)}
              >
                {opciones.map((opcion) => (
                  <FormControlLabel
                    key={opcion}
                    value={opcion}
                    control={<Radio />}
                    label={opcion}
                  />
                ))}
              </RadioGroup>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={enviarAutoevaluacion}
          disabled={alumno.autoevaluacionEnviada || !formularioLleno()}
        >
          Subir Autoevaluación
        </Button>
      </Box>
    </Box>
  );
};

export default ReportesBimestrales;
