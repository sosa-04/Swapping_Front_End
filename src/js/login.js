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
    let isLoginMode = true;
    
    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', function() {
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Bienvenido a Swapping';
            document.querySelector('.login-description').textContent = 'Inicia sesión para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Iniciar Sesión';
            isLoginMode = true;
        });
        
        registerBtn.addEventListener('click', function() {
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Crear una cuenta';
            document.querySelector('.login-description').textContent = 'Regístrate para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Registrarse';
            isLoginMode = false;
        });
    }
    
    // Form submission
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showMessage('Por favor, complete todos los campos', 'error');
                return;
            }
            
            // Deshabilitar el botón de envío para evitar múltiples envíos
            const submitBtn = document.querySelector('.login-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = isLoginMode ? 'Iniciando sesión...' : 'Registrando...';
            
            try {
                if (isLoginMode) {
                    // Iniciar sesión
                    await iniciarSesion(email, password);
                } else {
                    // Registrar usuario (esta función se implementaría según la API disponible)
                    showMessage('La funcionalidad de registro aún no está implementada', 'warning');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage(error.message || 'Ha ocurrido un error. Inténtelo de nuevo.', 'error');
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
            }
        });
    }
    
    // Función para iniciar sesión
    async function iniciarSesion(correo, contrasena) {
        try {
            const response = await fetch('http://localhost:8081/api/usuarios/iniciarSesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contrasena })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al iniciar sesión');
            }
            
            // Obtener los datos del usuario
            const userData = await response.json();
            
            // Guardar token si existe
            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
            }
            
            // Guardar la información completa del usuario
            localStorage.setItem('usuario', JSON.stringify(userData));
            
            // Verificar si se guardó correctamente
            console.log('Usuario guardado:', JSON.parse(localStorage.getItem('usuario')));
            
            showMessage('Inicio de sesión exitoso', 'success');
            
            // Redireccionar a la página principal después de un breve retraso
            setTimeout(() => {
                window.location.href = '/src/view/catalogoUsuario.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        // Verificar si ya existe un mensaje y eliminarlo
        const existingMessage = document.querySelector('.message-container');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear el contenedor del mensaje
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${type}`;
        
        // Crear el contenido del mensaje
        messageContainer.innerHTML = `
            <div class="message-content">
                <i class="fas ${getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Añadir el mensaje al formulario
        loginForm.insertAdjacentElement('beforebegin', messageContainer);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            messageContainer.classList.add('fade-out');
            setTimeout(() => {
                messageContainer.remove();
            }, 500);
        }, 5000);
    }
    
    // Función para obtener el icono según el tipo de mensaje
    function getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-info-circle';
        }
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.social-login.google');
    const facebookBtn = document.querySelector('.social-login.facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            console.log('Iniciar sesión con Google');
            showMessage('Inicio de sesión con Google no disponible en este momento', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            console.log('Iniciar sesión con Facebook');
            showMessage('Inicio de sesión con Facebook no disponible en este momento', 'info');
        });
    }
});