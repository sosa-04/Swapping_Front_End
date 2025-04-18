document.addEventListener('DOMContentLoaded', function() {
    // Fetch categorías y productos desde la API
    fetchCategorias();
    
    // Product hover effect
    setupProductHoverEffects();
    
    // Details button click
    setupDetailsButtons(grupos);
    
    // Mobile menu toggle
    setupMobileMenu();
    
    // Slider dots functionality
    setupSliderDots();
});

// Función para obtener las categorías y productos desde la API
async function fetchCategorias() {
    try {
        const response = await fetch('http://localhost:8081/api/categorias/obtenerCategorias');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        
        const categorias = await response.json();
        console.log('Categorías obtenidas:', categorias);
        
        // Llenar el select de categorías
        populateCategorySelect(categorias);
        
        // Actualizar la navegación con las categorías de la API
        updateNavigationWithCategories(categorias);
        
        // Crear secciones para cada categoría
        createCategorySections(categorias);
        
        // Actualizar la sección de productos destacados en la página de inicio
        updateFeaturedProducts(categorias);
        
        // Configurar la navegación
        setupNavigation();
        
        // Configurar la búsqueda para los productos cargados
        setupSearch();
        
    } catch (error) {
        console.error('Error:', error);
        // Si hay un error, mostrar los productos de ejemplo
        console.log('Mostrando productos de ejemplo');
    }
}

// Función para llenar el select de categorías
function populateCategorySelect(categorias) {
    const categorySelect = document.querySelector('.category-select');
    if (!categorySelect) return;
    
    // Limpiar opciones existentes excepto la primera
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Añadir las categorías como opciones
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.idcategoria;
        option.textContent = categoria.nombre;
        categorySelect.appendChild(option);
    });
    
    // Configurar el evento change
    categorySelect.addEventListener('change', function() {
        const categoryId = this.value;
        if (categoryId) {
            // Buscar el enlace de navegación correspondiente y simular un clic
            const navLink = document.querySelector(`.main-nav a[data-category-id="${categoryId}"]`);
            if (navLink) {
                navLink.click();
            }
        }
    });
}

// Función para actualizar la navegación con las categorías de la API
function updateNavigationWithCategories(categorias) {
    const navUl = document.querySelector('.main-nav ul');
    if (!navUl) return;
    
    // Mantener solo el elemento "Inicio"
    while (navUl.children.length > 1) {
        navUl.removeChild(navUl.lastChild);
    }
    
    // Añadir las categorías a la navegación
    categorias.forEach((categoria, index) => {
        const li = document.createElement('li');
        const isNew = index === 0; // Marcar la primera categoría como nueva (ejemplo)
        
        li.innerHTML = `
            <a href="#" data-category="categoria-${categoria.idcategoria}" data-category-id="${categoria.idcategoria}">
                ${categoria.nombre}
                ${isNew ? '<span class="new-badge">NEW</span>' : ''}
            </a>
        `;
        
        navUl.appendChild(li);
    });
    
    // Añadir el enlace "Más" al final
    const masLi = document.createElement('li');
    masLi.innerHTML = '<a href="#" data-category="mas">Más</a>';
    navUl.appendChild(masLi);
}

// Función para crear secciones para cada categoría
function createCategorySections(categorias) {
    const contentSections = document.querySelector('.content-sections');
    if (!contentSections) return;
    
    // Mantener la sección de inicio
    const inicioSection = document.getElementById('inicio-section');
    
    // Eliminar todas las secciones de categoría existentes
    const existingSections = contentSections.querySelectorAll('.category-section:not(#inicio-section)');
    existingSections.forEach(section => section.remove());
    
    // Crear una sección para cada categoría
    categorias.forEach(categoria => {
        const categorySection = document.createElement('section');
        categorySection.id = `categoria-${categoria.idcategoria}-section`;
        categorySection.className = 'category-section';
        
        // Actualizar la sección con los productos destacados
        updateSectionWithFeaturedProducts(categorySection, categoria);
        
        // Añadir la sección al contenedor
        contentSections.appendChild(categorySection);
    });
}

