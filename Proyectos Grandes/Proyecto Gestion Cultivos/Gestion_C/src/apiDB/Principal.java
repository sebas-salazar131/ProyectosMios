
package apiDB;

import java.util.HashMap;
import java.util.Map;


public class Principal {
    public static void main(String[] args) {
        
        ConsumoApi ejemplo = new ConsumoApi();
        
        
        // GET sin datos
        //System.out.println("Consumo GET: " + ejemplo.consumoGET("http://localhost/APIenPHP-agricultura/admin/Obtener.php"));
        
        // GET con Datos
        //Map<String, String> getData = new HashMap<>();
        //getData.put("cedula", "108805");
        //System.out.println("Consumo SELECT: " + ejemplo.consumoGET("http://localhost/APIenPHP/getPersona.php", getData));
        
        // POST con Datos
       Map<String, String> insertData = new HashMap<>();
       insertData.put("cedula", "102207");
       insertData.put("nombre", "Camilo");
       insertData.put("correo", "oscar@111");
       insertData.put("contrasenia", "7779");
       System.out.println("Consumo INSERT: " + ejemplo.consumoPOST("http://localhost/APIenPHP-agricultura/admin/Insert_admin.php", insertData));
      
        // POST con Datos
       
        
        
        
        
    }    
}

