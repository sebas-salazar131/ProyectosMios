package com.example.pruebarecycler;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    RecyclerView recyclerView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        List<Persona> listado= new ArrayList<>();
        listado.add(new Persona("Oscar", "Loaiza", "50", "M", "Calle 20", "3039930", "default.png"));
        listado.add(new Persona("Sebas", "Garcia", "30", "M", "Calle 25", "3039670", "default.png"));
        listado.add(new Persona("Pedro", "Pepito", "40", "M", "Calle 23", "3539930", "default.png"));
        listado.add(new Persona("Ana", "Maria", "19", "F", "Calle 23", "30399430", "default.png"));

        recyclerView = findViewById(R.id.recycler_contactos);

        AdaptadorContacto adaptador= new AdaptadorContacto(listado);
        recyclerView.setAdapter(adaptador);
        recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext(), LinearLayoutManager.HORIZONTAL, false));

    }
}