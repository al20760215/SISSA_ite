import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const EstadoSolicitud = ({ alumnoId }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Carga las solicitudes desde el archivo JSON
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch("http://localhost:3000/solicitudes");
        const data = await response.json();
        // Filtra las solicitudes por el ID del alumno
        const solicitudesFiltradas = data.filter(
          (solicitud) => solicitud.id_alumno === alumnoId
        );
        setSolicitudes(solicitudesFiltradas);
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
        setSolicitudes([]);
      } finally {
        setCargando(false);
      }
    };

    fetchSolicitudes();
  }, [alumnoId]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Estado de Solicitud
      </Typography>
      {cargando ? (
        <Typography variant="body1">Cargando solicitudes...</Typography>
      ) : solicitudes.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No has realizado ninguna solicitud
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha de solicitud</TableCell>
                <TableCell>ID solicitud</TableCell>
                <TableCell>Nombre del programa</TableCell>
                <TableCell>Estado de la solicitud</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell>{solicitud.fecha}</TableCell>
                  <TableCell>{solicitud.id}</TableCell>
                  <TableCell>{solicitud.nombre_programa}</TableCell>
                  <TableCell>{solicitud.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EstadoSolicitud;
