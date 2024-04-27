package com.example.androidagro;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.androidagro.utils.Config;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.PublicKey;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    Config config;
    EditText cedula, contra;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        config= new Config(getApplicationContext());
        cedula=findViewById(R.id.cedula);
        contra=findViewById(R.id.password);
        validarSesion();
    }

    public void validarIngreso(View vista){

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String url = config.getEndpoint("APIenPHP-agricultura/agricultor/getPersona.php");
        String cedula_valor = cedula.getText().toString();
        String contrasena_valor=contra.getText().toString();

        StringRequest solicitud =  new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    System.out.println("El servidor POST responde OK");
                    JSONObject jsonObject = new JSONObject(response);

                    JSONArray registrosArray = jsonObject.getJSONArray("registros");
                    JSONObject primerRegistro = registrosArray.getJSONObject(0);
                    String contrasena = primerRegistro.getString("pass");
                    String nombre = primerRegistro.getString("nombre");
                    System.out.println("hola "+contrasena_valor);
                    if(contrasena_valor.equals(contrasena) && cedula_valor.equals(primerRegistro.getString("cedula"))){

                        SharedPreferences archivo = getSharedPreferences("agroControl", MODE_PRIVATE);
                        SharedPreferences.Editor editor = archivo.edit();
                        editor.putString("cedula", cedula_valor);
                        editor.putString("nombres", nombre);
                        editor.commit();

                        Intent intencion = new Intent(MainActivity.this, InicioAgricultor.class);
                        intencion.putExtra("cedula", cedula_valor);
                        intencion.putExtra("nombre", nombre);
                        startActivity(intencion);

                    }


                    System.out.println("Contraseña: " + contrasena);

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
                params.put("cedula", cedula_valor);



                return params;
            }
        };

        queue.add(solicitud);
    }

    public void validarSesion(){
        SharedPreferences archivo = getSharedPreferences("agroControl", MODE_PRIVATE);
        String cedula, nombres;
        cedula= archivo.getString("cedula", null);
        nombres = archivo.getString("nombres", null);

        if (cedula!=null && nombres != null){
            Intent intencion = new Intent(getApplicationContext(), InicioAgricultor.class);
            startActivity(intencion);
            finish();
        }
    }

}