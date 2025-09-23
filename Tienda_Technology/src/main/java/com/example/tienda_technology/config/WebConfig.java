package com.example.tienda_technology.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration: Indica que esta clase es una fuente de configuración para la aplicación.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Inyección de dependencia del interceptor de sesión. Spring nos proporciona la
    // instancia.
    private final SessionInterceptor sessionInterceptor;

    // Constructor para la inyección de dependencias.
    public WebConfig(SessionInterceptor sessionInterceptor) {
        this.sessionInterceptor = sessionInterceptor;
    }

    // Este método se usa para configurar cómo se sirven los recursos estáticos
    // (CSS, JS, imágenes).
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Le dice a Spring que cualquier petición que empiece con /css/**
        // debe buscar archivos en la carpeta 'classpath:/static/css/'.
        // 'classpath:' se refiere a la carpeta 'src/main/resources'.
        // setCachePeriod(0) deshabilita el caché en el navegador, útil durante el
        // desarrollo.
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/")
                .setCachePeriod(0);

        // Lo mismo para los archivos JavaScript.
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/")
                .setCachePeriod(0);

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(0);
    }

    // Este método se usa para registrar interceptores.
    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/**") // Aplica a TODAS las rutas
                .excludePathPatterns(
                        "/login",
                        "/logout",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/error",
                        "/favicon.ico",
                        "/tienda",       // ← Añade esta exclusión
                        "/tienda/**",    // ← Y esta para cualquier subruta de tienda
                        "/"              // ← Y la raíz
                );
    }

    // Configura CORS (Cross-Origin Resource Sharing). Es necesario si tu frontend y
    // backend
    // estuvieran en dominios diferentes. En este caso, es una buena práctica para
    // las APIs.
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Configuración CORS para APIs
        registry.addMapping("/usuarios/api/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Permite el envío de cookies (importante para sesiones).
    }
}