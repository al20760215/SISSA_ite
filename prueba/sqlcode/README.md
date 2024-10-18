# Proyecto PostgreSQL en Docker

Este proyecto configura un contenedor Docker con PostgreSQL e importa automáticamente una base de datos desde un archivo SQL durante la inicialización.

## Estructura del Proyecto

- **Dockerfile**: Archivo que define la imagen de Docker, configurando PostgreSQL y cargando el archivo SQL `baseservicio.sql`.
- **sqlcode/baseservicio.sql**: Archivo SQL que contiene las instrucciones para crear y poblar la base de datos `baseservicio`.

## Requisitos

- [Docker](https://www.docker.com/get-started) instalado en tu máquina.
- Cuenta en [Docker Hub](https://hub.docker.com/) (opcional para subir la imagen).

## Instrucciones

### 1. Clonar el repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/robealex/nombre_repositorio.git
cd nombre_repositorio
