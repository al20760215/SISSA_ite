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
  Chip,
} from "@mui/material";
import dummySolicitudes from "./dummySolicitudes.json";

const getStatusColor = (estado) => {
  switch (estado) {
    case "aprobada":
      return "success";
    case "rechazada":
      return "error";
    case "enviada":
      return "warning";
    case "baja":
      return "default";
    default:
      return "primary";
  }
};

const EstadoSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    setSolicitudes(dummySolicitudes);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Estado de Solicitudes
      </Typography>
      {solicitudes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Fecha de Solicitud</strong>
                </TableCell>
                <TableCell>
                  <strong>ID Solicitud</strong>
                </TableCell>
                <TableCell>
                  <strong>Programa</strong>
                </TableCell>
                <TableCell>
                  <strong>Estado</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell>{solicitud.fecha}</TableCell>
                  <TableCell>{solicitud.id}</TableCell>
                  <TableCell>{solicitud.programa}</TableCell>
                  <TableCell>
                    <Chip
                      label={solicitud.estado}
                      color={getStatusColor(solicitud.estado)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No has realizado ninguna solicitud.
        </Typography>
      )}
    </Box>
  );
};

export default EstadoSolicitud;
