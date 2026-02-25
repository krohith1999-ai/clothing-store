# Build stage: Java 17 + Maven (no Java in Render's native env, so we use Docker)
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline -DskipTests

COPY src src
RUN mvn -B package -DskipTests

# Run stage: slim JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/clothing-store-api-1.0.0.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
