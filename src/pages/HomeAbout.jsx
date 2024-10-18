import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h1" color="primary">
        Sistema Integral de Servicio Social Albatros ITE
      </Typography>
      <p>Esta es la pagina acerca de</p>
      <Button component={Link} to="/login" variant="contained">
        Ir a Login...
      </Button>
    </Container>
  );
}
