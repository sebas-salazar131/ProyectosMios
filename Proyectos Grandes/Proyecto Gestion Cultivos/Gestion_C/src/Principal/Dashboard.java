
package Principal;


import Views.Cultivo;
import Views.Principal;
import Views.Seguimiento;
import Views.Tareas;
import Views.Agricultores;
import com.formdev.flatlaf.FlatLightLaf;
import com.formdev.flatlaf.intellijthemes.materialthemeuilite.FlatMaterialLighterIJTheme;
import java.awt.BorderLayout;
import java.awt.Color;
import javax.swing.JPanel;



public class Dashboard extends javax.swing.JFrame {

    private String nombre;
   
    private String tipo;
    public Dashboard(String nombre, String tipo) {
        this.tipo=tipo;
        this.nombre=nombre;
        
        initComponents();
        InitStyles();
        InitContent();
        init2();
    }
    
    private void InitStyles() {

        appName.putClientProperty("FlatLaf.style", "font: bold $h1.regular.font");
        appName.setForeground(Color.white);
    }
    
    public void init2(){
        this.jLabel3.setText("USUARIO: "+this.nombre.toUpperCase());
        this.jLabel4.setText("TIPO: "+this.tipo);
    }
    
    private void InitContent() {
        ShowJPanel(new Principal());
        
    }
    
