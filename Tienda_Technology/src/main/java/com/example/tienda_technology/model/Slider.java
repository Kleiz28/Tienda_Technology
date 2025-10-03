package com.example.tienda_technology.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "sliders")
public class Slider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(length = 200)
    private String descripcion;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl; // Solo guardar el nombre del archivo

    @Column(name = "es_logo", nullable = false)
    private Boolean esLogo = false;

    @Column(nullable = false)
    private Integer orden = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.ACTIVO;

    public enum Estado {
        ACTIVO,
        INACTIVO,
        ELIMINADO
    }

    // Método helper para obtener la URL completa de la imagen
    public String getImagenUrlCompleta() {
        return this.imagenUrl != null ? "/sliders/" + this.imagenUrl : null;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public Boolean getEsLogo() { return esLogo; }
    public void setEsLogo(Boolean esLogo) { this.esLogo = esLogo; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}