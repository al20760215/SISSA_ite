import { create } from "zustand";

export const useAlumnoStore = create((set) => {
  return {
    nombre: "", //valor iniciales
    apellidos: "",
    grupo: "",
    cantidad_creditos: 0,
    testValue: "",

    funcionAsincronica: async () => {
      console.log("fetching something...");
      // const res = await fetch("http://localhost:5173/data.json");
      const data = await res.json();
      console.log(data);
      //cambiar datos de variables globales
      set({
        nombre: data.Nombres,
        apellidos: data.Apellido1 + " " + data.Apellido2,
        grupo: data.Grupo,
        cantidad_creditos: data.CantidadCreditos,
      });
      funcionNormal: () => {
        console.log("Hacer algo con las variables globales");
        //...
      };
    },
  };
});
