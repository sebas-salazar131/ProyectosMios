package com.example.androidagro;

public class Cultivos {
    String id_cultivo;
    String nombre;
    String descripcion;
    String img;

    String id_agricultor;

    public Cultivos(String id_cultivo, String nombre, String descripcion, String img, String id_agricultor) {
        this.id_cultivo = id_cultivo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.img = img;
        this.id_agricultor = id_agricultor;
    }

    public String getId_cultivo() {
        return id_cultivo;
    }

    public void setId_cultivo(String id_cultivo) {
        this.id_cultivo = id_cultivo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getId_agricultor() {
        return id_agricultor;
    }

    public void setId_agricultor(String id_agricultor) {
        this.id_agricultor = id_agricultor;
    }
}
