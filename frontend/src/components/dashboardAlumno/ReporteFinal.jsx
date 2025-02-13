import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const ReporteFinal = () => {
  // Estado inicial del componente
  const [datosAlumno, setDatosAlumno] = useState({
    nombre: "Juan",
    apellido1: "Pérez",
    apellido2: "López",
    carrera: "Ingeniería en Sistemas",
    numeroControl: "12345678",
    fechaInicio: "2024-01-01",
    fechaFin: "2024-07-01",
    programa: {
      dependencia: "Universidad Autónoma",
      nombrePrograma: "Programa de Apoyo Comunitario",
      objetivoGeneral: "Fomentar el desarrollo comunitario.",
      objetivosEspecificos: [
        "Promover el conocimiento",
        "Fomentar el trabajo en equipo",
      ],
      actividades: [
        "Apoyar en clases de regularización.",
        "Diseñar materiales didácticos.",
        "Monitorear el progreso académico.",
        "Realizar talleres de emprendimiento.",
        "Organizar brigadas de plantación.",
      ],
    },
    estadoRevision: "Pendiente",
    reporteEnviado: false,
  });

  const [actividadesBimestres, setActividadesBimestres] = useState(
    datosAlumno.programa.actividades.map(() => [false, false, false])
  );

  const [conclusion, setConclusion] = useState("");
  const [resultados, setResultados] = useState("");
  const [enviarDeshabilitado, setEnviarDeshabilitado] = useState(
    datosAlumno.reporteEnviado
  );

  // Validar si se puede habilitar el botón
  useEffect(() => {
    const actividadesCompletadas = actividadesBimestres.every((bimestres) =>
      bimestres.some((bimestre) => bimestre)
    );
    setEnviarDeshabilitado(
      datosAlumno.reporteEnviado ||
        !actividadesCompletadas ||
        !conclusion ||
        !resultados
    );
  }, [
    actividadesBimestres,
    conclusion,
    resultados,
    datosAlumno.reporteEnviado,
  ]);

  const handleCheckboxChange = (actividadIndex, bimestreIndex) => {
    const updatedBimestres = [...actividadesBimestres];
    updatedBimestres[actividadIndex][bimestreIndex] =
      !updatedBimestres[actividadIndex][bimestreIndex];
    setActividadesBimestres(updatedBimestres);
  };

  const handleEnviarReporte = () => {
    const data = {
      actividades: actividadesBimestres,
      conclusion,
      resultados,
    };
    fetch(`http://localhost/reportefinal/${datosAlumno.numeroControl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => alert("Reporte enviado exitosamente"))
      .catch((error) => console.error("Error al enviar el reporte:", error));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reporte Final
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Estado de revisión:
          </Typography>{" "}
          {datosAlumno.estadoRevision}
        </Typography>
      </Box>
      {/* Datos del Alumno */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Datos del Alumno</Typography>
        <Typography>
          Nombre:{" "}
          {`${datosAlumno.nombre} ${datosAlumno.apellido1} ${datosAlumno.apellido2}`}
        </Typography>
        <Typography>Carrera: {datosAlumno.carrera}</Typography>
        <Typography>Número de Control: {datosAlumno.numeroControl}</Typography>
        <Typography>Fecha de Inicio: {datosAlumno.fechaInicio}</Typography>
        <Typography>Fecha de Finalización: {datosAlumno.fechaFin}</Typography>
      </Box>

      {/* Datos del Programa */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Datos del Programa</Typography>
        <Typography>Dependencia: {datosAlumno.programa.dependencia}</Typography>
        <Typography>
          Nombre del Programa: {datosAlumno.programa.nombrePrograma}
        </Typography>
        <Typography>
          Objetivo General: {datosAlumno.programa.objetivoGeneral}
        </Typography>
      </Box>

      {/* Desarrollo de Actividades */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Desarrollo de Actividades</Typography>
        <List>
          {datosAlumno.programa.actividades.map((actividad, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ListItemText primary={actividad} />
              {["1er Bimestre", "2do Bimestre", "3er Bimestre"].map(
                (bimestre, bimestreIndex) => (
                  <FormControl key={bimestreIndex} sx={{ mr: 2 }}>
                    <Checkbox
                      checked={actividadesBimestres[index][bimestreIndex]}
                      onChange={() =>
                        handleCheckboxChange(index, bimestreIndex)
                      }
                    />
                    <FormHelperText>{bimestre}</FormHelperText>
                  </FormControl>
                )
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Conclusión y Resultados */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Conclusión"
          fullWidth
          multiline
          rows={4}
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Resultados"
          fullWidth
          multiline
          rows={4}
          value={resultados}
          onChange={(e) => setResultados(e.target.value)}
        />
      </Box>

      {/* Evidencias */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Evidencias</Typography>
        <Grid container spacing={2} columns={12}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid key={index} size={{ sm: 12, md: 6, lg: 4 }}>
              <Box
                component="img"
                src={`/src/assets/testevidencias/evidencia${index + 1}.jpg`}
                alt={`Evidencia ${index + 1}`}
                sx={{ width: "100%", height: "auto", borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Botón Enviar Reporte */}
      <Button
        variant="contained"
        color="primary"
        disabled={enviarDeshabilitado}
        onClick={handleEnviarReporte}
      >
        Enviar Reporte
      </Button>
    </Box>
  );
};

export default ReporteFinal;
