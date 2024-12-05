import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { CheckCircleOutline, Block } from "@mui/icons-material";
import axios from "axios";

const PlaticaServicio = ({ alumno }) => {
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

  const [estadoPlatica, setEstadoPlatica] = useState("platica vigente");
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [fechaReintento, setFechaReintento] = useState(null);
  const [notificacion, setNotificacion] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("estadoPlatica"));
    if (datosGuardados) {
      setEstadoPlatica(datosGuardados.estadoPlatica);
      setIntentosFallidos(datosGuardados.intentosFallidos);
      setFechaReintento(datosGuardados.proximaFecha);
    }

    const cargarPreguntas = async () => {
      const response = await axios.get(
        "/src/components/dashboardAlumno/dummyCuestionario.json"
      );
      const todasLasPreguntas = response.data;

      const seleccionadas = todasLasPreguntas
        .sort(() => Math.random() - 0.5)
        .slice(0, 10); // Selección reducida a 10 preguntas

      const preguntasConRespuestasRevueltas = seleccionadas.map((pregunta) => ({
        ...pregunta,
        respuestas: pregunta.respuestas.sort(() => Math.random() - 0.5),
      }));

      setPreguntas(preguntasConRespuestasRevueltas);
    };

    cargarPreguntas();
  }, []);

  const manejarCambioRespuesta = (preguntaIndex, respuesta) => {
    setRespuestas({ ...respuestas, [preguntaIndex]: respuesta });
  };

  const comprobarRespuestas = () => {
    if (Object.keys(respuestas).length !== preguntas.length) {
      setNotificacion({
        open: true,
        message: "Debes responder todas las preguntas antes de continuar.",
      });
      return;
    }

    const respuestasCorrectas = preguntas.filter(
      (pregunta, index) => respuestas[index] === pregunta.respuestaCorrecta
    ).length;

    const porcentajeCorrectas = (respuestasCorrectas / preguntas.length) * 100;

    if (porcentajeCorrectas >= 70) {
      setEstadoPlatica("platica exitosa");
      localStorage.setItem(
        "estadoPlatica",
        JSON.stringify({
          estadoPlatica: "platica exitosa",
          intentosFallidos: 0,
        })
      );
    } else {
      const nuevosIntentos = intentosFallidos + 1;
      const proximaFecha =
        nuevosIntentos >= 3
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 24 * 60 * 60 * 1000);

      setIntentosFallidos(nuevosIntentos);
      setFechaReintento(proximaFecha.toISOString());
      setEstadoPlatica(
        nuevosIntentos >= 3 ? "platica fallida" : "platica vigente"
      );

      localStorage.setItem(
        "estadoPlatica",
        JSON.stringify({
          estadoPlatica:
            nuevosIntentos >= 3 ? "platica fallida" : "platica vigente",
          intentosFallidos: nuevosIntentos,
          proximaFecha: proximaFecha.toISOString(),
        })
      );
    }
  };

  const limpiarEstado = () => {
    localStorage.removeItem("estadoPlatica");
    setEstadoPlatica("platica vigente");
    setIntentosFallidos(0);
    setFechaReintento(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {estudianteInicial.nombreCompleto}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Estado de la plática: {estadoPlatica}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" color="secondary" onClick={limpiarEstado}>
          Limpiar Estado
        </Button>
      </Box>

      {estadoPlatica === "platica fallida" && fechaReintento && (
        <Typography color="error">
          Podrás reintentar la encuesta después del:{" "}
          {new Date(fechaReintento).toLocaleDateString()}
        </Typography>
      )}

      <Card sx={{ mb: 3 }}>
        <video width="100%" controls>
          <source src="/src/assets/video_platica.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>
      </Card>

      <Card>
        <CardContent>
          {estadoPlatica === "platica fallida" ||
          estadoPlatica === "platica no vigente" ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Block sx={{ fontSize: 60, color: "red", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                La encuesta está bloqueada. Podrás reintentar el:{" "}
                {fechaReintento
                  ? new Date(fechaReintento).toLocaleDateString()
                  : "fecha no disponible"}
                .
              </Typography>
            </Box>
          ) : estadoPlatica === "platica exitosa" ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CheckCircleOutline
                sx={{ fontSize: 60, color: "green", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                ¡Plática completada! Ya has respondido la encuesta con éxito.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h5">Cuestionario</Typography>
              {preguntas.map((pregunta, index) => (
                <Box key={index} sx={{ my: 2 }}>
                  <Typography>{pregunta.pregunta}</Typography>
                  <RadioGroup
                    value={respuestas[index] || ""}
                    onChange={(e) =>
                      manejarCambioRespuesta(index, e.target.value)
                    }
                  >
                    {pregunta.respuestas.map((respuesta, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={respuesta}
                        control={<Radio />}
                        label={respuesta}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={comprobarRespuestas}
                >
                  Comprobar respuestas
                </Button>
              </CardActions>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={notificacion.open}
        autoHideDuration={6000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
      >
        <Alert severity="warning">{notificacion.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaticaServicio;
