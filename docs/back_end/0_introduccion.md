---
sidebar_position: 0
---

# Introducción

## Objetivo

El objetivo principal del backend es servir como el núcleo de la lógica del sistema, gestionando el acceso a datos, procesando la información y proporcionando una interfaz segura y eficiente para la comunicación entre los diferentes componentes del sistema, como el frontend y la base de datos. El backend maneja las solicitudes del usuario, las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la base de datos, y la lógica de negocio asociada, incluyendo la autenticación, la autorización y el control de acceso.

El backend proporciona soporte para la siguiente funcionalidad:
- Gestión de usuarios: registro, inicio de sesión y administración de roles y permisos.
- Gestión de datos: administración de tablas y registros dentro de la base de datos.
- Manejo de archivos: almacenamiento y recuperación de archivos mediante rutas específicas.
- Seguridad y autenticación: asegurando que solo los usuarios autorizados puedan realizar ciertas acciones a través de medidas como JWT (JSON Web Tokens) y Flask-Limiter para limitar el número de peticiones.

## Tecnologías Utilizadas

El backend de SISSA está construido utilizando las siguientes tecnologías:

### Flask
Flask es un framework web minimalista y flexible para Python que permite desarrollar aplicaciones web con facilidad. Flask se utiliza para crear las rutas y manejar la lógica de negocio, junto con herramientas como Flask-Limiter para la limitación de tasa y la gestión de solicitudes.

### PostgreSQL
La base de datos PostgreSQL es utilizada para almacenar y gestionar la información relacionada con el sistema. Esta base de datos es conocida por su robustez, rendimiento y soporte a consultas complejas.

### Docker
SISSA está completamente dockerizado, lo que permite aislar las dependencias del entorno y garantizar que el sistema funcione de manera consistente en diferentes plataformas. Docker se utiliza para contenerizar tanto el servidor Flask como la base de datos PostgreSQL, entre otros servicios.

### Nginx
Nginx se utiliza como un servidor proxy inverso y balanceador de carga para dirigir las solicitudes HTTP hacia el contenedor Flask. Esto mejora el rendimiento y la escalabilidad del sistema al manejar eficientemente las solicitudes de los clientes.

### Flask-Limiter
Flask-Limiter es una extensión para Flask que ayuda a implementar la limitación de tasa (Rate Limiting) en las rutas del backend, lo que ayuda a proteger la API de sobrecargas y abusos.

## Arquitectura del Sistema

La arquitectura del backend está basada en una estructura de microservicios en contenedores Docker. Los componentes clave incluyen:

- **Nginx**: Actúa como un servidor proxy inverso, redirigiendo las solicitudes HTTP al contenedor adecuado (en este caso, al contenedor Flask).
- **Flask**: El servidor de aplicaciones que maneja las rutas y la lógica de negocio del sistema. Exponer las rutas de la API que interactúan con la base de datos y procesan la información.
- **PostgreSQL**: Base de datos relacional que almacena los datos persistentes de los usuarios y otras entidades relevantes dentro del sistema.
- **Contenedores Docker**: Cada componente del backend se ejecuta dentro de un contenedor Docker aislado, garantizando que las dependencias y configuraciones sean consistentes en todas las instancias del sistema.

### Diagrama de Arquitectura

```bash
                +------------------+ 
                |   Nginx Proxy    |
                |   (Contenedor)   |
                +--------+---------+ 
                         | 
                         v 
                +--------+---------+
                |    Flask (API)   |
                |   (Contenedor)   |
                +--------+---------+
                         | 
                         v
                +--------+---------+
                |  PostgreSQL DB   |
                |   (Contenedor)   |
                +------------------+
```
---
## Flujo de Datos

* El usuario realiza una solicitud HTTP que es enviada al servidor Nginx. 
* Nginx redirige la solicitud al servidor Flask basado en las reglas configuradas en el archivo nginx.conf.
* Flask procesa la solicitud, interactúa con la base de datos PostgreSQL si es necesario y devuelve una respuesta al usuario.
* Las respuestas son procesadas y enviadas de vuelta a Nginx, que las devuelve al cliente.

---
