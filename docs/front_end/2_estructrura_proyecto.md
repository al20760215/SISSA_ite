---
sidebar_position: 2
---

# Estructura

# Estructura del Proyecto

SISSA está organizado en carpetas y archivos que siguen una convención estándar para aplicaciones React.

## 📂 **src**

La carpeta `src` es donde reside todo el código fuente de la aplicación. Es el núcleo del proyecto y contiene todos los archivos necesarios para que la aplicación funcione correctamente.

### 📂 **components**
Esta carpeta contiene los componentes reutilizables de la aplicación. Los componentes en esta carpeta son bloques de construcción que se utilizan en varias partes de la aplicación para mantener el código modular y organizado.

- **Ejemplos**: Botones, formularios, tarjetas, tablas, encabezados, etc.
- **Propósito**: Ayudar a reducir la duplicación de código y mejorar la mantenibilidad del proyecto.

### 📂 **pages**
En esta carpeta se encuentran las vistas principales de la aplicación. Cada archivo dentro de esta carpeta corresponde a una página o una vista completa dentro de la aplicación.

- **Ejemplos**: Página de inicio, página de login, panel de usuario, etc.
- **Propósito**: Organizar las vistas de manera que cada una tenga su propio archivo independiente.

### 📂 **hooks**
Aquí se encuentran los **custom hooks**. Los hooks personalizados son funciones que encapsulan lógica reutilizable para que los componentes puedan acceder a esa lógica sin tener que duplicarla.

- **Ejemplos**: `useAuth` (para manejar la autenticación), `useFetchData` (para obtener datos de un API), etc.
- **Propósito**: Reutilizar lógica entre diferentes componentes y mantener el código limpio y fácil de mantener.

### 📂 **context**
Esta carpeta contiene los archivos relacionados con el uso de **React Context API**. Context API se utiliza para manejar el estado global de la aplicación y pasar datos entre componentes sin necesidad de props.

- **Ejemplos**: Contexto para manejar la autenticación, preferencias del usuario, temas, etc.
- **Propósito**: Facilitar el acceso a valores y estados globales sin tener que propagar datos a través de muchos niveles de componentes.

### 📂 **assets**
La carpeta `assets` contiene todos los archivos estáticos, como imágenes, iconos y otros recursos que no son JavaScript ni CSS.

- **Ejemplos**: `logo.png`, `favicon.ico`, imágenes para la interfaz de usuario.
- **Propósito**: Centralizar todos los recursos estáticos para facilitar su gestión.

### 📂 **styles**
Aquí se encuentran los archivos de estilos, como CSS o archivos de configuración de un preprocesador como **SASS** o **Tailwind**.

- **Ejemplos**: Archivos CSS generales, variables globales de estilo, configuraciones de Tailwind CSS.
- **Propósito**: Gestionar la apariencia visual de la aplicación de manera centralizada.

### **main.jsx**
Este es el archivo de entrada principal de la aplicación. Aquí es donde se monta el componente principal `App` y se establece el punto de entrada para React.

- **Propósito**: Es el primer archivo ejecutado cuando se inicia la aplicación. Aquí se configuran las dependencias iniciales como el *Provider* de Redux o el contexto de autenticación.

### **app.jsx**
Este archivo contiene la configuración de las rutas y la inicialización de los *providers* necesarios para la aplicación. En este archivo se gestionan las rutas utilizando **React Router** y se envuelven los componentes de la aplicación con los *providers* (por ejemplo, Context API, Redux).

- **Propósito**: Definir la estructura general de la aplicación y las rutas principales, y proporcionar el contexto necesario para los componentes.

---

## Diagrama de la Estructura

A continuación se presenta un diagrama visual de la estructura de carpetas para facilitar la comprensión de la organización del proyecto:

📂 src\
 ├── 📂 components   # Componentes reutilizables\
 ├── 📂 pages        # Vistas principales\
 ├── 📂 hooks        # Custom hooks\
 ├── 📂 context      # Context API\
 ├── 📂 assets       # Imágenes, iconos, etc.\
 ├── 📂 styles       # Archivos de estilos\
 ├── main.jsx        # Entrada principal de React\
 ├── app.jsx         # Configuración de rutas y providers.