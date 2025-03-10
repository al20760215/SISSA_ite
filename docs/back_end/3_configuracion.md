---
sidebar_position: 3
---

# Configuración

Este documento describe cómo configurar correctamente el backend del proyecto antes de ejecutarlo. Se incluyen configuraciones para las variables de entorno, base de datos, Nginx y Flask.

---

## Variables de Entorno

Se definen dentro del archivo `docker-compose.yml` y son utilizadas por Flask y PostgreSQL.

### **Configuración en `docker-compose.yml`**

Dentro del servicio `flask`, las variables de entorno son:

``` yaml
environment:
  - FLASK_APP=/code/main.py
  - SECRET_KEY=clave_encriptada_de_prueba
  # Variables para Flask-Limiter
  - RATELIMIT_HEADERS_ENABLED=true # Agrega headers para indicar estado de límite
  # Variables de conexión a la base de datos
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=password
  - POSTGRES_DB=sissa_postgres_db

    FLASK_APP: Especifica el archivo principal de la aplicación Flask (main.py).
    SECRET_KEY: Clave secreta utilizada para cifrar sesiones y autenticación.
    RATELIMIT_HEADERS_ENABLED: Habilita los encabezados para Flask-Limiter.
    POSTGRES_USER: Usuario de la base de datos PostgreSQL.
    POSTGRES_PASSWORD: Contraseña de la base de datos.
    POSTGRES_DB: Nombre de la base de datos que usará SISSA.
```

## Configuración de la Base de Datos

SISSA usa PostgreSQL como base de datos. Su configuración está en docker-compose.yml en la sección db:

```
db:
  image: postgres:latest
  container_name: sissa-postgres
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
    POSTGRES_DB: sissa_postgres_db
  volumes:
    - ./scripts:/docker-entrypoint-initdb.d
  networks:
    - my-network
```

### Personalización de la Base de Datos

Para cambiar el usuario, contraseña o nombre de la base de datos, editar los valores en POSTGRES_USER, POSTGRES_PASSWORD y POSTGRES_DB.

### Inicialización de la Base de Datos

Los scripts SQL de inicialización estan en la carpeta scripts/. Estos se ejecutarán automáticamente al levantar el contenedor de la base de datos.

## Configuración de Nginx

SISSA utiliza Nginx como proxy inverso para redirigir las peticiones hacia el backend en Flask.

El archivo de configuración nginx.conf se encuentra en la raíz del proyecto y tiene la siguiente estructura:

```
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://flask-app:5000/;
        proxy_set_header Host "localhost";
    }

    location /register {
        proxy_pass http://flask-app:5000/register;
        proxy_set_header Host "localhost";
    }

    location /login {
        proxy_pass http://flask-app:5000/login;
        proxy_set_header Host "localhost";
    }
}
```

### Cambios en la Configuración de Nginx

Para cambiar la configuración, editar el archivo nginx.conf y luego reinicia el contenedor de Nginx:

```
docker-compose restart nginx
```

## Configuración de Flask

El backend está construido con Flask y se ejecuta dentro de un contenedor Docker. El servicio de Flask está definido en docker-compose.yml:

```
flask:
  build:
    context: ./
    dockerfile: Dockerfile
  image: flask:0.0.1
  container_name: flask-sissa
  volumes:
    - ./code/:/code/
    - ./uploads/:/uploads/
  environment:
    - FLASK_APP=/code/main.py
    - SECRET_KEY=clave_encriptada_de_prueba
  command: flask run --host=0.0.0.0
  networks:
    my-network:
      aliases:
        - flask-app
```

### Modificación del Código

Para modificar el código de Flask, los archivos fuente están dentro de la carpeta code/. Se pueden editar y luego sera necesario reiniciar el contenedor:

```
docker-compose restart flask
```

## Configuración de Límites de Peticiones (Rate Limiting)

Se usa Flask-Limiter para limitar la cantidad de peticiones que un usuario puede realizar en un periodo de tiempo. Está configurado con la variable de entorno:

```
- RATELIMIT_HEADERS_ENABLED=true
```

Esto agrega encabezados HTTP en las respuestas para indicar el estado de los límites de tasa.
