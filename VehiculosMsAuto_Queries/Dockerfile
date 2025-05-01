FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV DB_HOST=mongodb://vehiculos-queries-db:27017 \
    DB_NAME=vehiculosdbauto_read \
    PORT=4005
EXPOSE 4005
CMD ["node", "src/index.js"]