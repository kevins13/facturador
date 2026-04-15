# Sistema de Facturación AuraLink

Un sistema web completo (fullstack) para gestionar clientes y emitir facturas, construido con Node.js, Express, React, TailwindCSS, PostgreSQL y Prisma, diseñado de cero para ser desplegado eficientemente en Railway.

## Estructura del Proyecto

- `/backend`: Servidor de Node.js con Express, Prisma ORM y PostgreSQL.
- `/frontend`: Aplicación cliente en React (construida con Vite).

---

## 🚀 Instalación Local

### Requisitos previos
- Node.js v18 o superior.
- PostgreSQL en tu base de datos local (o usa un servicio alojado como Supabase/Neon temporalmente).

### 1. Configuración del Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales de PostgreSQL en DATABASE_URL

# Iniciar la base de datos y Prisma
npx prisma migrate dev --name init

# Ejecutar el seed para crear el administrador
node seed.js
# Admin provisto -> Email: admin@auralink.com | Password: admin

# Iniciar servidor en modo dev (en http://localhost:3000)
npm run dev
```

### 2. Configuración del Frontend
```bash
cd frontend
npm install

# Iniciar aplicación React (en http://localhost:5173 por defecto)
npm run dev
```

### 3. Opción: Docker Compose (Para entorno de desarrollo)
Si dispones de Docker instalado, puedes iniciar todo el ecosistema (PostgreSQL, Backend y Frontend) con un solo comando:
```bash
docker-compose up --build -d
```
Esto pondrá el sistema en marcha asegurando los siguientes **puertos locales**:
- **Backend API:** Expuesto en el puerto `3000` (http://localhost:3000)
- **Frontend App:** Expuesto en el puerto `5173` (http://localhost:5173)
- **Base de Datos:** Expuesto en el puerto `5432`

---

## 🌐 Deploy en Railway (Zero-Config con Dockerfiles)

Gracias a la inclusión de los `Dockerfile`, el despliegue a Railway es totalmente automatizado y directo. Solo necesitas separar la aplicación conectando el repositorio a dos servicios distintos (*Microservicios*).

#### Servicio 1: Backend (Base de datos Node y Postgres)
1. En Railway, crea un Plugin de PostgreSQL.
2. Crea un nuevo servicio desde GitHub conectado al ROOT Directory de `/backend`.
3. Establece las Variables de Entorno en Railway:
   - `DATABASE_URL`: Asigna la URL del plugin de base de datos (`${{Postgres.DATABASE_URL}}`).
   - `JWT_SECRET`: Ingresa una cadena segura al azar.
4. **Listo.** Railway detectará tu `backend/Dockerfile`. Compilará mágicamente el sistema y aplicará `npx prisma migrate deploy` antes de encender un puerto en modo backend automáticamente.

#### Servicio 2: Frontend (Vite App)
1. Crea otro servicio usando el mismo repositorio pero el Root Directory será `/frontend`.
2. Establece la variable de entorno en Railway:
   - `VITE_API_URL`: Pasa el dominio público generado de tu servicio Backend (ej. `https://micodigobackend.up.railway.app/api`).
3. **Listo.** Railway leerá tu `frontend/Dockerfile` y abrirá dinámicamente un puerto nativo sirviendo tu Frontend ya optimizado para producción de la forma más veloz posible.

---

## Tecnologías Utilizadas

- **Frontend**: React 18, Vite, React Router Dom, TailwindCSS, Axios, React-Hook-Form, Lucide-react.
- **Backend**: Node.js, Express, Prisma ORM, PDFKit, JWT (JSON Web Tokens), Bcryptjs.
- **Base de Datos**: PostgreSQL compatible.

Desarrollado para gestionar finanzas y clientes rápidamente bajo requerimientos fullstack minimalistas pero escalables.
