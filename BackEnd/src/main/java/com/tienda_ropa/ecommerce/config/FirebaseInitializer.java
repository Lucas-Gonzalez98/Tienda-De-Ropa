package com.tienda_ropa.ecommerce.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Component
public class FirebaseInitializer {

    @PostConstruct
    public void init() throws IOException {
        System.out.println("Inicializando Firebase...");

        InputStream serviceAccount = getClass()
                .getClassLoader()
                .getResourceAsStream("firebase/firebase-service-account-tienda.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
            System.out.println("Firebase inicializado correctamente.");
        } else {
            System.out.println("Firebase ya estaba inicializado.");
        }
    }

}
