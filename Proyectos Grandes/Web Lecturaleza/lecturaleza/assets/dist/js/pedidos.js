$(document).ready(function() {

    var url ="";
    var url_registrar = "";
    var pedidoId = "";
    var id_usuario = "";
    var nuevoEstado = "";
    var estadoAnterior = "";

    // Evento para abrir el modal cuando se cambia el estado del pedido
    $('.estado-select').change(function() {
        estadoAnterior = $(this).find(':selected').data('estado-anterior');
        console.log("Estado Anterior: "+estadoAnterior);
        nuevoEstado = $(this).val();
        console.log("Estado Selecionado: "+nuevoEstado);
        pedidoId = $(this).data('id-pedido');
        console.log("ID PEDIDO: "+pedidoId);
        id_usuario = $(this).data('id-usuario');
        console.log("ID USUARIO: "+id_usuario);
        url = $(this).data('url');
        console.log("URL : "+url);
        url_registrar = $(this).data('url-registrar');
        console.log("URL REGISTRAR: "+url_registrar);
    
        if (nuevoEstado === 'COMPRADO') {
            abrirModalTerminado(pedidoId);
        }else{
            Swal.fire({
                title: 'No se puede actualizar el estado',
                text: 'Este Pedido ya ha sido entregado',
                icon: 'error',
                onClose: function() {
                    $(this).val(estadoAnterior);
                }
            });
        }
        
    });

    // Función para abrir el modal cuando el estado del pedido es "TERMINADO" y mostrar el total del valor de los pedidos
    function abrirModalTerminado(pedidoId) {
        // Obtener el total del valor de los pedidos
        var totalValorPedidos = calcularTotalValorPedidos(pedidoId);
        
        // Mostrar el total del valor de los pedidos en el modal
        $("#totalPedido").val(totalValorPedidos);
        
        // Limpiar el campo de cantidadRecibida y vueltas al abrir el modal
        $("#cantidadRecibida").val("");
        $("#vueltas").val("");
        
        // Abrir el modal
        $('#modalTerminado').modal('show');
    }

    // Función para calcular el total del valor de los pedidos
    function calcularTotalValorPedidos(pedidoId) {
        var detallesPedido = pedidos;
        var total = 0;

        // Filtrar detalles del pedido por ID del pedido seleccionado
        detallesPedido.forEach(function(pedido) {
            if (pedido.id_pedido == pedidoId) {
                total += parseInt(pedido.total_unitario);
            }
        });
        
        return total;
    }

    // Evento cuando se cambia la cantidad recibida
    $("#cantidadRecibida").on('input', function() {
        var cantidadRecibida = parseInt($(this).val());
        var totalPedido = parseInt($("#totalPedido").val());
        
        if (!isNaN(cantidadRecibida) && !isNaN(totalPedido)) {
            var vueltas = cantidadRecibida - totalPedido;
            $("#vueltas").val(vueltas);
        } else {
            $("#vueltas").val("");
        }
    });

    // Evento cuando se hace clic en el botón "Aceptar" del modal
    $("#modalTerminado .btn-success").on('click', function() {
        var totalPedido = $("#totalPedido").val();
        var cantidadRecibida = $("#cantidadRecibida").val();
        var vueltas = $("#vueltas").val();
        
        // Realizar una solicitud AJAX para enviar los datos al controlador PHP
        console.log("Url Actualizar: "+url);
        console.log("Url Final: "+url_registrar);
        console.log("Pedido Id: "+pedidoId);
        console.log("Id Usuario: "+id_usuario);
        console.log("Total Pedido: "+totalPedido);
        console.log("Cantidad Recibida :"+cantidadRecibida);

        $.ajax({
            url: url,
            method: 'POST',
            data: { pedido_id: pedidoId, nuevo_estado: nuevoEstado },
            success: function(response) {
                if (response.success) {
                    // La operación fue exitosa
                    console.log("Mensaje: " + response.message);
                } else {
                    // Hubo un error durante la operación
                    console.log("Error: " + response.message);
                }
            },
            error: function() {
                alert('Error de conexión');
            }
        });

        console.log("Vueltas:"+vueltas);
        $.ajax({
            url: url_registrar,
            method: 'POST',
            data: {
                pedido_id: pedidoId, 
                id_usuario: id_usuario,
                total_pedido: totalPedido,
                cantidad_recibida: cantidadRecibida,
                vueltas: vueltas
                
            },
            success: function(response) {
                if (response.success) {
                    // La operación fue exitosa
                    console.log("Mensaje: " + response.message);
                } else {
                    // Hubo un error durante la operación
                    console.log("Error: " + response.message);
                }
            },
            error: function() {
                alert('Error de conexión');
            }
        });
    });

    // Evento cuando se cierra el modal
    $('#modalTerminado').on('hidden.bs.modal', function (e) {
        // Limpiar los campos del modal al cerrarlo
        $("#totalPedido").val("");
        $("#cantidadRecibida").val("");
        $("#vueltas").val("");
        nuevoEstado = "EN PROCESO";
    });
});



