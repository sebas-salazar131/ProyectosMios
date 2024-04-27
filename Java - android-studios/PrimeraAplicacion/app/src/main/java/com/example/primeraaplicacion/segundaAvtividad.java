package com.example.primeraaplicacion;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class segundaAvtividad extends AppCompatActivity {
     TextView etq_datos;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_segunda_avtividad);

        etq_datos=findViewById(R.id.etq_datos);
        Intent intencion= getIntent();
        Bundle datos=intencion.getExtras();

        String nombres= datos.getString("nombres");
        String apellidos= datos.getString("apellido");
        String telefono= datos.getString("telefono");
        String direccion= datos.getString("direccion");
        String correo= datos.getString("correo");

        etq_datos.setText("Nombre: "+ nombres+"\n"+"Apellido: "+ apellidos+"\n"+"telefono: "+ telefono+"\n"+"direccion: "+ direccion+"\n"+"correo: "+ correo+"\n");
    }

}