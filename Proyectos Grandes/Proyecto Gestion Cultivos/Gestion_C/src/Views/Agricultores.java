package Views;


import Clases.ButtonEditor;
import Clases.ButtonRenderer;
import Clases.agricultor;
import Principal.Dashboard;
import static Principal.Dashboard.ShowJPanel;
import apiDB.ConsumoApi;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;
import java.util.Map;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

public class Agricultores extends javax.swing.JPanel {
    private JButton etqBoton[];
    private JButton etqBotonE[];
    int variable ;
    public Agricultores() {
        initComponents();
        InitStyles();
        mostrar();
        init2();
    }
    
    public void init2(){
        this.jTable1.getColumn("EDITAR").setCellRenderer(new ButtonRenderer());
        this.jTable1.getColumn("EDITAR").setCellEditor(new ButtonEditor(new JCheckBox()));
        
        this.jTable1.getColumn("ELIMINAR").setCellRenderer(new ButtonRenderer());
        this.jTable1.getColumn("ELIMINAR").setCellEditor(new ButtonEditor(new JCheckBox()));
    }
    private void InitStyles() {
        title.putClientProperty("FlatLaf.styleClass", "h1");
        title.setForeground(Color.WHITE);
        inputBuscar.putClientProperty("JTextField.placeholderText", "Ingrese el nombre de usuario a buscar.");
    }

