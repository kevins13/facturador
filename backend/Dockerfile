FROM node:22-alpine

WORKDIR /app

# Instalar liberías necesarias para Prisma en Alpine Linux
RUN apk add --no-cache openssl

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Drizzle Kit usa la variable de entorno y los esquemas para hacer push automáticos
RUN npm run build --if-present

# Añadir script para hacer migraciones nativas de NodeJS, sincronización segura y rellenar auth base
CMD ["sh", "-c", "node migrate.js; node seed.js; node src/index.js"]
