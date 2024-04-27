<?php
 $dataHeader['titulo']="Actualizar Cultivo";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      

<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center mb-5">Actualizar Cultivo </h1>
        <div class="container">
            <form id="actualizarCultivo" action="#" method="post">
                <div class="form-group">
                    <label for="nombre">Nombre del cultivo</label>
                    <input class="form-control" type="text" placeholder="Ingrese el nombre del cultivo" id="nombre" name="nombre">
                </div>
                <input type="hidden" id="id_cultivo" name="id_cultivo" value="<?php echo $id_cultivo ?>">
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows="4" cols="50" class="form-control"></textarea>
                </div>
            
                <div class="form-group">
                    <label for="tipo">Tipo</label>
                    <select name="tipo" id="tipo" class="form-control">
                        <option value="VERDURAS">VERDURAS</option>
                        <option value="FRUTAS">FRUTAS</option>
                        <option value="GRANOS">GRANOS</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary" onclick="actualizarCultivo()" >Registrar</button>
          </form>
        </div> 
    </div> 
</div>
 





<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>


<script>
  // Aquí puedes definir y llamar a tu función de JavaScript
  function cargarCultivo(id_cultivo){
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('id_cultivo', id_cultivo);
  

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/cultivos/getCultivo.php', {
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
    document.getElementById("nombre").value = registro.nombre;
    document.getElementById("descripcion").value = registro.descripcion;
    document.getElementById("tipo").value = registro.tipo;
    console.log("dsadsa"+registro.tipo)
    
  } else {
    console.log('No se encontraron registros.');
  }
    
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la APIsssss:', error);
  });

  

}

var id_cultivo = "<?php echo $id_cultivo; ?>";

    console.log("holsa"+id_cultivo)
  // Llama a la función cuando se cargue completamente la página
  window.addEventListener('DOMContentLoaded', function() {
    
    cargarCultivo(id_cultivo);
  });
</script>      