    public void mostrar(){
        DefaultTableModel modelo = new DefaultTableModel();
        modelo.addColumn("CEDULA");
        modelo.addColumn("NOMBRE");
        modelo.addColumn("APELLIDO");
        modelo.addColumn("TELEFONO");
        modelo.addColumn("EMAIL");
        modelo.addColumn("PASS");
        modelo.addColumn("ESTADO");
        modelo.addColumn("EDITAR");
        modelo.addColumn("ELIMINAR");
        jTable1.setModel(modelo);
        ConsumoApi traer = new ConsumoApi();
        
        
        ImageIcon icon = new ImageIcon("src/img/eliminar.png");
        ImageIcon icon2 = new ImageIcon("src/img/editar.png");
        
        
        
        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        
        String datos = traer.consumoGET("http://localhost/APIenPHP-agricultura/agricultor/Obtener.php");
        JsonObject listaAgri = JsonParser.parseString(datos).getAsJsonObject();
        for (int i = 0; i < jTable1.getColumnCount(); i++) {
            jTable1.getColumnModel().getColumn(i).setCellRenderer(center);
        }
        if(listaAgri.has("registros")){
            JsonArray listaAgricultores = listaAgri.getAsJsonArray("registros");
            etqBoton= new JButton[listaAgricultores.size()];
            etqBotonE= new JButton[listaAgricultores.size()];
            for(int i=0; i< listaAgricultores.size();i++){
                //int i = Integer.parseInt(String.valueOf(registroElement));
                
                JsonObject temporal = listaAgricultores.get(i).getAsJsonObject();
                etqBoton[i]= new JButton("",icon2);
                etqBoton[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                etqBoton[i].setHorizontalTextPosition(SwingConstants.CENTER);
                etqBoton[i].setContentAreaFilled(false);  // Oculta el fondo del botón
                etqBoton[i].setBorderPainted(false);     // Oculta el borde del botón
                
                
                
                
                etqBotonE[i]= new JButton("",icon);
                etqBotonE[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                etqBotonE[i].setHorizontalTextPosition(SwingConstants.CENTER);
                etqBotonE[i].setContentAreaFilled(false);  // Oculta el fondo del botón
                etqBotonE[i].setBorderPainted(false);     // Oculta el borde del botón
                
                variable=i;
                String cedula = temporal.get("cedula").getAsString();
                String nombre = temporal.get("nombre").getAsString();
                String apellido = temporal.get("apellido").getAsString();
                String telefono = temporal.get("telefono").getAsString();
                String email = temporal.get("email").getAsString();
                String estado = temporal.get("estado").getAsString();
                
                etqBoton[i].addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        agricultor editAgri = new agricultor(cedula, nombre, apellido, telefono, email, estado);
                        Dashboard.ShowJPanel(new UpUsers("editar", editAgri));
                        
                        
                       
                    }
                });
            
               etqBotonE[i].addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                     
                            int respuesta = JOptionPane.showConfirmDialog(
                                null,
                                "Seguro que desea eliminar a: " + nombre + " " + apellido,
                                "Confirmar eliminación",
                                JOptionPane.YES_NO_OPTION
                            );
                            
                            
                            if (respuesta == JOptionPane.YES_OPTION) {
                                
                                ConsumoApi eliminar = new ConsumoApi();
                                Map<String, String> deleteData = new HashMap<>();
                                deleteData.put("cedula", cedula);
                                
                                eliminar.consumoPOST("http://localhost/APIenPHP-agricultura/agricultor/Delete.php"  , deleteData);
                                ShowJPanel(new Agricultores());
                            } else {
                                
                            }
                    }
                });
            
                
                
                
                
                modelo.addRow(new Object[]{cedula, nombre, apellido, telefono, email, "*****", estado, etqBoton[i], etqBotonE[i]});
                
                
                
            }
        }else{
            System.out.println("Views.Agricultores.mostrar()");
        }
        
        
        
        
    }
    
    public void buscar(){
        
        String buscar = this.inputBuscar.getText();
        ConsumoApi traer = new ConsumoApi();
        Map<String, String> getData = new HashMap<>();
        getData.put("cedula", buscar);
        getData.put("nombre", buscar);
        String datoUsuario =traer.consumoGET("http://localhost/APIenPHP-agricultura/agricultor/getPersona.php",getData);
            
        DefaultTableModel modelo = new DefaultTableModel();
        modelo.addColumn("CEDULA");
        modelo.addColumn("NOMBRE");
        modelo.addColumn("APELLIDO");
        modelo.addColumn("TELEFONO");
        modelo.addColumn("EMAIL");
        modelo.addColumn("PASS");
        modelo.addColumn("ESTADO");
        modelo.addColumn("EDITAR");
        modelo.addColumn("ELIMINAR");
        jTable1.setModel(modelo);
        
        
        
        JsonObject listaAgri = JsonParser.parseString(datoUsuario).getAsJsonObject();
        
        if(listaAgri.has("registros")){
            JsonArray listaAgricultores = listaAgri.getAsJsonArray("registros");
            etqBoton= new JButton[listaAgricultores.size()];
            etqBotonE= new JButton[listaAgricultores.size()];
            for(int i=0; i< listaAgricultores.size();i++){
                 JsonObject temporal = listaAgricultores.get(i).getAsJsonObject();
                etqBoton[i]= new JButton("Editar");
                etqBotonE[i]= new JButton("Eliminar");
                String cedula = temporal.get("cedula").getAsString();
                String nombre = temporal.get("nombre").getAsString();
                String apellido = temporal.get("apellido").getAsString();
                String telefono = temporal.get("telefono").getAsString();
                String email = temporal.get("email").getAsString();
                String estado = temporal.get("estado").getAsString();
                
                modelo.addRow(new Object[]{cedula, nombre, apellido, telefono, email, "*****", estado, "hola", "pedo"});
                
                
            }
        }else{
            System.out.println("Views.Agricultores.mostrar()");
        }
       
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        bg = new javax.swing.JPanel();
        title = new javax.swing.JLabel();
        inputBuscar = new javax.swing.JTextField();
        botonBuscar = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();
        addButton = new javax.swing.JButton();

        setBackground(new java.awt.Color(255, 255, 255));
        setMinimumSize(new java.awt.Dimension(1033, 564));
        setPreferredSize(new java.awt.Dimension(1033, 564));

        bg.setBackground(new java.awt.Color(51, 51, 51));
        bg.setPreferredSize(new java.awt.Dimension(1033, 564));

        title.setText("Agricultores");

        inputBuscar.setBackground(new java.awt.Color(51, 51, 51));
        inputBuscar.setForeground(new java.awt.Color(255, 255, 255));

        botonBuscar.setBackground(new java.awt.Color(153, 0, 255));
        botonBuscar.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        botonBuscar.setForeground(new java.awt.Color(255, 255, 255));
        botonBuscar.setText("Buscar");
        botonBuscar.setBorderPainted(false);
        botonBuscar.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        botonBuscar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                botonBuscarActionPerformed(evt);
            }
        });

        jTable1.setBackground(new java.awt.Color(51, 51, 51));
        jTable1.setFont(new java.awt.Font("Trebuchet MS", 1, 12)); // NOI18N
        jTable1.setForeground(new java.awt.Color(255, 255, 255));
        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "CEDULA", "NOMBRES", "APELLIDOS", "TELEFONO", "EMAIL", "PASS", "ESTADO", "EDITAR", "ELIMINAR"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.Object.class, java.lang.Object.class
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }
        });
        jTable1.getTableHeader().setReorderingAllowed(false);
        jTable1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                jTable1MousePressed(evt);
            }
        });
        jScrollPane1.setViewportView(jTable1);

        addButton.setBackground(new java.awt.Color(153, 0, 255));
        addButton.setFont(new java.awt.Font("Segoe UI", 0, 18)); // NOI18N
        addButton.setForeground(new java.awt.Color(255, 255, 255));
        addButton.setText("Nuevo");
        addButton.setBorderPainted(false);
        addButton.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        addButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addButtonActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout bgLayout = new javax.swing.GroupLayout(bg);
        bg.setLayout(bgLayout);
        bgLayout.setHorizontalGroup(
            bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(bgLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(bgLayout.createSequentialGroup()
                        .addComponent(title, javax.swing.GroupLayout.DEFAULT_SIZE, 328, Short.MAX_VALUE)
                        .addGap(699, 699, 699))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, bgLayout.createSequentialGroup()
                        .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(bgLayout.createSequentialGroup()
                                .addComponent(inputBuscar)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(botonBuscar))
                            .addGroup(bgLayout.createSequentialGroup()
                                .addGap(0, 0, Short.MAX_VALUE)
                                .addComponent(addButton, javax.swing.GroupLayout.PREFERRED_SIZE, 157, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(50, 50, 50))))
        );
        bgLayout.setVerticalGroup(
            bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(bgLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(title, javax.swing.GroupLayout.DEFAULT_SIZE, 25, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(bgLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(inputBuscar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(botonBuscar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 396, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(addButton)
                .addGap(25, 25, 25))
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

    private void jTable1MousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jTable1MousePressed

    }//GEN-LAST:event_jTable1MousePressed

    private void addButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addButtonActionPerformed
        agricultor agri = new agricultor(null,null,null,null,null,null);
        Dashboard.ShowJPanel(new UpUsers("asignar", agri));
        
    }//GEN-LAST:event_addButtonActionPerformed

    private void botonBuscarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_botonBuscarActionPerformed
        if(this.inputBuscar.getText().isEmpty()){
            mostrar();
        }else{
           buscar(); 
        }
        
    }//GEN-LAST:event_botonBuscarActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton addButton;
    private javax.swing.JPanel bg;
    private javax.swing.JButton botonBuscar;
    private javax.swing.JTextField inputBuscar;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable jTable1;
    private javax.swing.JLabel title;
    // End of variables declaration//GEN-END:variables
}