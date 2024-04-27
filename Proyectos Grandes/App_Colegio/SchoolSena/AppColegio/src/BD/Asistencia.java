
package BD;


public class Asistencia {
    private String cedula;
    private String nombre;
    private String apellido;
    private String asistencia;
    private String fecha;
    private String materia;
    

    public Asistencia(String cedula, String nombre, String apellido, String asistencia, String fecha, String materia ) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.asistencia = asistencia;
        this.fecha=fecha;
        this.materia=materia;
      
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getAsistencia() {
        return asistencia;
    }

    public void setAsistencia(String asistencia) {
        this.asistencia = asistencia;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getMateria() {
        return materia;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

   
    
    
}
