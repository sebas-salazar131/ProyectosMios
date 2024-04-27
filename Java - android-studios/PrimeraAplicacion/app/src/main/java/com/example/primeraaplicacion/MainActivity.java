package com.example.primeraaplicacion;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    EditText text_nombre, text_apellido,text_telefono, text_direccion, text_correo;
    TextView info;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        info=findViewById(R.id.info);
        text_nombre=findViewById(R.id.text_nombre);
        text_apellido=findViewById(R.id.text_apellido);
        text_telefono=findViewById(R.id.text_telefono);
        text_direccion=findViewById(R.id.text_direccion);
        text_correo=findViewById(R.id.text_correo);

    }

    public void mostrarinfo(View vista){
         String nombre= text_nombre.getText().toString();
        String apellido= text_apellido.getText().toString();
        String telefono= text_telefono.getText().toString();
        String direccion= text_direccion.getText().toString();
        String correo= text_correo.getText().toString();

        info.setText("Nombre: "+ nombre+"\n"+"Apellido: "+ apellido+"\n"+"telefono: "+ telefono+"\n"+"direccion: "+ direccion+"\n"+"correo: "+ correo+"\n");

        Intent intencion = new Intent(getApplicationContext(), segundaAvtividad.class);
        intencion.putExtra("nombres", nombre);
        intencion.putExtra("apellido", apellido);
        intencion.putExtra("telefono", telefono);
        intencion.putExtra("direccion", direccion);
        intencion.putExtra("correo", correo);
        startActivity(intencion);


    }
}