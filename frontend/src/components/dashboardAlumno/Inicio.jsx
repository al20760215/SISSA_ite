import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import procedimientoImage from "/src/assets/procedimiento de servicio social.jpeg";

const Inicio = (props) => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  // Estado para simular si el alumno ha respondido el cuestionario virtual
  const [cuestionarioRespondido, setCuestionarioRespondido] = useState(false);

  // Función simulada para obtener los datos del alumno desde el backend
  const fetchStudentData = async () => {
    // Simulación de llamada al backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nombres: "Juan",
          apellido1: "Pérez",
          apellido2: "López",
          numeroControl: "20760299",
          carrera: "Ingeniería en Sistemas",
          semestre: 6,
          cantidadCreditos: 190,
          inscrito: true,
          direccion: "Calle Falsa 123",
          CURP: "XXXXXXXXXXXX",
          numeroSeguridadSocial: "12345678901",
          telefono: "6461234567",
          correoAlternativo: "juan@example.com",
          fechaExpiracion: "31/08/2025",
          datosVigentes: true,
        });
      }, 100);
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchStudentData();
        // Si los datos no están vigentes se redirecciona a "/check"
        if (!data.datosVigentes) {
          navigate("/check");
          return;
        }
        setStudent(data);
      } catch (error) {
        console.error("Error al obtener los datos del alumno:", error);
      }
    };
    getData();
  }, [navigate]);

  // Verificar el cumplimiento de cada requisito
  const requisito1 = student ? student.inscrito : false;
  // Se asume que para cumplir el requisito el alumno debe tener al menos el 70% de 260 créditos (es decir, 182 créditos o más)
  const requisito2 = student ? student.cantidadCreditos >= 182 : false;
  const requisito3 = cuestionarioRespondido;
  const fulfilledCount = [requisito1, requisito2, requisito3].filter(
    Boolean
  ).length;
  const progressValue = (fulfilledCount / 3) * 100;

  // Función para dirigir al alumno a la sección de "Platica Servicio"
  const handleResponderCuestionario = () => {
    if (props.handleSectionChange) {
      props.handleSectionChange("Platica Servicio");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Sección 1: Tarjeta de Perfil del Alumno */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={<Avatar>{student ? student.nombres.charAt(0) : "A"}</Avatar>}
          title={
            student
              ? `${student.nombres} ${student.apellido1} ${student.apellido2}`
              : "Cargando..."
          }
          subheader={
            student ? `Número de Control: ${student.numeroControl}` : ""
          }
        />
        <CardContent>
          {student && (
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Carrera:</strong> {student.carrera}
                </Typography>
                <Typography variant="body2">
                  <strong>Semestre:</strong> {student.semestre}
                </Typography>
                <Typography variant="body2">
                  <strong>Créditos:</strong> {student.cantidadCreditos}
                </Typography>
                <Typography variant="body2">
                  <strong>Inscrito:</strong> {student.inscrito ? "Sí" : "No"}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Dirección:</strong> {student.direccion}
                </Typography>
                <Typography variant="body2">
                  <strong>CURP:</strong> {student.CURP}
                </Typography>
                <Typography variant="body2">
                  <strong>Número de Seguridad Social:</strong>{" "}
                  {student.numeroSeguridadSocial}
                </Typography>
                <Typography variant="body2">
                  <strong>Teléfono:</strong> {student.telefono}
                </Typography>
                <Typography variant="body2">
                  <strong>Correo Alternativo:</strong>{" "}
                  {student.correoAlternativo}
                </Typography>
                <Typography variant="body2">
                  <strong>Expira:</strong> {student.fechaExpiracion}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Sección 2: Requisitos */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Requisitos
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              {requisito1 ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="El alumno debe estar inscrito" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {requisito2 ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="Debe tener el 70% o más de créditos totales" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {requisito3 ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary="Asistir a la plática y responder el cuestionario virtual"
              secondary={
                !requisito3 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleResponderCuestionario}
                  >
                    Ir a Plática Servicio
                  </Button>
                )
              }
            />
          </ListItem>
        </List>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Progreso de requisitos: {fulfilledCount} de 3
          </Typography>
          <LinearProgress variant="determinate" value={progressValue} />
        </Box>
        {/* Botones temporales para probar la funcionalidad del cuestionario */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCuestionarioRespondido(true)}
            sx={{ mr: 1 }}
          >
            Marcar cuestionario como respondido
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCuestionarioRespondido(false)}
          >
            Resetear cuestionario
          </Button>
        </Box>
      </Box>

      {/* Sección 3: Información Relevante */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Información Relevante
        </Typography>
        <Typography variant="body1" paragraph>
          Bienvenido al proceso de servicio social. A continuación, encontrarás
          información importante sobre los pasos a seguir.
        </Typography>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={procedimientoImage}
            alt="Procedimiento de servicio social"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
        <Typography variant="body2">
          Si tienes alguna duda o necesitas mayor información, por favor
          contacta al departamento de servicios estudiantiles.
        </Typography>
      </Box>
    </Box>
  );
};

export default Inicio;
