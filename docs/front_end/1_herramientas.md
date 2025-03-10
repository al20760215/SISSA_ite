---
sidebar_position: 1
---

# Herramientas

# Herramientas del Proyecto

## 1. **React**

**React** es una biblioteca de JavaScript para construir interfaces de usuario dinámicas y reutilizables. En este proyecto, React es la piedra angular del frontend, permitiendo la creación de componentes modulares que pueden ser utilizados a lo largo de toda la aplicación.

### ¿Por qué se eligio React?
- **Componentes reutilizables**: React permite crear componentes autónomos que gestionan su propio estado y pueden ser reutilizados en diferentes partes de la aplicación.
- **Virtual DOM**: React optimiza la actualización de la interfaz de usuario mediante el uso de un Virtual DOM, lo que mejora el rendimiento y la experiencia de usuario.
- **Desarrollo más rápido**: Gracias a su sistema de componentes y herramientas como **React DevTools**, se facilita el desarrollo, la depuración y las pruebas.

### Cómo se usa en SISSA:
React se usa para construir componentes visuales como formularios, tablas y botones. Además, la aplicación usa **React Router** para manejar la navegación entre diferentes secciones de la plataforma.

---

## 2. **Vite**

**Vite** es una herramienta de construcción moderna y rápida que optimiza el proceso de desarrollo y la creación de proyectos frontend.

### ¿Por qué se eligio Vite?
- **Velocidad**: Vite ofrece tiempos de inicio casi instantáneos gracias a su utilización de **ESBuild** para la transpilación y el empaquetado, lo que mejora notablemente el tiempo de arranque en comparación con otros bundlers tradicionales como Webpack.
- **Recarga rápida (Hot Module Replacement, HMR)**: Permite la recarga instantánea de módulos cuando se modifica el código, lo que mejora la experiencia de desarrollo.
- **Compatibilidad con ESModules**: Vite utiliza ESModules nativos, lo que reduce significativamente el tiempo de procesamiento y mejora el rendimiento.

### Cómo se usa en SISSA:
Vite se configura como el bundler para el proyecto frontend. Gracias a su velocidad y características de recarga rápida, facilita un flujo de trabajo ágil y eficiente en el desarrollo de la aplicación.

---

## 3. **Axios / Fetch**

**Axios** es una librería de JavaScript para realizar solicitudes HTTP, aunque también se puede usar la API nativa **Fetch** para los mismos fines. En este proyecto, se usa para interactuar con el backend y consumir las APIs que proporcionan los datos necesarios para la aplicación.

### ¿Por qué se eligio Axios?
- **Promesas**: Axios devuelve promesas, lo que hace que el manejo de respuestas asíncronas sea más sencillo.
- **Manejo de errores**: Axios permite interceptar respuestas y errores, proporcionando un control más fino sobre las solicitudes y respuestas HTTP.
- **Compatibilidad con JSON**: Axios convierte automáticamente las respuestas en formato JSON, lo que facilita el trabajo con datos estructurados.

### Cómo se usa en SISSA:
Axios se emplea para hacer solicitudes al backend para obtener o enviar datos. En este proyecto, se utiliza para cargar información de los usuarios, las organizaciones y los programas de servicio social, entre otros.

---

## 4. **React Router**

**React Router** es una biblioteca estándar para el manejo de rutas en aplicaciones React. Permite definir múltiples rutas en una aplicación de una sola página, facilitando la navegación entre diferentes vistas sin recargar la página.

### ¿Por qué React Router?
- **Navegación declarativa**: La navegación es declarativa, lo que significa que las rutas se definen como componentes dentro de la aplicación, haciendo que el código sea más predecible.
- **Enrutamiento anidado**: React Router soporta rutas anidadas, lo que facilita la estructura jerárquica de las vistas.
- **Redirección y manejo de rutas protegidas**: Permite proteger rutas específicas (por ejemplo, autenticación de usuario) y redirigir a los usuarios según sea necesario.

### Cómo se usa en SISSA:
React Router se utiliza para gestionar las rutas entre diferentes secciones de la plataforma. Por ejemplo, se utiliza para navegar entre la página de inicio, el registro de usuarios, y las secciones de administración.

---

## 5. **Redux / Context API**

**Redux** es una librería para gestionar el estado global de la aplicación, aunque en proyectos más pequeños se puede utilizar **React Context API** para el mismo propósito. En este caso, dependiendo de la complejidad del proyecto, podrías optar por una u otra.

### ¿Por qué Redux (o Context API)?
- **Gestión centralizada del estado**: Redux permite almacenar el estado de la aplicación de manera centralizada, lo que facilita la gestión de los datos compartidos entre diferentes componentes.
- **Flujo unidireccional de datos**: Los cambios en el estado siguen un flujo predecible, lo que facilita la depuración y el mantenimiento de la aplicación.
- **Compatibilidad con React DevTools**: Redux es compatible con herramientas como **Redux DevTools**, que permiten monitorear y depurar el estado de la aplicación.

### Cómo se usa en SISSA:
En el caso de que el proyecto utilice Redux, se usa para gestionar el estado global de la aplicación, como el estado de autenticación del usuario o la información de los programas de servicio social. Si se opta por **Context API**, se utilizaría de forma similar para evitar la propensión a pasar props entre muchos componentes.

---

## 6. **Tailwind CSS**

**Tailwind CSS** es un framework de utilidades CSS que permite diseñar rápidamente interfaces modernas sin escribir CSS personalizado.

- **Diseño rápido y eficiente**: Permite aplicar estilos rápidamente utilizando clases de utilidad. Esto es especialmente útil en aplicaciones donde el diseño necesita cambiar rápidamente sin necesidad de escribir reglas CSS complicadas.
- **Personalización**: Tailwind es fácilmente personalizable, permitiendo a los desarrolladores ajustar el tema, los colores y otros aspectos visuales a sus necesidades.
- **Componentes predefinidos**: Se pueden crear componentes fácilmente con clases de utilidad, acelerando el desarrollo.

### Cómo se usa en SISSA:
Tailwind CSS se utiliza para diseñar la interfaz de usuario, aplicando clases de utilidad directamente a los componentes de React para establecer el diseño y la apariencia visual de la aplicación.



