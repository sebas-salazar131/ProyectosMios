function showAlert() {
    Swal.fire({
        icon: 'warning',
        title: '¡Alerta!',
        text: 'Debe iniciar sesión para agregar productos al carrito.',
        iconHtml: '<i class="fa fa-exclamation-triangle"></i>',
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        customClass: {
            popup: 'custom-alert-popup',
            icon: 'custom-alert-icon',
            title: 'custom-alert-title',
            content: 'custom-alert-content',
            closeButton: 'custom-alert-close-button',
            confirmButton: 'custom-alert-confirm-button'
        },
        showClass: {
            popup: 'animated bounceIn', // + animacion
            backdrop: 'swal2-backdrop-show' 
        },
        hideClass: {
            popup: 'animated bounceOut', 
            backdrop: 'swal2-backdrop-hide' 
        },
        animation: true // Deshabilita o habilita animación
    });
}