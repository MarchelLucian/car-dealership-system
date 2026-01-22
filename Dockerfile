FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY dealerauto ./dealerauto
RUN mvn clean install -DskipTests -f dealerauto/pom.xml

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/dealerauto/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
