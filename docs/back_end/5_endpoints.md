---
sidebar_position: 5
---


# Endpoints de la API

---

## Autenticación

### **Registro de usuario**
- **URL:** \`/register\`
- **Método:** \`POST\`
- **Descripción:** Registra un nuevo usuario en el sistema.
- **Body JSON ejemplo:**
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

### **Inicio de sesión**
- **URL:** \`/login\`
- **Método:** \`POST\`
- **Descripción:** Permite a los usuarios autenticarse en el sistema.
- **Body JSON ejemplo:**
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

### **Ruta protegida (requiere autenticación)**
- **URL:** \`/protected\`
- **Método:** \`GET\`
- **Descripción:** Solo accesible con un token válido.
- **Encabezados requeridos:**
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta exitosa (200 OK):**
  ``` json
  {
    "mensaje": "Acceso concedido"
  }
  ```

---

## 2. Gestión de Usuarios

### **Obtener todos los usuarios**
- **URL:** \`/users\`
- **Método:** \`GET\`
- **Descripción:** Obtiene la lista de usuarios registrados.
- **Respuesta exitosa (200 OK):**
  ``` json
  [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "telefono": "1234567890"
    }
  ]
  ```

### **Agregar un nuevo usuario**
- **URL:** \`/addusers\`
- **Método:** \`POST\`
- **Descripción:** Agrega un usuario al sistema.
- **Body JSON ejemplo:**
  ``` json
  {
    "nombre": "Ana Gómez",
    "correo": "ana@example.com",
    "telefono": "0987654321",
    "contraseña": "otro_password"
  }
  ```
- **Respuesta exitosa (201 Created):**
  ``` json
  {
    "mensaje": "Usuario agregado exitosamente"
  }
  ```

---

## Gestión de Estudiantes

### **Obtener lista de estudiantes**
- **URL:** \`/students\`
- **Método:** \`GET\`
- **Descripción:** Retorna la lista de estudiantes registrados en el sistema.
- **Respuesta exitosa (200 OK):**
  ``` json
  [
    {
      "id": 1,
      "nombre": "Pedro López",
      "matricula": "2023001234"
    }
  ]
  ```

---

## Gestión de Empresas y Programas

### **Obtener organizaciones**
- **URL:** \`/organizations\`
- **Método:** \`GET\`
- **Descripción:** Obtiene la lista de organizaciones asociadas al sistema.

### **Obtener programas de servicio social**
- **URL:** \`/programs\`
- **Método:** \`GET\`
- **Descripción:** Lista los programas disponibles para los estudiantes.

---

## Administración de Personal

### **Obtener supervisores**
- **URL:** \`/supervisors\`
- **Método:** \`GET\`

### **Obtener administradores**
- **URL:** \`/managers\`
- **Método:** \`GET\`

### **Obtener docentes**
- **URL:** \`/teachers\`
- **Método:** \`GET\`

### **Obtener tutores**
- **URL:** \`/tutors\`
- **Método:** \`GET\`

---

## Gestión de Historial y Créditos

### **Historial de programas**
- **URL:** \`/program-history\`
- **Método:** \`GET\`
- **Descripción:** Obtiene el historial de programas de los estudiantes.

### **Historial de créditos**
- **URL:** \`/credit-history\`
- **Método:** \`GET\`
- **Descripción:** Obtiene el historial de créditos obtenidos.

---

## Información Académica

### **Obtener bimestres**
- **URL:** \`/bimesters\`
- **Método:** \`GET\`
- **Descripción:** Lista los bimestres del ciclo escolar.

---

## Autenticación y Seguridad

Todos los endpoints protegidos requieren autenticación con un token JWT en los encabezados:

```
Authorization: Bearer <token>
```

Si el token es inválido o está ausente, se responderá con:

``` json
{
  "error": "Acceso denegado. Token no válido"
}
```

---

