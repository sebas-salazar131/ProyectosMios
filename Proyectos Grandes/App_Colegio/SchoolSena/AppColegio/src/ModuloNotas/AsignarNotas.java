
package ModuloNotas;

import BD.DataBase;
import BD.Profesor;
import Menu.MenuProfesor;
import javax.swing.JOptionPane;


public class AsignarNotas extends javax.swing.JFrame {

   private String estudiante;
   private Double matematicas[];
   private Double espaniol[];
   private Double informatica[];
   private String cedula;
   private Profesor profe;
   private ListarEstudiantes listar;
    DataBase database = new DataBase();
    public AsignarNotas(String estudiante, Double matematicas[], Double espaniol[], Double informatica[], String cedula, Profesor profe, ListarEstudiantes listar ) {
        this.estudiante=estudiante;
        this.matematicas=matematicas;
        this.espaniol=espaniol;
        this.informatica=informatica;
        this.cedula=cedula;
        this.profe=profe;
        this.listar=listar;
        initComponents();
        init2();
        asignarTodo();
    }

    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        LabelNombre = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        Mat1 = new javax.swing.JTextField();
        Mat2 = new javax.swing.JTextField();
        Mat3 = new javax.swing.JTextField();
        Esp3 = new javax.swing.JTextField();
        Esp2 = new javax.swing.JTextField();
        Esp1 = new javax.swing.JTextField();
        Infor1 = new javax.swing.JTextField();
        Infor2 = new javax.swing.JTextField();
        Infor3 = new javax.swing.JTextField();
        BotonVolver = new javax.swing.JButton();
        BotonGuardar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setResizable(false);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jPanel2.setBackground(new java.awt.Color(0, 153, 153));

