import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  LinearProgress,
  Box,
  Divider,
  Button,
  TextField,
} from "@mui/material";

export default function UserStatusCard() {
  const [user, setUser] = useState({
    name: "Juan Pérez",
    semester: 6,
    credits: 85,
    career: "Ingeniería en Sistemas",
    inProgram: true,
    program: {
      id: "12345",
      name: "Programa de Servicio Social en Tecnología",
      progressStage: "Bimestre 2",
    },
  });

  const [newCredits, setNewCredits] = useState(user.credits); // Estado para los nuevos créditos

  const { name, semester, credits, career, inProgram, program } = user;

  // Calcular elegibilidad automáticamente
  const eligible = credits >= 80;

  const progressMap = {
    "No iniciado": 0,
    "Bimestre 1": 25,
    "Bimestre 2": 50,
    "Bimestre 3": 75,
    Finalización: 100,
  };

  const progressValue = inProgram ? progressMap[program.progressStage] || 0 : 0;

  const nextProgressStage = () => {
    const stages = Object.keys(progressMap);
    const currentIndex = stages.indexOf(program.progressStage);
    if (currentIndex < stages.length - 1) {
      setUser((prevUser) => ({
        ...prevUser,
        program: {
          ...prevUser.program,
          progressStage: stages[currentIndex + 1],
        },
      }));
    }
  };

  const updateCredits = () => {
    setUser((prevUser) => ({
      ...prevUser,
      credits: newCredits,
    }));
  };

  // Calcular el porcentaje de créditos
  const creditProgress = Math.min((credits / 80) * 100, 100); // Asegurarse de que no supere 100

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <CardHeader
          avatar={<Avatar>{name.charAt(0)}</Avatar>}
          title={name}
          subheader={`Semestre: ${semester} | Carrera: ${career}`}
        />
        <CardContent>
          <Typography variant="body1">
            Créditos Acumulados: {credits}
          </Typography>
          <LinearProgress variant="determinate" value={creditProgress} />
          <Typography variant="caption" color="text.secondary">
            {credits} / 80 Créditos
          </Typography>
          <Typography variant="body1">
            {eligible
              ? "Eres apto para solicitar un programa de servicio social."
              : "No cumples con los requisitos para solicitar un programa de servicio social."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Sección del Programa de Servicio Social solo si el usuario tiene 80 créditos o más */}
          {eligible && inProgram && (
            <>
              <Typography variant="h6">Programa de Servicio Social</Typography>
              <Typography variant="body1">
                ID del Programa: {program.id}
              </Typography>
              <Typography variant="body1">
                Nombre del Programa: {program.name}
              </Typography>
              <Typography variant="h6">
                Etapa Actual del Servicio Social
              </Typography>
              <LinearProgress variant="determinate" value={progressValue} />
              <Typography variant="caption" color="text.secondary">
                {program.progressStage}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Typography variant="h6">
            Requisitos para Cursar el Servicio Social
          </Typography>
          <Box>
            <Typography variant="body2">- Créditos necesarios: 80</Typography>
            <Typography variant="body2">
              - Documentación necesaria: Carta de aceptación, CV, etc.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Campo de entrada para actualizar los créditos */}
          <TextField
            label="Actualizar Créditos"
            type="number"
            value={newCredits}
            onChange={(e) => setNewCredits(Number(e.target.value))}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={updateCredits}>
            Actualizar Créditos
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* Botón para avanzar a la siguiente etapa */}
          <Button
            variant="contained"
            color="secondary"
            onClick={nextProgressStage}
            disabled={!inProgram}
          >
            Siguiente Etapa
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
