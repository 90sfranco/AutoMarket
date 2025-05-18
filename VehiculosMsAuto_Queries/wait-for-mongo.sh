#!/bin/sh

echo "Esperando a MongoDB en $DB_HOST..."

# Extraer host y puerto de la variable DB_HOST
MONGO_HOST=$(echo "$DB_HOST" | sed -E 's/^mongodb:\/\/([^:]+):([0-9]+).*$/\1/')
MONGO_PORT=$(echo "$DB_HOST" | sed -E 's/^mongodb:\/\/([^:]+):([0-9]+).*$/\2/')

# Esperar hasta que esté disponible
until nc -z "$MONGO_HOST" "$MONGO_PORT"; do
  echo "MongoDB aún no disponible en $MONGO_HOST:$MONGO_PORT. Esperando..."
  sleep 10
done

echo "MongoDB está disponible. Iniciando microservicio..."

# Ejecutar la app
exec node src/index.js  # O el archivo principal de tu app
