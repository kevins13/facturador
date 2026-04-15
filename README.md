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

---

## 🌐 Deploy en Railway

### Estrategia recomendada: Dos Servicios

Deberás crear dos servicios conectados al mismo repositorio en Railway, especificando **Directorios Raíz (Root Directory)** distintos para cada uno.

#### Servicio 1: Backend (Base de datos Node y Postgres)
1. En Railway, crea un Plugin de PostgreSQL.
2. Crea un nuevo servicio (Node) conectado a la carpeta `/backend` usando la opción `Root Directory: /backend`.
3. Establece Variables de Entorno en Railway:
   - `DATABASE_URL`: Asigna la URL del plugin de base de datos (`${{Postgres.DATABASE_URL}}` usando la variable reference de Railway).
   - `JWT_SECRET`: Ingresa una cadena segura al azar.
4. El script `start` en el package.json iniciará correctamente el servidor (`node src/index.js`).
5. **Comanado Build (Opcional):** Si quieres ejecutar DB scripts, puedes colocar `npx prisma migrate deploy` en el Build Command.

#### Servicio 2: Frontend (Vite Static Build)
1. Crea otro servicio usando el mismo repositorio pero el Root Directory será `/frontend`.
2. Establece Variable de Entorno en Railway:
   - `VITE_API_URL`: La URL pública de tu servicio Backend (ej. `https://tuhostbackend.up.railway.app/api`).
3. Comandos estándar de Railway para Nixpacks:
   - Build command: `npm run build`
   - Start command (automático para frontend usando serv o el integrado de Railway).

---

## Tecnologías Utilizadas

- **Frontend**: React 18, Vite, React Router Dom, TailwindCSS, Axios, React-Hook-Form, Lucide-react.
- **Backend**: Node.js, Express, Prisma ORM, PDFKit, JWT (JSON Web Tokens), Bcryptjs.
- **Base de Datos**: PostgreSQL compatible.

Desarrollado para gestionar finanzas y clientes rápidamente bajo requerimientos fullstack minimalistas pero escalables.
