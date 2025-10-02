package com.example.tienda_technology.model;

import jakarta.persistence.*;

@Entity
@Table(name = "configuraciones_app")
public class ConfiguracionApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clave", nullable = false, unique = true, length = 50)
    private String clave;

    @Column(name = "valor", length = 100)
    private String valor;

    @Column(name = "descripcion", length = 200)
    private String descripcion;

    @Column(name = "categoria", length = 50)
    private String categoria; // COLORES, REDES_SOCIALES, etc.

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}