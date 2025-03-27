document.getElementById('cargarDatos').addEventListener('click', () => {
    fetch('http://localhost:8081/api/categorias/obtenerCategorias')
        .then(response => { 
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            return response.json();
        })
        .then(data => {
            let lista = document.getElementById('lista');
            lista.innerHTML = ''; // Limpia la lista antes de agregar nuevos elementos
            
            data.forEach(categoria => {
                let liCategoria = document.createElement('li');
                liCategoria.textContent = categoria.nombre;
                
                // Crear una lista para los productos dentro de la categoría
                let ulProductos = document.createElement('ul');
                
                // Agregar los productos de la categoría
                categoria.productos.forEach(producto => {
                    let liProducto = document.createElement('li');
                    liProducto.textContent = `📦 ${producto.nombre} - 💲${producto.precio}`;
                    ulProductos.appendChild(liProducto);
                });

                // Agregar la lista de productos debajo de la categoría
                liCategoria.appendChild(ulProductos);
                lista.appendChild(liCategoria);
            });
        })
        .catch(error => console.error('Error:', error));
});
