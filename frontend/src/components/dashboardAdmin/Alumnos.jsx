import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Typography,
  Modal,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
} from "@mui/material";
import dummyAlumnos from "./dummyAlumnos.json";

const Alumnos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("control");
  const [openModal, setOpenModal] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  // Función para normalizar textos:
  // Convierte a minúsculas, elimina acentos y remueve signos de puntuación.
  const normalizeText = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos
      .replace(/[^\w\s]/g, ""); // elimina signos de puntuación

  // Manejo del ordenamiento
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filtrado por búsqueda (múltiples términos) y filtros adicionales
  const filteredAlumnos = dummyAlumnos.filter((alumno) => {
    // Separar los términos de búsqueda y normalizarlos
    const terms = searchQuery
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((term) => normalizeText(term));

    // Si no hay términos, se muestran todos los alumnos
    const queryMatch = terms.every(
      (term) =>
        normalizeText(alumno.control).includes(term) ||
        normalizeText(alumno.nombre).includes(term) ||
        normalizeText(alumno.apellido).includes(term) ||
        (alumno.programa
          ? normalizeText(alumno.programa).includes(term)
          : false) ||
        normalizeText(alumno.estado).includes(term)
    );
    if (!queryMatch) return false;

    // Filtros adicionales
    if (filterOption === "programa") {
      return alumno.programa;
    }
    if (filterOption === "noIniciado") {
      return alumno.estado === "No iniciado";
    }
    if (filterOption === "atrasado") {
      if (
        alumno.estado !== "Concluido" &&
        alumno.fechaTentativa !== "-" &&
        new Date(alumno.fechaTentativa) < new Date() &&
        alumno.documentos < 10
      ) {
        return true;
      }
      return false;
    }
    if (filterOption === "docIncompleto") {
      return alumno.documentos < 10;
    }
    return true;
  });

  // Ordenamiento de los datos filtrados
  const sortedAlumnos = [...filteredAlumnos].sort((a, b) => {
    // Para campos de fecha, se tratan los valores "-" como vacíos.
    if (
      (a[orderBy] === "-" || !a[orderBy]) &&
      (b[orderBy] === "-" || !b[orderBy])
    )
      return 0;
    if (a[orderBy] === "-" || !a[orderBy]) return order === "asc" ? 1 : -1;
    if (b[orderBy] === "-" || !b[orderBy]) return order === "asc" ? -1 : 1;

    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleRowClick = (alumno) => {
    setSelectedAlumno(alumno);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAlumno(null);
  };

  return (
    <Box>
      {/* Barra de búsqueda y filtros */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Seguimiento de Alumnos
          </Typography>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Buscar alumno"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}
            />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 200, mr: 2, mb: { xs: 1, sm: 0 } }}
            >
              <InputLabel>Filtrar por</InputLabel>
              <Select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                label="Filtrar por"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="programa">Registrados en programa</MenuItem>
                <MenuItem value="noIniciado">No iniciado</MenuItem>
                <MenuItem value="atrasado">Atrasado</MenuItem>
                <MenuItem value="docIncompleto">
                  Documentación incompleta
                </MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </CardContent>
      </Card>

      {/* Lista de alumnos con tamaño fijo y scroll vertical */}
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ height: 600, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "control"}
                      direction={orderBy === "control" ? order : "asc"}
                      onClick={() => handleSort("control")}
                    >
                      No. Control
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "nombre"}
                      direction={orderBy === "nombre" ? order : "asc"}
                      onClick={() => handleSort("nombre")}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "apellido"}
                      direction={orderBy === "apellido" ? order : "asc"}
                      onClick={() => handleSort("apellido")}
                    >
                      Apellido
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Vigente</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "fechaInicio"}
                      direction={orderBy === "fechaInicio" ? order : "asc"}
                      onClick={() => handleSort("fechaInicio")}
                    >
                      Fecha Inicio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "fechaTentativa"}
                      direction={orderBy === "fechaTentativa" ? order : "asc"}
                      onClick={() => handleSort("fechaTentativa")}
                    >
                      Fecha Tentativa
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Documentos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAlumnos.map((alumno) => {
                  const today = new Date();
                  let computedEstado = alumno.estado;
                  if (
                    alumno.estado !== "Concluido" &&
                    alumno.fechaTentativa !== "-" &&
                    new Date(alumno.fechaTentativa) < today &&
                    alumno.documentos < 10
                  ) {
                    computedEstado = "Atrasado";
                  }

                  let estadoColor = "inherit";
                  if (computedEstado === "Concluido") {
                    estadoColor = "primary"; // azul
                  } else if (computedEstado === "En curso") {
                    estadoColor = "success"; // verde
                  } else if (computedEstado === "Atrasado") {
                    estadoColor = "error"; // rojo
                  }

                  return (
                    <TableRow
                      key={alumno.control}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(alumno)}
                    >
                      <TableCell>{alumno.control}</TableCell>
                      <TableCell>{alumno.nombre}</TableCell>
                      <TableCell>{alumno.apellido}</TableCell>
                      <TableCell>{alumno.vigente ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        {alumno.programa ? alumno.programa : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography color={estadoColor}>
                          {computedEstado}
                        </Typography>
                      </TableCell>
                      <TableCell>{alumno.fechaInicio}</TableCell>
                      <TableCell>{alumno.fechaTentativa}</TableCell>
                      <TableCell>
                        <Typography
                          color={alumno.documentos < 10 ? "error" : "inherit"}
                        >
                          {alumno.documentos}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Modal para ver detalles del alumno */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          {selectedAlumno && (
            <>
              <Typography variant="h6" gutterBottom>
                Detalles del Alumno
              </Typography>
              <Typography variant="body1">
                <strong>No. Control:</strong> {selectedAlumno.control}
              </Typography>
              <Typography variant="body1">
                <strong>Nombre:</strong> {selectedAlumno.nombre}{" "}
                {selectedAlumno.apellido}
              </Typography>
              <Typography variant="body1">
                <strong>Vigente:</strong> {selectedAlumno.vigente ? "Sí" : "No"}
              </Typography>
              <Typography variant="body1">
                <strong>Programa:</strong>{" "}
                {selectedAlumno.programa ? selectedAlumno.programa : "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Estado:</strong> {selectedAlumno.estado}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha Inicio:</strong> {selectedAlumno.fechaInicio}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha Tentativa:</strong>{" "}
                {selectedAlumno.fechaTentativa}
              </Typography>
              <Typography variant="body1">
                <strong>Documentos:</strong> {selectedAlumno.documentos}
              </Typography>
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button variant="contained" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Alumnos;
