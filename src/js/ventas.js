document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const isvElement = document.getElementById('isv');
    const totalPagarElement = document.getElementById('totalPagar');
    const backBtn = document.getElementById('backBtn');
    const updateCartBtn = document.getElementById('updateCartBtn');
    const payBtn = document.getElementById('payBtn');
    
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('idProducto');
    
    // Función para formatear moneda
    function formatCurrency(value) {
        return `L ${parseFloat(value).toFixed(2)}`;
    }
    
    // Cargar detalles del producto
    if (productId) {
        loadProductDetails(productId);
    } else {
        // Si no hay ID de producto, mostrar mensaje
        if (cartItems) {
            cartItems.innerHTML = '<div class="empty-cart">No se especificó un producto para comprar</div>';
        }
    }
    
    // Función para cargar los detalles del producto
    async function loadProductDetails(productId) {
        try {
            // Mostrar indicador de carga
            if (cartItems) {
                cartItems.innerHTML = '<div class="loading">Cargando detalles del producto...</div>';
            }
            
            // Obtener detalles del producto
            const response = await fetch(`http://localhost:8081/api/productos/productosXid?idproducto=${productId}`);
            
            if (!response.ok) {
                throw new Error('Error al cargar los detalles del producto');
            }
            
            const product = await response.json();
            console.log('Datos del producto:', product);
            
            // Crear el elemento del carrito
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="item-select">
                        <input type="checkbox" checked>
                    </div>
                    <div class="item-image">
                        <img src="${product.fotos && product.fotos.length > 0 ? product.fotos[0].url : 'https://via.placeholder.com/80x80'}" alt="${product.nombre}">
                    </div>
                    <div class="item-details">
                        <div class="item-name">${product.nombre}</div>
                        <div class="item-seller">Vendedor: ${product.usuario ? product.usuario.primernombre + ' ' + product.usuario.primerapellido : 'No especificado'}</div>
                    </div>
                    <div class="item-price">${formatCurrency(product.precio)}</div>
                    <div class="item-quantity">
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" class="quantity-input" value="01" readonly>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div class="item-subtotal">${formatCurrency(product.precio)}</div>
                </div>
            `;
            
            if (cartItems) {
                cartItems.innerHTML = cartItemHTML;
            }
            
            // Actualizar el resumen
            const subtotal = product.precio;
            const isv = subtotal * 0.15; // Asumiendo un ISV del 15%
            const total = subtotal + isv;
            
            if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
            if (isvElement) isvElement.textContent = formatCurrency(isv);
            if (totalPagarElement) totalPagarElement.textContent = formatCurrency(total);
            
            // Configurar eventos para los botones de cantidad
            setupQuantityButtons(product.precio);
            
            // Guardar IDs para la venta
            if (product.usuario) {
                // Guardar el ID del vendedor en un campo oculto o en localStorage
                localStorage.setItem('tempVendedorId', product.usuario.idusuario);
            }
            
        } catch (error) {
            console.error('Error:', error);
            if (cartItems) {
                cartItems.innerHTML = `<div class="error-message">Error al cargar el producto: ${error.message}</div>`;
            }
        }
    }
    
    // Función para configurar los botones de cantidad
    function setupQuantityButtons(price) {
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.querySelector('.quantity-input');
        const itemSubtotal = document.querySelector('.item-subtotal');
        
        if (!minusBtn || !plusBtn || !quantityInput || !itemSubtotal) return;
        
        minusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity.toString().padStart(2, '0');
                updateSubtotal(quantity, price);
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            quantity++;
            quantityInput.value = quantity.toString().padStart(2, '0');
            updateSubtotal(quantity, price);
        });
    }
    
    // Función para actualizar el subtotal
    function updateSubtotal(quantity, price) {
        const itemSubtotal = document.querySelector('.item-subtotal');
        const subtotal = price * quantity;
        
        if (itemSubtotal) itemSubtotal.textContent = formatCurrency(subtotal);
        
        // Actualizar el resumen
        if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
        const isv = subtotal * 0.15; // Asumiendo un ISV del 15%
        if (isvElement) isvElement.textContent = formatCurrency(isv);
        if (totalPagarElement) totalPagarElement.textContent = formatCurrency(subtotal + isv);
    }
    
    // Evento para el botón de regresar
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Evento para el botón de actualizar carrito
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            if (productId) {
                loadProductDetails(productId);
            }
        });
    }
    
    // Evento para el botón de pago
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            realizarVenta();
        });
    }
    
    // Función para realizar la venta
    async function realizarVenta() {
        try {
            if (!productId) {
                alert('No se ha seleccionado un producto para comprar');
                return;
            }
            
            // Obtener información del usuario
            const userInfo = localStorage.getItem('usuario') ? 
                            JSON.parse(localStorage.getItem('usuario')) : 
                            sessionStorage.getItem('usuario') ? 
                            JSON.parse(sessionStorage.getItem('usuario')) : 
                            null;
            
            if (!userInfo) {
                alert('Debe iniciar sesión para realizar la compra');
                window.location.href = `/src/view/login.html?redirect=${encodeURIComponent(window.location.href)}`;
                return;
            }
            
            // Obtener el ID del vendedor (guardado previamente)
            const idVendedor = localStorage.getItem('tempVendedorId') || 0;
            
            // Obtener el ID del comprador
            const idComprador = userInfo.idusuario || 0;
            
            // Datos para la venta
            const ventaData = {
                idVendedor: Number(idVendedor),
                idComprador: Number(idComprador),
                idProducto: Number(productId)
            };
            
            // Deshabilitar botón de pago
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            }
            
            console.log("📦 Datos que se enviarán a la API:");
            console.log(ventaData);
            
            // Llamada a la API para crear la venta
            const response = await fetch('http://localhost:8081/api/ventas/crearVenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const ventaResponse = await response.json();
            console.log('Venta creada:', ventaResponse);
            
            // Redirigir a la página de factura con los datos de la venta
            window.location.href = `/src/view/factura.html?idVenta=${ventaResponse.idventa || ''}&nombreComprador=${encodeURIComponent(ventaResponse.nombrecomprador || '')}&nombreVendedor=${encodeURIComponent(ventaResponse.nombrevendedor || '')}&subtotal=${ventaResponse.subtotal || 0}&isv=${ventaResponse.isv || 0}&total=${ventaResponse.totalpagar || 0}&fecha=${encodeURIComponent(ventaResponse.fechaemision || '')}&nombreProducto=${encodeURIComponent(ventaResponse.nombreProducto || '')}&idComprador=${idComprador}`;
            
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la venta. Por favor, intente nuevamente.');
            
            // Restaurar el botón
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.innerHTML = 'PROCEDER EL PAGO <i class="fas fa-arrow-right"></i>';
            }
        }
    }
});