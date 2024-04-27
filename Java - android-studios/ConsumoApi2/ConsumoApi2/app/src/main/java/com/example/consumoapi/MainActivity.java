package com.example.consumoapi;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.ImageRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    TextView etq_respuesta;
    ImageView imagen;
    int contador =0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        etq_respuesta=findViewById(R.id.etq);
        imagen=findViewById(R.id.imagen);
    }

    public void consumoGet(View vista){
        contador++;
        if(contador<3){
            RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
            String url = "http://10.199.145.114/APIenPHP/Obtener.php";

            JsonObjectRequest solicitud =  new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    System.out.println("El servidor responde OK");
                    System.out.println(response.toString());
                    getClientes(response);
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("El servidor responde con un error:");
                    System.out.println(error.getMessage());
                }
            });

            queue.add(solicitud);
        }else{
            etq_respuesta.setText("Deje de ser canson");
        }

    }

    public void getClientes(JSONObject response){

        etq_respuesta.setText("");
        try {
            JSONArray arreglo = response.getJSONArray("registros");
            for (int i =0;i<arreglo.length();i++){
                JSONObject cliente = arreglo.getJSONObject(i);
                String document = cliente.getString("cedula");
                String nombres = cliente.getString("nombres");
                String apellidos = cliente.getString("apellidos");
                String direccion = cliente.getString("direccion");
                String correo = cliente.getString("email");
                etq_respuesta.append(document+"--"+nombres+"--"+apellidos+"--"+direccion+"\n");

            }
        }catch (JSONException e){
            throw new RuntimeException(e);
        }

    }

    public void insertar(View vista){
        contador=0;
        etq_respuesta.setText("");
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = "http://10.199.145.114/APIenPHP/Insert.php";

        StringRequest solicitud =  new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    System.out.println("El servidor POST responde OK");
                    JSONObject jsonObject = new JSONObject(response);
                    System.out.println(response);
                    etq_respuesta.append(response);
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
                Map<String, String> params = new HashMap<>();
                params.put("cedula", "10774");
                params.put("nombres", "Sebastian");
                params.put("apellidos", "Morales");
                params.put("telefono", "31122");
                params.put("direccion", "mz7");
                params.put("email", "kshkas@gmail.com");

                return params;
            }
        };

        queue.add(solicitud);
    }

    public void consumoImagen(View vista){
        contador=0;
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png";

        ImageRequest solicitud = new ImageRequest(
                url,
                new Response.Listener<Bitmap>() {
                    @Override
                    public void onResponse(Bitmap bitmap) {
                        imagen.setImageBitmap(bitmap);


                    }
                },
                0, 0, null, // maxWidth, maxHeight, decodeConfig;
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        System.out.println("El servidor responde con un error:");
                        System.out.println(error.getMessage());
                    }
                });

        queue.add(solicitud);
    }


}