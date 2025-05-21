FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

COPY wait-for-mongo.sh .

RUN chmod +x wait-for-mongo.sh \
    && sed -i 's/\r$//' wait-for-mongo.sh 

ENV DB_HOST=mongodb://vehiculos-queries-db:27017 \
    DB_NAME=vehiculosdbauto_read \
    PORT=4005

ENTRYPOINT ["./wait-for-mongo.sh"]
