---
sidebar_position: 2
---

# Instalación

Este archivo proporciona una guía paso a paso para instalar y ejecutar el proyecto en tu entorno local. El sistema está compuesto por varios contenedores Docker para Nginx, Flask y PostgreSQL, lo que facilita la configuración y despliegue del proyecto.

## Requisitos Previos

Antes de comenzar con la instalación, asegúrate de tener instalados los siguientes programas en tu máquina:

- **Docker**: Se requiere Docker para ejecutar los contenedores de los servicios. Si no lo tienes, puedes descargarlo desde [Docker Desktop](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Docker Compose es necesario para gestionar múltiples contenedores. Puedes instalarlo desde [Docker Compose](https://docs.docker.com/compose/install/).

Además, si deseas ejecutar la aplicación localmente en tu máquina para desarrollarla o probarla, necesitarás tener Node.js y npm instalados.

- **Node.js y npm**: Si no tienes Node.js, puedes descargarlo desde [Node.js](https://nodejs.org/).

## Pasos de Instalación

### 1. Clonar el Repositorio

Primero, clona el repositorio del proyecto desde GitHub:

```bash
git clone https://github.com/al20760215/SISSA_ite.git
```

## Navegar a la Carpeta del Proyecto

Una vez que hayas clonado el repositorio, navega a la carpeta del proyecto:
```
cd SISSA_ite
```

## Construir y Levantar los Contenedores Docker

SISSA utiliza Docker y Docker Compose para ejecutar los contenedores de Nginx, Flask y PostgreSQL. Para levantar los contenedores, sigue estos pasos:

* Construir los Contenedores

En la carpeta raíz del proyecto, ejecuta el siguiente comando para construir las imágenes de los contenedores:
```
docker-compose build
```

* Levantar los Contenedores

Una vez que las imágenes estén construidas, levanta los contenedores con el siguiente comando:
```
docker-compose up -d
```

Esto iniciará los contenedores en segundo plano. Los contenedores que se levantarán son:

    * **Nginx:** Servirá como proxy inverso para redirigir las solicitudes HTTP al contenedor de Flask.
    * **Flask:** La aplicación backend que maneja las rutas y lógica de negocio.
    PostgreSQL: La base de datos que almacena la información persistente.

## Verificar que los Contenedores Están Corriendo

Puedes verificar que los contenedores se estén ejecutando correctamente con el siguiente comando:
```
docker-compose ps
```

Este comando mostrará una lista de los contenedores en ejecución y sus respectivos puertos.

## Acceder a la Aplicación

Una vez que los contenedores estén en funcionamiento, puedes acceder a la aplicación a través de tu navegador web en la siguiente dirección:
```
http://localhost:8080
```

Si todo está configurado correctamente, deberías ver la interfaz de la aplicación.

## Detener los Contenedores

Cuando hayas terminado de trabajar con la aplicación, puedes detener los contenedores con el siguiente comando:
```
docker-compose down
```

Este comando detendrá y eliminará los contenedores en ejecución.

## Desarrollar y Realizar Cambios en el Proyecto

Para realizar cambios en los archivos del proyecto y ver los cambios reflejados al reiniciar los contenedores. Los archivos de código y configuración están montados en volúmenes Docker, lo que permite una fácil edición y prueba.

## Dependencias de Node.js

Instalar las dependencias de Node.js:

* Navega a la carpeta frontend del proyecto:
```
cd frontend
```

Instalar las dependencias de Node.js:
```
npm install
```

Para iniciar el frontend en modo de desarrollo, ejecuta:
```
npm start
```

Esto abrirá una ventana del navegador con el frontend en http://localhost:3000.
