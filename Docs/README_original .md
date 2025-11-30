# Apple Music Case Study
**Universidad Da Vinci de Guatemala** **Curso:** Desarrollo Web / Bases de Datos II  
**Catedrático:** Ing. Brandon Chitay

---

## 🎯 Objetivo
Este repositorio contiene el **Kit de Inicio (Starter Kit)**. Su misión es actuar como arquitectos de datos para diseñar la infraestructura, persistencia y API de la nueva plataforma de analíticas de Apple Music.

El script incluido (`seed.js`) generará **miles de registros simulados** (Usuarios, Canciones, Artistas y Streams) para que puedan probar sus consultas en un entorno realista.

---

## 🚀 Instrucciones de Inicio (Setup)

Sigue estos pasos estrictamente para configurar tu entorno de examen.

### 1. Preparar el Repositorio
Este repositorio es la base de tu entrega. No lo clones directamente, primero haz tu propia copia:

1.  Da clic en el botón **Fork** (arriba a la derecha de esta página) para crear una copia en tu cuenta de GitHub.
2.  Clona **tu nuevo repositorio** (el que está en tu perfil) a tu máquina local:
    ```bash
    git clone [https://github.com/TU_USUARIO/seeding.git](https://github.com/TU_USUARIO/seeding.git)
    cd seeding
    ```

### 2. Instalar Dependencias del Seeder
El script de generación de datos utiliza Node.js. Instala las librerías necesarias:
```bash
npm install
````

### 3\. Levantar Infraestructura (Docker)

Antes de generar los datos, necesitas una base de datos corriendo.

  * Crea tu archivo `docker-compose.yml` (ver sección de Entregables abajo).
  * Levanta el servicio:
    ```bash
    docker-compose up -d
    ```
  * **Importante:** Asegúrate de que MongoDB esté expuesto en el puerto `27017`.

### 4\. Poblar la Base de Datos (Seeding)

Una vez que Mongo esté corriendo, ejecuta el script mágico para llenar la DB con data de prueba:

```bash
npm start
```

*Si ves el mensaje "✅ EXITO: Base de datos poblada", estás listo para empezar.*

-----

## 📂 Estructura de Entrega (Requerido)

Para mantener el orden, debes crear las siguientes carpetas en este repositorio y colocar tus archivos donde corresponde. **El desorden será penalizado.**

```text
/
├── api-design/
│   └── api-spec.md         # Documentación de los 5 Endpoints (Request/Response)
├── database/
│   ├── docker-compose.yml  # Tu configuración de Docker
│   ├── queries.js          # Tus 5 Agregaciones (Aggregation Pipelines)
│   └── schema-diagram.pdf  # Imagen o PDF de tu diseño de esquema
├── dashboard-v0/
│   ├── screenshots/        # Capturas del dashboard generado en v0
│   └── prompt.txt          # El prompt que usaste para generar la UI
├── seed.js                 # (Ya incluido)
├── package.json            # (Ya incluido)
└── README.md               # (Este archivo)
```

-----

## 📝 Lista de Tareas (Checklist)

Para ganar los 100 puntos, asegúrate de completar:

  - [ ] **Infraestructura:** Docker corre correctamente y tiene persistencia de datos (Volumes).
  - [ ] **Datos:** El script `npm start` corre sin errores y genera usuarios "Zombis" y datos de Guatemala.
  - [ ] **Consultas:** El archivo `database/queries.js` contiene las 5 agregaciones solicitadas en el enunciado
  - [ ] **API:** El diseño de los endpoints en `api-design/` coincide lógicamente con lo que muestra el Dashboard.
  - [ ] **Visualización:** Las capturas en `dashboard-v0/` muestran una interfaz coherente con los datos.
  - [ ] **Video:** Has subido tu video explicativo (link en la entrega del portal o en este README al final).

-----

## ⚠️ Solución de Problemas (Troubleshooting)

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**

  * **Causa:** Tu contenedor de Docker no está corriendo o no mapeaste el puerto.
  * **Solución:** Revisa tu `docker-compose.yml` y asegúrate de tener `ports: - "27017:27017"`.

**Error: "Cannot find module..."**

  * **Causa:** No instalaste las librerías.
  * **Solución:** Ejecuta `npm install` en la raíz del proyecto.

-----

### 📅 Fecha Límite: 06 de Diciembre

¡Éxito, Ingenieros\! 🍏🎵

```

***

### ¿Por qué funciona este README?

1.  **Reduce la fricción cognitiva:** Les dice exactamente qué comando ejecutar (`npm install`, `npm start`).
2.  **Estandariza la entrega:** La sección "Estructura de Entrega" te salvará horas de calificación. Ya no tendrás que buscar dónde puso cada alumno el `docker-compose`.
3.  **Checklist:** Les da seguridad psicológica de que "ya terminaron" si marcaron todas las casillas.
4.  **Troubleshooting:** Previene que te escriban correos preguntando por errores básicos de conexión a Mongo.
```
