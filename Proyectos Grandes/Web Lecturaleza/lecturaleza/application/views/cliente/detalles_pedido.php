<?php
   $dataHeader['titulo']= "Detalles pedidos";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>

<section class="breadcrumb-section set-bg" data-setbg="<?php echo base_url("assets/distCliente/img/cana.jpg");?>">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="breadcrumb__text">
                        <h2 class="text-color"> Detalle del Pedido</h2>

                    </div>
                </div>
            </div>
        </div>
    </section>


<section class="shoping-cart spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="shoping__cart__table">
                        <table>
                            <thead>
                                <tr>
                                    <th class="shoping__product">Productos</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $total=0;  ?>
                            <?php foreach ($productos as $key => $producto):   ?>
                                <tr >
                                    <td class="shoping__cart__item">
                                        <img   style="width: 100px; height: 100px;" src="<?php if($producto->img==null){echo base_url();?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png";}else { echo  base_url()."/assets/distCliente/img/product/".$producto->img;}?>" alt="">
                                        <h5> <?php echo $producto->nombre_producto  ?></h5>
                                    </td>
                                    <td class="shoping__cart__price">
                                        <?php  echo "$".$formaro_moneda = number_format($producto->precio_venta ,0,',','.'); ?>  
                                    </td>
                                    <td class="shoping__cart__quantity">
                                        <div class="quantity">
                                            <div class="">
                                                <p><span><b><?php echo $cantidad[$key]->cantidad_compra  ?></b></span></p>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td class="shoping__cart__total">
                                        <?php   echo "$".$formaro_moneda = number_format($total_unitario[$key],0,',','.'); $total+=$total_unitario[$key];  ?> 
                                    </td>
                                    <td class="shoping__cart__item__close">
                                        
                                    </td>
                                </tr>
                              <?php endforeach  ?>  
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
               
                <div class="col-lg-6">
                   
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="shoping__checkout">
                        <h5>Precio Total</h5>
                        <ul>
                            <li>Total <span><?php  echo "$".$formaro_moneda = number_format($total,0,',','.');?></span></li>
                        </ul>
                       
                    </div>
                </div>
            </div>
        </div>
    </section>




<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>




