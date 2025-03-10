---
sidebar_position: 0
---

# Monitorización del Sistema

## **Introducción**  
Para garantizar la estabilidad y el rendimiento del **Sistema de Gestión de Servicio Social**, se ha implementado un sistema de **monitorización** basado en **Grafana + Icinga**.  

Este sistema permite:  
✅ **Supervisar el estado de los contenedores Docker** (CPU, RAM, uso de disco).  
✅ **Detectar fallos en tiempo real** y recibir alertas.  
✅ **Visualizar métricas y logs** del frontend, backend y base de datos.  
✅ **Analizar el rendimiento** del sistema con gráficos detallados.  

---

## **Tecnologías Utilizadas**  
La infraestructura de monitorización está compuesta por los siguientes componentes:  

### **Grafana**  
> Plataforma de visualización de datos utilizada para generar gráficos y paneles interactivos.  
-  **Visualización en tiempo real** de métricas del sistema.  
-  **Integración con Prometheus, InfluxDB y otras fuentes de datos**.  
-  **Configuración de alertas** cuando se detectan problemas en el sistema.  

### **Icinga**  
> Sistema de monitorización que revisa el estado de los contenedores Docker y la base de datos.  
- **Supervisión en tiempo real** de los servicios.  
- **Notificaciones automáticas** en caso de fallos.  
- **Monitoreo de red y disponibilidad del backend y frontend**.  

### **Prometheus** (opcional)  
> Base de datos de series temporales utilizada para almacenar métricas.  

---

## **Estructura del Sistema de Monitorización**  
La monitorización se realiza dentro de **contenedores Docker**, facilitando su implementación y escalabilidad.  

📂 **monitoring** (Carpeta del sistema de monitoreo)  
```bash
📂 monitoring
 ├── 📂 grafana     # Configuración y dashboards de Grafana
 ├── 📂 icinga      # Configuración de Icinga2
 ├── 📂 prometheus  # Configuración de Prometheus (opcional)
 ├── Dockerfile     # Imagen personalizada para Grafana + Icinga
 ├── docker-compose.yml  # Orquestación de los servicios
