---
sidebar_position: 0
---

# Sistema Integral de Servicio Social Albatros

## **Introducción**  
El **Sistema Integral de Servicio Social Albatros** es una aplicación web diseñada para facilitar la administración del servicio social en el **Instituto Tecnológico de Ensenada**. El sistema permite a los alumnos registrarse, postularse a programas de servicio social, enviar reportes y generar certificados, mientras que las empresas y la administración pueden gestionar y aprobar solicitudes.

Este sistema está desarrollado bajo una arquitectura **cliente-servidor**, utilizando tecnologías modernas para garantizar un rendimiento óptimo, escalabilidad y facilidad de mantenimiento.  

---

## **Objetivo**  
El objetivo principal del sistema es **automatizar y centralizar** el proceso de gestión del servicio social, reduciendo la carga administrativa y proporcionando una plataforma accesible para estudiantes, empresas y administradores.  

Entre sus funciones principales, el sistema permite:  
✅ Registro y autenticación de usuarios (estudiantes, empresas, administradores).  
✅ Administración de programas de servicio social y postulaciones.  
✅ Envío y revisión de reportes de servicio social.  
✅ Generación de oficions digitales tras la aprobación de los reportes.  
✅ Panel de administración para gestionar usuarios, empresas y reportes.  

---

## **Tecnologías Utilizadas**  

El sistema está basado en una arquitectura **Dockerizada** y está compuesto por los siguientes módulos:  

### **Frontend** (Interfaz de usuario)  
> Desarrollado con **React + Vite**, proporcionando una experiencia rápida e interactiva para los usuarios.  

- **React** → Biblioteca de JavaScript para interfaces dinámicas.  
- **Vite** → Herramienta de desarrollo optimizada para React.  
- **Tailwind CSS** → Framework de estilos para diseño responsivo.  
- **React Router** → Gestión de rutas dentro de la aplicación.  

### **Backend** (API y lógica de negocio)  
> Implementado con **Flask (Python)**, ofreciendo una API RESTful para manejar usuarios, reportes y empresas.  

- **Flask** → Framework ligero de Python para APIs.  
- **SQLAlchemy** → ORM para interactuar con la base de datos.  
- **PostgreSQL** → Base de datos relacional para almacenamiento de datos.  
- **JWT (JSON Web Tokens)** → Autenticación y seguridad de usuarios.  

### **Base de Datos**  
- **PostgreSQL** → Manejo eficiente de datos relacionales.  

### **Infraestructura y Despliegue**  
> Todo el sistema está **dockerizado**, lo que permite una implementación sencilla y replicable.  

- **Docker** → Contenedores para frontend, backend y base de datos.  
- **Nginx** → Servidor proxy para gestionar las peticiones del frontend y backend.  
- **Grafana + Icinga** → Monitorización del sistema y rendimiento.  
- **Docusaurus** → Documentación del proyecto.  

---

## **Estructura del Proyecto**  
A continuación, se muestra la estructura general del sistema dentro del entorno Docker:  

```
📂 sistema-servicio-social
 ├── 📂 frontend      # React + Vite
 ├── 📂 backend       # Flask + PostgreSQL
 ├── 📂 database      # Scripts SQL y migraciones
 ├── 📂 monitoring    # Grafana + Icinga para monitoreo
 ├── 📂 docs          # Documentación con Docusaurus
 ├── Dockerfile       # Configuración de Docker
 ├── docker-compose.yml  # Orquestación de contenedores

```

## Flujo de Trabajo
1️⃣ Usuarios y Roles

El sistema maneja distintos tipos de usuarios, cada uno con permisos específicos:

    * Estudiantes → Se registran, eligen programas y envían reportes.
    * Empresas → Publican programas y validan reportes de alumnos.
    * Administradores → Gestionan usuarios, empresas y revisan reportes.

2️⃣ Proceso General

* Registro/Login → Los usuarios acceden con credenciales o se registran.
* Selección de Programa → Los estudiantes eligen un programa de servicio social
* Envío de Reportes → Los estudiantes suben reportes periódicos.
* Revisión y Aprobación → Las empresas y administradores validan los reportes.
* Generación de Certificados → Si se cumplen los requisitos, se genera un certificado digital.

