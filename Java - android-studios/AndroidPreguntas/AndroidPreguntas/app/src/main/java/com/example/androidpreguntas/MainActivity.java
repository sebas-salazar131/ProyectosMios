package com.example.androidpreguntas;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidpreguntas.utils.Config;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    EditText correo;
    EditText contraseña;

    Button iniciar_sesion;
    Config config;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        correo=findViewById(R.id.correo);
        contraseña=findViewById(R.id.contraseña);
        config= new Config(getApplicationContext());
        iniciar_sesion=findViewById(R.id.iniciar_sesion);
        validarSesion();
    }

    public void validarIngreso(View vista){

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = config.getEndpoint("ApiPreguntas-V1/validar_ingreso.php");

        StringRequest solicitud =  new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    System.out.println("El servidor POST responde OK");
                    JSONObject jsonObject = new JSONObject(response);
                    String id_usuario = jsonObject.getJSONObject("usuario").getString("id_usuario");
                    String nombre = jsonObject.getJSONObject("usuario").getString("nombres");
                    cambiarAtivity(id_usuario, nombre);
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
                params.put("correo", correo.getText().toString());
                params.put("password", contraseña.getText().toString());


                return params;
            }
        };

        queue.add(solicitud);
    }

    public void cambiarAtivity(String id_usuario, String nombre) {
        SharedPreferences archivo = getSharedPreferences("app_pregunta_v3", MODE_PRIVATE);
        SharedPreferences.Editor editor = archivo.edit();
        editor.putString("id_usuario", id_usuario);
        editor.putString("nombres", nombre);
        editor.commit();

        Intent intencion = new Intent(MainActivity.this, Ventana_Principal.class);
        intencion.putExtra("id_usuario", id_usuario);
        intencion.putExtra("nombre", nombre);
        startActivity(intencion);
    }

    public void validarSesion(){
        SharedPreferences archivo = getSharedPreferences("app_pregunta_v3", MODE_PRIVATE);
        String id_usuario, nombres;
        id_usuario= archivo.getString("id_usuario", null);
        nombres = archivo.getString("nombres", null);

        if (id_usuario!=null && nombres != null){
            Intent intencion = new Intent(getApplicationContext(), Ventana_Principal.class);
            startActivity(intencion);
            finish();
        }
    }
}