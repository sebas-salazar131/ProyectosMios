package com.example.androidagro;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidagro.utils.Config;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CultivosAgricultor extends AppCompatActivity {
    Config config;
    RecyclerView recycler;
    AdaptadorCultivos adaptador;
    List<Cultivos> lista;
    String id_cultivo;
    String id_agricultor;
    String nombre;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cultivos);
        recycler = findViewById(R.id.recycler_cultivos);
        config = new Config(getApplicationContext());
        SharedPreferences archivo = getSharedPreferences("agroControl", MODE_PRIVATE);
        id_agricultor= archivo.getString("cedula","");
        traerCultivos();
    }

    public void ver_tarea_cultivo(View view){

        Intent intencion = new Intent(this, TablaTareas.class);
        intencion.putExtra("id_cultivo", id_cultivo);
        intencion.putExtra("id_agricultor", id_agricultor);
        System.out.println("este es el id para enviar: "+id_agricultor);
       // intencion.putExtra("nombre", nombre);
        startActivity(intencion);



        System.out.println("este es el id para enviar: "+id_agricultor);
    }

    public void traerCultivos() {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = config.getEndpoint("APIenPHP-agricultura/joins/joinCultivoAgri.php");
        StringRequest solicitud = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    System.out.println("El servidor POST responde OK");
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray registrosArray = jsonObject.getJSONArray("registros");

                    lista = new ArrayList<>();
                    for (int i = 0; i < registrosArray.length(); i++) {
                        JSONObject client = registrosArray.getJSONObject(i);
                        id_cultivo = client.getString("id_cultivo");

                        System.out.println("id: "+id_agricultor);
                        nombre = client.getString("nombre");
                        String descripcion = client.getString("descripcion");
                        String img = client.getString("img");
                        lista.add(new Cultivos(id_cultivo, nombre, descripcion, img, id_agricultor));
                        System.out.println("Id Cultivo Inicio: "+id_cultivo);
                    }
                    adaptador = new AdaptadorCultivos(lista);
                    recycler.setAdapter(adaptador);
                    recycler.setLayoutManager(new LinearLayoutManager(getApplicationContext()));

                    System.out.println(response);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("El servidor responde con un error:");
                System.out.println(error.getMessage());
            }
        }){
            protected Map<String, String> getParams(){
                Map<String, String> params = new HashMap<String, String>();
                params.put("id_agricultor", id_agricultor);



                return params;
            }
        };
        queue.add(solicitud);
    }
    public void cerrarSesion(View vista){
        SharedPreferences sharedPreferences = getSharedPreferences("agroControl", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();

        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Limpiar el historial de actividades
        startActivity(intent);
        finish();
    }
}
