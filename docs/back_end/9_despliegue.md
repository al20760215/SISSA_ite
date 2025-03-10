---
sidebar_position: 9
---

# Despliegue del Backend

Este documento describe el proceso para desplegar la API en un servidor utilizando **Docker** y **Nginx**.

---

## Prerrequisitos

Antes de iniciar el despliegue, asegurar de tener instalados los siguientes paquetes en el servidor:

- **Docker**: Para la gestión de contenedores.
- **Docker Compose**: Para orquestar los servicios.
- **Git**: Para clonar el repositorio.

Instalación en Ubuntu:

``` bash
sudo apt update && sudo apt install -y docker.io docker-compose git
``` 

Verifica que Docker está corriendo:

``` bash
sudo systemctl start docker
sudo systemctl enable docker
``` 

---

## Clonar el Repositorio

Clona el repositorio del backend:

``` bash
git clone https://github.com/al20760215/SISSA_ite.git
cd SISSA_ite
``` 

---

## Configurar Variables de Entorno

Crea un archivo **.env** para definir credenciales y configuraciones:

``` bash
cat <<EOT > .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=sissa_postgres_db
SECRET_KEY=clave_encriptada_de_prueba
EOT
``` 

---

## Construcción y Ejecución con Docker

Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:

``` bash
docker-compose up -d --build
``` 

Esto iniciará los siguientes servicios:

- **flask-sissa**: API backend en Flask.
- **nginx-sissa**: Servidor proxy inverso con Nginx.
- **sissa-postgres**: Base de datos PostgreSQL.

Verifica que los contenedores están corriendo:

``` bash
docker ps
``` 

---

## Acceso a la API

Una vez que el backend esté desplegado, puedes acceder a los endpoints a través de **Nginx** en el puerto `8080`:

``` bash
curl -X GET http://localhost:8080/
``` 
---

## Monitoreo y Logs

Para ver los logs de los contenedores en tiempo real:

``` bash
docker-compose logs -f
``` 

Para acceder al contenedor de Flask:

``` bash
docker exec -it flask-sissa bash
``` 

Para acceder a la base de datos PostgreSQL:

``` bash
docker exec -it sissa-postgres psql -U postgres -d sissa_postgres_db
``` 

---

## Detener y Reiniciar el Backend

Para detener los contenedores:

``` bash
docker-compose down
``` 

Para reiniciar con cambios en el código:

``` bash
docker-compose up -d --build
``` 

