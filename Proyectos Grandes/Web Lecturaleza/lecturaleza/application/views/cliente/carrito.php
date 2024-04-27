<?php
   $dataHeader['titulo']= "Carrito";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>


<?php $cant =0; ?>
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
                                <?php $tempo =0; ?>
                                
                            <?php foreach ($carrito as $index => $productos):   ?>
                                <tr>
                                    <td class="shoping__cart__item">
                                        <img   style="width: 100px; height: 100px;"  src="<?php if($productos->img==null){echo base_url();?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png";}else { echo  base_url()."/assets/distCliente/img/product/".$productos->img;}?>" alt="">
                                        <h5 id="nombre_producto"> <?php echo $productos->nombre_producto  ?></h5>
                                        
                                    </td>
                                    <td class="shoping__cart__price">
                                        <?php  echo "$".$formaro_moneda = number_format($productos->precio_venta ,0,',','.'); ?>  
                                    </td>
                                    <td class="shoping__cart__quantity">
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                                <button class="btn btn-outline-secondary" type="button" onclick="restar(<?php echo $index; ?>)">-</button>
                                            </div>
                                            <input type="text" class="form-control form-control-sm text-center" value="0" id="cantidad_<?php echo $index; ?>" disabled>
                                            <input type="hidden" value="<?php echo $productos->precio_venta?>" id="precio_<?php echo $index; ?>" >
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-secondary" type="button" onclick="sumar(<?php echo $index; ?>)">+</button>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="shoping__cart__total" id="total_<?php echo $index; ?>">
                                         $0
                                    </td>
                                    <td class="shoping__cart__item__close">
                                        <a href="<?php echo base_url('index.php/Cliente/Inicio/eliminarCarrito/'.$productos->id_producto.'/'.$session["id_usuario"]) ; ?>"><span class="icon_close"></span></a>
                                    </td>
                                </tr>
                              <?php endforeach  ?>  
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    
                </div>
                <div class="col-lg-6">
                   
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="shoping__checkout">
                        <h5>Carta Total</h5>
                        <ul >
                            <li>Total <span id="total_pago">$0</span></li>
                        </ul>
                       
                        <script>
                        function enviarPedido() {
                            var carrito = JSON.parse('<?php echo json_encode($carrito); ?>');
                            console.log('<?php echo json_encode($carrito); ?>');
                            var mensaje = "Hola deseo realizar este pedido: [";
                            var total_pago = 0;

                            // Crear un formulario
                            var form = document.createElement("form");
                            form.setAttribute("method", "post");
                            form.setAttribute("action", "http://localhost/lecturaleza/index.php/SinLog/insertarPedido");

                            carrito.forEach((producto, index) => {
                                var cantidad = parseInt(document.getElementById('cantidad_' + index).value, 10);
                                var precio = parseFloat(document.getElementById('precio_' + index).value);
                                var subtotal = cantidad * precio;
                                total_pago += subtotal;

                                mensaje += producto.nombre_producto + ": " + cantidad + " x $" + precio.toLocaleString() + " = $" + subtotal.toLocaleString() + ", ";

                                // Crear inputs para cada producto y añadirlos al formulario
                                var inputID = document.createElement("input");
                                inputID.type = "hidden";
                                inputID.name = "productos[" + index + "][id]";
                                inputID.value = producto.id_producto;
                                form.appendChild(inputID);

                                var inputNombre = document.createElement("input");
                                inputNombre.type = "hidden";
                                inputNombre.name = "productos[" + index + "][nombre]";
                                inputNombre.value = producto.nombre_producto;
                                form.appendChild(inputNombre);

                                var inputCantidad = document.createElement("input");
                                inputCantidad.type = "hidden";
                                inputCantidad.name = "productos[" + index + "][cantidad]";
                                inputCantidad.value = cantidad;
                                form.appendChild(inputCantidad);

                                var inputPrecio = document.createElement("input");
                                inputPrecio.type = "hidden";
                                inputPrecio.name = "productos[" + index + "][precio]";
                                inputPrecio.value = precio;
                                form.appendChild(inputPrecio);
                            });

                            mensaje += "] Total a pagar: $" + total_pago.toLocaleString();
                            var telefono = "57<?php echo str_replace(' ', '', $telefono); ?>";
                            var url = "https://api.whatsapp.com/send?phone=" + telefono + "&text=" + encodeURIComponent(mensaje);
                            
                            // Añadir el formulario al body
                            document.body.appendChild(form);
                            
                            // Enviar el formulario
                            form.submit();
                            
                            // Abrir WhatsApp
                            window.open(url, '_blank');
                            
                        }
                        </script>

                        <button class="primary-btn" onclick="enviarPedido()">REALIZAR PEDIDO</button>

                        
                        
                    </div>
                </div>
            </div>
        </div>
    </section>


<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>
