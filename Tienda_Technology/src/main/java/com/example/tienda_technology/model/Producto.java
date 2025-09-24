package com.example.tienda_technology.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String marca;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual = 0;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 5;

    @Column(name = "precio_coste", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioCoste;

    @Column(name = "precio_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;

    @Column(name = "codigo_barras", unique = true, length = 50)
    private String codigoBarras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Estado estado = Estado.ACTIVO;

    // Enumerado para el estado
    public enum Estado {
        ACTIVO,
        INACTIVO,
        ELIMINADO
    }

    // Constructor por defecto
    public Producto() {
    }

    // Constructor con parámetros principales
    public Producto(String nombre, String marca, BigDecimal precioUnitario, Categoria categoria) {
        this.nombre = nombre;
        this.marca = marca;
        this.precioUnitario = precioUnitario;
        this.precioCoste = precioUnitario.multiply(new BigDecimal("0.8")); // 80% del precio unitario
        this.categoria = categoria;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public BigDecimal getPrecioCoste() {
        return precioCoste;
    }

    public void setPrecioCoste(BigDecimal precioCoste) {
        this.precioCoste = precioCoste;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    // Método para obtener el nombre de la categoría (para compatibilidad)
    @JsonIgnore
    public String getNombreCategoria() {
        return categoria != null ? categoria.getNombre() : null;
    }

    // Método para verificar si el stock está bajo
    @JsonIgnore
    public boolean isStockBajo() {
        return stockActual <= stockMinimo;
    }

    // Método para calcular el margen de ganancia
    @JsonIgnore
    public BigDecimal getMargenGanancia() {
        if (precioCoste == null || precioCoste.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return precioUnitario.subtract(precioCoste);
    }

    @Override
    public String toString() {
        return "Producto{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", marca='" + marca + '\'' +
                ", categoria=" + (categoria != null ? categoria.getNombre() : "null") +
                ", stockActual=" + stockActual +
                ", precioUnitario=" + precioUnitario +
                ", estado=" + estado +
                '}';
    }
}