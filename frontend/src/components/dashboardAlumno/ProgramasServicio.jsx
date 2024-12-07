import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

export default function ProgramasServicio(props) {
  const [programas, setProgramas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [alumno, setAlumno] = useState({
    id: 12345,
    nombre: "Juan Pérez",
    carrera: "Ingeniería en Sistemas",
  });
  const [estadoSolicitud, setEstadoSolicitud] = useState("Cargando...");
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programasResponse = await axios.get(
          "/src/components/dashboardAlumno/dummyProgramas.json"
        );
        const solicitudesResponse = await axios.get(
          "http://localhost:3000/solicitudes"
        );
        setProgramas(programasResponse.data);
        setSolicitudes(solicitudesResponse.data);

        const solicitudExistente = solicitudesResponse.data.find(
          (s) => s.id_alumno === alumno.id
        );
        setEstadoSolicitud(
          solicitudExistente ? "Solicitud enviada" : "Solicitud disponible"
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setEstadoSolicitud("Solicitud no disponible");
      }
    };

    fetchData();
  }, []);

  const handleSeleccionarPrograma = (programa) => {
    setProgramaSeleccionado(programa);
  };

  const handleSolicitarPrograma = () => {
    setDialogoAbierto(true);
  };

  const confirmarSolicitud = async () => {
    setBotonDeshabilitado(true);
    try {
      const nuevaSolicitud = {
        id: solicitudes.length + 1,
        fecha: new Date(Date.now()),
        estado: "Enviada",
        nombre_programa: programaSeleccionado.nombre,
        id_programa: programaSeleccionado.id,
        id_alumno: alumno.id,
      };
      const res = await axios.post(
        "http://localhost:3000/solicitudes",
        nuevaSolicitud
      );
      console.log(res);
      setEstadoSolicitud("Solicitud enviada");
    } catch {
      alert("Error al enviar la solicitud.");
      setBotonDeshabilitado(false);
    }
    setDialogoAbierto(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5">Estado: {estadoSolicitud}</Typography>
      <Box
        sx={{
          maxHeight: "350px", // Altura máxima de la lista
          overflowY: "auto", // Habilita el scroll vertical
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "8px",
          marginTop: 2,
        }}
      >
        <List>
          {programas.map((programa, index) => (
            <ListItem
              key={programa.id}
              component="button"
              onClick={() => handleSeleccionarPrograma(programa)}
              sx={{
                textAlign: "left",
                textDecoration: "none",
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={`${index + 1}. ${programa.nombre}`}
                secondary={`${programa.alumnos_inscritos} / ${programa.alumnos_maximos_requeridos} alumnos inscritos`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {programaSeleccionado && (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6">{programaSeleccionado.nombre}</Typography>
            <Box
              sx={{
                whiteSpace: "pre-line", // Preserve line breaks
              }}
            >
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Dependencia:
                </Typography>{" "}
                {programaSeleccionado.dependencia}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Alumnos minimos requeridos:
                </Typography>{" "}
                {programaSeleccionado.alumnos_minimos_requeridos}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Alumnos maximos requeridos:
                </Typography>{" "}
                {programaSeleccionado.alumnos_maximos_requeridos}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Alumnos inscritos:
                </Typography>{" "}
                {programaSeleccionado.alumnos_inscritos}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Carreras solicitadas:
                </Typography>
                {"\n"}
                {programaSeleccionado.carreras_solicitadas.join("\n ")}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Domicilio de la dependencia:
                </Typography>{" "}
                {programaSeleccionado.domicilio_dependencia}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Telefono:
                </Typography>{" "}
                {programaSeleccionado.telefono}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Titular de la dependencia:
                </Typography>{" "}
                {programaSeleccionado.titular_dependencia}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Cargo del titular:
                </Typography>{" "}
                {programaSeleccionado.cargo_titular}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Departamento u oficina:
                </Typography>{" "}
                {programaSeleccionado.departamento_oficina}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Jefe del Departamento:
                </Typography>{" "}
                {programaSeleccionado.jefe_departamento}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Nombre del responsable:
                </Typography>{" "}
                {programaSeleccionado.responsable}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Puesto del responsable:
                </Typography>{" "}
                {programaSeleccionado.puesto_responsable}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Correo del responsable:
                </Typography>{" "}
                {programaSeleccionado.correo_responsable}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Objetivo general:
                </Typography>{" "}
                {programaSeleccionado.objetivo_general}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Objetivos especificos:
                </Typography>
                {"\n"}
                {programaSeleccionado.objetivos_especificos.join("\n ")}
              </Typography>
              <Typography variant="body1">
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Desglose de actividades:
                </Typography>
                {"\n"}
                {programaSeleccionado.desglose_actividades.join("\n ")}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              disabled={
                estadoSolicitud !== "Solicitud disponible" || botonDeshabilitado
              }
              onClick={handleSolicitarPrograma}
            >
              {botonDeshabilitado ? "Enviando solicitud" : "Solicitar Programa"}
            </Button>
          </CardActions>
        </Card>
      )}
      <Dialog open={dialogoAbierto}>
        <DialogTitle>Confirmar Solicitud</DialogTitle>
        <DialogContent>
          <Box variant="body1">
            <Typography variant="h5">
              ¿Seguro que desea aplicar para el programa{" "}
            </Typography>
            <Typography variant="h4" color="secondary.main">
              {programaSeleccionado?.nombre}?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogoAbierto(false)}
            disabled={botonDeshabilitado}
          >
            No
          </Button>
          <Button onClick={confirmarSolicitud} disabled={botonDeshabilitado}>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
