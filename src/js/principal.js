document.getElementById('cargarDatos').addEventListener('click', () => {
    fetch('http://localhost:8081/api/categorias/obtenerCategorias') // URL de la API
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
                let li = document.createElement('li');
                li.textContent = categoria.nombre; // Suponiendo que la entidad tiene un atributo "nombre"
                lista.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});
