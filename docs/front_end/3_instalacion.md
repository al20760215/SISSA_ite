---
sidebar_position: 3
---

# Instalación

Guía paso a paso sobre cómo instalar y ejecutar el proyecto.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

1. **Node.js y npm**  
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado. El instalador de Node.js incluye npm (Node Package Manager), que es necesario para manejar las dependencias de JavaScript.

   - **Comprobación**: Ejecuta los siguientes comandos en tu terminal para verificar si tienes Node.js y npm instalados:
   
     ```bash
     node -v
     npm -v
     ```

2. **Git**  
   Se necesita **Git** para clonar el repositorio. Si no tienes Git, puedes descargarlo desde [aquí](https://git-scm.com/).

   - **Comprobación**: Verifica si tienes Git ejecutando el siguiente comando:

     ```bash
     git --version
     ```

3. **Editor de código**  
   Recomendamos usar un editor de código como [VSCode](https://code.visualstudio.com/) para una mejor experiencia de desarrollo.

## Pasos de Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina:

### Clonar el Repositorio

Clona el repositorio del proyecto en tu máquina local usando Git:

```
git clone <https://github.com/al20760215/SISSA_ite/tree/main>
```

### Accede a la carpeta del proyecto:
```
cd <SISSA>
```

### Instalar las Dependencias

Una vez dentro del proyecto, instala todas las dependencias necesarias usando npm:

**npm install**

Este comando descargará e instalará todas las dependencias definidas en el archivo package.json.

### Configuración de Variables de Entorno

En algunos casos, es posible que necesites configurar variables de entorno específicas para que el proyecto funcione correctamente. Crea un archivo .env en la raíz del proyecto si no existe, y agrega las variables necesarias. Un ejemplo de un archivo .env podría ser:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Iniciar el Servidor de Desarrollo

Una vez que las dependencias estén instaladas, puedes iniciar el servidor de desarrollo utilizando el siguiente comando:

**npm start**

Este comando ejecutará el proyecto en modo de desarrollo, y podrás acceder a la aplicación en tu navegador en la siguiente URL:
```
http://localhost:3000
```

### Compilar para Producción

Si deseas compilar el proyecto para producción, utiliza el siguiente comando:

**npm run build**

Esto creará una versión optimizada de la aplicación lista para ser desplegada en un servidor.
Solución de Problemas

Si encuentras algún error durante la instalación, aquí tienes algunos pasos comunes para solucionarlos:

    Problemas de dependencias: Si tienes problemas con las dependencias, intenta eliminarlas y reinstalarlas:

**rm -rf node_modules**\
**npm install**

Errores de configuración de entorno: Asegúrate de que el archivo .env esté correctamente configurado con las variables necesarias.

Puerto ocupado: Si el puerto 3000 está ocupado por otra aplicación, puedes cambiar el puerto en el archivo package.json o en el archivo .env.