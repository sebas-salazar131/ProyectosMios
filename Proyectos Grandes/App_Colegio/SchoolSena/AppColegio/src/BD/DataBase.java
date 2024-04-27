
package BD;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class DataBase {
    Statement manipularDB;
    
    public DataBase(){
        String hostname = "localhost";
        String puerto = "3306";
        String database_name = "colegio";
        String database_user = "root";
        String database_password = "";
        String url = "jdbc:mysql://"+hostname+":"+puerto+"/"+database_name;
        
        try{
            Connection conexion = DriverManager.getConnection(url, database_user, database_password);
            this.manipularDB = conexion.createStatement();
            System.out.println("Conexion Exitosa a: "+database_name);
        }catch(SQLException e){
            System.out.println("Error en conexion: "+e.getMessage());
            this.manipularDB = null;
        }
    }
    
    
    
    public Profesor ExtraerDatosProfe(String usuario){
        ResultSet registros=null;
        
        try {
            String consulta = "SELECT * FROM profesores WHERE usuario='"+usuario+"'";
            registros=manipularDB.executeQuery(consulta);
            
            if(registros.next()){
               
                Profesor validar = new Profesor(registros.getString("usuario"), registros.getString("materia"));
                
               return validar;
            }
             
        }catch (SQLException e) {
            System.out.print("Usuario no registrado:"+e.getMessage());
            
        }
        return null;
    }
    
    public boolean insertarProfe(){
        boolean respuesta = false;
        String user="Oscar";
        int pass=11;
        String materia="Informatica";
    try {
        
        
        String consulta = "INSERT INTO profesores (usuario, contrasenia, materia) VALUES ('"+user+"','"+pass+"','"+materia+"')";
        int resp_consulta = manipularDB.executeUpdate(consulta);
        if (resp_consulta==1) {
            respuesta = true;
        }
    } catch (SQLException ex) {
        System.out.println("--> Error Insert: " + ex.getMessage());
    }
        return false;
    }

    
    public Usuario validacion(String usuario, String contraseña){
        ResultSet registros=null;
        
        try {
            String consulta = "SELECT * FROM profesores WHERE usuario='"+usuario+"' AND contrasenia='"+contraseña+"'";
            registros=manipularDB.executeQuery(consulta);
            
            if(registros.next()){
               
                Usuario validar = new Usuario(registros.getString("usuario"), registros.getString("contrasenia"));
                System.out.print(validar.getPassword()+ validar.getUsuario());
               return validar;
            }
             
        }catch (SQLException e) {
            System.out.print("Usuario no registrado:"+e.getMessage());
            
        }
        return null;
    }
    
    
    public boolean registrarEstudiante(Estudiantes estudiante ){
        String cedula= estudiante.getCedula();
        String nombre= estudiante.getNombre();
        String apellido=estudiante.getApellido();
        int edad=estudiante.getEdad();
        String correo=estudiante.getCorreo();
         try {
            
            
            String consuta="INSERT INTO estudiantes(cedula, nombre, apellido, edad, correo) VALUES ('"+cedula+"', '"+nombre+"', '"+apellido+"', '"+edad+"', '"+correo+"') ";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
    }
    
    public Estudiantes [] mostrarEstudiantes(){
        ResultSet registros = null;
        Estudiantes arregloestu []= new Estudiantes[100];
	try {
	    String consulta = "SELECT * FROM estudiantes";
	    registros = manipularDB.executeQuery(consulta);
	    registros.next();
	    if(registros.getRow()==1){
                int indice=0;
	        do{
	            Estudiantes estudiante = new Estudiantes(registros.getString("cedula"), registros.getString("nombre"), registros.getString("apellido"), registros.getInt("edad"),registros.getString("correo") );
                    arregloestu[indice]=estudiante;
                    indice++;
	        }while(registros.next());
                
	    }
            return arregloestu;
	} catch (SQLException ex) {
	    System.out.println("Error al buscar el cliente: "+ex.getMessage());
	}   
        return arregloestu;
    }
    public Estudiantes buscarEstudiantes(String cedula){
        Estudiantes temp = null;
        try{
            ResultSet registros = this.manipularDB.executeQuery("SELECT * FROM estudiantes WHERE cedula='"+cedula+"' ");
            
            registros.next();
            if (registros.getRow()==1) {
                temp = new Estudiantes( registros.getString("cedula"),registros.getString("nombre"), registros.getString("apellido"), registros.getInt("edad"), registros.getString("correo") );
            }
            return temp;
        }catch(SQLException e){
            System.out.println("Error en SELECT: "+e.getMessage());
            return temp;
        }
    }
    
    public boolean modificarEstudiantes(Estudiantes persona){
        boolean respuesta = false;
        String cedula = persona.getCedula();
        String nombres = persona.getNombre();
        String apellidos = persona.getApellido();
        String edad =String.valueOf(persona.getEdad()) ;
        String correo = persona.getCorreo();
      
        
        try {
            String consulta = "UPDATE estudiantes SET nombre='"+nombres+"', apellido='"+apellidos+"', edad='"+edad+"', correo='"+correo+"' WHERE cedula='"+cedula+"'";
            int resp = manipularDB.executeUpdate(consulta);
            if (resp>0) {
                respuesta = true;
            }
        } catch (SQLException ex) {
            System.out.println("Error en UPDATE: "+ex.getMessage());
        }
        return respuesta;
    }
    
    public boolean eliminarEstudiante(String cedula){
        try{
            String cedulas=cedula;
            String consulta = "DELETE FROM estudiantes WHERE cedula='"+cedulas+"' ";
            String consulta2 = "DELETE FROM matematicas WHERE cedula='"+cedulas+"' ";
            String consulta3 = "DELETE FROM espaniol WHERE cedula='"+cedulas+"' ";
            String consulta4 = "DELETE FROM informatica WHERE cedula='"+cedulas+"' ";
            
            int resp_consulta = manipularDB.executeUpdate(consulta);
            int resp_consulta2 = manipularDB.executeUpdate(consulta2);
            int resp_consulta3 = manipularDB.executeUpdate(consulta3);
            int resp_consulta4 = manipularDB.executeUpdate(consulta4);
             if(resp_consulta==1 && resp_consulta==1){
                return true;
             }
            
        }catch(SQLException e){
             System.out.println("--> Error Delete: " + e.getMessage());
  
        }  
         if(true){
            System.out.println("Eliminado con exito");
            return true;
         }else{
            System.out.println("No se pudo Eliminar"); 
            return false;
         }
    }
    
    public Mate[] mostrar_Matematicas( Estudiantes[] estu){
        ResultSet registros = null;
        
        Mate mate []= new Mate[100];
	try {
            for (int i = 0; i < estu.length; i++) {
            if (estu[i] != null) {
                String cedula = estu[i].getCedula();

                
                String consultaMatematicas = "SELECT * FROM matematicas WHERE cedula='" + cedula + "'";
                registros = manipularDB.executeQuery(consultaMatematicas);

                if (registros.next()) {
                    double promedioMatematicas = registros.getDouble("promedio");

                    
                    String consultaEspaniol = "SELECT * FROM espaniol WHERE cedula='" + cedula + "'";
                    ResultSet registrosEspaniol = manipularDB.executeQuery(consultaEspaniol);

                    if (registrosEspaniol.next()) {
                        double promedioEspaniol = registrosEspaniol.getDouble("promedio");

                        
                        String consultaInformatica = "SELECT * FROM informatica WHERE cedula='" + cedula + "'";
                        ResultSet registrosInformatica = manipularDB.executeQuery(consultaInformatica);

                        if (registrosInformatica.next()) {
                            double promedioInformatica = registrosInformatica.getDouble("promedio");

                            Mate matematicas = new Mate(cedula, estu[i].getNombre(), promedioMatematicas,promedioEspaniol, promedioInformatica);
                            mate[i] = matematicas;
                        }

                        
                    }

                    
                }
            }
        }

        return mate;
	} catch (SQLException ex) {
	    System.out.println("Error al buscar el cliente: "+ex.getMessage());
	}   
        return mate;
    }
    
  
    
    
    
    public Double[] Matematicas (String cedula){
        ResultSet registros = null;
        Double arregloestu []= new Double[4];
	try {
	    String consulta = "SELECT * FROM matematicas WHERE cedula='"+cedula+"'";
	    registros = manipularDB.executeQuery(consulta);
	    registros.next();
	    if(registros.getRow()==1){
                
	       
	        do{
                    arregloestu[0]=registros.getDouble("nota1");
                    arregloestu[1]=registros.getDouble("nota2");
                    arregloestu[2]=registros.getDouble("nota3"); 
                    arregloestu[3]=registros.getDouble("promedio");
                } while(registros.next());
               
                    
	        
                
	    }
            return arregloestu;
	} catch (SQLException ex) {
	    System.out.println("Error al buscar el cliente: "+ex.getMessage());
	}   
        return arregloestu;
    }
    
    public Double[] espaniol (String cedula){
        ResultSet registros = null;
        Double arregloestu []= new Double[4];
	try {
	    String consulta = "SELECT * FROM espaniol WHERE cedula='"+cedula+"'";
	    registros = manipularDB.executeQuery(consulta);
	    registros.next();
	    if(registros.getRow()==1){
                
	        
	       do{
                    arregloestu[0]=registros.getDouble("nota1");
                    arregloestu[1]=registros.getDouble("nota2");
                    arregloestu[2]=registros.getDouble("nota3");
                    arregloestu[3]=registros.getDouble("promedio"); 
               }while(registros.next()); 
                   
	        
                
	    }
            return arregloestu;
	} catch (SQLException ex) {
	    System.out.println("Error al buscar el cliente: "+ex.getMessage());
	}   
        return arregloestu;
    }
    
    public Double[] informatica(String cedula){
        ResultSet registros = null;
        Double arregloestu []= new Double[4];
	try {
	    String consulta = "SELECT * FROM informatica WHERE cedula='"+cedula+"'";
	    registros = manipularDB.executeQuery(consulta);
	    registros.next();
	    if(registros.getRow()==1){
                
	        
	        do{
                    arregloestu[0]=registros.getDouble("nota1");
                    arregloestu[1]=registros.getDouble("nota2");
                    arregloestu[2]=registros.getDouble("nota3");
                    arregloestu[3]=registros.getDouble("promedio"); 
                }while(registros.next());
 
	    }
            return arregloestu;
	} catch (SQLException ex) {
	    System.out.println("Error al buscar el cliente: "+ex.getMessage());
	}   
        return arregloestu;
    }
    
    
    public boolean AlmacenarMate(Double nota1, Double nota2, Double nota3, String cedula){
         
            Double promedio = (nota1+nota2+nota3)/3;
        
         try {
            
            
            String consuta="UPDATE  matematicas SET nota1='"+nota1+"', nota2='"+nota2+"',nota3='"+nota3+"', promedio='"+promedio+"' WHERE cedula='"+cedula+"'";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
        
        
        
    }
    
    public boolean AlmacenarEspa(Double nota1, Double nota2, Double nota3, String cedula){
         
            Double promedio = (nota1+nota2+nota3)/3;
        
         try {
            
            
            String consuta="UPDATE  espaniol SET nota1='"+nota1+"', nota2='"+nota2+"',nota3='"+nota3+"', promedio='"+promedio+"' WHERE cedula='"+cedula+"'";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
        
        
        
    }
    
    public boolean AlmacenarInfor(Double nota1, Double nota2, Double nota3, String cedula){
         
            Double promedio = (nota1+nota2+nota3)/3;
        
         try {
            
            
            String consuta="UPDATE  informatica SET nota1='"+nota1+"', nota2='"+nota2+"',nota3='"+nota3+"', promedio='"+promedio+"' WHERE cedula='"+cedula+"'";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
        
        
        
    }
    
    public boolean RegistrarMate(String cedula){
         
        Double nota1=0.0;
        Double nota2=0.0;
        Double nota3=0.0;
        Double promedio=0.0;
        
        
        
         try {
            
            
            String consuta="INSERT INTO matematicas(cedula,nota1, nota2, nota3, promedio) VALUES ('"+cedula+"','"+nota1+"', '"+nota2+"', '"+nota3+"','"+promedio+"') ";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
    }
    
    public boolean RegistrarEspa(String cedula){
         
        Double nota1=0.0;
        Double nota2=0.0;
        Double nota3=0.0;
        Double promedio=0.0;
        
        
        
         try {
            
            
            String consuta="INSERT INTO espaniol(cedula,nota1, nota2, nota3, promedio) VALUES ('"+cedula+"','"+nota1+"', '"+nota2+"', '"+nota3+"','"+promedio+"') ";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
    }
    
    
    public boolean RegistrarInfor(String cedula){
         
        Double nota1=0.0;
        Double nota2=0.0;
        Double nota3=0.0;
        Double promedio=0.0;
        
        
        
         try {
            
            
            String consuta="INSERT INTO informatica(cedula,nota1, nota2, nota3, promedio) VALUES ('"+cedula+"','"+nota1+"', '"+nota2+"', '"+nota3+"','"+promedio+"') ";
            int respusta = manipularDB.executeUpdate(consuta);
            if(respusta==1){
                System.out.println("insertado");
                return true;
                
            }
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
    }
    
    
     public boolean SubirAsistencias(Asistencia[] asistencias){
         
        
        try {
            
            for(int i=0;i< asistencias.length;i++){
                if(asistencias[i]!=null){
                    String cedula = asistencias[i].getCedula();
                    String nombre = asistencias[i].getNombre();
                    String apellido = asistencias[i].getApellido();
                    String fecha = asistencias[i].getFecha();
                    String asis = asistencias[i].getAsistencia();
                    String materia = asistencias[i].getMateria();
                    String consuta="INSERT INTO asistencia(cedula_estu,nombre, apellido, fecha,materia, asistencia) VALUES ('"+cedula+"','"+nombre+"', '"+apellido+"', '"+fecha+"','"+materia+"'  ,'"+asis+"') ";
                    int respusta = manipularDB.executeUpdate(consuta);
                }
            }
            
            
        } catch (SQLException e) {
            System.out.println("Error al insertar"+e.getMessage());
            
        }
        return false;
    }
    
    
    public Asistencia[] mostrarAsis(String fecha){
        Asistencia [] listarAsis = new Asistencia[100];
        try{
            ResultSet registros = this.manipularDB.executeQuery("SELECT * FROM asistencia WHERE fecha='"+fecha+"'");
            registros.next();
            if (registros.getRow()==1) {
                int indice = 0;
                do{
                    Asistencia temp = new Asistencia(registros.getString("cedula_estu"),registros.getString("nombre"), registros.getString("apellido"), registros.getString("fecha"), registros.getString("asistencia"), registros.getString("materia") );
                    listarAsis[indice] = temp;
                    indice++;
                }while(registros.next());
            }
            return listarAsis;
        }catch(SQLException e){
            System.out.println("Error en SELECT: "+e.getMessage());
            return listarAsis;
        }
    }
    
    
    
    public Usuario validacionEstu(String usuario, String contraseña){
        ResultSet registros=null;
        
        try {
            String consulta = "SELECT * FROM estudiantes WHERE nombre='"+usuario+"' AND cedula='"+contraseña+"'";
            registros=manipularDB.executeQuery(consulta);
            
            if(registros.next()){
               
                Usuario validar = new Usuario(registros.getString("nombre"), registros.getString("cedula"));
                System.out.print(validar.getPassword()+ validar.getUsuario());
               return validar;
            }
             
        }catch (SQLException e) {
            System.out.print("Usuario no registrado:"+e.getMessage());
            
        }
        return null;
    }
    
    
    public Estudiantes BuscarEstudiante(String cedula){
        ResultSet registros=null;
        try {
            String consulta = "SELECT * FROM estudiantes WHERE cedula='"+cedula+"'";
            registros=manipularDB.executeQuery(consulta);
            
            if(registros.next()){
               
                Estudiantes validar = new Estudiantes(registros.getString("cedula"), registros.getString("nombre"),registros.getString("apellido"),registros.getInt("edad"),registros.getString("correo"));
                
               return validar;
            }
             
        }catch (SQLException e) {
            System.out.print("Usuario no registrado:"+e.getMessage());
            
        }
        return null;
    }
    
    public Asistencia[] mostrarAsisEstu(String cedula){
        Asistencia [] listarAsis = new Asistencia[100];
        try{
            ResultSet registros = this.manipularDB.executeQuery("SELECT * FROM asistencia WHERE cedula_estu='"+cedula+"'");
            registros.next();
            if (registros.getRow()==1) {
                int indice = 0;
                do{
                    Asistencia temp = new Asistencia(registros.getString("cedula_estu"),registros.getString("nombre"), registros.getString("apellido"), registros.getString("fecha"), registros.getString("asistencia"), registros.getString("materia") );
                    listarAsis[indice] = temp;
                    indice++;
                }while(registros.next());
            }
            return listarAsis;
        }catch(SQLException e){
            System.out.println("Error en SELECT: "+e.getMessage());
            return listarAsis;
        }
    }
    
    
}