    public static void ShowJPanel(JPanel p) {
        p.setSize(1033, 564);
        p.setLocation(0,0);
        
        content.removeAll();
        content.add(p, BorderLayout.CENTER);
        content.revalidate();
        content.repaint();
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        background = new javax.swing.JPanel();
        menu = new javax.swing.JPanel();
        appName = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        btn_prin = new javax.swing.JButton();
        btn_Asignar = new javax.swing.JButton();
        btn_Tareas = new javax.swing.JButton();
        btn_Agricultor = new javax.swing.JButton();
        btn_Cultivo = new javax.swing.JButton();
        btn_Seguimiento = new javax.swing.JButton();
        panelRound1 = new Clases.PanelRound();
        jLabel1 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        header = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        content = new javax.swing.JPanel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setMinimumSize(new java.awt.Dimension(1280, 720));
        setResizable(false);

        background.setBackground(new java.awt.Color(51, 51, 51));

        menu.setBackground(new java.awt.Color(0, 102, 0));
        menu.setPreferredSize(new java.awt.Dimension(270, 640));

        appName.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        appName.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        appName.setText("Gestion Del Cultivo");

        jSeparator1.setForeground(new java.awt.Color(51, 51, 51));
        jSeparator1.setPreferredSize(new java.awt.Dimension(50, 5));

        btn_prin.setBackground(new java.awt.Color(0, 51, 0));
        btn_prin.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_prin.setForeground(new java.awt.Color(255, 255, 255));
        btn_prin.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/pagina-principal (1).png"))); // NOI18N
        btn_prin.setText("Principal");
        btn_prin.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_prin.setBorderPainted(false);
        btn_prin.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_prin.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_prin.setIconTextGap(13);
        btn_prin.setInheritsPopupMenu(true);
        btn_prin.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_prinActionPerformed(evt);
            }
        });

        btn_Asignar.setBackground(new java.awt.Color(0, 51, 0));
        btn_Asignar.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_Asignar.setForeground(new java.awt.Color(255, 255, 255));
        btn_Asignar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/delegar (1).png"))); // NOI18N
        btn_Asignar.setText("Asignar");
        btn_Asignar.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_Asignar.setBorderPainted(false);
        btn_Asignar.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_Asignar.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_Asignar.setIconTextGap(13);
        btn_Asignar.setInheritsPopupMenu(true);
        btn_Asignar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_AsignarActionPerformed(evt);
            }
        });

        btn_Tareas.setBackground(new java.awt.Color(0, 51, 0));
        btn_Tareas.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_Tareas.setForeground(new java.awt.Color(255, 255, 255));
        btn_Tareas.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/notas (1).png"))); // NOI18N
        btn_Tareas.setText("Tareas");
        btn_Tareas.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_Tareas.setBorderPainted(false);
        btn_Tareas.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_Tareas.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_Tareas.setIconTextGap(13);
        btn_Tareas.setInheritsPopupMenu(true);
        btn_Tareas.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_TareasActionPerformed(evt);
            }
        });

        btn_Agricultor.setBackground(new java.awt.Color(0, 51, 0));
        btn_Agricultor.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_Agricultor.setForeground(new java.awt.Color(255, 255, 255));
        btn_Agricultor.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/agricultores (1).png"))); // NOI18N
        btn_Agricultor.setText("Agricultor");
        btn_Agricultor.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_Agricultor.setBorderPainted(false);
        btn_Agricultor.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_Agricultor.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_Agricultor.setIconTextGap(13);
        btn_Agricultor.setInheritsPopupMenu(true);
        btn_Agricultor.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_AgricultorActionPerformed(evt);
            }
        });

        btn_Cultivo.setBackground(new java.awt.Color(0, 51, 0));
        btn_Cultivo.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_Cultivo.setForeground(new java.awt.Color(255, 255, 255));
        btn_Cultivo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/verduras (1).png"))); // NOI18N
        btn_Cultivo.setText("Cultivo");
        btn_Cultivo.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_Cultivo.setBorderPainted(false);
        btn_Cultivo.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_Cultivo.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_Cultivo.setIconTextGap(13);
        btn_Cultivo.setInheritsPopupMenu(true);
        btn_Cultivo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_CultivoActionPerformed(evt);
            }
        });

        btn_Seguimiento.setBackground(new java.awt.Color(0, 51, 0));
        btn_Seguimiento.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        btn_Seguimiento.setForeground(new java.awt.Color(255, 255, 255));
        btn_Seguimiento.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/ocupaciones (1).png"))); // NOI18N
        btn_Seguimiento.setText("Seguimiento");
        btn_Seguimiento.setBorder(javax.swing.BorderFactory.createMatteBorder(1, 13, 1, 1, new java.awt.Color(0, 0, 0)));
        btn_Seguimiento.setBorderPainted(false);
        btn_Seguimiento.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btn_Seguimiento.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btn_Seguimiento.setIconTextGap(13);
        btn_Seguimiento.setInheritsPopupMenu(true);
        btn_Seguimiento.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_SeguimientoActionPerformed(evt);
            }
        });

        panelRound1.setBackground(new java.awt.Color(0, 51, 0));
        panelRound1.setRoundBottomLeft(50);
        panelRound1.setRoundBottomRight(50);
        panelRound1.setRoundTopLeft(50);
        panelRound1.setRoundTopRight(50);

        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/icon.png"))); // NOI18N

        jLabel3.setBackground(new java.awt.Color(255, 255, 255));
        jLabel3.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("USUARIO :");

        jLabel4.setBackground(new java.awt.Color(255, 255, 255));
        jLabel4.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(255, 255, 255));
        jLabel4.setText("TIPO :");

        javax.swing.GroupLayout panelRound1Layout = new javax.swing.GroupLayout(panelRound1);
        panelRound1.setLayout(panelRound1Layout);
        panelRound1Layout.setHorizontalGroup(
            panelRound1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelRound1Layout.createSequentialGroup()
                .addGap(27, 27, 27)
                .addGroup(panelRound1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel4)
                    .addComponent(jLabel3)
                    .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 194, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(29, Short.MAX_VALUE))
        );
        panelRound1Layout.setVerticalGroup(
            panelRound1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelRound1Layout.createSequentialGroup()
                .addGap(21, 21, 21)
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel4)
                .addGap(31, 31, 31)
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 131, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(24, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout menuLayout = new javax.swing.GroupLayout(menu);
        menu.setLayout(menuLayout);
        menuLayout.setHorizontalGroup(
            menuLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(btn_Asignar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(btn_Agricultor, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(btn_prin, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(btn_Tareas, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(btn_Cultivo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(btn_Seguimiento, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(menuLayout.createSequentialGroup()
                .addGroup(menuLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(10, 10, 10)
                        .addComponent(appName, javax.swing.GroupLayout.PREFERRED_SIZE, 250, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(40, 40, 40)
                        .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(0, 10, Short.MAX_VALUE))
            .addGroup(menuLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(panelRound1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        menuLayout.setVerticalGroup(
            menuLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(menuLayout.createSequentialGroup()
                .addGap(52, 52, 52)
                .addComponent(appName, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(4, 4, 4)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(20, 20, 20)
                .addGroup(menuLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(50, 50, 50)
                        .addComponent(btn_Asignar, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(150, 150, 150)
                        .addComponent(btn_Agricultor, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(btn_prin, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(100, 100, 100)
                        .addComponent(btn_Tareas, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(200, 200, 200)
                        .addComponent(btn_Cultivo, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(menuLayout.createSequentialGroup()
                        .addGap(250, 250, 250)
                        .addComponent(btn_Seguimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(18, 18, 18)
                .addComponent(panelRound1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        header.setBackground(new java.awt.Color(0, 102, 0));
        header.setPreferredSize(new java.awt.Dimension(744, 150));
        header.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel5.setIcon(new javax.swing.ImageIcon(getClass().getResource("/img/fonhj (1).jpg"))); // NOI18N
        header.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 1030, 150));

        content.setBackground(new java.awt.Color(51, 51, 51));
        content.setLayout(new java.awt.BorderLayout());

        javax.swing.GroupLayout backgroundLayout = new javax.swing.GroupLayout(background);
        background.setLayout(backgroundLayout);
        backgroundLayout.setHorizontalGroup(
            backgroundLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(backgroundLayout.createSequentialGroup()
                .addComponent(menu, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(backgroundLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(content, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(header, javax.swing.GroupLayout.DEFAULT_SIZE, 1033, Short.MAX_VALUE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        backgroundLayout.setVerticalGroup(
            backgroundLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
            .addComponent(menu, javax.swing.GroupLayout.DEFAULT_SIZE, 720, Short.MAX_VALUE)
            .addGroup(backgroundLayout.createSequentialGroup()
                .addComponent(header, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(content, javax.swing.GroupLayout.PREFERRED_SIZE, 564, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(background, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(background, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void btn_prinActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_prinActionPerformed
        ShowJPanel(new Principal());
    }//GEN-LAST:event_btn_prinActionPerformed

    private void btn_AsignarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_AsignarActionPerformed
        ShowJPanel(new Views.Asignar());
    }//GEN-LAST:event_btn_AsignarActionPerformed

    private void btn_TareasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_TareasActionPerformed
        ShowJPanel(new Tareas());
    }//GEN-LAST:event_btn_TareasActionPerformed

    private void btn_AgricultorActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_AgricultorActionPerformed
        ShowJPanel(new Agricultores());
    }//GEN-LAST:event_btn_AgricultorActionPerformed

    private void btn_CultivoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_CultivoActionPerformed
        ShowJPanel(new Cultivo());
    }//GEN-LAST:event_btn_CultivoActionPerformed

    private void btn_SeguimientoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_SeguimientoActionPerformed
        ShowJPanel(new Seguimiento());
    }//GEN-LAST:event_btn_SeguimientoActionPerformed


    public static void main(String args[]) {

        FlatMaterialLighterIJTheme.setup();


        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                String nombre ="rueba";
                String nombre3 ="rueba";
                new Dashboard(nombre,nombre3 ).setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel appName;
    private javax.swing.JPanel background;
    private javax.swing.JButton btn_Agricultor;
    private javax.swing.JButton btn_Asignar;
    private javax.swing.JButton btn_Cultivo;
    private javax.swing.JButton btn_Seguimiento;
    private javax.swing.JButton btn_Tareas;
    private javax.swing.JButton btn_prin;
    private static javax.swing.JPanel content;
    private javax.swing.JPanel header;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JPanel menu;
    private Clases.PanelRound panelRound1;
    // End of variables declaration//GEN-END:variables
}
