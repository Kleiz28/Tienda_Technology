package com.example.tienda_technology.config;

import com.example.tienda_technology.model.Categoria;
import com.example.tienda_technology.model.Producto;
import com.example.tienda_technology.repository.CategoriaRepository;
import com.example.tienda_technology.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public DataLoader(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Crear categorías por defecto si no existen
        crearCategoriasPorDefecto();
    }

    private void crearCategoriasPorDefecto() {
        // Solo crear si no existen categorías
        if (categoriaRepository.count() == 0) {
            Categoria electronica = new Categoria("Electrónica", "Productos electrónicos");
            Categoria hogar = new Categoria("Hogar", "Productos para el hogar");
            Categoria deportes = new Categoria("Deportes", "Artículos deportivos");

            categoriaRepository.save(electronica);
            categoriaRepository.save(hogar);
            categoriaRepository.save(deportes);
        }
    }
}