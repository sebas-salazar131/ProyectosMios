
package BD;

public class Mate {
    
    private String cedula;
    private String nombre;
    private Double promedioMates;
    private Double promedioEspa;
    private Double promediInfor;

    public Mate(String cedula, String nombre, Double promedioMates, Double promedioEspa, Double promediInfor) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.promedioMates = promedioMates;
        this.promedioEspa = promedioEspa;
        this.promediInfor = promediInfor;
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

    public Double getPromedioMates() {
        return promedioMates;
    }

    public void setPromedioMates(Double promedioMates) {
        this.promedioMates = promedioMates;
    }

    public Double getPromedioEspa() {
        return promedioEspa;
    }

    public void setPromedioEspa(Double promedioEspa) {
        this.promedioEspa = promedioEspa;
    }

    public Double getPromediInfor() {
        return promediInfor;
    }

    public void setPromediInfor(Double promediInfor) {
        this.promediInfor = promediInfor;
    }
    
    

   

   
    
    

    
    
}

