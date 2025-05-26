# Etapa 1: Construcción
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /build/target/automarket-KafkaStreams-1.0.0-jar-with-dependencies.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=9000"]


