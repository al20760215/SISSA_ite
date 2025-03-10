---
sidebar_position: 7
---
# Estilos

Este proyecto utiliza diferentes enfoques de estilización para gestionar la apariencia de la aplicación. A continuación se detallan los métodos utilizados para aplicar los estilos.

## **MUI (Material-UI)**

**Material-UI** (ahora conocido como **MUI**) se usa para los componentes de interfaz de usuario. Los estilos de los componentes se gestionan a través de un sistema de temas, que permite configurar la paleta de colores, los puntos de ruptura y otros parámetros globales.

### Tema Personalizado (mui-theme.js)

En el archivo \`mui-theme.js\`, se configura el tema principal de la aplicación. Este tema define los colores principales, colores secundarios, y los puntos de ruptura para la responsividad.

```javascript
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0048e2",  // Color principal
    },
    secondary: {
      main: "#4b7bff",  // Color secundario
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
```

### Aplicación del Tema

El tema es aplicado en el archivo \`main.jsx\`, utilizando el \`ThemeProvider\` de MUI. Esto asegura que los componentes de MUI en todo el proyecto sigan el mismo esquema de diseño.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { theme } from "./mui-theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

## **Estilos en Componentes con Styled Components**

Si se utilizara **Styled Components**, donde podrían ser definidos directamente en los componentes de React mediante funciones de JavaScript. Esto permite que los estilos sean dinámicos y específicos a cada componente.

Ejemplo:

```javascript
import styled from 'styled-components';

const Button = styled.button\`
  background-color: #0048e2;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
\`;

const MyComponent = () => {
  return <Button>Click me</Button>;
};
```

## **Tailwind CSS**

**Tailwind CSS**, los estilos serían aplicados directamente como clases en los componentes. En este caso, no se usarían archivos CSS tradicionales, sino que las clases de Tailwind serían aplicadas directamente en el JSX de los componentes.

Ejemplo:

```javascript
const Button = () => {
  return <button className="bg-blue-500 text-white p-2 rounded">Click me</button>;
};
```

## **CSS Modules**

En algunos casos, se usan **CSS Modules** para manejar los estilos de los componentes de forma local. Los archivos CSS Modules permiten la importación de estilos específicos para cada componente, evitando conflictos de nombres.

Ejemplo:

```javascript
import styles from './Button.module.css';

const Button = () => {
  return <button className={styles.button}>Click me</button>;
};
```

### Ejemplo de archivo \`Button.module.css\`

```css
.button {
  background-color: #0048e2;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
```

