FROM node:20

WORKDIR /app

COPY discord-proxy.js .

RUN npm install express axios

ENV PORT=9600
EXPOSE 9600

CMD ["node", "discord-proxy.js"]
