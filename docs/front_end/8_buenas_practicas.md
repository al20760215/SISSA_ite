---
sidebar_position: 8
---


# Buenas Prácticas

Las buenas prácticas están orientadas a mantener el código limpio, eficiente y fácil de mantener.

## **Uso de Componentes Funcionales y Hooks**

En React, es recomendable usar **componentes funcionales** en lugar de componentes basados en clases. Los hooks permiten manejar el estado y los efectos de manera más limpia y con un mejor rendimiento.

### Ejemplo de Componente Funcional con Hook:

```javascript
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```

## **Uso de `PropTypes` o `TypeScript`**

Es importante definir los tipos de las props que recibe cada componente, para evitar errores inesperados y mejorar la legibilidad del código.

Si no se usa TypeScript, se puede utilizar **PropTypes** para definir los tipos de las props.

### PropTypes:

```javascript
import PropTypes from 'prop-types';

const Button = ({ label }) => {
  return <button>{label}</button>;
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Button;
```

En **TypeScript**, Se define los tipos de las props directamente en el código.

### TypeScript:

```typescript
interface ButtonProps {
  label: string;
}

const Button: React.FC<ButtonProps> = ({ label }) => {
  return <button>{label}</button>;
};

export default Button;
```

## **Uso de Estados Locales y Contextos de Forma Adecuada**

Los estados locales se mantienen dentro de los componentes que realmente los necesitan. Si un estado se comparte entre muchos componentes, es recomendable usar un **Contexto** para gestionarlo.

### Contexto:

```javascript
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## **Optimización de Renderizados**

Es importante evitar los renderizados innecesarios de componentes. Se puede hacer uso de **React.memo** y **useMemo** para optimizar el rendimiento.

### Ejemplo de React.memo:

```javascript
import React from 'react';

const ExpensiveComponent = React.memo(() => {
  // Componente costoso que solo se renderiza cuando sus props cambian
  return <div>Expensive Component</div>;
});

export default ExpensiveComponent;
```

## **Estilos y Organización del Código**

### Se utiliza un Sistema de Temas

La configuración de los estilos en un archivo de tema, como \`mui-theme.js\` para Material-UI, y utilizar un **ThemeProvider** para aplicar el tema de forma global.

### Ejemplo de Tema en MUI:

```javascript
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0048e2",
    },
    secondary: {
      main: "#4b7bff",
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

### Evitamos el uso de estilos en línea

Siempre que sea posible, utilizamos archivos de CSS, **CSS Modules** o **Styled Components** en lugar de usar estilos en línea. Esto facilita la reutilización y el mantenimiento del código.

## **Uso de Vite para el Desarrollo y Construcción**

Vite es una herramienta moderna para el desarrollo de aplicaciones que nos ofrece un inicio rápido y una construcción eficiente.

- **Habilitar la optimización de dependencias**: Esto mejora el tiempo de construcción.
- **Utilizar el modo de desarrollo**: Para aprovechar la recarga rápida de módulos.

### Configuración Básica de Vite:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
```

## **Manejo de Dependencias**

Mantenemos las dependencias actualizadas y gestionamos correctamente las versiones de las bibliotecas utilizadas. Utilizamos herramientas como **npm audit** para verificar las vulnerabilidades de seguridad en las dependencias.

### Actualizar Dependencias:

```bash
npm update
```

## **Escribir Pruebas Unitarias y de Integración**

Para un futuro de SISSA es buena práctica escribir pruebas unitarias y de integración para asegurar que el código funciona correctamente. Se puede utilizar bibliotecas como **Jest** y **React Testing Library** para realizar las pruebas.

### Ejemplo de Prueba futura con React Testing Library:

```javascript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('debe mostrar el texto del botón', () => {
  render(<Button label="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---
