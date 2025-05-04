package com.read.config;


import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;



@Configuration
public class FirebaseConfig {
    
    @PostConstruct
    public void initializeFirebase() {
         String credentialsPath =  System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
         if (credentialsPath == null || credentialsPath.isEmpty()) {
            throw new RuntimeException("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set");
        }
        try {
            FileInputStream serviceAccount =
                    new FileInputStream(credentialsPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            throw new RuntimeException("Firebase initialization failed", e);
        }
    }
}
