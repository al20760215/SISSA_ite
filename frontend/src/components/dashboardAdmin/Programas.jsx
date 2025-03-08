// Programas.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  Chip,
  Stack,
  FormHelperText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

// Función auxiliar para formatear fechas (YYYY-MM-DD)
const formatDate = (date) => date.toISOString().split("T")[0];

// Expresiones regulares para validaciones
const phoneRegex = /^[0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Función de validación que acumula errores por campo (todos son obligatorios)
const validateProgramData = (data) => {
  const errors = {};
  if (!data.Dependencia.trim()) {
    errors.Dependencia = "Campo obligatorio.";
  }
  if (!data.Domicilio.trim()) {
    errors.Domicilio = "Campo obligatorio.";
  }
  if (!data.Teléfono.trim()) {
    errors.Teléfono = "Campo obligatorio.";
  } else if (!phoneRegex.test(data.Teléfono)) {
    errors.Teléfono = "El teléfono debe contener solo números.";
  }
  if (!data["Nombre del titular de la dependencia"].trim()) {
    errors["Nombre del titular de la dependencia"] = "Campo obligatorio.";
  }
  if (!data["Cargo o puesto del titular de la dependencia"].trim()) {
    errors["Cargo o puesto del titular de la dependencia"] =
      "Campo obligatorio.";
  }
  if (!data["Depto. y/u Oficina donde se va a realizar el SS"].trim()) {
    errors["Depto. y/u Oficina donde se va a realizar el SS"] =
      "Campo obligatorio.";
  }
  if (!data["Nombre del responsable del programa de SS"].trim()) {
    errors["Nombre del responsable del programa de SS"] = "Campo obligatorio.";
  }
  if (!data["Puesto del responsable del programa de SS"].trim()) {
    errors["Puesto del responsable del programa de SS"] = "Campo obligatorio.";
  }
  if (!data["Correo electrónico del responsable del SS"].trim()) {
    errors["Correo electrónico del responsable del SS"] = "Campo obligatorio.";
  } else if (
    !emailRegex.test(data["Correo electrónico del responsable del SS"])
  ) {
    errors["Correo electrónico del responsable del SS"] =
      "El correo electrónico no tiene un formato válido.";
  }
  if (!data["Nombre del Programa de SS"].trim()) {
    errors["Nombre del Programa de SS"] = "Campo obligatorio.";
  }
  if (!data["Objetivo del Programa de SS"].trim()) {
    errors["Objetivo del Programa de SS"] = "Campo obligatorio.";
  }
  if (!data["Alumnos a solicitar por carrera"].trim()) {
    errors["Alumnos a solicitar por carrera"] = "Campo obligatorio.";
  }
  if (
    !data.min_alumnos.toString().trim() ||
    !data.max_alumnos.toString().trim()
  ) {
    errors.min_alumnos = "Campo obligatorio.";
  } else if (isNaN(data.min_alumnos) || isNaN(data.max_alumnos)) {
    errors.min_alumnos =
      "El número mínimo y máximo de alumnos deben ser numéricos.";
  } else if (
    Number(data.min_alumnos) < 1 ||
    Number(data.max_alumnos) < Number(data.min_alumnos)
  ) {
    errors.min_alumnos = "Revisa el rango de alumnos (mínimo y máximo).";
  }
  if (
    !data["Desglose de actividades a realizar en el SS"] ||
    data["Desglose de actividades a realizar en el SS"].length === 0
  ) {
    errors["Desglose de actividades a realizar en el SS"] =
      "Debe seleccionar al menos una actividad.";
  }
  return errors;
};

// Función para simular actualización de archivo JSON
const updateJSONFile = (path, data) => {
  // Simula la llamada al backend (se necesitara nodejs o python para escribir en archivos JSON)
  fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al actualizar archivo " + path);
      console.log("Archivo actualizado:", path);
    })
    .catch((err) => console.error(err));
};

