# Usar una imagen base con Node.js
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios al contenedor
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del proyecto al contenedor
COPY . .

# Compilar la aplicación estática de Docusaurus
RUN npm run build

# Usar un servidor para servir archivos estáticos
RUN npm install -g serve

# Exponer el puerto 3000
EXPOSE 3000

# Comando para servir la documentación
CMD ["serve", "-s", "build", "-l", "3000"]
