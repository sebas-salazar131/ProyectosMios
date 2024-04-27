
package Menu;

import BD.Asistencia;
import BD.DataBase;
import BD.Profesor;
import Login.Login;
import ModuloAsis.Asistencias;
import ModuloEstudiantes.EliminarEstudiante;
import ModuloEstudiantes.ModificarEstudiante;
import ModuloEstudiantes.MostrarEstudiantes;
import ModuloEstudiantes.RegistrarEstudiante;
import ModuloNotas.ListarEstudiantes;
import java.awt.Color;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import javax.swing.table.DefaultTableModel;


public class MenuProfesor extends javax.swing.JFrame {

    private Profesor profe;
    DataBase database =new DataBase();
    Color color;
    int yMouse;
    int xMouse;
    public MenuProfesor(Profesor profe) {
        this.profe=profe;
        
        initComponents();
        init2();
        color=this.jPanel2.getBackground();
    }

    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel2 = new javax.swing.JPanel();
        jPanel4 = new javax.swing.JPanel();
        jScrollPane2 = new javax.swing.JScrollPane();
        Tabla = new javax.swing.JTable();
        jLabel2 = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        InputFecha = new com.toedter.calendar.JDateChooser();
        jButton1 = new javax.swing.JButton();
        LabelProfesor = new javax.swing.JLabel();
        LabelMateria = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        BotonRegistrar = new javax.swing.JButton();
        BotonEliminar = new javax.swing.JButton();
        BotonMostrar = new javax.swing.JButton();
        BotonModificar = new javax.swing.JButton();
        Asistencias = new javax.swing.JButton();
        BotonAsignarNotas = new javax.swing.JButton();
        jSeparator1 = new javax.swing.JSeparator();
        LabelNombrePro = new javax.swing.JLabel();
        LabelMateriaPro = new javax.swing.JLabel();
        jSeparator2 = new javax.swing.JSeparator();
        botonCerrarSesion = new javax.swing.JButton();
        BotonCerrar = new javax.swing.JButton();
        ModoNoche = new javax.swing.JToggleButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);
        setResizable(false);

        jPanel2.setBackground(new java.awt.Color(0, 153, 153));
        jPanel2.addMouseMotionListener(new java.awt.event.MouseMotionAdapter() {
            public void mouseDragged(java.awt.event.MouseEvent evt) {
                jPanel2MouseDragged(evt);
            }
        });
        jPanel2.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                jPanel2MousePressed(evt);
            }
        });

        jPanel4.setBackground(new java.awt.Color(255, 255, 255));

        Tabla.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        Tabla.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Nombre", "Apellido", "Fecha", "Asistencia", "Materia"
            }
        ));
        jScrollPane2.setViewportView(Tabla);

        jLabel2.setBackground(new java.awt.Color(0, 0, 0));
        jLabel2.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 18)); // NOI18N
        jLabel2.setText("Buscar Asistencias");

        jLabel1.setFont(new java.awt.Font("Times New Roman", 1, 18)); // NOI18N
        jLabel1.setText("Fecha");

        InputFecha.setDateFormatString("y-MM-d");

        jButton1.setFont(new java.awt.Font("Times New Roman", 1, 18)); // NOI18N
        jButton1.setText("Buscar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGap(274, 274, 274)
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addComponent(InputFecha, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jButton1)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addContainerGap(58, Short.MAX_VALUE)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                        .addComponent(jLabel2)
                        .addGap(318, 318, 318))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 694, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(57, 57, 57))))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 10, Short.MAX_VALUE)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(InputFecha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel1)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 25, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 268, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(15, 15, 15))
        );

        LabelProfesor.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 26)); // NOI18N
        LabelProfesor.setForeground(new java.awt.Color(255, 255, 255));
        LabelProfesor.setText("Bienvenido Profesor ");

        LabelMateria.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 26)); // NOI18N
        LabelMateria.setForeground(new java.awt.Color(255, 255, 255));
        LabelMateria.setText("Materia ");

        jPanel3.setBackground(new java.awt.Color(255, 255, 255));
        jPanel3.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        BotonRegistrar.setBackground(new java.awt.Color(0, 153, 153));
        BotonRegistrar.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonRegistrar.setForeground(new java.awt.Color(255, 255, 255));
        BotonRegistrar.setText("Registrar estudiante\n");
        BotonRegistrar.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        BotonRegistrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonRegistrarActionPerformed(evt);
            }
        });

        BotonEliminar.setBackground(new java.awt.Color(0, 153, 153));
        BotonEliminar.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonEliminar.setForeground(new java.awt.Color(255, 255, 255));
        BotonEliminar.setText("Eliminar Estudiante");
        BotonEliminar.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        BotonEliminar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonEliminarActionPerformed(evt);
            }
        });

        BotonMostrar.setBackground(new java.awt.Color(0, 153, 153));
        BotonMostrar.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonMostrar.setForeground(new java.awt.Color(255, 255, 255));
        BotonMostrar.setText("Mostrar estudiantes");
        BotonMostrar.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        BotonMostrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonMostrarActionPerformed(evt);
            }
        });

        BotonModificar.setBackground(new java.awt.Color(0, 153, 153));
        BotonModificar.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonModificar.setForeground(new java.awt.Color(255, 255, 255));
        BotonModificar.setText("Modificar estudiante");
        BotonModificar.setBorder(javax.swing.BorderFactory.createCompoundBorder());
        BotonModificar.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        BotonModificar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonModificarActionPerformed(evt);
            }
        });

        Asistencias.setBackground(new java.awt.Color(0, 153, 153));
        Asistencias.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        Asistencias.setForeground(new java.awt.Color(255, 255, 255));
        Asistencias.setText("Asistencias\n");
        Asistencias.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        Asistencias.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                AsistenciasActionPerformed(evt);
            }
        });

        BotonAsignarNotas.setBackground(new java.awt.Color(0, 153, 153));
        BotonAsignarNotas.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonAsignarNotas.setForeground(new java.awt.Color(255, 255, 255));
        BotonAsignarNotas.setText("Asignar notas");
        BotonAsignarNotas.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        BotonAsignarNotas.setFocusPainted(false);
        BotonAsignarNotas.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonAsignarNotasActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(38, 38, 38)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(BotonRegistrar, javax.swing.GroupLayout.DEFAULT_SIZE, 239, Short.MAX_VALUE)
                    .addComponent(BotonMostrar, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(BotonEliminar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(BotonModificar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(BotonAsignarNotas, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(Asistencias, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jSeparator1))
                .addContainerGap(41, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap(20, Short.MAX_VALUE)
                .addComponent(BotonAsignarNotas, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(Asistencias, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(12, 12, 12)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(BotonRegistrar, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(12, 12, 12)
                .addComponent(BotonMostrar, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(BotonEliminar, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(BotonModificar, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(15, 15, 15))
        );

        LabelNombrePro.setFont(new java.awt.Font("Segoe UI Black", 1, 30)); // NOI18N
        LabelNombrePro.setForeground(new java.awt.Color(255, 255, 255));
        LabelNombrePro.setText("Gustavo");

        LabelMateriaPro.setFont(new java.awt.Font("Segoe UI Black", 1, 30)); // NOI18N
        LabelMateriaPro.setForeground(new java.awt.Color(255, 255, 255));
        LabelMateriaPro.setText("Matematicas");

        botonCerrarSesion.setBackground(new java.awt.Color(255, 0, 0));
        botonCerrarSesion.setFont(new java.awt.Font("Segoe UI Black", 1, 18)); // NOI18N
        botonCerrarSesion.setForeground(new java.awt.Color(255, 255, 255));
        botonCerrarSesion.setText("Cerrar Sesion");
        botonCerrarSesion.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        botonCerrarSesion.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                botonCerrarSesionActionPerformed(evt);
            }
        });

        BotonCerrar.setBackground(new java.awt.Color(0, 153, 153));
        BotonCerrar.setFont(new java.awt.Font("Segoe UI Historic", 1, 24)); // NOI18N
        BotonCerrar.setForeground(new java.awt.Color(255, 255, 255));
        BotonCerrar.setText("X");
        BotonCerrar.setBorder(null);
        BotonCerrar.setBorderPainted(false);
        BotonCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonCerrarActionPerformed(evt);
            }
        });

        ModoNoche.setText("Modo oscuro");
        ModoNoche.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                ModoNocheActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(64, 64, 64)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGap(16, 16, 16)
                                .addComponent(LabelProfesor))
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGap(76, 76, 76)
                                .addComponent(LabelNombrePro))
                            .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 294, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGap(92, 92, 92)
                                .addComponent(LabelMateria))
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGap(45, 45, 45)
                                .addComponent(LabelMateriaPro))))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(132, 132, 132)
                        .addComponent(botonCerrarSesion))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(147, 147, 147)
                        .addComponent(ModoNoche)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(27, 27, 27))
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(BotonCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(BotonCerrar)
                .addGap(2, 2, 2)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(ModoNoche)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(LabelProfesor)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(LabelNombrePro)
                        .addGap(18, 18, 18)
                        .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(LabelMateria)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(LabelMateriaPro)
                        .addGap(31, 31, 31)
                        .addComponent(botonCerrarSesion)
                        .addGap(10, 10, 10))
                    .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 26, Short.MAX_VALUE)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents
    
    public void init2(){
        this.LabelProfesor.setText("Bienvenido Profesor: ");
        this.LabelNombrePro.setText(profe.getNombre());
        this.LabelMateria.setText("Materia: ");
        this.LabelMateriaPro.setText(profe.getMateria());
        setLocationRelativeTo(null);
    }
    
    private void AsistenciasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_AsistenciasActionPerformed
        String materia = profe.getMateria();
        Asistencias asis= new Asistencias(profe,this);
        setVisible(false);
        asis.setVisible(true);
    }//GEN-LAST:event_AsistenciasActionPerformed

    private void BotonRegistrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonRegistrarActionPerformed
        RegistrarEstudiante registro = new RegistrarEstudiante(this);
        registro.setVisible(true);
    }//GEN-LAST:event_BotonRegistrarActionPerformed

    private void BotonAsignarNotasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonAsignarNotasActionPerformed
        ListarEstudiantes notas = new ListarEstudiantes(profe,this);
        dispose();
        notas.setVisible(true);
    }//GEN-LAST:event_BotonAsignarNotasActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        DefaultTableModel modelo= new DefaultTableModel();
        modelo.addColumn("Nombre");
        modelo.addColumn("Apellido");
        modelo.addColumn("Fecha");
        modelo.addColumn("Asistencia");
        modelo.addColumn("Materia");
        Tabla.setModel(modelo);
        
        Date var=this.InputFecha.getDate();
        String dateFormatString=this.InputFecha.getDateFormatString();
        SimpleDateFormat datefromat= new SimpleDateFormat(dateFormatString);
        String formateddate= datefromat.format(var);
        
        Asistencia listaAsis []=this.database.mostrarAsis(String.valueOf(formateddate));
        
        for(int i=0;i<listaAsis.length;i++){
            if(listaAsis[i]!=null){
                String nombre =listaAsis[i].getNombre();
                String apellido=listaAsis[i].getApellido();
                String fecha=listaAsis[i].getFecha();
                String asistencia = listaAsis[i].getAsistencia();
                String materia= listaAsis[i].getMateria();
                
                String todo="Nombre: "+nombre+"   "+"Apellido: "+apellido+"   "+"Fecha: "+asistencia+"   "+"Asistencia: "+fecha+"Materia: "+materia+"\n"+"\n";
                
                modelo.addRow(new Object[]{nombre, apellido, fecha, asistencia,materia});
                
                
            }
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void BotonCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonCerrarActionPerformed
        dispose();
        revalidate();
    }//GEN-LAST:event_BotonCerrarActionPerformed

    private void botonCerrarSesionActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_botonCerrarSesionActionPerformed
        dispose();
        Login login =new  Login();
        login.setVisible(true);
    }//GEN-LAST:event_botonCerrarSesionActionPerformed

    private void BotonMostrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonMostrarActionPerformed
       MostrarEstudiantes ventana= new MostrarEstudiantes(this);
       ventana.setVisible(true);
    }//GEN-LAST:event_BotonMostrarActionPerformed

    private void BotonEliminarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonEliminarActionPerformed
        EliminarEstudiante ventana=new EliminarEstudiante(this);
        ventana.setVisible(true);
    }//GEN-LAST:event_BotonEliminarActionPerformed

    private void BotonModificarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonModificarActionPerformed
       ModificarEstudiante ventana=new ModificarEstudiante(this);
        ventana.setVisible(true);
    }//GEN-LAST:event_BotonModificarActionPerformed

    private void ModoNocheActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_ModoNocheActionPerformed
        if(ModoNoche.isSelected()){
           jPanel2.setBackground(Color.gray);
           BotonAsignarNotas.setBackground(Color.black);
           Asistencias.setBackground(Color.black);
           BotonEliminar.setBackground(Color.black);
           BotonMostrar.setBackground(Color.black);
           BotonRegistrar.setBackground(Color.black);
           BotonModificar.setBackground(Color.black);
           BotonCerrar.setBackground(Color.black);
           jPanel4.setBackground(Color.gray);
       }else{
           jPanel2.setBackground(color);
           BotonAsignarNotas.setBackground(color);
           Asistencias.setBackground(color);
           BotonEliminar.setBackground(color);
           BotonMostrar.setBackground(color);
           BotonRegistrar.setBackground(color);
           BotonModificar.setBackground(color);
           BotonCerrar.setBackground(color);
           jPanel4.setBackground(Color.WHITE);
       }
    }//GEN-LAST:event_ModoNocheActionPerformed

    private void jPanel2MousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jPanel2MousePressed
        xMouse=evt.getX();
        yMouse=evt.getY();
    }//GEN-LAST:event_jPanel2MousePressed

    private void jPanel2MouseDragged(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jPanel2MouseDragged
        int y = evt.getYOnScreen();
        int x = evt.getXOnScreen();
        setLocation(x - xMouse, y - yMouse);
    }//GEN-LAST:event_jPanel2MouseDragged

    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton Asistencias;
    private javax.swing.JButton BotonAsignarNotas;
    private javax.swing.JButton BotonCerrar;
    private javax.swing.JButton BotonEliminar;
    private javax.swing.JButton BotonModificar;
    private javax.swing.JButton BotonMostrar;
    private javax.swing.JButton BotonRegistrar;
    private com.toedter.calendar.JDateChooser InputFecha;
    private javax.swing.JLabel LabelMateria;
    private javax.swing.JLabel LabelMateriaPro;
    private javax.swing.JLabel LabelNombrePro;
    private javax.swing.JLabel LabelProfesor;
    private javax.swing.JToggleButton ModoNoche;
    private javax.swing.JTable Tabla;
    private javax.swing.JButton botonCerrarSesion;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JSeparator jSeparator2;
    // End of variables declaration//GEN-END:variables
}
