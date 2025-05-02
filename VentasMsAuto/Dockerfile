FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV DB_HOST=ventas-db \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=VentasDBAuto \
    PORT=4004
EXPOSE 4004
CMD ["node", "src/index.js"]