package Views;

import Clases.agricultor;
import apiDB.ConsumoApi;
import java.awt.Color;
import java.util.HashMap;
import java.util.Map;

public class UpUsers extends javax.swing.JPanel {

    
    private String titulo;
    private agricultor agricultor;
    public UpUsers(String titulo, agricultor agricultor) {
        this.titulo=titulo;
        this.agricultor=agricultor;
        initComponents();
        InitStyles();
        titulo();
    }

   

    private void InitStyles() {
        title.putClientProperty("FlatLaf.styleClass", "h1");
        title.setForeground(Color.WHITE);
       
    }

   public void titulo(){
        if(this.titulo.equals("asignar")){
            this.title.setText("Insertar agricultor");
        }else{
             this.title.setText("Editar Agricultor");
             this.button.setText("Guardar");
             String cedula = this.agricultor.getCedula();
             String nombre = this.agricultor.getNombre();
             String apellido = this.agricultor.getApellido();
             String telefono = this.agricultor.getTelefono();
             String email = this.agricultor.getEmail();
             String estado = this.agricultor.getEstado();
             
             this.inputCedula.setText(cedula);
             this.inputNombre.setText(nombre);
             this.inputApellidos.setText(apellido);
             this.inputTelefono.setText(telefono);
             this.inputEmail.setText(email);
             this.inputEstado.addItem(estado);
        }
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        bg = new javax.swing.JPanel();
        title = new javax.swing.JLabel();
        documeto = new javax.swing.JLabel();
        inputCedula = new javax.swing.JTextField();
        nombre = new javax.swing.JLabel();
        inputNombre = new javax.swing.JTextField();
        inputApellidos = new javax.swing.JTextField();
        jSeparator1 = new javax.swing.JSeparator();
        email = new javax.swing.JLabel();
        inputEmail = new javax.swing.JTextField();
        button = new javax.swing.JButton();
        password = new javax.swing.JLabel();
        inputPassword = new javax.swing.JTextField();
        apellidos1 = new javax.swing.JLabel();
        direccion1 = new javax.swing.JLabel();
        inputTelefono = new javax.swing.JTextField();
        password1 = new javax.swing.JLabel();
        inputEstado = new javax.swing.JComboBox<>();

        setBackground(new java.awt.Color(255, 255, 255));
        setMinimumSize(new java.awt.Dimension(1033, 564));
        setPreferredSize(new java.awt.Dimension(1033, 564));
        setRequestFocusEnabled(false);

        bg.setBackground(new java.awt.Color(51, 51, 51));
        bg.setPreferredSize(new java.awt.Dimension(1033, 564));

        title.setText("Registrar nuevo Usuario");

        documeto.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        documeto.setText("DOCUMENTO");

        nombre.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        nombre.setText("NOMBRES");

        jSeparator1.setForeground(new java.awt.Color(204, 204, 204));
        jSeparator1.setOrientation(javax.swing.SwingConstants.VERTICAL);
        jSeparator1.setPreferredSize(new java.awt.Dimension(200, 10));

        email.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        email.setText("EMAIL");

        inputEmail.setToolTipText("");

        button.setBackground(new java.awt.Color(153, 0, 255));
        button.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        button.setForeground(new java.awt.Color(255, 255, 255));
        button.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/enviar (2).png"))); // NOI18N
        button.setText("Registrar");
        button.setBorderPainted(false);
        button.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        button.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                buttonActionPerformed(evt);
            }
        });

        password.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        password.setText("PASSWORD");

        inputPassword.setToolTipText("");

        apellidos1.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        apellidos1.setText("APELLIDOS");

        direccion1.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        direccion1.setText("TELEFONO");

        inputTelefono.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                inputTelefonoActionPerformed(evt);
            }
        });

        password1.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        password1.setText("ESTADO");

        inputEstado.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "ACTIVO", "INACTIVO" }));

        javax.swing.GroupLayout bgLayout = new javax.swing.GroupLayout(bg);
        bg.setLayout(bgLayout);
        bgLayout.setHorizontalGroup(
            bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(bgLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(bgLayout.createSequentialGroup()
                        .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(bgLayout.createSequentialGroup()
                                        .addComponent(documeto, javax.swing.GroupLayout.DEFAULT_SIZE, 194, Short.MAX_VALUE)
                                        .addGap(223, 223, 223))
                                    .addComponent(inputCedula)
                                    .addGroup(bgLayout.createSequentialGroup()
                                        .addComponent(nombre, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addGap(182, 182, 182))
                                    .addComponent(inputNombre)
                                    .addComponent(inputApellidos))
                                .addGap(68, 68, 68))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(apellidos1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(password1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(direccion1, javax.swing.GroupLayout.PREFERRED_SIZE, 135, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, bgLayout.createSequentialGroup()
                                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addComponent(inputEstado, javax.swing.GroupLayout.Alignment.LEADING, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(inputTelefono))
                                .addGap(68, 68, 68)))
                        .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(70, 70, 70)
                        .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(inputEmail)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(email, javax.swing.GroupLayout.DEFAULT_SIZE, 170, Short.MAX_VALUE)
                                .addGap(220, 220, 220))
                            .addComponent(inputPassword)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(password, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addGap(218, 218, 218))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, bgLayout.createSequentialGroup()
                                .addGap(0, 0, Short.MAX_VALUE)
                                .addComponent(button, javax.swing.GroupLayout.PREFERRED_SIZE, 204, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(72, 72, 72))
                    .addGroup(bgLayout.createSequentialGroup()
                        .addComponent(title, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(553, 553, 553))))
        );
        bgLayout.setVerticalGroup(
            bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(bgLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(title, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(bgLayout.createSequentialGroup()
                        .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(documeto, javax.swing.GroupLayout.DEFAULT_SIZE, 18, Short.MAX_VALUE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputCedula, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(nombre, javax.swing.GroupLayout.DEFAULT_SIZE, 19, Short.MAX_VALUE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputNombre, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(apellidos1, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputApellidos, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(password1, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputEstado, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(14, 14, 14))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(email, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputEmail, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(password, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputPassword, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                        .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(direccion1, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(inputTelefono, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addGap(86, 86, 86)
                                .addComponent(button, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addComponent(jSeparator1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(26, 26, 26))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(bg, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(bg, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
    }// </editor-fold>//GEN-END:initComponents

    private void buttonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_buttonActionPerformed
        String cedula = this.inputCedula.getText();
        String nombre = this.inputNombre.getText();
        String apellido = this.inputApellidos.getText();
        String estado  = String.valueOf(this.inputEstado.getSelectedItem());
        String telefono = this.inputTelefono.getText();
        String correo = this.inputEmail.getText();
        String password = this.inputPassword.getText();
        
        Map<String, String> insertData = new HashMap<>();
        insertData.put("cedula", cedula);
        insertData.put("nombre", nombre);
        insertData.put("apellido", apellido);
        insertData.put("email", correo);
        insertData.put("pass", password);
        insertData.put("telefono", telefono);
        insertData.put("estado", estado);
        
        ConsumoApi insertar = new ConsumoApi();
        
        String response = insertar.consumoPOST("http://localhost/APIenPHP-agricultura/agricultor/Insertar.php", insertData);
        

        
        
    }//GEN-LAST:event_buttonActionPerformed

    private void inputTelefonoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_inputTelefonoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_inputTelefonoActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel apellidos1;
    private javax.swing.JPanel bg;
    private javax.swing.JButton button;
    private javax.swing.JLabel direccion1;
    private javax.swing.JLabel documeto;
    private javax.swing.JLabel email;
    private javax.swing.JTextField inputApellidos;
    private javax.swing.JTextField inputCedula;
    private javax.swing.JTextField inputEmail;
    private javax.swing.JComboBox<String> inputEstado;
    private javax.swing.JTextField inputNombre;
    private javax.swing.JTextField inputPassword;
    private javax.swing.JTextField inputTelefono;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JLabel nombre;
    private javax.swing.JLabel password;
    private javax.swing.JLabel password1;
    private javax.swing.JLabel title;
    // End of variables declaration//GEN-END:variables
}