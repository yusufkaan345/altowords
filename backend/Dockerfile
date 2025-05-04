FROM openjdk:19-jdk-alpine3.16
COPY target/bacakend-0.0.1-SNAPSHOT.jar app-1.0.0.jar
COPY alto-word-ai-firebase-adminsdk.json /app/alto-word-ai-firebase-adminsdk.json
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app-1.0.0.jar"]