package com.example.androidpreguntas;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidpreguntas.utils.Config;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.HashMap;
import java.util.Map;

public class DetallesCuestionario extends AppCompatActivity {

    TextView nombre, info;
    Config config;

    LinearLayout layout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalles_cuestionario);
        nombre=findViewById(R.id.nombre);
        info=findViewById(R.id.info);
        layout=findViewById(R.id.contenedor);

        config= new Config(getApplicationContext());

        SharedPreferences archivo = getSharedPreferences("app_pregunta_v3", MODE_PRIVATE);
        String nombres= archivo.getString("nombres","");
        Intent intencion= getIntent();
        String fecha_inicio= intencion.getStringExtra("fecha_inicio");
        String preguntas=intencion.getStringExtra("cant_preguntas");
        String cant_ok=intencion.getStringExtra("cant_ok");
        String cant_error=intencion.getStringExtra("cant_error");
        String id_cuestionario =intencion.getStringExtra("id_cuestionario");

        info.append("Fecha Inicio: "+ fecha_inicio+"\n");
        info.append("Fecha Fin:    "+ "\n");
        info.append("Preguntas:    "+ preguntas+"\n");
        info.append("Correctas:     "+ cant_ok+"\n");
        info.append("Incorrectas:  "+ cant_error+"\n");
        nombre.setText(nombres);

        cargarPreguntas(id_cuestionario);

    }

    public  void cargarPreguntas(String id_cuestionario){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = config.getEndpoint("ApiPreguntas-V1/DetallesCuestionario.php");

        StringRequest solicitud =  new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {

                    JsonObject lista = JsonParser.parseString(response).getAsJsonObject();
                    JsonArray lista_preguntas = lista.getAsJsonArray("preguntas");
                    TextView[] preguntas=new TextView[lista_preguntas.size()];

                    for (int i=0;i<lista_preguntas.size();i++){
                        preguntas[i] = new TextView(getApplicationContext());
                        JsonObject temporal = lista_preguntas.get(i).getAsJsonObject();

                        JsonArray lista_opciones = temporal.getAsJsonArray("opciones");
                        TextView[] opciones = new TextView[lista_opciones.size()];

                        String id_pregunta= temporal.get("id").getAsString();
                        String descripcion= temporal.get("descripcion").getAsString();
                        preguntas[i].append("Pregunta: "+i+"\n");
                        preguntas[i].append(descripcion+"\n");
                        preguntas[i].setTextColor(Color.parseColor("#000000"));
                        System.out.println("oda"+descripcion);
                        System.out.println(id_pregunta);
                        layout.addView(preguntas[i]);
                        for (int j=0; j<lista_opciones.size(); j++){
                            opciones[j]= new TextView(getApplicationContext());
                            JsonObject temporal_opciones=lista_opciones.get(j).getAsJsonObject();



                            String descripcion_opciones= temporal_opciones.get("descripcion").getAsString();

                            opciones[j].append(descripcion_opciones+"\n");
                            System.out.println("oda"+descripcion_opciones);
                            opciones[j].setTextColor(Color.parseColor("#000000"));
                            layout.addView(opciones[j]);

                        }




                    }
                    System.out.println(response);
                    System.out.println("El servidor POST responde OK");




                } catch (Exception e) {
                    System.out.println("El servidor POST responde con un error:");

                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("El servidor POST responde con un error:");
                System.out.println(error.getMessage());
            }
        }){

            protected Map<String, String> getParams(){
                Map<String, String> params = new HashMap<String, String>();
                params.put("id_cuestionario", id_cuestionario);


                return params;
            }
        };

        queue.add(solicitud);
    }
}