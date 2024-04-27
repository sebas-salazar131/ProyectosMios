<?php
 $dataHeader['titulo']="Crear Tareas";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      

<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center mb-5">Registrar Tarea </h1>
        <div class="container">
        <button type="button" class="btn btn-primary"><a href="<?= base_url('index.php/admin/Inicio/verTareas') ?>" class="nav-link"> Ver Tareas</a></button>
            <form id="registroTarea" action="#" method="post">
                <div class="form-group">
                    <label for="nombre">Titulo de la Tarea</label>
                    <input class="form-control" type="text" placeholder="Ingrese el titulo" id="titulo" name="titulo">
                </div>

                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows="4" cols="50" class="form-control"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="tipo">Cultivo</label>
                   
                    <select name="cultivo" id="cultivo" class="form-control">
                        <?php foreach ($datos['registros'] as $key => $cultivo) { ?>
                            <option value="<?php echo $cultivo['id_cultivo']; ?>"><?php echo $cultivo['id_cultivo']; ?> - <?php echo $cultivo['nombre'];?>  </option>
                            
                            <?php } ?>
                    </select>
                </div>
                <input type="hidden" value="Pendiente" id="estado">

                <button type="submit" class="btn btn-primary" >Registrar</button>
          </form>
        </div> 
    </div> 
</div>
 





<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>