# Seguridad y Autenticación con JWT (JSON Web Tokens)
### Instalacion de Flask-JWT-Extended en el proyecto.
Se agrega al comando de instalacion en el Dockerfile, se importa y configura en main.py:
![imagen](https://github.com/user-attachments/assets/3a4be144-30a1-420c-9da3-08459b489a0b)
![imagen](https://github.com/user-attachments/assets/0359395e-2d32-4399-8d1a-7140c132cb30)

### Registro de usuarios (POST /register) y ruta de autenticación (POST /login).
/register:
![imagen](https://github.com/user-attachments/assets/a338ef37-12e6-481f-afc1-05884f1104a0)

/login (devuelve un JWT si las credenciales son válidas):
![imagen](https://github.com/user-attachments/assets/4ddf18f8-b068-4f86-ad6b-6694dfc39aee)

### Proteger rutas mediante decoradores de JWT (@jwt_required).
![imagen](https://github.com/user-attachments/assets/cfee299d-3b59-4450-8edd-09eabffe706d)

### Configurar la expiración de los tokens JWT
Manejo de tokens caducados.
![imagen](https://github.com/user-attachments/assets/a3cf30f4-fd38-4482-8a2b-60f069f9ee51)

### Implementar una ruta para la renovación de tokens (POST /refresh).
![imagen](https://github.com/user-attachments/assets/5820c727-afa1-45ab-aaaa-2cc4da20353a)

## Resultados
Se realizaron las pruebas con Postman:
### Crear un usuario en POST /register
![imagen](https://github.com/user-attachments/assets/b95bea77-d669-4a9d-8eb8-96210bc0cbf7)


### Iniciar sesion en POST /login y obtener el JWT.
![imagen](https://github.com/user-attachments/assets/891c5dd0-fa02-4f23-b822-798197e58149)

### Probar acceso usando el token en GET /protected.
Se usa el token obtenido, en el header Authorization con el contenido: Bearer token_generado
![imagen](https://github.com/user-attachments/assets/a149780c-214b-467d-be2e-ab57aa779329)

### Hacer logout para invalidar el token en POST /logout
![imagen](https://github.com/user-attachments/assets/93447e4e-3d33-4b2b-acb8-3cfbaf73f24b)

### Verificar que el token es inválido en POST /protected después del logout.
![imagen](https://github.com/user-attachments/assets/1035e804-0e89-4414-b0ed-8193664d9e21)

### Finalmente si intentamos realizar cualquier accion con un token expirado obtenemos el mensaje de error esperado.
![imagen](https://github.com/user-attachments/assets/0f6a5cfb-b175-4041-8dc4-c8217939f997)
Con esto confirmamos que el flujo de autenticación y logout funciona correctamente en la aplicación.
