---
sidebar_position: 6
---

# Autenticación en la API

## Introducción

SISSA utiliza **JSON Web Tokens (JWT)** para la autenticación y autorización de los usuarios. Los usuarios deben registrarse y autenticarse para obtener un token de acceso, que se debe incluir en cada solicitud protegida.

---

## Registro de Usuarios

### **Endpoint:** \`/register\`
- **Método:** \`POST\`
- **Descripción:** Registra un nuevo usuario en la base de datos.
- **Body JSON esperado:**
  ``` json
  {
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "1234567890",
    "contraseña": "password_seguro"
  }
  ```
- **Respuesta exitosa (201 Created):**
  ``` json
  {
    "mensaje": "Usuario registrado exitosamente"
  }
  ```
- **Errores posibles:**
  - 400 Bad Request: Datos inválidos o incompletos.
  - 409 Conflict: El correo ya está registrado.

---

## Inicio de Sesión

### **Endpoint:** \`/login\`
- **Método:** \`POST\`
- **Descripción:** Permite a los usuarios autenticarse en el sistema y obtener un token JWT.
- **Body JSON esperado:**
  ``` json
  {
    "correo": "juan@example.com",
    "contraseña": "password_seguro"
  }
  ```
- **Respuesta exitosa (200 OK):**
  ``` json
  {
    "token": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Errores posibles:**
  - 401 Unauthorized: Credenciales incorrectas.
  - 400 Bad Request: Datos incompletos.

---

## Uso del Token para Acceder a Rutas Protegidas

Los endpoints protegidos requieren incluir el token en el encabezado **Authorization** de la solicitud:

```
Authorization: Bearer <token>
```

### **Ejemplo de uso con cURL**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1..." -X GET http://localhost:8080/protected
```

Si el token es válido, el servidor responderá con:

``` json
{
  "mensaje": "Acceso concedido"
}
```

Si el token es inválido o está ausente:

``` json
{
  "error": "Acceso denegado. Token no válido"
}
```

---

## Cierre de Sesión

El cierre de sesión se puede manejar en el frontend eliminando el token almacenado.

---

## Consideraciones de Seguridad

- **Almacenar el token en memoria o en HTTPOnly Cookies.**  
- **Implementar expiración y renovación de tokens.**  
- **Usar HTTPS para cifrar las comunicaciones.**  


