
package ModuloNotas;

import BD.DataBase;
import BD.Estudiantes;
import BD.Profesor;
import Clases.ButtonEditor;
import Clases.ButtonRenderer;
import Menu.MenuProfesor;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;


public class ListarEstudiantes extends javax.swing.JFrame {

    DataBase database = new DataBase();
    private JButton [] etqButton;
    private JButton [] etqButton2;
    private JLabel etqTemporal;
    private JLabel etqTemporal2;
    private Profesor profe;
    private MenuProfesor menu;
   
    public ListarEstudiantes(Profesor profe, MenuProfesor menu) {
        this.profe=profe;
        this.menu=menu;
        initComponents();
        init2();
        
    }

    public void init2(){
        setLocationRelativeTo(null);
        mostrarTodos();
         this.Tabla.getColumn("Asignar Notas").setCellRenderer(new ButtonRenderer());
        this.Tabla.getColumn("Asignar Notas").setCellEditor(new ButtonEditor(new JCheckBox()));
        
    }
    public void mostrarTodos(){
        DefaultTableModel modelo = new DefaultTableModel();
        modelo.addColumn("Cedula");
        modelo.addColumn("Nombre");
        modelo.addColumn("Apellido");
        modelo.addColumn("Asignar Notas");
        this.Tabla.setModel(modelo);
        this.Tabla.setRowHeight(30);
        Estudiantes [] estudiantes=database.mostrarEstudiantes();
          etqButton=new JButton[estudiantes.length];
          etqButton2=new JButton[estudiantes.length];
         
            for(int i=0;i<estudiantes.length;i++){
                if(estudiantes[i]!=null){
                    etqTemporal = new JLabel("Cedula: "+estudiantes[i].getCedula()+"   "+"Nombre: "+estudiantes[i].getNombre()+"   "+"Apellido: "+estudiantes[i].getApellido());
                    etqButton[i]= new JButton("Asignar Notas");
                    etqButton[i].setBackground(PanelTitulo.getBackground());
                    etqButton[i].setFont(new Font("Source Han Sans Cn Bold", Font.PLAIN, 14) {
                    });
                    etqTemporal2 = new JLabel("--------------------------------------------------------------------------------------------------------------");
                    etqTemporal.setFont(new Font("Source Han Sans Cn Bold", Font.PLAIN, 17));
                    etqTemporal.setBorder(new EmptyBorder(2,10,2,10));
                    
                    etqButton[i].setPreferredSize(new Dimension(200,300));
                    int posicion =i;
                    
                    
                    
                    etqButton[i].addActionListener(new ActionListener() {
                    @Override
                        public void actionPerformed(ActionEvent e) {
                        Double matematicas[]=database.Matematicas(estudiantes[posicion].getCedula());
                        Double espaniol[]=database.espaniol(estudiantes[posicion].getCedula());
                        Double informatica[]=database.informatica(estudiantes[posicion].getCedula());
                        
                        
                        
                        AsignarNotas notas = new AsignarNotas(estudiantes[posicion].getNombre(), matematicas,espaniol,informatica, estudiantes[posicion].getCedula(),profe,ListarEstudiantes.this);
                        dispose();
                        notas.setVisible(true);
                        System.out.print(estudiantes[posicion].getNombre());
                    
                        }
                    });
                    Object[] asignar=new Object[]{estudiantes[i].getCedula(), estudiantes[i].getNombre(),estudiantes[i].getApellido(),etqButton[i]};
                    modelo.addRow(asignar);
                }else{
                    break;
                }
            }
    }
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        PanelTitulo = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        BotonVolver = new javax.swing.JButton();
        jScrollPane2 = new javax.swing.JScrollPane();
        Tabla = new javax.swing.JTable();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setResizable(false);

        PanelTitulo.setBackground(new java.awt.Color(0, 153, 153));
        PanelTitulo.setForeground(new java.awt.Color(153, 153, 153));

        jLabel1.setBackground(new java.awt.Color(255, 255, 255));
        jLabel1.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 24)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Notas de estudiantes");

        javax.swing.GroupLayout PanelTituloLayout = new javax.swing.GroupLayout(PanelTitulo);
        PanelTitulo.setLayout(PanelTituloLayout);
        PanelTituloLayout.setHorizontalGroup(
            PanelTituloLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelTituloLayout.createSequentialGroup()
                .addGap(140, 140, 140)
                .addComponent(jLabel1)
                .addContainerGap(145, Short.MAX_VALUE))
        );
        PanelTituloLayout.setVerticalGroup(
            PanelTituloLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, PanelTituloLayout.createSequentialGroup()
                .addContainerGap(43, Short.MAX_VALUE)
                .addComponent(jLabel1)
                .addGap(33, 33, 33))
        );

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));

        BotonVolver.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        BotonVolver.setText("Volver");
        BotonVolver.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BotonVolverActionPerformed(evt);
            }
        });

        Tabla.setFont(new java.awt.Font("Source Han Sans CN Bold", 1, 14)); // NOI18N
        Tabla.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Cedula", "Nombre", "Apellido", "Asignar Notas"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.Object.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, false, true
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane2.setViewportView(Tabla);

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(212, 212, 212)
                .addComponent(BotonVolver)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(jPanel2Layout.createSequentialGroup()
                    .addGap(15, 15, 15)
                    .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 500, Short.MAX_VALUE)
                    .addGap(16, 16, 16)))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap(327, Short.MAX_VALUE)
                .addComponent(BotonVolver)
                .addContainerGap())
            .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(jPanel2Layout.createSequentialGroup()
                    .addGap(40, 40, 40)
                    .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 265, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(57, Short.MAX_VALUE)))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(PanelTitulo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(PanelTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void BotonVolverActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BotonVolverActionPerformed
       dispose();
       this.menu.setVisible(true);
    }//GEN-LAST:event_BotonVolverActionPerformed

    
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton BotonVolver;
    private javax.swing.JPanel PanelTitulo;
    private javax.swing.JTable Tabla;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane2;
    // End of variables declaration//GEN-END:variables
}
