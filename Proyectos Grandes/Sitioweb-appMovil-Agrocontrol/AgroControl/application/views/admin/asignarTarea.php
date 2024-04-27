<?php
 $dataHeader['titulo']="Ver Usuarios";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      

<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center mb-5">Asignar tarea</h1>
        <div class="container">
            <form id="asignarTarea" action="#" method="post">
                <div class="form-group">
                    <label for="nombre">Agricultor</label>
                    <select name="agriultor" id="agricultor" class="form-control">
                        <?php foreach ($agricultores['registros'] as $key => $agricultor) { ?>
                            <option value="<?php echo $agricultor['cedula']; ?>"><?php echo $agricultor['nombre']; ?></option>
                            
                            <?php } ?>
                    </select>
                </div>
                <input type="hidden" name="id_cultivo" id="id_cultivo" value="<?php $id_cultivo ?>">
                <div class="form-group">
                    <label for="descripcion">Tarea</label>
                    <select name="tarea" id="tarea" class="form-control">
                        <option value=""></option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="tipo">Plazo hasta:</label>
                    <label for="fecha">Selecciona una fecha:</label><br>
                    <input type="date" id="fecha" class="form-control" name="fecha"><br><br>
                </div>

                <button type="submit" class="btn btn-primary">Asignar tarea</button>
          </form>
        </div> 
    </div> 
</div>
 





<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>


<script>
    // Utilizamos window.onload para esperar a que la ventana esté completamente cargada
    window.onload = function() {

        document.getElementById('asignarTarea').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe normalmente
        
            // Aquí puedes agregar la lógica para manejar la solicitud del formulario, por ejemplo, llamando a la función registrarCultivo()
            registrarApi(id_cultivo);
            registrarTareaAgri();
            
        });




        function cargarTarea(id_cultivo) {
            var formData = new FormData();
            formData.append('id_cultivo', id_cultivo);
            console.log(id_cultivo);
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

                // Obtener el select
                var select = document.getElementById("tarea");

                // Limpiar el select
                select.innerHTML = '';

                // Agregar una opción por defecto
                var optionDefault = document.createElement("option");
                optionDefault.text = "Seleccione una tarea";
                select.add(optionDefault);

                // Agregar las opciones de las tareas recibidas de la API
                data.registros.forEach(tarea => {
                    var option = document.createElement("option");
                    option.value = tarea.id_tarea; // Ajusta esto según la estructura de tus datos
                    option.text = tarea.titulo; // Ajusta esto según la estructura de tus datos
                    select.add(option);
                });
            })
            .catch(error => {
                console.error('Error al enviar datos a la API:', error);
            });

          
        }

    





        function registrarApi(id_cultivo){
            // Crea un objeto FormData y añade los datos del formulario
            var formData = new FormData();
            formData.append('id_cultivo', id_cultivo);
            formData.append('id_agricultor', document.getElementById("agricultor").value);
            
        
            // Realiza una solicitud POST a la API
            fetch('http://localhost/APIenPHP-agricultura/cultivo_agricultor/Insertar.php', {
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
            // Aquí puedes agregar lógica adicional según la respuesta de la API
            })
            .catch(error => {
            // Maneja los errores de la solicitud
            console.error('Error al enviar datos a la API:', error);
            });
            
        }


        function registrarTareaAgri(){
            var fechaActual = new Date();

            // Obtener el año, mes y día
            var año = fechaActual.getFullYear();
            var mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, por lo que sumamos 1
            var dia = fechaActual.getDate();

            // Formatear la fecha como un string
            var fechaFormateada = año + "-" + mes + "-" + dia;

            // Mostrar la fecha formateada en la consola
            console.log("La fecha actual es: " + fechaFormateada);

            var formData = new FormData();
            formData.append('id_agricultor', document.getElementById("agricultor").value);
            formData.append('id_tarea', document.getElementById("tarea").value);
            formData.append('fecha_inicio', fechaFormateada);
            formData.append('fecha_fin', document.getElementById("fecha").value );
            
            
            
        
            // Realiza una solicitud POST a la API
            fetch('http://localhost/APIenPHP-agricultura/tareas_agricultor/Insertar.php', {
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
            // Aquí puedes agregar lógica adicional según la respuesta de la API
            })
            .catch(error => {
            // Maneja los errores de la solicitud
            console.error('Error al enviar datos a la API:', error);
            });
        }






        var id_cultivo = "<?php echo $id_cultivo; ?>";
        cargarTarea(id_cultivo);
    



    };


</script>