// Función para actualizar una sección con productos destacados
function updateSectionWithFeaturedProducts(section, categoria) {
    // Limpiar el contenido actual de la sección
    section.innerHTML = '';
    
    // Crear el contenedor principal
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-container';
    
    // Crear el encabezado con título y búsqueda
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = `
        <h2>${categoria.nombre}</h2>
        <div class="category-search">
            <input type="text" placeholder="Buscar en ${categoria.nombre.toLowerCase()}">
            <button class="search-btn">
                <i class="fas fa-search"></i>
            </button>
        </div>
    `;
    categoryContainer.appendChild(headerDiv);
    
    // Ordenar productos por precio (de mayor a menor) para destacar los más caros
    const productosOrdenados = [...categoria.productos].sort((a, b) => b.precio - a.precio);
    
    // Dividir los productos en grupos para mostrarlos en secciones
    const productosPorSeccion = 5; // Número de productos por sección
    const grupos = [];
    
    for (let i = 0; i < productosOrdenados.length; i += productosPorSeccion) {
        grupos.push(productosOrdenados.slice(i, i + productosPorSeccion));
    }
    
    // Crear secciones para cada grupo de productos
    grupos.forEach((grupo, index) => {
        // Determinar el título de la sección según el índice
        let tituloSeccion = '';
        if (index === 0) {
            tituloSeccion = `Lo más destacado en ${categoria.nombre}`;
        } else if (index === 1) {
            tituloSeccion = `Ofertas en ${categoria.nombre}`;
        } else {
            tituloSeccion = `Más ${categoria.nombre}`;
        }
        
        // Crear la sección de productos
        const productSection = document.createElement('section');
        productSection.className = 'featured-products';
        
        // Crear el encabezado de la sección
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
            <h2>${tituloSeccion}</h2>
            <a href="#" class="view-all">Ver Todo »</a>
        `;
        
        // Crear la cuadrícula de productos
        const productGrid = document.createElement('div');
        productGrid.className = 'product-grid';
        productGrid.innerHTML = generateProductsHTML(grupo);
        
        // Añadir elementos a la sección
        productSection.appendChild(sectionHeader);
        productSection.appendChild(productGrid);
        
        // Añadir la sección al contenedor principal
        categoryContainer.appendChild(productSection);
    });
    
    // Si no hay productos, mostrar un mensaje
    if (productosOrdenados.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No hay productos disponibles en esta categoría.';
        categoryContainer.appendChild(emptyMessage);
    }
    
    // Añadir el contenedor a la sección
    section.appendChild(categoryContainer);
}

// Función para generar el HTML de los productos
function generateProductsHTML(productos) {
    if (!productos || productos.length === 0) {
        return '<p>No hay productos disponibles en esta categoría.</p>';
    }
    
    return productos.map(producto => {
        // Obtener la primera foto del producto o usar un placeholder
        const fotoUrl = producto.fotos && producto.fotos.length > 0 
            ? producto.fotos[0].url 
            : '/placeholder.svg?height=200&width=150';
        
        // Generar información adicional del producto
        let infoAdicional = '';
        if (producto.almacenamiento && producto.almacenamiento.tamanioalmacenamiento) {
            infoAdicional += `${producto.almacenamiento.tamanioalmacenamiento} `;
        }
        if (producto.color && producto.color.nombre) {
            infoAdicional += `| ${producto.color.nombre}`;
        }
        
        return `
            <div class="product-card" data-id="${producto.idproducto}">
                <div class="product-image">
                    <img src="${fotoUrl}" alt="${producto.nombre}">
                </div>
                <h3>${producto.nombre}</h3>
                ${infoAdicional ? `<p class="product-info">${infoAdicional}</p>` : ''}
                <a href="/src/view/detalleProducto.html?id=${producto.idproducto}" class="details-btn" data-id="${producto.idproducto}">Ver más detalles</a>
            </div>
        `;
    }).join('');
}


// Función para actualizar los productos destacados en la página de inicio
function updateFeaturedProducts(categorias) {
    // Buscar la categoría de celulares o usar la primera categoría
    const celularesCategoria = categorias.find(cat => 
        cat.nombre.toLowerCase().includes('celular') || 
        cat.nombre.toLowerCase().includes('móvil') ||
        cat.nombre.toLowerCase().includes('phone')
    ) || categorias[0];
    
    if (!celularesCategoria) return;
    
    const featuredProductsGrid = document.querySelector('.featured-products .product-grid');
    if (!featuredProductsGrid) return;
    
    // Actualizar el título de la sección
    const featuredTitle = document.querySelector('.featured-products .section-header h2');
    if (featuredTitle) {
        featuredTitle.textContent = `Lo más destacado en ${celularesCategoria.nombre}`;
    }
    
    // Ordenar productos por precio (de mayor a menor) para destacar los más caros
    const productosDestacados = [...celularesCategoria.productos]
        .sort((a, b) => b.precio - a.precio)
        .slice(0, 5); // Mostrar los 5 más caros
    
    // Mostrar los productos destacados
    featuredProductsGrid.innerHTML = generateProductsHTML(productosDestacados);
}

// Función para configurar la navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const categorySections = document.querySelectorAll('.category-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category from data attribute
            const category = this.getAttribute('data-category');
            
            // Remove active class from all nav items
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.parentElement.classList.add('active');
            
            // Hide all category sections
            categorySections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected category section
            if (category === 'inicio' || category === 'mas') {
                document.getElementById('inicio-section').classList.add('active');
            } else {
                const targetSection = document.getElementById(category + '-section');
                if (targetSection) {
                    targetSection.classList.add('active');
                } else {
                    // Si no se encuentra la sección, mostrar inicio
                    document.getElementById('inicio-section').classList.add('active');
                }
            }
        });
    });
}

// Función para configurar la búsqueda
function setupSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || e.target.value.length > 2) {
                const searchTerm = this.value.toLowerCase();
                const activeSection = this.closest('.category-section') || 
                                     document.querySelector('.category-section.active');
                
                if (activeSection) {
                    const products = activeSection.querySelectorAll('.product-card');
                    
                    products.forEach(product => {
                        const productName = product.querySelector('h3').textContent.toLowerCase();
                        const productInfo = product.querySelector('.product-info')?.textContent.toLowerCase() || '';
                        
                        if (productName.includes(searchTerm) || productInfo.includes(searchTerm)) {
                            product.style.display = 'block';
                        } else {
                            product.style.display = 'none';
                        }
                    });
                    
                    if (searchTerm === '') {
                        products.forEach(product => {
                            product.style.display = 'block';
                        });
                    }
                }
            }
        });
    });
}

// Función para configurar los efectos hover de los productos
function setupProductHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.style.transform = 'translateY(-5px)';
            productCard.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.style.transform = 'translateY(0)';
            productCard.style.boxShadow = 'none';
        }
    });
}

// Función para configurar los botones de detalles
function setupDetailsButtons(productos) {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('details-btn')) {
            e.preventDefault();
            window.location.href = '/src/view/detalleProducto.html?id=${producto.idproducto}';
        }
    });
}


// Función para configurar el menú móvil
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }
}

// Función para configurar los puntos del slider
function setupSliderDots() {
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Remove active class from all dots
            dots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            this.classList.add('active');
            
            // Aquí se cambiaría la imagen del slider
            console.log('Cambiado a la diapositiva', index + 1);
        });
    });
}