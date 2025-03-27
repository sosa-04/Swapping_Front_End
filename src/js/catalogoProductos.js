document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.main-nav a');
    const productSections = document.querySelectorAll('.products-section');
    
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
            
            // Hide all product sections
            productSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected product section
            if (category !== 'inicio' && category !== 'mas') {
                const targetSection = document.getElementById(category);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            } else {
                // For "Inicio" and "Más", show the first section (celulares) as default
                document.getElementById('celulares').classList.add('active');
            }
        });
    });
    
    // Product hover effect
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                const activeSection = document.querySelector('.products-section.active');
                const products = activeSection.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    const productName = product.querySelector('h3').textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
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
        });
    });
    
    // Details button click
    const detailsBtns = document.querySelectorAll('.details-btn');
    
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert('Ver detalles de: ' + productName);
        });
    });
    
    // Category select
    const categorySelect = document.querySelector('.category-select');
    
    if (categorySelect) {
        categorySelect.addEventListener('click', function() {
            alert('Seleccionar categoría');
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }
});