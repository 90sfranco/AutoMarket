FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV DB_HOST=mongodb://mongo:27017 \
    DB_NAME=VehiculosDBAuto_Read \
    PORT=4005
EXPOSE 4005
CMD ["node", "src/index.js"]