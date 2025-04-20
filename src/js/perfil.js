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
    
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            alert('Función de edición de perfil no implementada');
        });
    }
    
    // Buy buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert(`Producto añadido al carrito: ${productName}`);
        });
    });
    
    // Cargar información del usuario
    loadUserProfile();
    
    // Función para cargar la información del perfil del usuario
    function loadUserProfile() {
        // Obtener datos del usuario del almacenamiento
        const userInfo = localStorage.getItem('usuario') ? 
                        JSON.parse(localStorage.getItem('usuario')) : 
                        sessionStorage.getItem('usuario') ? 
                        JSON.parse(sessionStorage.getItem('usuario')) : 
                        null;
        
        if (!userInfo) {
            console.log('No se encontró información del usuario');
            // Si no hay información de usuario, redirigir a la página de inicio de sesión
            window.location.href = '/src/view/login.html';
            return;
        }
        
        console.log('Información del usuario cargada:', userInfo);
        
        // Actualizar la interfaz con la información del usuario
        updateProfileUI(userInfo);
        
        // Actualizar el estado de inicio de sesión en la barra de navegación
        updateLoginStatus(userInfo);
    }
    
    // Función para actualizar la interfaz con la información del usuario
    function updateProfileUI(user) {
        // Actualizar foto de perfil
        const profileImage = document.querySelector('.profile-image img');
        if (profileImage && user.fotoperfil) {
            profileImage.src = user.fotoperfil;
            profileImage.alt = `${user.primernombre} ${user.primerapellido}`;
        }
        
        // Actualizar nombre
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            const fullName = `${user.primernombre || ''} ${user.segundonombre || ''} ${user.primerapellido || ''} ${user.segundoapellido || ''}`;
            profileName.textContent = fullName.replace(/\s+/g, ' ').trim();
        }
        
        // Actualizar calificación
        if (user.calificacion !== undefined) {
            updateRatingStars(user.calificacion);
        }
        
        // Actualizar información de contacto
        const contactItems = document.querySelectorAll('.contact-info li');
        if (contactItems.length > 0) {
            // Email
            const emailItem = contactItems[0].querySelector('span');
            if (emailItem && user.email) {
                emailItem.textContent = user.email;
            }
            
            // Teléfono
            const phoneItem = contactItems[1].querySelector('span');
            if (phoneItem && user.telefono) {
                phoneItem.textContent = user.telefono;
            }
        }
        
        // Actualizar descripción
        const aboutSection = document.querySelector('.about-section p');
        if (aboutSection && user.descripcion) {
            aboutSection.textContent = user.descripcion;
        }
        
        // Actualizar rol de usuario si está disponible
        if (user.roles && user.roles.nombrerol) {
            const memberSince = document.querySelector('.member-since');
            if (memberSince) {
                memberSince.textContent = `Rol: ${user.roles.nombrerol}`;
            }
        }
    }
    
    // Función para actualizar las estrellas de calificación
    function updateRatingStars(rating) {
        const ratingContainer = document.querySelector('.profile-rating');
        if (!ratingContainer) return;
        
        // Limpiar estrellas existentes
        ratingContainer.innerHTML = '';
        
        // Agregar estrellas según la calificación
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= rating ? 'fas fa-star' : 'far fa-star';
            ratingContainer.appendChild(star);
        }
        
        // Agregar contador de calificaciones si existe
        const ratingCount = document.createElement('span');
        ratingCount.className = 'rating-count';
        ratingCount.textContent = '(3)'; // Puedes ajustar esto si tienes el número real de calificaciones
        ratingContainer.appendChild(ratingCount);
    }
    
    // Función para actualizar el estado de inicio de sesión en la barra de navegación
    function updateLoginStatus(user) {
        const loginBtn = document.querySelector('.login-btn');
        const registerLink = document.querySelector('.register-link');
        
        if (loginBtn) {
            loginBtn.textContent = `${user.primernombre || 'Mi Cuenta'}`;
            loginBtn.href = '/src/view/perfil.html';
        }
        
        if (registerLink) {
            registerLink.style.display = 'none';
        }
        
        // Actualizar contador del carrito si existe
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            // Aquí podrías obtener el número real de elementos en el carrito si tienes esa información
            cartCount.textContent = '0';
        }
    }
    
    // Función para cerrar sesión
    function logout() {
        // Eliminar datos de sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        
        // Redirigir a la página de inicio
        window.location.href = '/src/view/landing.html';
    }
    
    // Agregar botón de cerrar sesión
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = 'Cerrar sesión';
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        userActions.appendChild(logoutBtn);
    }
});