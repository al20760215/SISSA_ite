import { Button } from "@mui/material";
import { useAlumnoStore } from "../store/alumnos";

export const Start = () => {
  const fetchAlumnos = useAlumnoStore((state) => state.fetchAlumnos);
  const handleClick = () => {
    fetchAlumnos();
    console.log("HERE START");
  };
  return (
    <Button onClick={handleClick} variant="contained">
      SOLICITAR DATOS
    </Button>
  );
};
