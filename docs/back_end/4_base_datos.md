---
sidebar_position: 4
---

# Base de Datos

Se detalla la configuración, las tablas principales, las relaciones y los scripts de inicialización.

---

## Configuración de la Base de Datos

El backend utiliza **PostgreSQL** como sistema de gestión de bases de datos. La base de datos se ejecuta dentro de un contenedor Docker, definido en el archivo \`docker-compose.yml\`:

``` yaml
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

### **Credenciales por defecto**
- **Usuario:** \`postgres\`
- **Contraseña:** \`password\`
- **Base de datos:** \`sissa_postgres_db\`

Para modificar estas credenciales, edita las variables en \`docker-compose.yml\` antes de levantar los contenedores.

---

## Estructura de la Base de Datos

La base de datos está diseñada para gestionar el sistema con varias entidades principales.

### **Tablas Principales**

#### **Usuarios**
Guarda la información de los usuarios del sistema.

``` sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    contraseña TEXT NOT NULL
);
``` 

#### **Empresas**
Registra las empresas con las que se tiene relación.

``` sql
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(15)
);
``` 

#### **Reportes**
Almacena los reportes enviados por los usuarios.

``` sql
CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    empresa_id INT REFERENCES empresas(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archivo TEXT NOT NULL
);
``` 

#### **Administradores**
Registra los administradores del sistema.

``` sql
CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    rol VARCHAR(50) NOT NULL
);
``` 

---

## Relaciones entre Tablas

- **Usuarios - Reportes**: Un usuario puede enviar múltiples reportes.
- **Empresas - Reportes**: Cada reporte está asociado a una empresa.
- **Usuarios - Administradores**: Un usuario puede tener un rol administrativo.

### **Diagrama Relacional**

``` plaintext
Usuarios (id) ───< Reportes (usuario_id)
Empresas (id) ───< Reportes (empresa_id)
Usuarios (id) ─── Administradores (usuario_id)
``` 

---

## Inicialización de la Base de Datos

Los scripts de creación de la base de datos se encuentran en la carpeta \`scripts/\`. Se ejecutan automáticamente al levantar el contenedor.

Para ejecutar los scripts manualmente dentro del contenedor de PostgreSQL:

``` bash
docker exec -it sissa-postgres psql -U postgres -d sissa_postgres_db -f /docker-entrypoint-initdb.d/init.sql
``` 

---

## Comandos Útiles para la Base de Datos

### **Acceder a la base de datos dentro del contenedor**
``` bash
docker exec -it sissa-postgres psql -U postgres -d sissa_postgres_db
``` 

### **Ver las tablas creadas**
``` sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
``` 

### **Ver los datos de una tabla**
``` sql
SELECT * FROM usuarios;
``` 

### **Crear un nuevo usuario desde la terminal**
``` sql
INSERT INTO usuarios (nombre, correo, telefono, contraseña) VALUES ('Juan Pérez', 'juan@example.com', '1234567890', 'password_hash');
``` 

---

## Respaldo y Restauración de la Base de Datos

### **Generar un respaldo**
``` bash
docker exec -t sissa-postgres pg_dump -U postgres -d sissa_postgres_db > backup.sql
``` 

### **Restaurar un respaldo**
``` bash
docker exec -i sissa-postgres psql -U postgres -d sissa_postgres_db < backup.sql
``` 

---

