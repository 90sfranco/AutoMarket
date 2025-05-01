# Multi-stage build para producción
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY src ./src

# Build final
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Usuario no root
USER node

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4006

# Exponer puerto
EXPOSE 4006

# Comando de inicio
CMD ["node", "src/index.js"]