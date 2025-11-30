# Apple Music Analytics – Arquitectura de Datos y Business Intelligence
### Proyecto Final Parcial – Bases de Datos 2
**Consultores de Arquitectura de Datos | MongoDB + Docker + Node.js + BI**
**https://youtu.be/gnf81Kg4xyw**

---
## n 1. Descripción del Proyecto
Este proyecto implementa una solución de Business Intelligence en tiempo real para métricas de
streaming musical estilo Apple Music, usando MongoDB, Docker, Node.js y un Dashboard generado
con IA.
---
## n 2. Objetivo General
Diseñar una arquitectura escalable para:
- Poblar datos masivos.
- Procesar métricas críticas mediante Aggregation Pipelines.
- Exponer información vía API REST.
- Visualizar insights en Dashboard UI.
---
## n 3. Arquitectura General
Sistema basado en MongoDB, Node.js, Docker y UI v0.dev para visualizar KPIs.
---
## n 4. Tecnologías Utilizadas
- MongoDB 7
- Docker Compose
- Node.js / Express
- v0.dev Dashboard
- Aggregation Pipelines
---
## n 5. Instalación y Configuración
### 1) Clonar:
`git clone `
### 2) Docker:
`docker compose up -d`
### 3) Instalar dependencias:
`npm install`
### 4) Poblar datos:
`npm run seed`
### 5) Iniciar API:
`npm start`
---
## n 6. Estructura del Proyecto
Incluye carpetas: api, aggregations, Dashboard, Docs, mongo_data y archivos seed.js y
docker-compose.yml.
---
## n 7. API REST (Resumen)
- `/api/royalties?days=30`
- `/api/top-songs?country=GT&days;=7`
- `/api/zombies?days=30`
- `/api/demografia/reggaeton`
- `/api/heavy-users/badbunny?limit=5`
---
## n 8. Pipelines Implementados
5 pipelines para regalías, top songs, zombies, demografía y heavy users.
---
## n 9. Dashboard
Dashboard tipo Apple Music Admin generado con v0.dev.
---
## n 10. Video
https://youtu.be/gnf81Kg4xyw
Duración: 7 minutos. Incluye arquitectura, API, pipelines y dashboard.
---
## n 11. Consideraciones Técnicas
Denormalización estratégica, pipelines avanzados y API escalable.
---
## n 12. Autor
**Hugo Breganza 202301727 – Consultor de Arquitectura de Datos**
