---
sidebar_position: 9
---

# Despliegue del Proyecto

## **Prerrequisitos**

Antes de iniciar el despliegue, es importante asegurarnos de tener los siguientes elementos instalados y configurados en tu entorno:

- **Docker**: para contenerizar el proyecto y sus dependencias.
- **Docker Compose**: para gestionar varios contenedores de Docker.
- **Node.js** (si es necesario para el frontend): para ejecutar Vite y React.
- **Vite**: para la construcción y desarrollo del frontend.
- **PostgreSQL**: para almacenar los datos del proyecto.

## Verificamos la instalación de Docker:

```
docker --version
```

Verifica la instalación de Docker Compose:
```
docker-compose --version
```
Verifica la instalación de Node.js:
```
node --version
```

## Clonar el Repositorio

Clonamos el repositorio del proyecto:
```
git clone https://github.com/al20760215/SISSA_ite/tree/main
cd proyecto
```

## Construcción y Despliegue con Docker

Para construir las imágenes de Docker para el frontend y backend, usa el siguiente comando:
```
docker-compose build
```

Este comando construirá los contenedores definidos en tu archivo 
```
docker-compose.yml.
```

## Levantar los Contenedores

Una vez que las imágenes se hayan construido correctamente, levanta los contenedores de Docker con:
```
docker-compose up -d
```

El parámetro -d permite que los contenedores se ejecuten en segundo plano.

## Verificar el Estado de los Contenedores

Para verificar si los contenedores están funcionando correctamente, utiliza el siguiente comando:
```
docker-compose ps
```

Esto mostrará el estado de todos los contenedores.


## Ver Logs de los Contenedores

Para verificar los logs de los contenedores y asegurarte de que todo esté funcionando correctamente, utiliza el siguiente comando:

```
docker-compose logs -f
```

## Configuración de Nginx para el Despliegue

Configuración Básica de Nginx:
```
server {
    listen 80;
    server_name nginx-sissa;

    location / {
        proxy_pass http://frontend:5432;  # Dirección del frontend
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
```

## Despliegue en el Servidor de Producción

Escalar un Servicio con Docker Compose
```
docker-compose up -d --scale frontend=3
```

Esto levantará las tres instancias del contenedor frontend, el backend, la monitorización y la documentación.


Para realizar el mantenimiento de los contenedores, puedes detenerlos, reiniciarlos o eliminarlos usando los siguientes comandos:
```
docker-compose down      # Detiene y elimina los contenedores
docker-compose restart   # Reinicia los contenedores
```
## Backup y Restauración

Es importante hacer backups regulares de la base de datos y otros datos críticos.
Backup de la Base de Datos (PostgreSQL):
```
docker exec -t sissa pg_dumpall -c -U postgres > backup.sql
```
Restauración de la Base de Datos:
```
cat backup.sql | docker exec -i sissa psql -U postgres
```