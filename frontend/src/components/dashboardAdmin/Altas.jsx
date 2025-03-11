import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Paper,
} from "@mui/material";

// Se importa el JSON local con la lista de programas
import programsData from "./ProgramasVSS_Ene2025_test.json";

const Altas = () => {
  // Estados para el formulario de alta de alumno
  const [alumnoData, setAlumnoData] = useState({
    nombres: "",
    apellidos: "",
    numeroControl: "",
    correo: "",
    carrera: "",
    creditos: "",
    vigente: false,
  });
  const [alumnoErrors, setAlumnoErrors] = useState({});

  // Estados para el formulario de alta de responsable
  const [responsableData, setResponsableData] = useState({
    interno: false,
    nombres: "",
    apellidos: "",
    institucion: "",
    puesto: "",
    correo: "",
    programas: [],
  });
  const [responsableErrors, setResponsableErrors] = useState({});

  // Estado para el historial de altas
  const [historial, setHistorial] = useState([]);

  // Estado para mostrar notificaciones (Snackbars)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Nombre del administrador (placeholder)
  const adminName = "Admin Example";

  // Manejo de cambios en el formulario de alumno
  const handleAlumnoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlumnoData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejo de cambios en el formulario de responsable
  const handleResponsableChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "interno") {
      setResponsableData((prev) => ({
        ...prev,
        interno: checked,
        institucion: checked ? "Instituto Tecnologico de Ensenada" : "",
      }));
    } else {
      setResponsableData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Manejo de selección múltiple para los programas
  const handleProgramasChange = (event) => {
    const {
      target: { value },
    } = event;
    setResponsableData((prev) => ({
      ...prev,
      programas: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Validación del formulario de alumno
  const validateAlumno = () => {
    let errors = {};
    if (!alumnoData.nombres.trim()) errors.nombres = "Requerido";
    if (!alumnoData.apellidos.trim()) errors.apellidos = "Requerido";
    if (!alumnoData.numeroControl.trim()) {
      errors.numeroControl = "Requerido";
    } else if (!/^[0-9]+$/.test(alumnoData.numeroControl)) {
      errors.numeroControl = "Solo números permitidos";
    }
    if (!alumnoData.correo.trim()) {
      errors.correo = "Requerido";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(alumnoData.correo)) {
      errors.correo = "Formato de correo inválido";
    }
    if (!alumnoData.carrera.trim()) errors.carrera = "Requerido";
    if (!alumnoData.creditos.trim()) {
      errors.creditos = "Requerido";
    } else if (isNaN(alumnoData.creditos)) {
      errors.creditos = "Debe ser numérico";
    }
    setAlumnoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validación del formulario de responsable
  const validateResponsable = () => {
    let errors = {};
    if (!responsableData.nombres.trim()) errors.nombres = "Requerido";
    if (!responsableData.apellidos.trim()) errors.apellidos = "Requerido";
    if (!responsableData.institucion.trim()) errors.institucion = "Requerido";
    if (!responsableData.puesto.trim()) errors.puesto = "Requerido";
    if (!responsableData.correo.trim()) {
      errors.correo = "Requerido";
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(responsableData.correo)
    ) {
      errors.correo = "Formato de correo inválido";
    }
    if (responsableData.programas.length === 0)
      errors.programas = "Seleccione al menos un programa";
    setResponsableErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para simular el envío de datos al backend para alumnos
  const handleAlumnoSubmit = async (e) => {
    e.preventDefault();
    if (!validateAlumno()) {
      setSnackbar({
        open: true,
        message: "Por favor corrija los errores en el formulario de alumno.",
        severity: "error",
      });
      return;
    }
    try {
      // Simulación de llamada al backend
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Si el número de control es distinto de "0000", se simula un registro exitoso
          if (alumnoData.numeroControl !== "0000") {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Alumno duplicado" });
          }
        }, 1000);
      });
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Alumno registrado con éxito",
          severity: "success",
        });
        setHistorial((prev) => [
          {
            fecha: new Date().toLocaleString(),
            admin: adminName,
            tipo: "Alta de Alumno",
            nombre: `${alumnoData.nombres} ${alumnoData.apellidos}`,
            resultado: "Exitosa",
          },
          ...prev,
        ]);
        setAlumnoData({
          nombres: "",
          apellidos: "",
          numeroControl: "",
          correo: "",
          carrera: "",
          creditos: "",
          vigente: false,
        });
      } else {
        setSnackbar({
          open: true,
          message: response.error || "Error al registrar alumno",
          severity: "error",
        });
        setHistorial((prev) => [
          {
            fecha: new Date().toLocaleString(),
            admin: adminName,
            tipo: "Alta de Alumno",
            nombre: `${alumnoData.nombres} ${alumnoData.apellidos}`,
            resultado: "Fallida",
          },
          ...prev,
        ]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al comunicarse con el backend",
        severity: "error",
      });
    }
  };

  // Función para simular el envío de datos al backend para responsables
  const handleResponsableSubmit = async (e) => {
    e.preventDefault();
    if (!validateResponsable()) {
      setSnackbar({
        open: true,
        message:
          "Por favor corrija los errores en el formulario de responsable.",
        severity: "error",
      });
      return;
    }
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulación: si el correo es distinto de "fail@ite.edu.mx", se simula un registro exitoso
          if (responsableData.correo !== "fail@ite.edu.mx") {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Responsable duplicado" });
          }
        }, 1000);
      });
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Responsable registrado con éxito",
          severity: "success",
        });
        setHistorial((prev) => [
          {
            fecha: new Date().toLocaleString(),
            admin: adminName,
            tipo: "Alta de Responsable",
            nombre: `${responsableData.nombres} ${responsableData.apellidos}`,
            resultado: "Exitosa",
          },
          ...prev,
        ]);
        setResponsableData({
          interno: false,
          nombres: "",
          apellidos: "",
          institucion: "",
          puesto: "",
          correo: "",
          programas: [],
        });
      } else {
        setSnackbar({
          open: true,
          message: response.error || "Error al registrar responsable",
          severity: "error",
        });
        setHistorial((prev) => [
          {
            fecha: new Date().toLocaleString(),
            admin: adminName,
            tipo: "Alta de Responsable",
            nombre: `${responsableData.nombres} ${responsableData.apellidos}`,
            resultado: "Fallida",
          },
          ...prev,
        ]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al comunicarse con el backend",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Sección informativa */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Alta de Usuarios
        </Typography>
        <Typography variant="body1">
          Esta sección le permite registrar nuevos alumnos y responsables para
          el servicio social. Complete los formularios correspondientes y
          asegúrese de que la información sea correcta.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Card: Alta de Alumno */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Alta de Alumno
              </Typography>
              <Box component="form" onSubmit={handleAlumnoSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre(s)"
                      name="nombres"
                      fullWidth
                      value={alumnoData.nombres}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.nombres}
                      helperText={alumnoErrors.nombres}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido(s)"
                      name="apellidos"
                      fullWidth
                      value={alumnoData.apellidos}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.apellidos}
                      helperText={alumnoErrors.apellidos}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Número de Control"
                      name="numeroControl"
                      fullWidth
                      value={alumnoData.numeroControl}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.numeroControl}
                      helperText={alumnoErrors.numeroControl}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Correo Institucional"
                      name="correo"
                      fullWidth
                      value={alumnoData.correo}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.correo}
                      helperText={alumnoErrors.correo}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Carrera"
                      name="carrera"
                      fullWidth
                      value={alumnoData.carrera}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.carrera}
                      helperText={alumnoErrors.carrera}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Créditos"
                      name="creditos"
                      fullWidth
                      value={alumnoData.creditos}
                      onChange={handleAlumnoChange}
                      error={!!alumnoErrors.creditos}
                      helperText={alumnoErrors.creditos}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="vigente"
                          checked={alumnoData.vigente}
                          onChange={handleAlumnoChange}
                        />
                      }
                      label="Alumno vigente"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Registrar Alumno
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card: Alta de Responsable */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Alta de Responsable de Institución
              </Typography>
              <Box component="form" onSubmit={handleResponsableSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="interno"
                          checked={responsableData.interno}
                          onChange={handleResponsableChange}
                        />
                      }
                      label="Responsable interno"
                    />
                    <Typography variant="caption" display="block">
                      Marca esta casilla si el responsable es trabajador del ITE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre(s)"
                      name="nombres"
                      fullWidth
                      value={responsableData.nombres}
                      onChange={handleResponsableChange}
                      error={!!responsableErrors.nombres}
                      helperText={responsableErrors.nombres}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido(s)"
                      name="apellidos"
                      fullWidth
                      value={responsableData.apellidos}
                      onChange={handleResponsableChange}
                      error={!!responsableErrors.apellidos}
                      helperText={responsableErrors.apellidos}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Institución"
                      name="institucion"
                      fullWidth
                      value={responsableData.institucion}
                      onChange={handleResponsableChange}
                      error={!!responsableErrors.institucion}
                      helperText={responsableErrors.institucion}
                      disabled={responsableData.interno}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Puesto"
                      name="puesto"
                      fullWidth
                      value={responsableData.puesto}
                      onChange={handleResponsableChange}
                      error={!!responsableErrors.puesto}
                      helperText={responsableErrors.puesto}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo"
                      name="correo"
                      fullWidth
                      value={responsableData.correo}
                      onChange={handleResponsableChange}
                      error={!!responsableErrors.correo}
                      helperText={responsableErrors.correo}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={programsData}
                      value={responsableData.programas}
                      onChange={(event, newValue) =>
                        setResponsableData((prev) => ({
                          ...prev,
                          programas: newValue,
                        }))
                      }
                      getOptionLabel={(option) =>
                        `${option["Nombre del Programa de SS"]} - ${option["Depto. y/u Oficina donde se va a realizar el SS"]}`
                      }
                      ListboxProps={{ style: { maxHeight: "200px" } }}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{ fontWeight: selected ? 600 : 400 }}
                        >
                          {`${option["Nombre del Programa de SS"]} - ${option["Depto. y/u Oficina donde se va a realizar el SS"]}`}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Programa(s) a cargo"
                          placeholder="Selecciona programas"
                          error={!!responsableErrors.programas}
                          helperText={responsableErrors.programas}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Registrar Responsable
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Historial de Altas con tamaño fijo y scroll vertical */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Historial de Altas
        </Typography>
        <TableContainer component={Paper} sx={{ height: 300 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Administrador</TableCell>
                <TableCell>Tipo de Alta</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Resultado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.fecha}</TableCell>
                  <TableCell>{entry.admin}</TableCell>
                  <TableCell>{entry.tipo}</TableCell>
                  <TableCell>{entry.nombre}</TableCell>
                  <TableCell>{entry.resultado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Altas;
