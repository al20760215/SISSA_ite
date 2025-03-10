---
sidebar_position: 7
---

# Pruebas en la API

## Introducción

El backend implementa pruebas para garantizar su correcto funcionamiento. Se pueden realizar pruebas manuales con Postman o cURL, y pruebas automatizadas con **pytest**.

---

## Instalación de Dependencias para Pruebas

Antes de ejecutar las pruebas, debemos de tener instaladas las dependencias necesarias:

``` bash
pip install pytest requests
```

Si estás pruebas dentro del contenedor Docker, acceder a la terminal del contenedor de Flask:

``` bash
docker exec -it flask-sissa bash
pip install pytest requests
```

---

## Pruebas con cURL

Se pueden realizar pruebas a los endpoints usando **cURL**. A continuación, algunos ejemplos:

### **Probar el registro de usuarios**
``` bash
curl -X POST http://localhost:8080/register -H "Content-Type: application/json" -d '{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "1234567890",
  "contraseña": "password_seguro"
}'
```

### **Probar el inicio de sesión**
``` bash
curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d '{
  "correo": "juan@example.com",
  "contraseña": "password_seguro"
}'
```

### **Acceder a un endpoint protegido con token**
``` bash
curl -H "Authorization: Bearer <TOKEN>" -X GET http://localhost:8080/protected
```

---

## Pruebas Automáticas con pytest

### **Estructura del archivo de pruebas**
Las pruebas unitarias se ubican en un archivo llamado \`test_api.py\` dentro del proyecto.

### **Ejemplo de pruebas con pytest**
Crea el archivo \`test_api.py\`:

```python
import requests

BASE_URL = "http://localhost:8080"

def test_register():
    response = requests.post(f"{BASE_URL}/register", json={
        "nombre": "Test User",
        "correo": "test@example.com",
        "telefono": "1234567890",
        "contraseña": "password123"
    })
    assert response.status_code == 201 or response.status_code == 409

def test_login():
    response = requests.post(f"{BASE_URL}/login", json={
        "correo": "test@example.com",
        "contraseña": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.json()
```

### **Ejecutar las pruebas**
Para ejecutar todas las pruebas, usar:

``` bash
pytest test_api.py
```

Paran pruebas dentro de Docker:

``` bash
docker exec -it flask-sissa pytest test_api.py
```

---

## Pruebas con Postman

Para probar la API con **Postman**:

1. Abrir Postman y crear una nueva colección.
2. Agrega una petición **POST** a \`http://localhost:8080/register\` con un cuerpo JSON de prueba.
3. Agrega una petición **POST** a \`http://localhost:8080/login\` y obtén un token.
4. Usa el token en la pestaña **Authorization** para probar endpoints protegidos.


