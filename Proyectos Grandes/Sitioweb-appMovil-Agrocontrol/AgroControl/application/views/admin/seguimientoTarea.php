<?php
 $dataHeader['titulo']="Tareas del cultivo alguno";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
    
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center">Tareas</h1>
      
        <div class="row" id="contenedor-tareas">
           
            <div class="col-md-4 mb-4">
                <div class="card">
                        
                    <div class="card-body">
                        <h5 class="card-title"></h5>
                        <p class="card-text"></p>
                        <p> <?php echo $id_cultivo ?> </p>
                        <a href="<?= base_url('index.php/admin/Inicio/asignarTarea/') ?>" class="btn btn-primary"></a>
                            
                    </div>
                </div>
            </div>
            
        </div>
    </div>


    
</div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Trabajadores Asignados</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="trabajadoresModalBody">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>





<script>
    // Utilizamos window.onload para esperar a que la ventana esté completamente cargada
    window.onload = function() {

        


        function cargarTarea(id_cultivo) {
            var formData = new FormData();
            formData.append('id_cultivo', id_cultivo);

            fetch('http://localhost/APIenPHP-agricultura/tareas/getTarea.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos enviados correctamente a la API.');
            console.log('Respuesta de la API:', data);

            
            var contenedorTareas = document.getElementById("contenedor-tareas");

            
            contenedorTareas.innerHTML = '';

            
            var divRow = document.createElement("div");
            divRow.className = "row";

            // Iterar sobre cada tarea y crear el HTML correspondiente
            data.registros.forEach(tarea => {
                var divCol = document.createElement("div");
                divCol.className = "col-md-4 mb-4";
                
                var divCard = document.createElement("div");
                divCard.className = "card";
                
                var divCardBody = document.createElement("div");
                divCardBody.className = "card-body";
                
                var titulo = document.createElement("h1");
                titulo.className = "card-title";
                titulo.textContent = tarea.titulo;

                
                
                var descripcion = document.createElement("h4");
                descripcion.className = "card-text";
                descripcion.textContent = tarea.descripcion;

                var estado = document.createElement("h1");
                estado.className = "card-text";
                estado.textContent = tarea.estado;
                
                var idCultivo = document.createElement("p");
                idCultivo.textContent = "<?php echo $id_cultivo; ?>";

                var idTarea = document.createElement("p");
                idTarea.textContent = tarea.id_tarea;
                
                var asignarTarea = document.createElement("a");
                asignarTarea.className = "btn btn-primary";
                asignarTarea.setAttribute("data-bs-toggle", "modal");
                asignarTarea.setAttribute("data-bs-target", "#exampleModal");
                asignarTarea.setAttribute("data-tarea-id", tarea.id_tarea); 
                asignarTarea.textContent = "Ver Trabajadores";
                asignarTarea.addEventListener("click", function() {
                    
                    var tareaId = this.getAttribute("data-tarea-id");
                    
                    
                    console.log("ID de la tarea:", tareaId);
                    cargarTrabajadores(tareaId);
                });
                
                
                
                divCardBody.appendChild(titulo);
                divCardBody.appendChild(descripcion);
                
                divCardBody.appendChild(estado);
                divCardBody.appendChild(asignarTarea);
                
                
                
                divCard.appendChild(divCardBody);
                
                divCol.appendChild(divCard);
                
                
                divRow.appendChild(divCol);
            });

           
            contenedorTareas.appendChild(divRow);
                })
                    .catch(error => {
                    console.error('Error al enviar datos a la API:', error);
                });
            }
    


        var id_cultivo = "<?php echo $id_cultivo; ?>";
        cargarTarea(id_cultivo);



    };


    function cargarTrabajadores(id_tarea){
        var formData = new FormData();
    formData.append('id_tarea', id_tarea);
  
    fetch('http://localhost/APIenPHP-agricultura/joins/joinAgriTarea.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos enviados correctamente a la API.');
        console.log('Respuesta de la API:', data);
        
        
        var modalBody = document.getElementById("trabajadoresModalBody");
        
        
        modalBody.innerHTML = '';
        
        
        var ul = document.createElement("ul");
        
        
        data['registros'].forEach(trabajador => {
            var cedula = document.createElement("li");
            var nombre = document.createElement("li");
            var telefono = document.createElement("li");
            var hr = document.createElement("hr")
            cedula.textContent = "CEDULA: "+trabajador.cedula; 
            nombre.textContent = "NOMBRE: "+trabajador.nombre;
            telefono.textContent = "TELEFONO: "+trabajador.telefono;
            ul.appendChild(cedula);
            ul.appendChild(nombre);
            ul.appendChild(telefono);
            ul.appendChild(hr);
        });
        
        
        modalBody.appendChild(ul);
    })
    .catch(error => {
        console.error('Error al enviar datos a la API:', error);
    });
    }

</script>