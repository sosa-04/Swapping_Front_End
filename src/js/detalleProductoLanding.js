document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all nav items
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.parentElement.classList.add('active');
        });
    });
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 1; // Default to ID 1 if not specified
    
    // Load product details
    loadProductDetails(productId);
    
    // Check if user is logged in
    checkUserLogin();
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(productId);
        });
    }
    
    // Buy now button
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            buyNow(productId);
        });
    }
});

// Function to load product details
async function loadProductDetails(productId) {
    try {
        // Mostrar indicador de carga
        const productContainer = document.querySelector('.product-container');
        if (productContainer) {
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando detalles del producto...';
            productContainer.appendChild(loadingIndicator);
        }
        
        const response = await fetch(`http://localhost:8081/api/productos/productosXid?idproducto=${productId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los detalles del producto');
        }
        
        const product = await response.json();
        console.log('Datos del producto:', product);
        
        // Eliminar indicador de carga
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Update UI with product details
        updateProductUI(product);
        
        // Actualizar la información del vendedor directamente desde el objeto del producto
        if (product.usuario) {
            updateSellerUI(product.usuario);
        } else {
            // Si el producto no tiene usuario asociado, mostrar información genérica
            updateSellerUI({
                primernombre: "Vendedor",
                primerapellido: "Anónimo",
                calificacion: 0,
                fotoperfil: "https://randomuser.me/api/portraits/lego/1.jpg"
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('No se pudo cargar la información del producto. Por favor, inténtelo de nuevo más tarde.');
    }
}

// Function to update seller UI
function updateSellerUI(user) {
    // Update seller name
    const sellerName = document.querySelector('.seller-name');
    if (sellerName) {
        sellerName.textContent = `${user.primernombre || ''} ${user.primerapellido || ''}`.trim();
    }
    
    // Update seller avatar
    const sellerAvatar = document.querySelector('.seller-avatar');
    if (sellerAvatar) {
        sellerAvatar.src = user.fotoperfil || "https://randomuser.me/api/portraits/lego/1.jpg";
        sellerAvatar.alt = `${user.primernombre || 'Vendedor'} ${user.primerapellido || ''}`.trim();
    }
    
    // Update seller rating
    updateSellerRating(user.calificacion || 0);
}

// Function to update seller rating
function updateSellerRating(rating) {
    const sellerRating = document.querySelector('.seller-rating');
    if (!sellerRating) return;
    
    // Clear existing stars
    sellerRating.innerHTML = '';
    
    // Add stars based on rating
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= rating ? 'fas fa-star' : 'far fa-star';
        sellerRating.appendChild(star);
    }
}

// Function to update UI with product details
function updateProductUI(product) {
    // Update product title
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = product.nombre;
    }
    
    // Update product price
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        productPrice.textContent = `L${product.precio.toLocaleString()}`;
    }
    
    // Update product description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = product.descripcion || 'No hay descripción disponible para este producto.';
    }
    
    // Update product specifications
    updateProductSpecs(product);
    
    // Update product images
    updateProductImages(product);
    
    // Update document title
    document.title = `${product.nombre} - Swapping`;
}

// Function to update product specifications
function updateProductSpecs(product) {
    // Update brand
    const productBrand = document.getElementById('productBrand');
    if (productBrand) {
        productBrand.textContent = product.marca ? product.marca.nombre : 'No especificado';
    }
    
    // Update model
    const productModel = document.getElementById('productModel');
    if (productModel) {
        productModel.textContent = product.modelo ? product.modelo.nombre : 'No especificado';
    }
    
    // Update color
    const productColor = document.getElementById('productColor');
    if (productColor) {
        productColor.textContent = product.color ? product.color.nombre : 'No especificado';
    }
    
    // Update storage
    const productStorage = document.getElementById('productStorage');
    if (productStorage) {
        productStorage.textContent = product.almacenamiento ? product.almacenamiento.tamanioalmacenamiento : 'No especificado';
    }
    
    // Update stock
    const productStock = document.getElementById('productStock');
    if (productStock) {
        productStock.textContent = product.stock !== undefined ? product.stock : 'No especificado';
    }
    
    // Update condition
    const productCondition = document.getElementById('productCondition');
    if (productCondition) {
        const conditionText = getConditionText(product.estado);
        productCondition.textContent = conditionText;
    }
}

// Function to get condition text based on state number
function getConditionText(state) {
    switch (state) {
        case 0:
            return 'Nuevo';
        case 1:
            return 'Como nuevo';
        case 2:
            return 'Buen estado';
        case 3:
            return 'Usado';
        case 4:
            return 'Con detalles';
        default:
            return 'No especificado';
    }
}

// Function to update product images
function updateProductImages(product) {
    // Get main image element
    const mainProductImage = document.getElementById('mainProductImage');
    
    // Get thumbnails container
    const galleryThumbnails = document.getElementById('galleryThumbnails');
    
    // Clear existing thumbnails
    if (galleryThumbnails) {
        galleryThumbnails.innerHTML = '';
    }
    
    // Check if product has photos
    if (product.fotos && product.fotos.length > 0) {
        // Set main image to first photo
        if (mainProductImage) {
            mainProductImage.src = product.fotos[0].url;
            mainProductImage.alt = product.nombre;
        }
        
        // Create thumbnails for all photos
        product.fotos.forEach((photo, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnailDiv.dataset.index = index;
            
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = photo.url;
            thumbnailImg.alt = `${product.nombre} - Imagen ${index + 1}`;
            
            thumbnailDiv.appendChild(thumbnailImg);
            
            // Add click event to thumbnail
            thumbnailDiv.addEventListener('click', function() {
                // Update main image
                mainProductImage.src = photo.url;
                
                // Update active thumbnail
                document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                this.classList.add('active');
            });
            
            galleryThumbnails.appendChild(thumbnailDiv);
        });
    } else {
        // If no photos, use a placeholder
        if (mainProductImage) {
            mainProductImage.src = 'https://via.placeholder.com/400x400?text=No+Image';
            mainProductImage.alt = 'No hay imagen disponible';
        }
    }
}

// Function to add product to cart
function addToCart(productId) {
    // Check if user is logged in
    const userInfo = localStorage.getItem('usuario') ? 
                    JSON.parse(localStorage.getItem('usuario')) : 
                    sessionStorage.getItem('usuario') ? 
                    JSON.parse(sessionStorage.getItem('usuario')) : 
                    null;
    
    if (!userInfo) {
        // If not logged in, redirect to login page
        alert('Debe iniciar sesión para agregar productos al carrito');
        window.location.href = `/src/view/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
    }
    
    // Get cart from localStorage or initialize empty array
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        // If product is already in cart, increment quantity
        existingProduct.quantity += 1;
    } else {
        // If product is not in cart, add it
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showSuccessMessage('Producto añadido al carrito');
}

function buyNow(productId) {
    // Check if user is logged in
    const userInfo = localStorage.getItem('usuario') ? 
                    JSON.parse(localStorage.getItem('usuario')) : 
                    sessionStorage.getItem('usuario') ? 
                    JSON.parse(sessionStorage.getItem('usuario')) : 
                    null;
    
    if (!userInfo) {
        // If not logged in, redirect to login page
        alert('Debe iniciar sesión para comprar productos');
        window.location.href = `/src/view/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
    }
    
    // Redirigir a la página de ventas con el ID del producto
    window.location.href = `/src/view/login.html`;
}

// Function to update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    // Get cart from localStorage
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Calculate total quantity
    const totalQuantity = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    
    // Update cart count
    cartCount.textContent = totalQuantity;
}

// Function to check if user is logged in
function checkUserLogin() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userInfo = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
    
    if (token && userInfo) {
        // User is logged in, update UI
        const loginBtn = document.querySelector('.login-btn');
        const registerLink = document.querySelector('.register-link');
        
        if (loginBtn) {
            loginBtn.textContent = userInfo.primernombre || 'Mi Cuenta';
            loginBtn.href = '/src/view/perfil.html';
        }
        
        if (registerLink) {
            registerLink.style.display = 'none';
        }
        
        // Update cart count
        updateCartCount();
    }
}

// Function to show error message
function showErrorMessage(message) {
    const productContainer = document.querySelector('.product-container');
    
    if (productContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Clear container and show error
        productContainer.innerHTML = '';
        productContainer.appendChild(errorDiv);
    }
}

// Function to show success message
function showSuccessMessage(message) {
    // Crear elemento de mensaje
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Añadir al cuerpo del documento
    document.body.appendChild(successDiv);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        successDiv.classList.add('fade-out');
        setTimeout(() => {
            successDiv.remove();
        }, 500);
    }, 3000);
}

// Añadir estilos para los mensajes y el indicador de carga
const style = document.createElement('style');
style.textContent = `
    .loading-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        font-size: 16px;
        color: #666;
    }
    
    .loading-indicator i {
        margin-right: 10px;
        color: #0088ff;
    }
    
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 4px;
        margin: 20px 0;
        display: flex;
        align-items: center;
    }
    
    .error-message i {
        margin-right: 10px;
        font-size: 20px;
    }
    
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .success-message i {
        margin-right: 10px;
        font-size: 20px;
    }
    
    .success-message.fade-out {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);