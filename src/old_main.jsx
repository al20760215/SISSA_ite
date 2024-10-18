import { useState } from "react";
import "./App.css";
import { Container, Stack, Typography } from "@mui/material";
import { Start } from "./Start";
import { useAlumnoStore } from "./store/alumnos";

function App() {
  const { nombre, apellidos, grupo, cantidad_creditos } = useAlumnoStore(
    (state) => state
  );
  // const edad = useAlumnoStore((state) => state.edad);
  console.log(nombre);
  console.log(apellidos);
  console.log(grupo);
  console.log(cantidad_creditos);

  return (
    <main>
      <Container maxWidth="sm">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          {nombre ? (
            <p>
              <h3>{nombre}</h3>
              <h3>{apellidos}</h3>
              <h3>{grupo}</h3>
              <h3>{cantidad_creditos} creditos</h3>
            </p>
          ) : (
            <Typography variant="h2" component="h1">
              Pagina inicial
            </Typography>
          )}
        </Stack>
        {/* boton para fetch */}
        <Start />
      </Container>
    </main>
  );
}

export default App;
