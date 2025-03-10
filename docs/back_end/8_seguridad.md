---
sidebar_position: 8
---

# Seguridad en la API

## Autenticación y Autorización

La API utiliza **JWT (JSON Web Tokens)** para la autenticación y autorización de usuarios. 

### **Proceso de autenticación**
1. Un usuario se registra con su correo y contraseña.
2. Al iniciar sesión, recibe un **token JWT** que debe incluir en cada solicitud a endpoints protegidos.
3. La API verifica el token antes de permitir el acceso.

### **Ejemplo de uso de JWT en una solicitud**
``` bash
curl -H "Authorization: Bearer <TOKEN>" -X GET http://localhost:8080/protected
``` 

---

## Protección contra Ataques Comunes

### **Protección contra Inyección SQL**
- Se utiliza **SQLAlchemy** con consultas parametrizadas para evitar inyecciones SQL.
- No se concatenan datos directamente en las consultas SQL.

### **Protección contra XSS (Cross-Site Scripting)**
- Se sanitizan las entradas del usuario para evitar la ejecución de scripts maliciosos.

### **Protección contra CSRF (Cross-Site Request Forgery)**
- Se pueden usar **tokens CSRF** en formularios web para proteger las solicitudes POST, PUT y DELETE.

### **Protección contra Fuerza Bruta**
- Se implementa **Flask-Limiter** para limitar la cantidad de intentos de inicio de sesión por IP.

Ejemplo de configuración en **Flask**:

``` python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(get_remote_address, app=app, default_limits=["5 per minute"])
``` 

---

## Cifrado de Datos Sensibles

- Las **contraseñas** de los usuarios se almacenan con **bcrypt** para asegurar que no sean accesibles en texto plano.

Ejemplo de hash de contraseña en **Flask**:

``` python
from werkzeug.security import generate_password_hash

hashed_password = generate_password_hash("mi_contraseña_segura")
``` 

---

## Configuración Segura del Servidor

### **Configuración Segura de Nginx**
El archivo **nginx.conf** solo permite tráfico hacia los endpoints específicos y bloquea accesos no autorizados.

Ejemplo de configuración en **nginx.conf**:
``` nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://flask-app:5000/;
        proxy_set_header Host "localhost";
    }

    location /login {
        proxy_pass http://flask-app:5000/login;
        proxy_set_header Host "localhost";
    }

    location /register {
        proxy_pass http://flask-app:5000/register;
        proxy_set_header Host "localhost";
    }

    # Bloqueo de acceso directo a archivos sensibles
    location ~ /\. {
        deny all;
    }
}
``` 

### **Variables de Entorno**
- Se utilizan **variables de entorno** para almacenar credenciales en lugar de hardcodearlas en el código.

Ejemplo en **docker-compose.yml**:
``` yaml
environment:
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=password
  - SECRET_KEY=clave_encriptada_de_prueba
``` 

---

## Auditoría y Monitoreo

- Se pueden implementaron herramientas como **Icinga** y **Grafana** para monitorear accesos y posibles intentos de ataque.
- Se recomienda almacenar logs de actividad en un sistema seguro.

