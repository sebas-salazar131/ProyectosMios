package com.example.androidpreguntas;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidpreguntas.utils.Config;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class NuevoCuestionario extends AppCompatActivity {
    Config config;
    TextView nombre, fecha;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nuevo_cuestionario);
        nombre= findViewById(R.id.nombre);
        fecha= findViewById(R.id.fecha);
        config= new Config(getApplicationContext());

        SharedPreferences archivo =  getSharedPreferences("app_pregunta_v3", MODE_PRIVATE);
        String nombres= archivo.getString("nombres","");


        SimpleDateFormat simple= new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String hora= simple.format(new Date());
        System.out.println(nombres);
        nombre.setText(nombres);
        fecha.setText(hora);

    }

    public void empezarCuestionario(View vista){
        Intent intencion = new Intent(NuevoCuestionario.this, EmpezarCuestionario.class);
        startActivity(intencion);


    }

}