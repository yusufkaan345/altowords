package com.read.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // API yollarını burada belirtebilirsiniz
                .allowedOrigins("http://localhost:3000")  // React frontend'inizin çalıştığı adres
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Hangi HTTP yöntemlerine izin verileceği
                .allowedHeaders("*")  // Tüm başlıklara izin verir
                .allowCredentials(true);  // İsteklerin kimlik doğrulama bilgilerinin iletilmesine izin verir
    }
}
