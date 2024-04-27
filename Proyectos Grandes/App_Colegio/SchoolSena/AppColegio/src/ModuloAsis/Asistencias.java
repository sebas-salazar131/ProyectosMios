
package ModuloAsis;

import BD.Asistencia;
import BD.DataBase;
import BD.Estudiantes;
import BD.Profesor;
import Clases.ButtonEditor;
import Clases.ButtonRenderer;
import Menu.MenuProfesor;
import ModuloEstudiantes.RegistrarEstudiante;
import ModuloNotas.AsignarNotas;
import java.awt.Checkbox;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.time.LocalDate;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.border.EmptyBorder;
import java.util.Date;
import javax.swing.table.DefaultTableModel;

public class Asistencias extends javax.swing.JFrame {
    
    private JButton [] etqButton;
    private JButton [] etqButton2;
    private JLabel etqTemporal;
    private JLabel etqTemporal2;
    private JCheckBox [] check;
    private Profesor profe;
    private MenuProfesor menu;
    Asistencia asistencia [];
    DataBase database= new DataBase();
    LocalDate fechaActual = LocalDate.now();
    public Asistencias(Profesor profe, MenuProfesor menu) {
        this.asistencia=new Asistencia[database.mostrarEstudiantes().length];
        this.check= new JCheckBox[database.mostrarEstudiantes().length];
        this.profe=profe;
        this.menu=menu;
        initComponents();
        init2();
    }

    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        InputFecha = new javax.swing.JTextField();
        jPanel2 = new javax.swing.JPanel();
        BotonGuardar = new javax.swing.JButton();
        jButton1 = new javax.swing.JButton();
        jScrollPane2 = new javax.swing.JScrollPane();
        Tabla = new javax.swing.JTable();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setResizable(false);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 24)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 153, 153));
        jLabel1.setText("Asistencias");

        jLabel2.setBackground(new java.awt.Color(0, 153, 153));
        jLabel2.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 24)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(0, 153, 153));
        jLabel2.setText("Fecha:");

        InputFecha.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        InputFecha.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                InputFechaActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(54, 54, 54)
                .addComponent(jLabel1)
                .addGap(110, 110, 110)
                .addComponent(jLabel2)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(InputFecha, javax.swing.GroupLayout.PREFERRED_SIZE, 108, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(38, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel1)
                    .addComponent(jLabel2)
                    .addComponent(InputFecha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(34, Short.MAX_VALUE))
        );

        jPanel2.setBackground(new java.awt.Color(0, 153, 153));

        BotonGuardar.setFont(new java.awt.Font("Segoe UI Black", 1, 14)); // NOI18N
        BotonGuardar.setText("Subir asistencia");
        BotonGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonGuardarActionPerformed(evt);
            }
        });

        jButton1.setFont(new java.awt.Font("Segoe UI Black", 1, 14)); // NOI18N
        jButton1.setText("Volver");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        Tabla.setFont(new java.awt.Font("Segoe UI Black", 1, 14)); // NOI18N
        Tabla.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Cedula", "Nombre", "Apellido", "Asistencia"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, true
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane2.setViewportView(Tabla);

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap(38, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addComponent(jScrollPane2)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 211, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(32, 32, 32)
                        .addComponent(BotonGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 220, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(29, 29, 29))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(28, 28, 28)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 387, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(BotonGuardar)
                    .addComponent(jButton1))
                .addGap(12, 12, 12))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents
     public void init2(){
        setLocationRelativeTo(null);
        mostrarTodos();
        
         
        this.InputFecha.setEditable(false);
        this.InputFecha.setText(String.valueOf(fechaActual));
        this.Tabla.getColumn("Asistencia").setCellRenderer(new ButtonRenderer());
        this.Tabla.getColumn("Asistencia").setCellEditor(new ButtonEditor(new JCheckBox()));
        
        
    }
    
    private void InputFechaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_InputFechaActionPerformed
        
    }//GEN-LAST:event_InputFechaActionPerformed

    private void BotonGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonGuardarActionPerformed
        Estudiantes [] estudiantes=database.mostrarEstudiantes();
        
          
          
          
            for(int i=0;i<estudiantes.length;i++){
                if(estudiantes[i]!=null){
                    etqTemporal = new JLabel("Cedula: "+estudiantes[i].getCedula()+"      "+"Nombre: "+estudiantes[i].getNombre()+"      "+"Apellido: "+estudiantes[i].getApellido());
                    
                   
                    
                    if(check[i].isSelected()){
                        String cedula =estudiantes[i].getCedula();
                        String nombre=estudiantes[i].getNombre();
                        String apellido=estudiantes[i].getApellido();
                        String asis="Asistio";
                        Asistencia tempo = new Asistencia(cedula, nombre, apellido, asis,String.valueOf(fechaActual),profe.getMateria());
                        asistencia[i]=tempo;
                       
                    }else{
                        String cedula =estudiantes[i].getCedula();
                        String nombre=estudiantes[i].getNombre();
                        String apellido=estudiantes[i].getApellido();
                        String asis="No Asistio";
                        Asistencia tempo = new Asistencia(cedula, nombre, apellido, asis,String.valueOf(fechaActual), profe.getMateria());
                        asistencia[i]=tempo;
                    }
                   
                    
                    
                
                }else{
                    break;
                }
            }
            
           database.SubirAsistencias(asistencia);
           
           dispose();
           this.menu.setVisible(true);
    }//GEN-LAST:event_BotonGuardarActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
       dispose(); 
       this.menu.setVisible(true);
    }//GEN-LAST:event_jButton1ActionPerformed

    public void mostrarTodos(){
        Estudiantes [] estudiantes=database.mostrarEstudiantes();
        
            DefaultTableModel modelo = new DefaultTableModel();
            modelo.addColumn("Cedula");
            modelo.addColumn("Nombre");
            modelo.addColumn("Apellido");
            modelo.addColumn("Asistencia");
            this.Tabla.setRowHeight(30);
            Tabla.setModel(modelo);
          
          
            for(int i=0;i<estudiantes.length;i++){
                if(estudiantes[i]!=null){
                  check[i]= new JCheckBox("Asistio");
                    Object[] asignar=new Object[]{estudiantes[i].getCedula(),estudiantes[i].getNombre(), estudiantes[i].getApellido(),check[i]};
                    modelo.addRow(asignar);
                }else{
                    break;
                }
            }
    }
    
    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton BotonGuardar;
    private javax.swing.JTextField InputFecha;
    private javax.swing.JTable Tabla;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane2;
    // End of variables declaration//GEN-END:variables
}
