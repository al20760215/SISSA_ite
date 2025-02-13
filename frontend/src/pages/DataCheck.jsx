import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DataCheck() {
  const navigate = useNavigate();

  // Estados para cargar la información del usuario/alumno y controlar la UI
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    direccion: "",
    curp: "",
    numSegSocial: "",
    telefono: "",
    correoAlternativo: "",
  });
  const [errors, setErrors] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [registroFecha, setRegistroFecha] = useState(null);
  const [expiracionFecha, setExpiracionFecha] = useState(null);

  // Al montar el componente se consulta al backend para obtener el tipo de usuario y, si es alumno, sus datos
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Se espera que el backend retorne un objeto con:
        // Para alumnos: { tipoUsuario: "alumno", vigentes: boolean, datos: { direccion, curp, numSegSocial, telefono, correoAlternativo } }
        // Para otros: { tipoUsuario: "responsable" } o { tipoUsuario: "admin" }

        // const response = await fetch("/api/alumno/:id");
        // const data = await response.json();
        const data = {
          tipoUsuario: "alumno",
          vigentes: false,
          datos: {
            direccion: "calle falsa 123",
            curp: "123456789012345678",
            numSegSocial: "12345678901",
            telefono: "6461234567",
            correoAlternativo: "alumno@example.com",
          },
        };
        // =================================================================

        if (data.tipoUsuario !== "alumno") {
          // Si el usuario no es alumno, se redirecciona de acuerdo a su tipo
          if (data.tipoUsuario === "responsable") {
            navigate("/responsable/dashboard");
          } else if (data.tipoUsuario === "admin") {
            navigate("/admin/dashboard");
          } else {
            console.error("Tipo de usuario desconocido");
          }
        } else {
          // Usuario alumno: se verifica si sus datos están vigentes
          if (data.vigentes) {
            navigate("/alumno/dashboard");
          } else {
            // Datos no vigentes o primera vez: cargar datos (o dejar campos vacíos)
            setStudentData({
              direccion: data.datos?.direccion || "",
              curp: data.datos?.curp || "",
              numSegSocial: data.datos?.numSegSocial || "",
              telefono: data.datos?.telefono || "",
              correoAlternativo: data.datos?.correoAlternativo || "",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  // Validación de los datos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (
      !studentData.direccion.trim() ||
      studentData.direccion.length >= 50 ||
      studentData.direccion.length <= 5
    ) {
      newErrors.direccion = "Una dirección valida es obligatoria";
    }
    if (!studentData.curp.trim() || studentData.curp.length !== 18) {
      newErrors.curp = "La CURP es obligatoria y debe tener 18 caracteres";
    }
    if (
      !studentData.numSegSocial.trim() ||
      isNaN(studentData.numSegSocial.trim()) ||
      studentData.numSegSocial.length !== 11
    ) {
      newErrors.numSegSocial = "El número de seguridad social es obligatorio";
    }
    if (
      !studentData.telefono.trim() ||
      studentData.telefono.length !== 10 ||
      isNaN(studentData.telefono.trim())
    ) {
      newErrors.telefono =
        "El número de teléfono es obligatorio, ingrese unicamente los 10 digitos de su numero";
    }
    if (
      studentData.correoAlternativo &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(studentData.correoAlternativo)
    ) {
      newErrors.correoAlternativo =
        "El correo alternativo no tiene un formato válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Al presionar el botón, se valida y se abre el diálogo de confirmación
  const handleUpdate = () => {
    if (validateForm()) {
      setOpenConfirm(true);
    }
  };

  // Al confirmar en el diálogo se registra la fecha y se envían los datos al backend
  const handleConfirm = async () => {
    const now = new Date();
    const expiracion = new Date(now);
    expiracion.setMonth(expiracion.getMonth() + 6);
    setRegistroFecha(now);
    setExpiracionFecha(expiracion);

    const payload = {
      ...studentData,
      registroFecha: now.toISOString(),
      expiracionFecha: expiracion.toISOString(),
    };

    try {
      //   const response = await fetch("/api/updateStudentData", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   });
      const response = { ok: true };
      if (response.ok) {
        navigate("/alumno/dashboard");
      } else {
        console.error("Error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error en la petición de actualización:", error);
    } finally {
      setOpenConfirm(false);
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Verificación de Datos del Alumno
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="Dirección"
          name="direccion"
          value={studentData.direccion}
          onChange={handleChange}
          error={Boolean(errors.direccion)}
          helperText={errors.direccion}
          required
          slotProps={{ htmlInput: { maxLength: 50 } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="CURP"
          name="curp"
          value={studentData.curp}
          onChange={handleChange}
          error={Boolean(errors.curp)}
          helperText={errors.curp}
          required
          slotProps={{ htmlInput: { maxLength: 18 } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Número de Seguridad Social"
          name="numSegSocial"
          value={studentData.numSegSocial}
          onChange={handleChange}
          error={Boolean(errors.numSegSocial)}
          helperText={errors.numSegSocial}
          required
          slotProps={{ htmlInput: { maxLength: 11 } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Número de Teléfono"
          name="telefono"
          value={studentData.telefono}
          onChange={handleChange}
          error={Boolean(errors.telefono)}
          helperText={errors.telefono}
          required
          slotProps={{ htmlInput: { maxLength: 10 } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Correo Electrónico Alternativo"
          name="correoAlternativo"
          value={studentData.correoAlternativo}
          onChange={handleChange}
          error={Boolean(errors.correoAlternativo)}
          helperText={errors.correoAlternativo}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleUpdate}
        >
          Actualizar Datos
        </Button>
      </form>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar Datos</DialogTitle>
        <DialogContent>
          <Typography>
            Por favor, revisa que tus datos sean correctos:
          </Typography>
          <Typography>
            <strong>Dirección:</strong> {studentData.direccion}
          </Typography>
          <Typography>
            <strong>CURP:</strong> {studentData.curp}
          </Typography>
          <Typography>
            <strong>Número de Seguridad Social:</strong>{" "}
            {studentData.numSegSocial}
          </Typography>
          <Typography>
            <strong>Teléfono:</strong> {studentData.telefono}
          </Typography>
          {studentData.correoAlternativo && (
            <Typography>
              <strong>Correo Alternativo:</strong>{" "}
              {studentData.correoAlternativo}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
