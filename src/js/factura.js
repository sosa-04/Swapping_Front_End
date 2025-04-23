document.addEventListener('DOMContentLoaded', function() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idVenta = urlParams.get('idVenta');
    const nombreComprador = urlParams.get('nombreComprador');
    const nombreVendedor = urlParams.get('nombreVendedor');
    const subtotal = urlParams.get('subtotal');
    const isv = urlParams.get('isv');
    const total = urlParams.get('total');
    const fecha = urlParams.get('fecha');
    const nombreProducto = urlParams.get('nombreProducto');
    const idComprador = urlParams.get('idComprador');
    
    // Función para formatear moneda
    function formatCurrency(value) {
        return `L ${parseFloat(value).toFixed(2)}`;
    }
    
    // Función para formatear fecha
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-HN', options);
    }
    
    // Actualizar los elementos de la factura con los datos recibidos
    document.getElementById('facturaId').textContent = idVenta || 'N/A';
    document.getElementById('facturaFecha').textContent = fecha ? formatDate(fecha) : 'N/A';
    document.getElementById('nombreVendedor').textContent = nombreVendedor || 'N/A';
    document.getElementById('nombreComprador').textContent = nombreComprador || 'N/A';
    document.getElementById('nombreProducto').textContent = nombreProducto || 'N/A';
    document.getElementById('subtotal').textContent = subtotal ? formatCurrency(subtotal) : 'L 0.00';
    document.getElementById('isv').textContent = isv ? formatCurrency(isv) : 'L 0.00';
    document.getElementById('total').textContent = total ? formatCurrency(total) : 'L 0.00';
    
    // Evento para el botón de volver al catálogo
    const backToCatalogBtn = document.getElementById('backToCatalogBtn');
    if (backToCatalogBtn) {
        backToCatalogBtn.addEventListener('click', function() {
            // Redirigir a la página de catálogo de usuarios con el ID del comprador
            if (idComprador) {
                window.location.href = `/src/view/catalogoUsuario.html?idUsuario=${idComprador}`;
            } else {
                // Si no hay ID de comprador, redirigir a la página principal
                window.location.href = '/src/view/landing.html';
            }
        });
    }
    
    // Actualizar el contador del carrito
    updateCartCount();
});

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    // Obtener el carrito del localStorage
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Calcular la cantidad total
    const totalQuantity = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    
    // Actualizar el contador
    cartCount.textContent = totalQuantity;
}