# Usa la imagen oficial de PostgreSQL
FROM postgres:latest

# Variables de entorno para configurar PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=Angie2019
ENV POSTGRES_DB=baseservicio

# Copiar el archivo SQL al contenedor
COPY baseservicio.sql /docker-entrypoint-initdb.d/


# Exponer el puerto 5432 para PostgreSQL
EXPOSE 5432
