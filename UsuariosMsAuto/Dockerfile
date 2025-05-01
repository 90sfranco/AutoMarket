FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV DB_HOST=usuarios-db \  
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=UsuariosDBAuto \
    PORT=4001  
EXPOSE 4001
CMD ["node", "src/index.js"]