<?php
   $dataHeader['titulo']= "Mis pedidos";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" integrity="sha256-2XFplPlrFClt0bIdPgpz8H7ojnk10H69xRqd9+uTShA=" crossorigin="anonymous" />

<div class="container-xl px-4 mt-4">
    <!-- Account page navigation-->
    <nav class="nav nav-borders">
        
        <a class="nav-link btn-success" href="<?php echo base_url('index.php/cliente/Inicio/pedidos/'.$session['id_usuario']);?>" target="_self">Pedidos</a>
        
        
    </nav>
    <hr class="mt-0 mb-4">
    
    
    <!-- Billing history card-->
    <div class="card mb-4">
        <div class="card-header">Pedidos</div>
        <div class="card-body p-0">
            <!-- Billing history table-->
            <div class="table-responsive table-billing-history">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th class="border-gray-200" scope="col">ID PEDIDO</th>
                            <th class="border-gray-200" scope="col">FECHA</th>
                            <th class="border-gray-200" scope="col">MONTO</th>
                            <th class="border-gray-200" scope="col">ESTADO</th>
                            <th class="border-gray-200" scope="col">VER DETALLES</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <?php $idPedido = null ?>
                        <?php foreach($pedidos as $key => $pedido): ?>
                            <?php if($pedido->id_pedido != $idPedido): ?>
                                <tr>
                                
                                    <td><?php echo "#".$pedido->id_pedido; ?></td>
                                    <td><?php echo $pedido->fecha; ?></td>
                                    <td><?php echo $pedido->total_unitario ?></td>
                                    <td><span class="badge bg-light text-dark"><?php echo $pedido->estado; ?></span></td>
                                    <td><span class="badge bg-light text-dark"> <a class="nav-link active ms-0 btn-success" href="<?php echo base_url('index.php/Cliente/Inicio/detallePedido/' . $pedido->id_pedido) ; ?>" target="_self">Ver mas</a> </td>
                                    
                                </tr>
                                <?php $idPedido=$pedido->id_pedido ?>
                            <?php endif; ?>
                        <?php endforeach ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>