const Programas = () => {
  // Estados para la lista de programas y actividades
  const [programas, setProgramas] = useState([]);
  const [actividadesOptions, setActividadesOptions] = useState([]);

  // Estados para el diálogo de edición
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [editedProgram, setEditedProgram] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Estado para el formulario de nuevo programa
  const [newProgram, setNewProgram] = useState({
    Dependencia: "",
    Domicilio: "",
    Teléfono: "",
    "Nombre del titular de la dependencia": "",
    "Cargo o puesto del titular de la dependencia": "",
    "Depto. y/u Oficina donde se va a realizar el SS": "",
    "Nombre del responsable del programa de SS": "",
    "Puesto del responsable del programa de SS": "",
    "Correo electrónico del responsable del SS": "",
    "Nombre del Programa de SS": "",
    "Objetivo del Programa de SS": "",
    "Desglose de actividades a realizar en el SS": [],
    "Alumnos a solicitar por carrera": "",
    min_alumnos: "",
    max_alumnos: "",
    // Fechas automáticas
    fechaInicio: formatDate(new Date()),
    fechaFin: formatDate(
      new Date(new Date().setFullYear(new Date().getFullYear() + 2))
    ),
  });
  const [newErrors, setNewErrors] = useState({});
  const [newSuccess, setNewSuccess] = useState("");

  // Carga de datos de programas y actividades al iniciar
  useEffect(() => {
    fetch("/src/components/dashboardAdmin/ProgramasVSS_Ene2025_test.json")
      .then((res) => res.json())
      .then((data) => setProgramas(data))
      .catch((err) => console.error("Error al cargar programas:", err));

    fetch("/src/components/dashboardAdmin/dummyActividades.json")
      .then((res) => res.json())
      .then((data) => setActividadesOptions(data))
      .catch((err) => console.error("Error al cargar actividades:", err));
  }, []);

  // Función para agregar actividad nueva al estado y actualizar el archivo
  const addNewActivityIfNotExist = (actividad) => {
    const exists = actividadesOptions.some(
      (act) => act.contenido.toLowerCase() === actividad.toLowerCase()
    );
    if (!exists && actividad.trim() !== "") {
      const newId = actividadesOptions.length
        ? Math.max(...actividadesOptions.map((act) => act.id)) + 1
        : 1;
      const newAct = { id: newId, contenido: actividad };
      const updatedActividades = [...actividadesOptions, newAct];
      setActividadesOptions(updatedActividades);
      updateJSONFile(
        "/src/components/dashboardAdmin/dummyActividades.json",
        updatedActividades
      );
    }
  };

  // Función para abrir el diálogo de edición cuando se hace click en un programa
  const handleRowClick = (programa) => {
    setSelectedProgram(programa);
    setEditedProgram({ ...programa });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  // Maneja el cambio en los campos del diálogo de edición
  const handleEditChange = (field, value) => {
    setEditedProgram((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Si se modifica el campo de actividades, verificar nuevas actividades
    if (field === "Desglose de actividades a realizar en el SS") {
      value.forEach((act) => addNewActivityIfNotExist(act));
    }
  };

  // Simula la llamada al backend para actualizar el programa y guardar en el archivo JSON
  const handleSaveEdit = () => {
    const errors = validateProgramData(editedProgram);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    // Simulación de llamada al backend
    setTimeout(() => {
      const updatedPrograms = programas.map((prog) =>
        prog.id === editedProgram.id ? editedProgram : prog
      );
      setProgramas(updatedPrograms);
      // Actualizar archivo JSON de programas
      updateJSONFile(
        "/src/components/dashboardAdmin/ProgramasVSS_Ene2025_test.json",
        updatedPrograms
      );
      setEditDialogOpen(false);
      setSelectedProgram(null);
    }, 500);
  };

  // Maneja el cambio en el formulario para nuevo programa
  const handleNewProgramChange = (field, value) => {
    setNewProgram((prev) => ({ ...prev, [field]: value }));
    if (newErrors[field]) {
      setNewErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === "Desglose de actividades a realizar en el SS") {
      value.forEach((act) => addNewActivityIfNotExist(act));
    }
  };

  // Simula la creación de un nuevo programa (backend simulado y actualización en archivo JSON)
  const handleCreateNewProgram = () => {
    const errors = validateProgramData(newProgram);
    if (Object.keys(errors).length > 0) {
      setNewErrors(errors);
      setNewSuccess("");
      return;
    }
    const newId = programas.length
      ? Math.max(...programas.map((p) => p.id)) + 1
      : 1;
    const programToAdd = { ...newProgram, id: newId };
    setTimeout(() => {
      const updatedPrograms = [...programas, programToAdd];
      setProgramas(updatedPrograms);
      updateJSONFile(
        "/src/components/dashboardAdmin/ProgramasVSS_Ene2025_test.json",
        updatedPrograms
      );
      setNewErrors({});
      setNewSuccess("Programa creado exitosamente.");
      setNewProgram({
        Dependencia: "",
        Domicilio: "",
        Teléfono: "",
        "Nombre del titular de la dependencia": "",
        "Cargo o puesto del titular de la dependencia": "",
        "Depto. y/u Oficina donde se va a realizar el SS": "",
        "Nombre del responsable del programa de SS": "",
        "Puesto del responsable del programa de SS": "",
        "Correo electrónico del responsable del SS": "",
        "Nombre del Programa de SS": "",
        "Objetivo del Programa de SS": "",
        "Desglose de actividades a realizar en el SS": [],
        "Alumnos a solicitar por carrera": "",
        min_alumnos: "",
        max_alumnos: "",
        fechaInicio: formatDate(new Date()),
        fechaFin: formatDate(
          new Date(new Date().setFullYear(new Date().getFullYear() + 2))
        ),
      });
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Programas
      </Typography>
      {/* Tabla de Programas con scroll vertical */}
      <TableContainer component={Paper} sx={{ mb: 4, maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Programa</TableCell>
              <TableCell>Dependencia</TableCell>
              <TableCell>Responsable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programas.map((programa) => (
              <TableRow
                key={programa.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(programa)}
              >
                <TableCell>{programa.id}</TableCell>
                <TableCell>{programa["Nombre del Programa de SS"]}</TableCell>
                <TableCell>{programa.Dependencia}</TableCell>
                <TableCell>
                  {programa["Nombre del responsable del programa de SS"]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición para programa seleccionado */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Programa (ID: {selectedProgram?.id})</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Dependencia"
              value={editedProgram.Dependencia || ""}
              onChange={(e) => handleEditChange("Dependencia", e.target.value)}
              fullWidth
              error={!!editErrors.Dependencia}
              helperText={editErrors.Dependencia}
            />
            <TextField
              label="Domicilio"
              value={editedProgram.Domicilio || ""}
              onChange={(e) => handleEditChange("Domicilio", e.target.value)}
              fullWidth
              error={!!editErrors.Domicilio}
              helperText={editErrors.Domicilio}
            />
            <TextField
              label="Teléfono"
              value={editedProgram.Teléfono || ""}
              onChange={(e) => handleEditChange("Teléfono", e.target.value)}
              fullWidth
              error={!!editErrors.Teléfono}
              helperText={editErrors.Teléfono}
            />
            <TextField
              label="Nombre del titular de la dependencia"
              value={
                editedProgram["Nombre del titular de la dependencia"] || ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Nombre del titular de la dependencia",
                  e.target.value
                )
              }
              fullWidth
              error={!!editErrors["Nombre del titular de la dependencia"]}
              helperText={editErrors["Nombre del titular de la dependencia"]}
            />
            <TextField
              label="Cargo o puesto del titular de la dependencia"
              value={
                editedProgram["Cargo o puesto del titular de la dependencia"] ||
                ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Cargo o puesto del titular de la dependencia",
                  e.target.value
                )
              }
              fullWidth
              error={
                !!editErrors["Cargo o puesto del titular de la dependencia"]
              }
              helperText={
                editErrors["Cargo o puesto del titular de la dependencia"]
              }
            />
            <TextField
              label="Depto. y/u Oficina donde se va a realizar el SS"
              value={
                editedProgram[
                  "Depto. y/u Oficina donde se va a realizar el SS"
                ] || ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Depto. y/u Oficina donde se va a realizar el SS",
                  e.target.value
                )
              }
              fullWidth
              error={
                !!editErrors["Depto. y/u Oficina donde se va a realizar el SS"]
              }
              helperText={
                editErrors["Depto. y/u Oficina donde se va a realizar el SS"]
              }
            />
            <TextField
              label="Nombre del responsable del programa de SS"
              value={
                editedProgram["Nombre del responsable del programa de SS"] || ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Nombre del responsable del programa de SS",
                  e.target.value
                )
              }
              fullWidth
              error={!!editErrors["Nombre del responsable del programa de SS"]}
              helperText={
                editErrors["Nombre del responsable del programa de SS"]
              }
            />
            <TextField
              label="Puesto del responsable del programa de SS"
              value={
                editedProgram["Puesto del responsable del programa de SS"] || ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Puesto del responsable del programa de SS",
                  e.target.value
                )
              }
              fullWidth
              error={!!editErrors["Puesto del responsable del programa de SS"]}
              helperText={
                editErrors["Puesto del responsable del programa de SS"]
              }
            />
            <TextField
              label="Correo electrónico del responsable del SS"
              value={
                editedProgram["Correo electrónico del responsable del SS"] || ""
              }
              onChange={(e) =>
                handleEditChange(
                  "Correo electrónico del responsable del SS",
                  e.target.value
                )
              }
              fullWidth
              error={!!editErrors["Correo electrónico del responsable del SS"]}
              helperText={
                editErrors["Correo electrónico del responsable del SS"]
              }
            />
            <TextField
              label="Nombre del Programa de SS"
              value={editedProgram["Nombre del Programa de SS"] || ""}
              onChange={(e) =>
                handleEditChange("Nombre del Programa de SS", e.target.value)
              }
              fullWidth
              error={!!editErrors["Nombre del Programa de SS"]}
              helperText={editErrors["Nombre del Programa de SS"]}
            />
            <TextField
              label="Objetivo del Programa de SS"
              value={editedProgram["Objetivo del Programa de SS"] || ""}
              onChange={(e) =>
                handleEditChange("Objetivo del Programa de SS", e.target.value)
              }
              fullWidth
              error={!!editErrors["Objetivo del Programa de SS"]}
              helperText={editErrors["Objetivo del Programa de SS"]}
            />
            <Autocomplete
              multiple
              freeSolo
              options={actividadesOptions.map((act) => act.contenido)}
              getOptionLabel={(option) => option || ""}
              value={
                editedProgram["Desglose de actividades a realizar en el SS"] ||
                []
              }
              onChange={(event, newValue) => {
                if (newValue.length <= 10) {
                  handleEditChange(
                    "Desglose de actividades a realizar en el SS",
                    newValue
                  );
                }
              }}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                const isSelected = (
                  editedProgram[
                    "Desglose de actividades a realizar en el SS"
                  ] || []
                ).includes(option);
                return (
                  <li key={key} {...rest}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {isSelected && (
                        <CheckIcon sx={{ mr: 1 }} fontSize="small" />
                      )}
                      <span>{option}</span>
                    </Box>
                  </li>
                );
              }}
              renderTags={(value, getTagProps) =>
                value
                  .filter((option) => option)
                  .map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Actividades del SS"
                  placeholder="Buscar o agregar actividad"
                  error={
                    !!editErrors["Desglose de actividades a realizar en el SS"]
                  }
                  helperText={
                    editErrors["Desglose de actividades a realizar en el SS"]
                  }
                />
              )}
            />
            <TextField
              label="Alumnos a solicitar por carrera"
              value={editedProgram["Alumnos a solicitar por carrera"] || ""}
              onChange={(e) =>
                handleEditChange(
                  "Alumnos a solicitar por carrera",
                  e.target.value
                )
              }
              fullWidth
              error={!!editErrors["Alumnos a solicitar por carrera"]}
              helperText={editErrors["Alumnos a solicitar por carrera"]}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Mínimo de alumnos"
                type="number"
                value={editedProgram.min_alumnos || ""}
                onChange={(e) =>
                  handleEditChange("min_alumnos", e.target.value)
                }
                error={!!editErrors.min_alumnos}
                helperText={editErrors.min_alumnos}
              />
              <TextField
                label="Máximo de alumnos"
                type="number"
                value={editedProgram.max_alumnos || ""}
                onChange={(e) =>
                  handleEditChange("max_alumnos", e.target.value)
                }
              />
            </Stack>
            {/* Fechas informativas */}
            <Typography variant="body2" color="textSecondary">
              Fecha de inicio del convenio:{" "}
              {editedProgram.fechaInicio || formatDate(new Date())} - Fecha de
              finalización:{" "}
              {editedProgram.fechaFin ||
                formatDate(
                  new Date(new Date().setFullYear(new Date().getFullYear() + 2))
                )}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sección para registrar un nuevo programa */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Registrar Nuevo Programa
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Dependencia"
            value={newProgram.Dependencia}
            onChange={(e) =>
              handleNewProgramChange("Dependencia", e.target.value)
            }
            fullWidth
            error={!!newErrors.Dependencia}
            helperText={newErrors.Dependencia}
          />
          <TextField
            label="Domicilio"
            value={newProgram.Domicilio}
            onChange={(e) =>
              handleNewProgramChange("Domicilio", e.target.value)
            }
            fullWidth
            error={!!newErrors.Domicilio}
            helperText={newErrors.Domicilio}
          />
          <TextField
            label="Teléfono"
            value={newProgram.Teléfono}
            onChange={(e) => handleNewProgramChange("Teléfono", e.target.value)}
            fullWidth
            error={!!newErrors.Teléfono}
            helperText={newErrors.Teléfono}
          />
          <TextField
            label="Nombre del titular de la dependencia"
            value={newProgram["Nombre del titular de la dependencia"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Nombre del titular de la dependencia",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Nombre del titular de la dependencia"]}
            helperText={newErrors["Nombre del titular de la dependencia"]}
          />
          <TextField
            label="Cargo o puesto del titular de la dependencia"
            value={newProgram["Cargo o puesto del titular de la dependencia"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Cargo o puesto del titular de la dependencia",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Cargo o puesto del titular de la dependencia"]}
            helperText={
              newErrors["Cargo o puesto del titular de la dependencia"]
            }
          />
          <TextField
            label="Depto. y/u Oficina donde se va a realizar el SS"
            value={
              newProgram["Depto. y/u Oficina donde se va a realizar el SS"]
            }
            onChange={(e) =>
              handleNewProgramChange(
                "Depto. y/u Oficina donde se va a realizar el SS",
                e.target.value
              )
            }
            fullWidth
            error={
              !!newErrors["Depto. y/u Oficina donde se va a realizar el SS"]
            }
            helperText={
              newErrors["Depto. y/u Oficina donde se va a realizar el SS"]
            }
          />
          <TextField
            label="Nombre del responsable del programa de SS"
            value={newProgram["Nombre del responsable del programa de SS"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Nombre del responsable del programa de SS",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Nombre del responsable del programa de SS"]}
            helperText={newErrors["Nombre del responsable del programa de SS"]}
          />
          <TextField
            label="Puesto del responsable del programa de SS"
            value={newProgram["Puesto del responsable del programa de SS"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Puesto del responsable del programa de SS",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Puesto del responsable del programa de SS"]}
            helperText={newErrors["Puesto del responsable del programa de SS"]}
          />
          <TextField
            label="Correo electrónico del responsable del SS"
            value={newProgram["Correo electrónico del responsable del SS"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Correo electrónico del responsable del SS",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Correo electrónico del responsable del SS"]}
            helperText={newErrors["Correo electrónico del responsable del SS"]}
          />
          <TextField
            label="Nombre del Programa de SS"
            value={newProgram["Nombre del Programa de SS"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Nombre del Programa de SS",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Nombre del Programa de SS"]}
            helperText={newErrors["Nombre del Programa de SS"]}
          />
          <TextField
            label="Objetivo del Programa de SS"
            value={newProgram["Objetivo del Programa de SS"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Objetivo del Programa de SS",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Objetivo del Programa de SS"]}
            helperText={newErrors["Objetivo del Programa de SS"]}
          />
          <Autocomplete
            multiple
            freeSolo
            options={actividadesOptions.map((act) => act.contenido)}
            getOptionLabel={(option) => option || ""}
            value={newProgram["Desglose de actividades a realizar en el SS"]}
            onChange={(event, newValue) => {
              if (newValue.length <= 10) {
                handleNewProgramChange(
                  "Desglose de actividades a realizar en el SS",
                  newValue
                );
              }
            }}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              const isSelected = (
                newProgram["Desglose de actividades a realizar en el SS"] || []
              ).includes(option);
              return (
                <li key={key} {...rest}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isSelected && (
                      <CheckIcon sx={{ mr: 1 }} fontSize="small" />
                    )}
                    <span>{option}</span>
                  </Box>
                </li>
              );
            }}
            renderTags={(value, getTagProps) =>
              value
                .filter((option) => option)
                .map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Actividades del SS"
                placeholder="Buscar o agregar actividad"
                error={
                  !!newErrors["Desglose de actividades a realizar en el SS"]
                }
              />
            )}
          />
          {newErrors["Desglose de actividades a realizar en el SS"] && (
            <FormHelperText error>
              {newErrors["Desglose de actividades a realizar en el SS"]}
            </FormHelperText>
          )}
          <TextField
            label="Alumnos a solicitar por carrera"
            value={newProgram["Alumnos a solicitar por carrera"]}
            onChange={(e) =>
              handleNewProgramChange(
                "Alumnos a solicitar por carrera",
                e.target.value
              )
            }
            fullWidth
            error={!!newErrors["Alumnos a solicitar por carrera"]}
            helperText={newErrors["Alumnos a solicitar por carrera"]}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Mínimo de alumnos"
              type="number"
              value={newProgram.min_alumnos}
              onChange={(e) =>
                handleNewProgramChange("min_alumnos", e.target.value)
              }
              error={!!newErrors.min_alumnos}
              helperText={newErrors.min_alumnos}
            />
            <TextField
              label="Máximo de alumnos"
              type="number"
              value={newProgram.max_alumnos}
              onChange={(e) =>
                handleNewProgramChange("max_alumnos", e.target.value)
              }
            />
          </Stack>
          {/* Fechas informativas */}
          <Typography variant="body2" color="textSecondary">
            Fecha de inicio del convenio: {newProgram.fechaInicio} - Fecha de
            finalización: {newProgram.fechaFin}
          </Typography>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Button onClick={handleCreateNewProgram} variant="contained">
            Crear Programa
          </Button>
        </Box>
        {newSuccess && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="success.main">
              {newSuccess}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Programas;
