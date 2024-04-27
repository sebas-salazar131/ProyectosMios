package com.example.pokeapi_recycler;

public class Pokemones {

    String nombres;
    String url;

    public Pokemones(String nombres, String url) {
        this.nombres = nombres;
        this.url = url;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
