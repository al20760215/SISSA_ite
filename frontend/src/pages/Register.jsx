import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import registerBg from "../assets/ensenada.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numerocontrol: "",
    nombres: "",
    apellido1: "",
    apellido2: "",
    semestre: "",
    cantidadcreditos: "",
    reprobadas: "",
    grupo: "",
    especialidad: "",
    telefono: "",
    direccion: "",
    segurosocial: false,
    correo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "numerocontrol",
      "nombres",
      "apellido1",
      "apellido2",
      "semestre",
      "cantidadcreditos",
      "especialidad",
      "correo",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterClick = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:8080/register",
          formData
        );
        console.log(response.data);
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: { xs: 2, sm: 0 },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: "70%", md: "50%", lg: "40%" },
          my: { xs: 2, sm: 0 },
          p: { xs: 2, sm: 4 },
          boxShadow: 3,
          maxWidth: "90vw",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            color="textPrimary"
            align="center"
            gutterBottom
          >
            Registro de Usuario
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                label: "Número de Control",
                name: "numerocontrol",
                type: "number",
              },
              { label: "Nombres", name: "nombres" },
              { label: "Primer Apellido", name: "apellido1" },
              { label: "Segundo Apellido", name: "apellido2" },
              { label: "Semestre", name: "semestre", type: "number" },
              {
                label: "Cantidad de Créditos",
                name: "cantidadcreditos",
                type: "number",
              },
              {
                label: "Materias Reprobadas",
                name: "reprobadas",
                type: "number",
                optional: true,
              },
              { label: "Grupo", name: "grupo", optional: true },
              { label: "Especialidad", name: "especialidad" },
              { label: "Teléfono", name: "telefono", optional: true },
              { label: "Dirección", name: "direccion", optional: true },
              { label: "Correo Electrónico", name: "correo" },
            ].map(({ label, name, type = "text", optional }) => (
              <Grid xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={`${label}${optional ? " (Opcional)" : ""}`}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name] || ""}
                />
              </Grid>
            ))}
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.segurosocial}
                    onChange={handleChange}
                    name="segurosocial"
                  />
                }
                label="¿Cuenta con Seguro Social?"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleRegisterClick}
          >
            Registrarse
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/login")}
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
