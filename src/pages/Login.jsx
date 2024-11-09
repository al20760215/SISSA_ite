import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import loginbg from "../assets/ensenada.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    //check if user is logged in
    const isAdmin = false;
    const isUser = false;
    const isTutor = false;
    if (isAdmin) {
      //redirect to login page if user is not admin
      navigate("/admin/dashboard");
    }
    if (isTutor) {
      //redirect to login page if user is not admin
      navigate("/tutor/dashboard");
    }
    if (isUser) {
      //redirect to login page if user is not admin
      navigate("/user/dashboard");
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", //vh = viewport height
        backgroundImage: `url(${loginbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: { xs: 2, sm: 0 },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: "70%", md: "50%", lg: "30%" }, // breakpoints
          my: { xs: 2, sm: 0 }, // Vertical margin on small screens
          p: { xs: 2, sm: 4 }, // Smaller padding on small screens
          boxShadow: 3,
          maxWidth: "90vw", // vh = viewport width
          minWidth: 300,
        }}
      >
        <CardContent align="center">
          <Typography variant="h5" color="textPrimary">
            SISTEMA INTEGRAL DE SERVICIO SOCIAL ALBATROS
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            INSTITUTO TECNOLOGICO DE ENSENADA 2024
          </Typography>
          <TextField
            label="USUARIO"
            fullWidth
            variant="outlined"
            margin="normal"
          ></TextField>
          <TextField
            label="CONTRASEÑA"
            fullWidth
            variant="outlined"
            type="password"
            margin="normal"
          ></TextField>
          <Button
            onClick={() => navigate("/user/dashboard")}
            variant="contained"
            sx={{ mt: 2, mx: 4 }}
          >
            Iniciar sesion
          </Button>
          <Button variant="outlined" sx={{ mt: 2 }}>
            registrarse
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

/* <Grid container spacing={{ xs: 2, md: 3 }}>
  <Grid size={{ xs: 12 }}>1</Grid>
  <Grid size={{ xs: 12, md: 4 }}></Grid>
</Grid>; */
