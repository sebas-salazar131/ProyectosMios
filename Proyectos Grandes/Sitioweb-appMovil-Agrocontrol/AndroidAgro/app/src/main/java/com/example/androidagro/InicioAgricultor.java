package com.example.androidagro;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidagro.utils.Config;
import com.google.android.material.snackbar.Snackbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class InicioAgricultor extends AppCompatActivity {
    TextView nombre, cant_tareas;
    Config config;

    String cedula;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio_agricultor);
        nombre=findViewById(R.id.nombre_usuario);
        cant_tareas=findViewById(R.id.total_tareas);
        config= new Config(getApplicationContext());
        SharedPreferences archivo = getSharedPreferences("agroControl", MODE_PRIVATE);
        String nombres= archivo.getString("nombres","");
        cedula= archivo.getString("cedula","");
        nombre.setText(nombres);
        View parentLayout = findViewById(android.R.id.content);

        Snackbar snackbar = Snackbar.make(parentLayout, "¡Bienvenido!", Snackbar.LENGTH_LONG);
        snackbar.setActionTextColor(getResources().getColor(R.color.white));
        snackbar.setBackgroundTint(getResources().getColor(R.color.verde));
        snackbar.show();

        traerTotalTareas();
    }
    public void ver_cultivos(View view){

        Intent intencion = new Intent(getApplicationContext(), CultivosAgricultor.class);

        startActivity(intencion);

        finish();
    }
    public void traerTotalTareas(){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = config.getEndpoint("APIenPHP-agricultura/tareas_agricultor/getAsignar.php");


        StringRequest solicitud =  new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    System.out.println("El servidor POST responde OK");
                    JSONObject jsonObject = new JSONObject(response);

                    JSONArray registrosArray = jsonObject.getJSONArray("registros");
                    JSONObject primerRegistro = registrosArray.getJSONObject(0);
                    int num_tareas = registrosArray.length();
                    cant_tareas.setText(String.valueOf("Tareas: "+num_tareas));





                    System.out.println(response);
                } catch (JSONException e) {
                    System.out.println("El servidor POST responde con un error:");
                    System.out.println(e.getMessage());
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
                params.put("id_agricultor", cedula);



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