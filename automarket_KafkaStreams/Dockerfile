# Etapa 1: Construcción
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final
FROM openjdk:17-jdk-slim
WORKDIR /app

# Instala netcat-openbsd para usar wait-for-it.sh
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copiar wait-for-it.sh y hacerlo ejecutable
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copiar el JAR compilado
COPY --from=builder /build/target/automarket-KafkaStreams-1.0.0-jar-with-dependencies.jar app.jar

EXPOSE 9000

# Usamos wait-for-it.sh para esperar a Kafka
ENTRYPOINT ["/wait-for-it.sh", "kafka", "29092", "--", "java", "-jar", "app.jar", "--server.port=9000"]
