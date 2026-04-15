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

# Exponer el puerto
EXPOSE 3000

# Añadir script para hacer schema push en Drizzle de forma forzada y rellenar auth base
CMD ["sh", "-c", "npx drizzle-kit push --force && node seed.js && node src/index.js"]
