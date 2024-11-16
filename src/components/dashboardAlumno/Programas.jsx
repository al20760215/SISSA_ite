import React, { useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { programasDummy } from "./dummyPrograms";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const initialPrograms = programasDummy;

export default function ProgramasServicio() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenDialog = (program = null) => {
    setSelectedProgram(program);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newProgram = Object.fromEntries(formData.entries());

    const programData = {
      id: selectedProgram ? selectedProgram.id : Date.now(),
      dependencia: newProgram.dependencia,
      domicilio: newProgram.domicilio,
      telefono: newProgram.telefono,
      nombreTitular: newProgram.nombreTitular,
      cargoTitular: newProgram.cargoTitular,
      departamento: newProgram.departamento,
      nombreJefe: newProgram.nombreJefe,
      nombreResponsable: newProgram.nombreResponsable,
      puestoResponsable: newProgram.puestoResponsable,
      correoResponsable: newProgram.correoResponsable,
      nombrePrograma: newProgram.nombrePrograma,
      objetivo: newProgram.objetivo,
      actividades: newProgram.actividades,
      carreras: newProgram.carreras,
      minAlumnos: parseInt(newProgram.minAlumnos, 10),
      maxAlumnos: parseInt(newProgram.maxAlumnos, 10),
    };

    if (selectedProgram) {
      setPrograms((prev) =>
        prev.map((prog) =>
          prog.id === selectedProgram.id ? programData : prog
        )
      );
      setSnackbarMessage("Programa editado correctamente");
    } else {
      setPrograms((prev) => [...prev, programData]);
      setSnackbarMessage("Programa agregado correctamente");
    }

    handleCloseDialog();
    setSnackbarOpen(true);
  };

  const handleDelete = (id) => {
    setPrograms((prev) => prev.filter((prog) => prog.id !== id));
    setSnackbarMessage("Programa eliminado correctamente");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Agregar Programa
      </Button>
      <TableContainer
        style={{ maxHeight: "400px", width: "100%", overflowY: "auto" }} // Ajusta la altura y el ancho
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Dependencia</TableCell>
              <TableCell>Domicilio</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Nombre del Titular</TableCell>
              <TableCell>Cargo del Titular</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Nombre del Jefe</TableCell>
              <TableCell>Nombre del Responsable</TableCell>
              <TableCell>Puesto del Responsable</TableCell>
              <TableCell>Correo del Responsable</TableCell>
              <TableCell>Nombre del Programa</TableCell>
              <TableCell>Objetivo</TableCell>
              <TableCell>Actividades</TableCell>
              <TableCell>Carreras</TableCell>
              <TableCell>Min Alumnos</TableCell>
              <TableCell>Max Alumnos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                {Object.entries(program).map(([key, value]) => {
                  if (key !== "id")
                    return <TableCell key={key}>{value}</TableCell>;
                })}
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog(program)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(program.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedProgram ? "Editar Programa" : "Agregar Programa"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              required
              name="dependencia"
              label="Dependencia"
              defaultValue={selectedProgram ? selectedProgram.dependencia : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="domicilio"
              label="Domicilio de la Dependencia"
              defaultValue={selectedProgram ? selectedProgram.domicilio : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="telefono"
              label="Teléfono"
              defaultValue={selectedProgram ? selectedProgram.telefono : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="nombreTitular"
              label="Nombre del Titular"
              defaultValue={
                selectedProgram ? selectedProgram.nombreTitular : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="cargoTitular"
              label="Cargo o Puesto del Titular"
              defaultValue={selectedProgram ? selectedProgram.cargoTitular : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="departamento"
              label="Departamento u Oficina"
              defaultValue={selectedProgram ? selectedProgram.departamento : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="nombreJefe"
              label="Nombre del Jefe de Departamento"
              defaultValue={selectedProgram ? selectedProgram.nombreJefe : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="nombreResponsable"
              label="Nombre del Responsable"
              defaultValue={
                selectedProgram ? selectedProgram.nombreResponsable : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="puestoResponsable"
              label="Puesto del Responsable"
              defaultValue={
                selectedProgram ? selectedProgram.puestoResponsable : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="correoResponsable"
              label="Correo Electrónico del Responsable"
              defaultValue={
                selectedProgram ? selectedProgram.correoResponsable : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="nombrePrograma"
              label="Nombre del Programa"
              defaultValue={
                selectedProgram ? selectedProgram.nombrePrograma : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="objetivo"
              label="Objetivo"
              defaultValue={selectedProgram ? selectedProgram.objetivo : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="actividades"
              label="Desglose de Actividades"
              defaultValue={selectedProgram ? selectedProgram.actividades : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="carreras"
              label="Carreras de Alumnos a Solicitar"
              defaultValue={selectedProgram ? selectedProgram.carreras : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="minAlumnos"
              label="Número de Alumnos Mínimo Requerido"
              type="number"
              defaultValue={selectedProgram ? selectedProgram.minAlumnos : ""}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              name="maxAlumnos"
              label="Número de Alumnos Máximo Requerido"
              type="number"
              defaultValue={selectedProgram ? selectedProgram.maxAlumnos : ""}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                {selectedProgram ? "Guardar Cambios" : "Agregar Programa"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
