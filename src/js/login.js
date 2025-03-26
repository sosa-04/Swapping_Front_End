document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Toggle between login and register
    const loginBtn = document.querySelector('.btn-primary');
    const registerBtn = document.querySelector('.btn-secondary');
    
    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', function() {
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Bienvenido a Swapping';
            document.querySelector('.login-description').textContent = 'Inicia sesión para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Iniciar Sesión';
        });
        
        registerBtn.addEventListener('click', function() {
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Crear una cuenta';
            document.querySelector('.login-description').textContent = 'Regístrate para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Registrarse';
        });
    }
    
    // Form submission
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                alert('Por favor, complete todos los campos');
                return;
            }
            
            // Aquí normalmente enviarías los datos al servidor
            console.log('Formulario enviado:', { email, password });
            
            // Simulación de inicio de sesión exitoso
            alert('Inicio de sesión exitoso');
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.social-login.google');
    const facebookBtn = document.querySelector('.social-login.facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            console.log('Iniciar sesión con Google');
            // Aquí normalmente redirigirías a la autenticación de Google
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            console.log('Iniciar sesión con Facebook');
            // Aquí normalmente redirigirías a la autenticación de Facebook
        });
    }
});