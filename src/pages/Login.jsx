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
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12 }}>1</Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Container>
          <Typography variant="h5">Login</Typography>
          <p>Esta es la pagina inicial</p>
          <Button variant="contained">Login</Button>
        </Container>
      </Grid>
    </Grid>
  );
}
