FROM node:22-alpine

WORKDIR /app

# Instalar liberías necesarias para Prisma en Alpine Linux
RUN apk add --no-cache openssl

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el esquema de Prisma y generar el cliente (antes de copiar todo para aprovechar caché de Docker)
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar todo el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Añadir script para correr migraciones y rellenar seed antes del inicio
CMD ["sh", "-c", "npx prisma migrate deploy && node seed.js && node src/index.js"]
