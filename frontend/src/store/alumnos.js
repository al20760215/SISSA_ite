import { create } from "zustand";

export const useAlumnoStore = create((set) => {
  return {
    nombre: "",
    apellidos: "",
    grupo: "",
    cantidad_creditos: 0,

    fetchAlumnos: async () => {
      console.log("fetching alumnos");
      // const res = await fetch("http://localhost:5173/data.json");
      const res2 = await fetch("http://localhost:3000/");
      const data = await res2.json();
      console.log(data);
      set({
        nombre: data.Nombres,
        apellidos: data.Apellido1 + " " + data.Apellido2,
        grupo: data.Grupo,
        cantidad_creditos: data.CantidadCreditos,
      });
    },
  };
});
