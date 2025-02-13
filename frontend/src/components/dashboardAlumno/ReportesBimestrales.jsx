import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
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
    horasBimestre: 167,
    horasAcumuladas: 0,
    estadoRevision: "Pendiente de revisión",
    autoevaluacionEnviada: false,
    solicitudAlumnoVigente: true,
  });
  const [fase1Respuestas, setFase1Respuestas] = useState({});
  const [fase2Respuestas, setFase2Respuestas] = useState({});
  const [evidencia1, setEvidencia1] = useState(null);
  const [evidencia2, setEvidencia2] = useState(null);
  const [errorEvidencia1, setErrorEvidencia1] = useState("");
  const [errorEvidencia2, setErrorEvidencia2] = useState("");

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
  const simularRevision = async () => {
    const estadoRevision = "Revisado";
    const horasBimestre = 167;
    const horasAcumuladas = 167;
    await setAlumno({
      ...alumno,
      estadoRevision,
      horasBimestre,
      horasAcumuladas,
    });
  };
  const manejarArchivo = (e, setEvidencia, setErrorEvidencia) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (!["image/jpeg", "image/png"].includes(archivo.type)) {
      setErrorEvidencia(
        "Solo se permiten archivos en formato JPG, JPEG o PNG."
      );
      return;
    }

    if (archivo.size > 25 * 1024 * 1024) {
      setErrorEvidencia("El archivo no debe exceder los 25MB.");
      return;
    }

    setEvidencia(archivo);
    setErrorEvidencia("");
  };

  const enviarReporte = async () => {
    const autoevaluacion = {
      fase1: fase1Respuestas,
      fase2: fase2Respuestas,
    };

    const formData = new FormData();
    formData.append("autoevaluacion", JSON.stringify(autoevaluacion));
    formData.append("evidencia1", evidencia1);
    formData.append("evidencia2", evidencia2);

    try {
      await axios.post("http://localhost:3000/reportealumno/1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Autoevaluación enviada exitosamente.");
    } catch (error) {
      console.error("Error al enviar la autoevaluación", error);
    }
  };

  const formularioLleno = () =>
    criteriosFase1.length === Object.keys(fase1Respuestas).length &&
    criteriosFase2.length === Object.keys(fase2Respuestas).length &&
    evidencia1 &&
    evidencia2;

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
        <Typography variant="h6">
          Estado de Revisión: {alumno.estadoRevision}
        </Typography>
        <Typography>Horas por acreditar: {alumno.horasBimestre}</Typography>
        <Typography>Horas Acreditadas: {alumno.horasAcumuladas}</Typography>
        <Button variant="outlined" onClick={() => simularRevision()}>
          Simular Revision
        </Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Instrucciones para Evidencias
        </Typography>
        <Typography>
          Debes subir exactamente dos fotografías como evidencias. Los formatos
          admitidos son JPG, JPEG y PNG, y el peso máximo por archivo es de 5MB.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Subir Evidencias
        </Typography>
        <Box mb={2}>
          <Typography>Evidencia 1:</Typography>
          <Button variant="contained" component="label">
            Subir Archivo
            <input
              type="file"
              hidden
              accept="image/jpeg, image/png"
              onChange={(e) =>
                manejarArchivo(e, setEvidencia1, setErrorEvidencia1)
              }
            />
          </Button>
          {evidencia1 && <Typography>{evidencia1.name}</Typography>}
          {errorEvidencia1 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorEvidencia1}
            </Alert>
          )}
        </Box>
        <Box mb={2}>
          <Typography>Evidencia 2:</Typography>
          <Button variant="contained" component="label">
            Subir Archivo
            <input
              type="file"
              hidden
              accept="image/jpeg, image/png"
              onChange={(e) =>
                manejarArchivo(e, setEvidencia2, setErrorEvidencia2)
              }
            />
          </Button>
          {evidencia2 && <Typography>{evidencia2.name}</Typography>}
          {errorEvidencia2 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorEvidencia2}
            </Alert>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Autoevaluación Fase 1
        </Typography>
        {criteriosFase1.map((criterio, index) => (
          <Box key={index} mb={2}>
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
          </Box>
        ))}

        <Typography variant="h6" gutterBottom>
          Autoevaluación Fase 2
        </Typography>
        {criteriosFase2.map((criterio, index) => (
          <Box key={index} mb={2}>
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
          </Box>
        ))}
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={enviarReporte}
          disabled={!formularioLleno()}
        >
          Enviar Reporte
        </Button>
      </Box>
    </Box>
  );
};

export default ReportesBimestrales;
