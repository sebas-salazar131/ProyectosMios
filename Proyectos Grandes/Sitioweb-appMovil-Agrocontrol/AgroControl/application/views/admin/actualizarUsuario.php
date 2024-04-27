<?php
 $dataHeader['titulo']="Actualizar";
 $dataSide['session']=$session;
 
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
    
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center">Actualizar Datos</h1>

       
<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
    
    <div class="container">
      <form id="registroForm" action="#" method="post">
        <label for="cedula">Cédula</label>
        <input class="form-control" type="text" placeholder="Ingrese la cédula" id="cedula" name="cedula">

        <label for="nombre">Nombre</label>
        <input class="form-control" type="text" placeholder="Ingrese el nombre" id="nombre" name="nombre">

        <label for="apellido">Apellido</label>
        <input class="form-control" type="text" placeholder="Ingrese el apellido" id="apellido" name="apellido">

        <label for="correo">Correo</label>
        <input class="form-control" type="text" placeholder="Ingrese el correo" id="email" name="email">

        <label for="pass">Contraseña</label>
        <input class="form-control" type="text" placeholder="Ingrese la contraseña" id="pass" name="pass">

        <label for="telefono">Teléfono</label>
        <input class="form-control" type="text" placeholder="Ingrese el teléfono" id="telefono" name="telefono">
        
        <label for="">Estado</label>
        <select name="estado" id="estado">
            <option value="INACTIVO">INACTIVO</option>
            <option value="ACTIVO">ACTIVO</option>
        </select>

        <button type="submit" onclick="actualizar()">Guardar</button>
      </form>
    </div>    
  </div>
</div>
        
    </div>
  </div>
<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>






<script>
  // Aquí puedes definir y llamar a tu función de JavaScript
  function cargarDatos(cedula){
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('cedula', cedula);
  

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/agricultor/getPersona.php', {
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
    document.getElementById("cedula").value = registro.cedula;
    document.getElementById("nombre").value = registro.nombre;
    document.getElementById("apellido").value = registro.apellido;
    document.getElementById("email").value = registro.email;
    document.getElementById("pass").value = registro.pass;
    document.getElementById("telefono").value = registro.telefono;
    document.getElementById("estado").value = registro.estado;
    
  } else {
    console.log('No se encontraron registros.');
  }
    
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la API:', error);
  });

  

}

var cedula = "<?php echo $cedula; ?>";


  // Llama a la función cuando se cargue completamente la página
  window.addEventListener('DOMContentLoaded', function() {
    
    cargarDatos(cedula);
  });
</script>      