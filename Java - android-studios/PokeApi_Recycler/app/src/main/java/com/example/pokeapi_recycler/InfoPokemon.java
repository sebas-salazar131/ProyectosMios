package com.example.pokeapi_recycler;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

public class InfoPokemon extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info_pokemon);

        Intent intencion= getIntent();
        String urlPokemon= intencion.getStringExtra("urlPokemon");
        System.out.println("url: "+urlPokemon);
    }
}