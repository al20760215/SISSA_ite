import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    //check if user is logged in
    const isAdmin = false;
    const isUser = false;
    const isTutor = false;
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
    if (isTutor) {
      navigate("/tutor/dashboard");
    }
    if (isUser) {
      navigate("/user/dashboard");
    }
  });

  const handleLoginClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });
      const data = response.data;
      console.log(data);
      if (data.token) {
        localStorage.setItem(
          "usuarioLocal",
          JSON.stringify({
            token: data.token,
            tokenRefresh: data.tokenRefresh,
          })
        );
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
          <TextField
            label="CONTRASEÑA"
            fullWidth
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <Button
            onClick={() => handleLoginClick()}
            variant="contained"
            sx={{ mt: 2, mx: 4 }}
          >
            Iniciar sesion
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            registrarse
          </Button>
          <Button
            onClick={() => navigate("/dataUpdate")}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            TestCheck
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