        LabelNombre.setFont(new java.awt.Font("Times New Roman", 1, 24)); // NOI18N
        LabelNombre.setForeground(new java.awt.Color(255, 255, 255));
        LabelNombre.setText("Estudiante: NOMBRE");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(196, 196, 196)
                .addComponent(LabelNombre)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(34, 34, 34)
                .addComponent(LabelNombre)
                .addContainerGap(39, Short.MAX_VALUE))
        );

        jLabel2.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 18)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(0, 153, 153));
        jLabel2.setText("Matematicas");

        jLabel3.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 18)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(0, 153, 153));
        jLabel3.setText("Español");

        jLabel4.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 18)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(0, 153, 153));
        jLabel4.setText("Informatica");

        BotonVolver.setBackground(new java.awt.Color(0, 153, 153));
        BotonVolver.setFont(new java.awt.Font("Segoe UI Black", 1, 14)); // NOI18N
        BotonVolver.setForeground(new java.awt.Color(255, 255, 255));
        BotonVolver.setText("Volver");
        BotonVolver.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonVolverActionPerformed(evt);
            }
        });

        BotonGuardar.setBackground(new java.awt.Color(0, 153, 153));
        BotonGuardar.setFont(new java.awt.Font("Segoe UI Black", 1, 14)); // NOI18N
        BotonGuardar.setForeground(new java.awt.Color(255, 255, 255));
        BotonGuardar.setText("Calificar");
        BotonGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonGuardarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(45, 45, 45)
                        .addComponent(jLabel2)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel3))
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                        .addGap(59, 59, 59)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                            .addComponent(Mat1, javax.swing.GroupLayout.DEFAULT_SIZE, 72, Short.MAX_VALUE)
                            .addComponent(Mat2)
                            .addComponent(Mat3))
                        .addGap(150, 150, 150)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(Esp1, javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(Esp2, javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(Esp3, javax.swing.GroupLayout.Alignment.TRAILING))))
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(114, 114, 114)
                        .addComponent(jLabel4)
                        .addGap(74, 74, 74))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                            .addComponent(Infor1, javax.swing.GroupLayout.DEFAULT_SIZE, 73, Short.MAX_VALUE)
                            .addComponent(Infor2)
                            .addComponent(Infor3))
                        .addGap(90, 90, 90))))
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(14, 14, 14)
                .addComponent(BotonVolver, javax.swing.GroupLayout.PREFERRED_SIZE, 301, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(BotonGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 309, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(16, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(Mat1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Mat2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Mat3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(Esp1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Esp2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Esp3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(Infor1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Infor2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(Infor3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 39, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(BotonVolver, javax.swing.GroupLayout.DEFAULT_SIZE, 31, Short.MAX_VALUE)
                    .addComponent(BotonGuardar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void BotonVolverActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonVolverActionPerformed
        MenuProfesor menu = new MenuProfesor(profe);
        dispose();
        menu.setVisible(true);
    }//GEN-LAST:event_BotonVolverActionPerformed

    private void BotonGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonGuardarActionPerformed
        Double mat1 = Double.parseDouble(this.Mat1.getText());
        Double mat2 = Double.parseDouble(this.Mat2.getText()) ;
        Double mat3 = Double.parseDouble(this.Mat3.getText()) ;
        
        Double espa1 = Double.parseDouble(this.Esp1.getText());
        Double espa2 = Double.parseDouble(this.Esp2.getText()) ;
        Double espa3 = Double.parseDouble(this.Esp3.getText()) ;
        
        Double infor1 = Double.parseDouble(this.Infor1.getText());
        Double infor2 = Double.parseDouble(this.Infor2.getText()) ;
        Double infor3 = Double.parseDouble(this.Infor3.getText()) ;
        
        if(mat1 <= 5.0 && mat2 <= 5.0 &&  mat3 <= 5.0 &&  espa1 <= 5.0 &&  espa2 <= 5.0 &&  espa3 <= 5.0 &&  infor1 <= 5.0 &&  infor2 <= 5.0 &&  infor3 <= 5.0 && mat1 >= 0.0 && mat2 >= 0.0 &&  mat3 >= 0.0 &&  espa1 >= 0.0 &&  espa2 >= 0.0 &&  espa3 >= 0.0 &&  infor1 >= 0.0 &&  infor2 >= 0.0 &&  infor3 >= 0.0){
            database.AlmacenarMate(mat1, mat2, mat3, cedula);
            database.AlmacenarEspa(espa1, espa2, espa3, cedula);
            database.AlmacenarInfor(infor1, infor2, infor3, cedula);
            JOptionPane.showMessageDialog(this, "Notas guardadas");
            dispose();
            listar.setVisible(true);
        }else{
            JOptionPane.showMessageDialog(this, "ERROR: NOTA MAYOR A 5.0 o NOTA MENOR A 0");
        }
        
        
        
        
    }//GEN-LAST:event_BotonGuardarActionPerformed
    
    public void init2(){
        setLocationRelativeTo(null);
    }    
    
    public void asignarTodo(){
        String materia= profe.getMateria();
        if(materia.equals("Matematicas")){
            this.Esp1.setEditable(false);
            this.Esp2.setEditable(false);
            this.Esp3.setEditable(false);
            
            this.Infor1.setEditable(false);
            this.Infor2.setEditable(false);
            this.Infor3.setEditable(false);
            
        }else if(materia.equals("Español")){
            this.Infor1.setEditable(false);
            this.Infor2.setEditable(false);
            this.Infor3.setEditable(false);
            
            this.Mat1.setEditable(false);
            this.Mat2.setEditable(false);
            this.Mat3.setEditable(false);
        }else if(materia.equals("Informatica")){
            this.Esp1.setEditable(false);
            this.Esp2.setEditable(false);
            this.Esp3.setEditable(false);
            
            this.Mat1.setEditable(false);
            this.Mat2.setEditable(false);
            this.Mat3.setEditable(false);
        }
        
        this.LabelNombre.setText("Estudiante: "+estudiante);
        this.Mat1.setText(String.valueOf(matematicas[0]));
        this.Mat2.setText(String.valueOf(matematicas[1]));
        this.Mat3.setText(String.valueOf(matematicas[2]));
        
        this.Esp1.setText(String.valueOf(espaniol[0]));
        this.Esp2.setText(String.valueOf(espaniol[1]));
        this.Esp3.setText(String.valueOf(espaniol[2]));
        
        this.Infor1.setText(String.valueOf(informatica[0]));
        this.Infor2.setText(String.valueOf(informatica[1]));
        this.Infor3.setText(String.valueOf(informatica[2]));
    }
    
    
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton BotonGuardar;
    private javax.swing.JButton BotonVolver;
    private javax.swing.JTextField Esp1;
    private javax.swing.JTextField Esp2;
    private javax.swing.JTextField Esp3;
    private javax.swing.JTextField Infor1;
    private javax.swing.JTextField Infor2;
    private javax.swing.JTextField Infor3;
    private javax.swing.JLabel LabelNombre;
    private javax.swing.JTextField Mat1;
    private javax.swing.JTextField Mat2;
    private javax.swing.JTextField Mat3;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    // End of variables declaration//GEN-END:variables
}
