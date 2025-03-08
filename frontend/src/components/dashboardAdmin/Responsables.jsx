import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import responsablesData from "./dummyResponsables.json";

const Responsables = () => {
  // Estados para búsqueda, filtros, ordenamiento y diálogo de detalle
  const [searchText, setSearchText] = useState("");
  const [filterEstadoResponsable, setFilterEstadoResponsable] =
    useState("Todos");
  const [filterEstadoConvenio, setFilterEstadoConvenio] = useState("Todos");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Función para normalizar cadenas (minúsculas, sin acentos/puntuación)
  const normalizeString = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

  // Filtrar datos según búsqueda y filtros de estados
  const filteredData = responsablesData.filter((r) => {
    const searchNormalized = normalizeString(searchText);
    const combinedFields = normalizeString(
      `${r.id} ${r.nombres} ${r.apellidos} ${r.institucion} ${r.puesto} ${(
        r.programas || []
      ).join(" ")}`
    );
    const matchesSearch = combinedFields.includes(searchNormalized);

    const matchesEstadoResponsable =
      filterEstadoResponsable === "Todos" ||
      r.estadoResponsable.toLowerCase() ===
        filterEstadoResponsable.toLowerCase();
    const matchesEstadoConvenio =
      filterEstadoConvenio === "Todos" ||
      r.estadoConvenio.toLowerCase() === filterEstadoConvenio.toLowerCase();

    return matchesSearch && matchesEstadoResponsable && matchesEstadoConvenio;
  });

  // Función para ordenar datos
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = filteredData.sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    // Convertir a fecha si corresponde
    if (orderBy === "fechaInicio" || orderBy === "fechaFin") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  //diálogo con detalle del responsable seleccionado
  const handleRowClick = (responsable) => {
    setSelectedResponsable(responsable);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResponsable(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Seguimiento de Responsables de Programas de SS
      </Typography>
      {/* Barra de búsqueda y filtros */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="estado-responsable-filter-label">
            Estado Responsable
          </InputLabel>
          <Select
            labelId="estado-responsable-filter-label"
            value={filterEstadoResponsable}
            onChange={(e) => setFilterEstadoResponsable(e.target.value)}
            label="Estado Responsable"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Dado de baja">Dado de baja</MenuItem>
            <MenuItem value="Inactividad">Inactividad</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="estado-convenio-filter-label">
            Estado Convenio
          </InputLabel>
          <Select
            labelId="estado-convenio-filter-label"
            value={filterEstadoConvenio}
            onChange={(e) => setFilterEstadoConvenio(e.target.value)}
            label="Estado Convenio"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Finalizado">Finalizado</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Tarjeta con la lista */}
      <Card>
        <CardContent>
          <TableContainer
            sx={{ width: "100%", overflowX: "auto", maxHeight: 600 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleSort("id")}
                    >
                      ID / No. Trabajador
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "nombres"}
                      direction={orderBy === "nombres" ? order : "asc"}
                      onClick={() => handleSort("nombres")}
                    >
                      Nombres
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "apellidos"}
                      direction={orderBy === "apellidos" ? order : "asc"}
                      onClick={() => handleSort("apellidos")}
                    >
                      Apellidos
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Programas</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "institucion"}
                      direction={orderBy === "institucion" ? order : "asc"}
                      onClick={() => handleSort("institucion")}
                    >
                      Institución
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "puesto"}
                      direction={orderBy === "puesto" ? order : "asc"}
                      onClick={() => handleSort("puesto")}
                    >
                      Puesto
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "numProgramas"}
                      direction={orderBy === "numProgramas" ? order : "asc"}
                      onClick={() => handleSort("numProgramas")}
                    >
                      # Programas
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "numProgramasVigentes"}
                      direction={
                        orderBy === "numProgramasVigentes" ? order : "asc"
                      }
                      onClick={() => handleSort("numProgramasVigentes")}
                    >
                      Programas Vigentes
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "fechaInicio"}
                      direction={orderBy === "fechaInicio" ? order : "asc"}
                      onClick={() => handleSort("fechaInicio")}
                    >
                      Fecha Inicio Convenio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "fechaFin"}
                      direction={orderBy === "fechaFin" ? order : "asc"}
                      onClick={() => handleSort("fechaFin")}
                    >
                      Fecha Fin Convenio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Estado Responsable</TableCell>
                  <TableCell>Estado Convenio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((r) => (
                  <TableRow
                    key={r.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(r)}
                  >
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.nombres}</TableCell>
                    <TableCell>{r.apellidos}</TableCell>
                    <TableCell>
                      {r.programas && r.programas.length > 0
                        ? r.programas.join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{r.institucion}</TableCell>
                    <TableCell>{r.puesto}</TableCell>
                    <TableCell>{r.numProgramas}</TableCell>
                    <TableCell>{r.numProgramasVigentes}</TableCell>
                    <TableCell>
                      {new Date(r.fechaInicio).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(r.fechaFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            r.estadoResponsable.toLowerCase() === "activo"
                              ? "green"
                              : r.estadoResponsable.toLowerCase() ===
                                "dado de baja"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {r.estadoResponsable}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            r.estadoConvenio.toLowerCase() === "activo"
                              ? "green"
                              : "red",
                        }}
                      >
                        {r.estadoConvenio}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {/* Diálogo para mostrar detalles */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle del Responsable</DialogTitle>
        <DialogContent dividers>
          {selectedResponsable && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>
                <strong>ID / No. Trabajador:</strong> {selectedResponsable.id}
              </Typography>
              <Typography>
                <strong>Nombres:</strong> {selectedResponsable.nombres}
              </Typography>
              <Typography>
                <strong>Apellidos:</strong> {selectedResponsable.apellidos}
              </Typography>
              <Typography>
                <strong>Programas a cargo:</strong>{" "}
                {selectedResponsable.programas &&
                selectedResponsable.programas.length > 0
                  ? selectedResponsable.programas.join(", ")
                  : "N/A"}
              </Typography>
              <Typography>
                <strong>Institución:</strong> {selectedResponsable.institucion}
              </Typography>
              <Typography>
                <strong>Puesto:</strong> {selectedResponsable.puesto}
              </Typography>
              <Typography>
                <strong>Número de programas:</strong>{" "}
                {selectedResponsable.numProgramas}
              </Typography>
              <Typography>
                <strong>Programas vigentes:</strong>{" "}
                {selectedResponsable.numProgramasVigentes}
              </Typography>
              <Typography>
                <strong>Fecha Inicio Convenio:</strong>{" "}
                {new Date(selectedResponsable.fechaInicio).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Fecha Fin Convenio:</strong>{" "}
                {new Date(selectedResponsable.fechaFin).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Estado Responsable:</strong>{" "}
                <span
                  style={{
                    color:
                      selectedResponsable.estadoResponsable.toLowerCase() ===
                      "activo"
                        ? "green"
                        : selectedResponsable.estadoResponsable.toLowerCase() ===
                          "dado de baja"
                        ? "red"
                        : "orange",
                  }}
                >
                  {selectedResponsable.estadoResponsable}
                </span>
              </Typography>
              <Typography>
                <strong>Estado Convenio:</strong>{" "}
                <span
                  style={{
                    color:
                      selectedResponsable.estadoConvenio.toLowerCase() ===
                      "activo"
                        ? "green"
                        : "red",
                  }}
                >
                  {selectedResponsable.estadoConvenio}
                </span>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Responsables;
