---
sidebar_position: 1
---

# Arquitectura

La arquitectura del backend está diseñada siguiendo el patrón de microservicios y contenedores, lo que garantiza una estructura modular, escalable y fácil de mantener. Todos los componentes del sistema están encapsulados en contenedores Docker, lo que permite que cada servicio funcione de manera independiente pero que interactúen de manera eficiente entre sí.

## Componentes Principales

### 1. **Servidor Proxy Inverso (Nginx)**

Nginx actúa como un **servidor proxy inverso** que se encarga de recibir las solicitudes HTTP del cliente y redirigirlas a los servicios apropiados. Su papel en la arquitectura es fundamental para:
- **Balanceo de carga**: Aunque en este sistema no se realiza balanceo de carga de múltiples instancias, Nginx facilita la distribución de solicitudes entre los servicios backend.
- **Seguridad y rendimiento**: Nginx también ayuda a gestionar aspectos como la seguridad, el manejo de certificados SSL y la limitación de conexiones.

El contenedor que ejecuta Nginx está configurado para escuchar en el puerto 80 y redirigir todas las solicitudes relevantes al contenedor de Flask.

### 2. **Aplicación Flask**

El servidor de aplicaciones está basado en **Flask**, un framework web ligero y flexible para Python. Flask se encarga de procesar las solicitudes que recibe, interactuar con la base de datos y devolver respuestas al cliente. 

#### Funciones principales:
- **Rutas de la API**: Flask maneja las rutas HTTP que permiten a los usuarios interactuar con el sistema.
- **Lógica de negocio**: Flask es responsable de procesar la lógica que se ejecuta cuando los usuarios envían solicitudes a la API.
- **Autenticación y autorización**: A través de bibliotecas como Flask-Login o JWT (JSON Web Tokens), se implementan mecanismos de autenticación y autorización de usuarios.
- **Limitación de tasa**: Flask-Limiter se utiliza para evitar abusos del sistema mediante la limitación del número de solicitudes que un cliente puede hacer en un período de tiempo.

### 3. **Base de Datos PostgreSQL**

El sistema utiliza **PostgreSQL** como la base de datos relacional para almacenar toda la información necesaria para la aplicación. PostgreSQL es conocido por su estabilidad y robustez, y permite realizar consultas complejas y manejar grandes volúmenes de datos con alta integridad.

#### Funciones principales:
- **Almacenamiento de datos persistentes**: Los datos como usuarios, programas, organizaciones, etc., se almacenan en tablas dentro de PostgreSQL.
- **Consultas complejas**: Gracias a su potente sistema de consultas, PostgreSQL permite realizar operaciones complejas para obtener, modificar o eliminar datos.
- **Seguridad de datos**: PostgreSQL proporciona un sistema robusto de roles y permisos para asegurar que solo los usuarios autorizados puedan acceder a la información sensible.

### 4. **Contenedores Docker**

Todo el sistema se encuentra encapsulado en contenedores **Docker**, lo que facilita el desarrollo, el despliegue y la escalabilidad del sistema. Docker permite que cada componente del sistema se ejecute en su propio contenedor, aislado de otros servicios.

#### Beneficios de Docker:
- **Aislamiento**: Cada componente del sistema (Nginx, Flask, PostgreSQL) se ejecuta en un contenedor aislado, lo que permite evitar conflictos entre dependencias y entornos.
- **Escalabilidad**: Docker facilita la escalabilidad de los servicios, permitiendo crear múltiples instancias de un contenedor si es necesario.
- **Consistencia**: Docker asegura que el entorno de desarrollo sea el mismo que el de producción, evitando problemas relacionados con diferencias de configuraciones entre entornos.

### 5. **Red Docker**

Todos los servicios están conectados a través de una red Docker personalizada llamada **my-network**. Esta red permite que los contenedores se comuniquen entre sí de forma segura, permitiendo a Nginx redirigir las solicitudes al contenedor de Flask, y a Flask interactuar con PostgreSQL para realizar consultas o modificar datos.

## Diagrama de Arquitectura

```bash
                 +------------------+
                 |   Nginx Proxy    |
                 |   (Contenedor)   |
                 +--------+---------+
                          | 
                          v 
                 +--------+---------+
                 |   Flask (API)    |
                 |   (Contenedor)   |
                 +--------+---------+
                          | 
                          v
                 +--------+---------+
                 |  PostgreSQL DB   |
                 |   (Contenedor)   |
                 +------------------+
```
### Descripción del Diagrama:

* Nginx Proxy: El contenedor de Nginx escucha las solicitudes entrantes en el puerto 80 y las redirige a la aplicación Flask correspondiente.
* Flask (API): El contenedor de Flask maneja las solicitudes de la API, procesa la lógica de negocio y se comunica con PostgreSQL para obtener o modificar datos.
* PostgreSQL DB: El contenedor de PostgreSQL se encarga de almacenar la información persistente del sistema, como los datos de los usuarios, las organizaciones, los programas, etc.

### Flujo de Datos

* El usuario realiza una solicitud HTTP a través del navegador o una API.
* Nginx recibe la solicitud y la dirige al contenedor de Flask según la ruta configurada.
* Flask procesa la solicitud, interactúa con la base de datos PostgreSQL si es necesario y ejecuta la lógica de negocio correspondiente.
* Flask devuelve una respuesta, que Nginx pasa de vuelta al usuario.

### Beneficios de la Arquitectura

* Modularidad: Cada servicio se gestiona de forma independiente, lo que facilita el mantenimiento y la escalabilidad.
* Flexibilidad: Docker permite un fácil despliegue en diferentes entornos, lo que es crucial para el desarrollo y la producción.
* Seguridad: Al tener componentes aislados, se mejora la seguridad al evitar que los servicios tengan acceso innecesario a recursos de otros servicios.
* Escalabilidad: La arquitectura es fácilmente escalable. Se pueden agregar más instancias de los contenedores según la demanda del sistema.