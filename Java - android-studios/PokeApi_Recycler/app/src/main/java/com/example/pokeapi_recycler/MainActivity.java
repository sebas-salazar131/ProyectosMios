package com.example.pokeapi_recycler;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class MainActivity extends AppCompatActivity {
    List<Pokemones> listado;
    RecyclerView recyclerView;
    Adaptador adaptador;
    String urlDetalle;

    public String nextUrl;
    public String previousUrl;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView=findViewById(R.id.recycler_pokemones);
        cargarPokemones();
    }
    public void cargarPokemones() {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = "https://pokeapi.co/api/v2/pokemon/";

        JsonObjectRequest solicitud = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    System.out.println(response.toString());
                    System.out.println("El servidor POST responde OK");

                    JSONArray lista_pokemones = response.getJSONArray("results");
                    nextUrl = response.getString("next");



                    listado= new ArrayList<>();
                    for (int i = 0; i < lista_pokemones.length(); i++) {
                        JSONObject pokemon = lista_pokemones.getJSONObject(i);


                        String nombre = pokemon.getString("name");
                        urlDetalle = pokemon.getString("url");


                        System.out.println("Nombre: " + nombre);
                        System.out.println("URL Detalle: " + urlDetalle);



                        listado.add(new Pokemones(nombre, urlDetalle));
                        adaptador= new Adaptador(listado, i);
                        recyclerView.setAdapter(adaptador);
                        recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println("Error al procesar la respuesta JSON:");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("El servidor POST responde con un error:");
                System.out.println(error.getMessage());
            }
        });

        queue.add(solicitud);
    }


    public void siguiente(View vista) {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = nextUrl != null ? nextUrl : "https://pokeapi.co/api/v2/pokemon/";

        JsonObjectRequest solicitud = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    System.out.println(response.toString());
                    System.out.println("El servidor POST responde OK");

                    JSONArray lista_pokemones = response.getJSONArray("results");

                    listado.clear();

                    nextUrl = response.getString("next");
                    previousUrl = response.getString("previous");

                    System.out.println("siguiente: "+nextUrl);
                    System.out.println("atras: "+previousUrl);

                    for (int i = 0; i < lista_pokemones.length(); i++) {
                        JSONObject pokemon = lista_pokemones.getJSONObject(i);

                        String nombre = pokemon.getString("name");
                         urlDetalle = pokemon.getString("url");

                        System.out.println("Nombre: " + nombre);
                        System.out.println("URL Detalle: " + urlDetalle);

                        listado.add(new Pokemones(nombre, urlDetalle));
                    }
                    int j = 20;

                    adaptador = new Adaptador(listado,j);
                    recyclerView.setAdapter(adaptador);
                    recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));


                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println("Error al procesar la respuesta JSON:");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("El servidor POST responde con un error:");
                System.out.println(error.getMessage());
            }
        });

        queue.add(solicitud);
    }


    public void anterior(View vista) {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = nextUrl != null ? previousUrl : "https://pokeapi.co/api/v2/pokemon/";

        JsonObjectRequest solicitud = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    System.out.println(response.toString());
                    System.out.println("El servidor POST responde OK");

                    JSONArray lista_pokemones = response.getJSONArray("results");

                    listado.clear();

                    previousUrl = response.getString("previous");
                    nextUrl = response.getString("next");
                    System.out.println("siguiente: "+nextUrl);
                    System.out.println("atras: "+previousUrl);

                    for (int i = 0; i < lista_pokemones.length(); i++) {
                        JSONObject pokemon = lista_pokemones.getJSONObject(i);

                        String nombre = pokemon.getString("name");
                        urlDetalle = pokemon.getString("url");

                        System.out.println("Nombre: " + nombre);
                        System.out.println("URL Detalle: " + urlDetalle);

                        listado.add(new Pokemones(nombre, urlDetalle));
                    }
                    int j =20;
                    adaptador = new Adaptador(listado, j);
                    recyclerView.setAdapter(adaptador);
                    recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));


                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println("Error al procesar la respuesta JSON:");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("El servidor POST responde con un error:");
                System.out.println(error.getMessage());
            }
        });

        queue.add(solicitud);
    }




}


