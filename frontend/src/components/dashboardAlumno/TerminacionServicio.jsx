import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Box,
  Button,
  Divider,
} from "@mui/material";

const requisitosIniciales = [
  { id: 1, nombre: "Solicitud en estado Vigente", cumplido: false },
  { id: 2, nombre: "Carta compromiso", cumplido: false },
  { id: 3, nombre: "Carta de Aceptacion", cumplido: false },
  { id: 4, nombre: "Cronograma", cumplido: false },
  { id: 5, nombre: "Carta de presentacion", cumplido: false },
  { id: 6, nombre: "Reporte Bimestral 1", cumplido: false },
  { id: 7, nombre: "Reporte Bimestral 2", cumplido: false },
  { id: 8, nombre: "Reporte Bimestral 3", cumplido: false },
  { id: 9, nombre: "Reporte Final", cumplido: false },
  { id: 10, nombre: "Carta de terminacion", cumplido: false },
];

const TerminacionServicio = () => {
  const [requisitos, setRequisitos] = useState(requisitosIniciales);

  const toggleCumplido = (id) => {
    setRequisitos((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, cumplido: !req.cumplido } : req
      )
    );
  };

  const totalRequisitos = requisitos.length;
  const requisitosCumplidos = requisitos.filter((req) => req.cumplido).length;
  const progreso = (requisitosCumplidos / totalRequisitos) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Terminación del Servicio Social
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esta sección está dedicada a verificar que el alumno ha cumplido con
        todos los requisitos en los periodos de tiempo determinados.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Requisitos:
      </Typography>
      <List>
        {requisitos.map((req) => (
          <ListItem key={req.id}>
            <ListItemText
              primary={req.nombre}
              secondary={req.cumplido ? "Cumplido" : "Pendiente"}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ my: 3 }}>
        <Typography variant="body2" gutterBottom>
          Progreso: {`${progreso.toFixed(0)}%`}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progreso}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "left", mt: 1 }}
        >
          Inicio del Servicio Social
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "right", mt: -2 }}
        >
          Finalización del Servicio Social
        </Typography>
      </Box>
      {progreso === 100 && (
        <Box sx={{ my: 2, p: 2, bgcolor: "success.light", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            ¡Felicidades, has finalizado tu servicio social satisfactoriamente!
          </Typography>
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Pruebas de funcionalidad:
      </Typography>
      <Box>
        {requisitos.map((req) => (
          <Button
            key={req.id}
            variant="outlined"
            onClick={() => toggleCumplido(req.id)}
            sx={{ m: 1 }}
          >
            {req.cumplido
              ? `Marcar "${req.nombre}" como No Cumplido`
              : `Marcar "${req.nombre}" como Cumplido`}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default TerminacionServicio;
