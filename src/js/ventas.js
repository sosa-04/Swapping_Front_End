document.addEventListener('DOMContentLoaded', function() {
    const createSaleBtn = document.getElementById('createSaleBtn');
    const responseContainer = document.getElementById('responseContainer');
    const backBtn = document.getElementById('backBtn');
    const payBtn = document.getElementById('payBtn');

    // Elementos para mostrar la respuesta
    const nombreComprador = document.getElementById('nombreComprador');
    const nombreVendedor = document.getElementById('nombreVendedor');
    const nombreProducto = document.getElementById('nombreProducto');
    const fechaEmision = document.getElementById('fechaEmision');
    const subtotal = document.getElementById('subtotal');
    const isv = document.getElementById('isv');
    const totalPagar = document.getElementById('totalPagar');

    // Función para formatear moneda
    function formatCurrency(value) {
        return `L ${parseFloat(value).toFixed(2)}`;
    }

    // Evento para crear una venta
    createSaleBtn.addEventListener('click', function() {
        const idVendedor = document.getElementById('idVendedor').value;
        const idComprador = document.getElementById('idComprador').value;
        const idProducto = document.getElementById('idProducto').value;

        // Datos para enviar a la API
        const data = {
            idVendedor: parseInt(idVendedor),
            idComprador: parseInt(idComprador),
            idProducto: parseInt(idProducto)
        };

        // Llamada a la API
        fetch('http://localhost:8081/api/ventas/crearVenta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar los datos de la respuesta
            nombreComprador.textContent = data.nombrecomprador;
            nombreVendedor.textContent = data.nombrevendedor;
            nombreProducto.textContent = data.nombreProducto;
            fechaEmision.textContent = new Date(data.fechaemision).toLocaleDateString();
            
            subtotal.textContent = formatCurrency(data.subtotal);
            isv.textContent = formatCurrency(data.isv);
            totalPagar.textContent = formatCurrency(data.totalpagar);
            
            // Mostrar el contenedor de respuesta
            responseContainer.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la venta. Por favor, intente nuevamente.');
        });
    });

    // Evento para el botón de regresar
    backBtn.addEventListener('click', function() {
        // Aquí puedes redirigir a otra página o simplemente recargar
        window.location.href = 'index.html';
    });

    // Evento para el botón de pago
    payBtn.addEventListener('click', function() {
        alert('Procesando el pago...');
        // Aquí puedes implementar la lógica para procesar el pago
    });
});