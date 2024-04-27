<?php
 $dataHeader['titulo']="Actualizar Tarea";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      

<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center mb-5">Actualizar Tarea </h1>
        <div class="container">
            <form id="actualizarTarea" action="#" method="post">
                <div class="form-group">
                    <label for="nombre">Id Tarea</label>
                    <input type="text" name="id_tarea" id="id_tarea" value="<?php echo $id_tarea ?>" disabled>
                </div>
                <div class="form-group">
                    <select name="id_cultivo" id="id_cultivo" class="form-control">
                            <?php foreach ($datos['registros'] as $key => $cultivo) { ?>
                                <option value="<?php echo $cultivo['id_cultivo']; ?>"><?php echo $cultivo['id_cultivo']; ?> - <?php echo $cultivo['nombre'];?>  </option>
                                
                                <?php } ?>
                        </select>
                </div>
                <div class="form-group">
                    <label for="nombre">Titulo de la tarea</label>
                    <input class="form-control" type="text" placeholder="Ingrese el nombre del cultivo" id="titulo" name="titulo">
                </div>
                
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows="4" cols="50" class="form-control"></textarea>
                </div>
               
                <div class="form-group">
                    <label for="estado">Estado</label>
                    <select name="estado" id="estado" class="form-control">
                        <option value="Finalizado">Finalizado</option>
                        <option value="Pendiente">Pendiente</option>
                        
                    </select>
                </div>

            <button type="submit" class="btn btn-primary" onclick="actualizarTarea()" >Registrar</button>
          </form>
        </div> 
    </div> 
</div>
 





<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>


<script>
  // Aquí puedes definir y llamar a tu función de JavaScript
  function cargarTarea(id_tarea){
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('id_tarea', id_tarea);
  

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/tareas/getTarea.php', {
    method: 'POST',
    body: formData // Utiliza el objeto FormData como cuerpo de la solicitud
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .then(data => {
    // Maneja la respuesta de la API
    console.log('Datos enviados correctamente a la API.');
    console.log('Respuesta de la API:', data);
    
    if (data['registros'].length > 0) {
    // Accede al primer registro si hay múltiples registros
    const registro = data['registros'][0];
    document.getElementById("id_cultivo").value = registro.id_cultivo;
    document.getElementById("titulo").value = registro.titulo;
    document.getElementById("descripcion").value = registro.descripcion;
    document.getElementById("estado").value = registro.estado;
   // console.log("dsadsa"+registro.);
    
  } else {
    console.log('No se encontraron registros.');
  }
    
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la APIsssss:', error);
  });

  

}

var id_tarea = "<?php echo $id_tarea; ?>";

    console.log("holsa"+id_tarea);
  // Llama a la función cuando se cargue completamente la página
  window.addEventListener('DOMContentLoaded', function() {
    
    cargarTarea(id_tarea);
  });
</script>      