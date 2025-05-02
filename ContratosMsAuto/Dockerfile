FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV DB_HOST=contratos-db \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=ContratosDBAuto \
    PORT=4003
EXPOSE 4003
CMD ["node", "src/index.js"]