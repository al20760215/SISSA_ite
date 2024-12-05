import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";
export default function AboutPage() {
  return (
    <Box
      sx={{
        display: "flex",
        padding: 10,
        width: "90vh",
        minWidth: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Paper sx={{ p: 4, width: "70vw" }}>
        <Typography variant="h1" color="textPrimary">
          Sistema Integral de Servicio Social Albatros ITE
        </Typography>
        <Typography gutterBottom>Esta es la pagina acerca de</Typography>
        <Button component={Link} to="/login" variant="contained">
          Ir a Login...
        </Button>
      </Paper>
    </Box>
  );
}
