import { Box, Typography, Button, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Importación de Grid2
import { Link } from "react-router-dom";
import PortadaSS from "../assets/ensenada.jpg"; // Asegúrate de usar una imagen atractiva.

export default function AboutPage() {
  return (
    <Box
      sx={{
        backgroundColor: "lightgrey", // Color solido para el fondo
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ paddingY: 8 }}>
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Grid container>
            {/* Sección de la imagen */}
            <Grid
              xs={12}
              md={6}
              sx={{
                height: { xs: 200, md: 400 },
                width: { xs: "100%" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey.100", // Color de fondo por si la imagen no carga
              }}
            >
              <Box
                component="img"
                src={PortadaSS}
                alt="Servicio Social"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>

            {/* Sección de contenido */}
            <Grid xs={12} md={6} sx={{ padding: 4 }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                textAlign="center"
              >
                <Typography variant="h3" color="textPrimary" gutterBottom>
                  Sistema Integral de Servicio Social Albatros ITE
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ paragraph: true }}
                >
                  ¡Bienvenido! Este sistema está diseñado para simplificar y
                  organizar la gestión de tu servicio social. Descubre los
                  programas disponibles, aplica fácilmente, y mantente al tanto
                  de tu progreso.
                </Typography>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  gap={2}
                  mt={2}
                >
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      textTransform: "none",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Accede a la plataforma
                  </Button>
                  <Button
                    component={Link}
                    to="https://www.ensenada.tecnm.mx/"
                    variant="outlined"
                    size="large"
                    sx={{
                      textTransform: "none",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Pagina del tecnologico
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
