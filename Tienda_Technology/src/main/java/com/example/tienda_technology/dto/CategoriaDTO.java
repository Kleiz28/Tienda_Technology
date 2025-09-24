package com.example.tienda_technology.dto;

import com.example.tienda_technology.model.Categoria;

public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String estado;
    private int cantidadProductos;

    // Constructor vacío
    public CategoriaDTO() {
    }

    // Constructor desde entidad Categoria
    public CategoriaDTO(Categoria categoria) {
        this.id = categoria.getId();
        this.nombre = categoria.getNombre();
        this.descripcion = categoria.getDescripcion();
        this.estado = categoria.getEstado().toString();
        this.cantidadProductos = categoria.getCantidadProductosActivos();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public int getCantidadProductos() { return cantidadProductos; }
    public void setCantidadProductos(int cantidadProductos) { this.cantidadProductos = cantidadProductos; }
}