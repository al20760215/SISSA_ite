import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Array de nombres de meses en español
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Función para generar datos mensuales aleatorios a partir de una fecha de actualización
function generateMonthlyData(lastUpdate) {
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      lastUpdate.getFullYear(),
      lastUpdate.getMonth() - i,
      1
    );
    const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    data.push({
      month: monthLabel,
      totalAlumnos: Math.floor(Math.random() * 1000),
      alumnosEnPrograma: Math.floor(Math.random() * 500),
      alumnosSinTerminar: Math.floor(Math.random() * 300),
      alumnosAtrasados: Math.floor(Math.random() * 200),
      alumnosConcluidos: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const Inicio = () => {
  // Estado para los datos del administrador (simulados)
  const [adminData, setAdminData] = useState(null);
  // Estado para la fecha de última actualización (simulada)
  const [lastUpdate, setLastUpdate] = useState(null);
  // Estado para los datos mensuales (últimos 12 meses simulados)
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    // Simula la consulta al backend para los datos mensuales
    setTimeout(() => {
      const now = new Date();
      setLastUpdate(now);
      setMonthlyData(generateMonthlyData(now));
    }, 100);

    // Simula la consulta al backend para los datos del administrador
    setTimeout(() => {
      setAdminData({
        nombre: "Juan Pérez",
        correo: "juan.perez@example.com",
        rol: "Administrador",
      });
    }, 150);
  }, []);

  // Función para refrescar los datos mensuales (simulando una consulta al backend)
  const refreshMonthlyData = () => {
    setMonthlyData(null);
    setTimeout(() => {
      const now = new Date();
      setLastUpdate(now);
      setMonthlyData(generateMonthlyData(now));
    }, 1000);
  };

  // Si no se han cargado todos los datos, mostramos un indicador de carga
  if (!adminData || !monthlyData) {
    return (
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Inicio
        </Typography>
        <Typography>Cargando datos...</Typography>
      </Box>
    );
  }

  // Las estadísticas del mes actual corresponden al último objeto del arreglo mensualData
  const currentMonthStats = monthlyData[monthlyData.length - 1];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Inicio
      </Typography>

      {/* Datos del Administrador */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4">Datos del Administrador</Typography>
          <Typography>
            <strong>Nombre:</strong> {adminData.nombre}
          </Typography>
          <Typography>
            <strong>Correo:</strong> {adminData.correo}
          </Typography>
          <Typography>
            <strong>Rol:</strong> {adminData.rol}
          </Typography>
        </CardContent>
      </Card>

      {/* Estadísticas principales del mes actual */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Estadísticas Principales del Mes Actual
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Datos obtenidos el: {lastUpdate.toLocaleString()}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">
                  Total de Alumnos Registrados
                </Typography>
                <Typography variant="h5">
                  {currentMonthStats.totalAlumnos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Alumnos en Programa</Typography>
                <Typography variant="h5">
                  {currentMonthStats.alumnosEnPrograma}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">
                  Alumnos sin Terminar Programa
                </Typography>
                <Typography variant="h5">
                  {currentMonthStats.alumnosSinTerminar}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Alumnos Atrasados</Typography>
                <Typography variant="h5">
                  {currentMonthStats.alumnosAtrasados}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Alumnos Concluidos</Typography>
                <Typography variant="h5">
                  {currentMonthStats.alumnosConcluidos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Gráfica de los últimos 12 meses */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Estadísticas de los Últimos 12 Meses (última actualización:{" "}
          {lastUpdate.toLocaleString()})
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAlumnos"
              stroke="#1976d2"
              name="Alumnos Registrados"
            />
            <Line
              type="monotone"
              dataKey="alumnosEnPrograma"
              stroke="#8884d8"
              name="En Programa"
            />
            <Line
              type="monotone"
              dataKey="alumnosSinTerminar"
              stroke="#82ca9d"
              name="Sin Terminar"
            />
            <Line
              type="monotone"
              dataKey="alumnosAtrasados"
              stroke="#ff7300"
              name="Atrasados"
            />
            <Line
              type="monotone"
              dataKey="alumnosConcluidos"
              stroke="#d32f2f"
              name="Concluidos"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Button variant="contained" onClick={refreshMonthlyData}>
        Generar datos aleatorios
      </Button>
    </Box>
  );
};

export default Inicio;
