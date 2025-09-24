package com.example.tienda_technology.dto;

import com.example.tienda_technology.model.Producto;
import java.math.BigDecimal;

public class ProductoDTO {
    private Long id;
    private String nombre;
    private String marca;
    private String descripcion;
    private String fotoUrl;
    private Integer stockActual;
    private Integer stockMinimo;
    private BigDecimal precioCoste;
    private BigDecimal precioUnitario;
    private String codigoBarras;
    private String categoria; // Solo el nombre de la categoría
    private String estado;

    // Constructor vacío
    public ProductoDTO() {
    }

    // Constructor desde entidad Producto
    public ProductoDTO(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.marca = producto.getMarca();
        this.descripcion = producto.getDescripcion();
        this.fotoUrl = producto.getFotoUrl();
        this.stockActual = producto.getStockActual();
        this.stockMinimo = producto.getStockMinimo();
        this.precioCoste = producto.getPrecioCoste();
        this.precioUnitario = producto.getPrecioUnitario();
        this.codigoBarras = producto.getCodigoBarras();
        this.estado = producto.getEstado().toString();

        // Solo obtener el nombre de la categoría para evitar problemas de serialización
        if (producto.getCategoria() != null) {
            this.categoria = producto.getCategoria().getNombre();
        }
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }

    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    public BigDecimal getPrecioCoste() { return precioCoste; }
    public void setPrecioCoste(BigDecimal precioCoste) { this.precioCoste = precioCoste; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}