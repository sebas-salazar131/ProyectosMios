<?php
   $dataHeader['titulo']= "Modificar usuarios";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= "session";
   $this->load->view('layouts/sidebar');
?>
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
           <div class="col-12 m-0 p-3">
                <h1 class="text-primary text-center">Modificar PERSONAS</h1>
                <div class="input-group mb-3 text-center">
                    <input type="text" class="" placeholder="Buscar...">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">Buscar</button>
                    </div>
                </div>
                <table class="table table-striped">
                    <tr>
                        <th>Cedula</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Telefono</th>
                        <th>Direccion</th>
                        <th>Email</th>
                        <th>foto</th>
                        <th></th>
                    </tr>
                    <?php foreach ($datos as $dato): ?>
                        <tr>
                            <td><?php echo $dato->cedula; ?></td>
                            <td><?php echo $dato->nombres; ?></td>
                            <td><?php echo $dato->apellidos; ?></td>
                            <td><?php echo $dato->telefono; ?></td>
                            <td><?php echo $dato->direccion; ?></td>
                            <td><?php echo $dato->email; ?></td>
                            <td><?php echo $dato->foto; ?></td>
                            <td> <a href="<?php echo base_url('index.php/admin/Inicio/buscar_Y_modificar/' . $dato->cedula ); ?>" class="btn btn-primary btn-sm">Editar</a></td>
                        </tr>
                    <?php endforeach; ?>
                </table>
          </div>
      </div>

<?php
   
   $this->load->view('layouts/footer');
?>