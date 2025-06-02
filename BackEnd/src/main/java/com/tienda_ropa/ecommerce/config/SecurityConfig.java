package com.tienda_ropa.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // Permite all
                )
                .csrf(csrf -> csrf
                        .disable() // CSRF desactivado para facilitar desarrollo con Postman, etc.
                )
                .headers(headers -> headers
                        .frameOptions().disable() // Solo necesario si usás frames (no siempre requerido)
                )
                .formLogin().disable(); // Desactiva el formulario de login

        return http.build();
    }

}

