document.addEventListener('DOMContentLoaded', function () {
    // Slider functionality
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Remove active class from all dots
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-open');
    });

    // Simulate loading products
    function simulateProductLoad() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, 100 * index);
        });
    }

    simulateProductLoad();

    // Add to cart functionality
    const detailsBtns = document.querySelectorAll('.details-btn');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;
    
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCount.textContent = count;
            
            // Animation for the button
            btn.classList.add('clicked');
            setTimeout(() => {
                btn.classList.remove('clicked');
            }, 300);
        });
    });

    // Obtener categorías de la API y agregarlas a la navegación y el select
    const navList = document.querySelector('.main-nav ul');
    const categorySelect = document.querySelector('.category-select');

    fetch('http://localhost:8081/api/categorias/obtenerCategorias')
        .then(response => response.json())
        .then(data => {
            // Agregar categorías al menú de navegación
            navList.innerHTML = `<li class="active"><a href="#">Inicio</a></li>`;
            data.forEach(category => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#">${category.nombre}</a>`;
                navList.appendChild(li);
            });

            // Agregar categorías al select de búsqueda
            categorySelect.innerHTML = `<option value="">Categoría...</option>`;
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nombre;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error cargando categorías:', error));
});
