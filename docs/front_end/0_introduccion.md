---
sidebar_position: 0
---

# Introducción al Frontend

## ¿Qué es el Frontend?

El **Frontend** es la parte del sistema que interactúa directamente con el usuario. Está compuesto por todas las interfaces y elementos visuales que permiten al usuario interactuar con la plataforma. En SISSA, el frontend se encarga de gestionar la visualización y manipulación de los datos del sistema de gestión de servicio social.

## Objetivo del Proyecto

El objetivo del **frontend** es proporcionar una interfaz intuitiva y dinámica para que los usuarios puedan interactuar con el sistema de gestión de servicio social. Esto incluye funcionalidades como:  
- **Visualización de datos**: Mostrar la información de los estudiantes, organizaciones y otros datos relevantes.
- **Interacciones**: Facilitar la interacción con formularios, tablas y otros componentes interactivos.
- **Navegación fluida**: Permitir una navegación fácil entre las diferentes secciones del sistema.

## Tecnologías y Herramientas

El frontend del sistema está construido utilizando las siguientes tecnologías y herramientas:

- **React**: Biblioteca de JavaScript para construir interfaces de usuario dinámicas y reutilizables.
- **Vite**: Herramienta de construcción que optimiza el rendimiento y la experiencia de desarrollo.
- **CSS (o Tailwind CSS)**: Para los estilos visuales de la aplicación. (Si usas Tailwind, menciona aquí sus beneficios como la creación rápida de interfaces).
- **Axios o Fetch**: Para realizar las solicitudes HTTP al backend y consumir las APIs.
- **React Router**: Para la navegación entre diferentes secciones de la aplicación.
- **Redux o Context API**: Para la gestión del estado global si se usa.

## Estructura del Proyecto

La estructura del proyecto frontend está organizada de la siguiente manera:

```
src/
 ├── components/   # Componentes reutilizables
 ├── pages/        # Vistas o páginas principales
 ├── services/     # Funciones para interactuar con APIs
 ├── assets/       # Archivos estáticos como imágenes y estilos
 ├── App.js        # Componente principal de la aplicación
 ├── index.js      # Punto de entrada para React
```
## Características Clave

* **Autenticación de Usuario:** El frontend maneja el login y la gestión de sesiones de los usuarios.
* **Interacción con APIs:** El sistema hace uso de fetch o Axios para interactuar con las APIs del backend, enviando y recibiendo datos de la base de datos.
* **Vistas Responsivas:** Las interfaces están diseñadas para adaptarse a diferentes dispositivos y tamaños de pantalla.

## Conexión con el Backend

El frontend interactúa con el backend a través de API REST. A través de métodos HTTP (GET, POST, PUT, DELETE), el frontend consume datos del sistema y actualiza la interfaz de usuario según las respuestas del servidor. El frontend también maneja la autenticación mediante tokens JWT para asegurar la comunicación con el backend.