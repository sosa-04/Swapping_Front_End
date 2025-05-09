// Importar las funciones de Firebase
import { storage, ref, uploadBytes, getDownloadURL } from './firebase-config.js';


// Llamar a esta función al cargar la página
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
    
    // Obtener el formulario y los campos adicionales de registro
    const loginForm = document.querySelector('.login-form');
    const registerFields = document.getElementById('register-fields');
    const roleSelector = document.getElementById('role-selector');
    const vendorFields = document.getElementById('vendor-fields');
    
    // Variables para las fotos
    let dniPhotoFile = null;
    let dniPhotoBase64 = null;
    let profilePhotoFile = null;
    let profilePhotoBase64 = null;
    
    // Configurar el input de archivo para la foto del DNI
    const dniPhotoInput = document.getElementById('dniPhoto');
    const dniPreview = document.getElementById('dniPreview');
    
    if (dniPhotoInput) {
        dniPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            dniPhotoFile = file;
            
            // Mostrar vista previa
            const reader = new FileReader();
            reader.onload = function(event) {
                dniPhotoBase64 = event.target.result;
                dniPreview.innerHTML = `
                    <img src="${dniPhotoBase64}" alt="Vista previa del DNI">
                    <span>${file.name}</span>
                `;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Configurar el input de archivo para la foto de perfil
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePreview');
    
    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            profilePhotoFile = file;
            
            // Mostrar vista previa
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePhotoBase64 = event.target.result;
                profilePreview.innerHTML = `
                    <img src="${profilePhotoBase64}" alt="Vista previa de la foto de perfil" style="border-radius: 50%;">
                    <span>${file.name}</span>
                `;
            };
            reader.readAsDataURL(file);
        });
    }
    
    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', function() {
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Bienvenido a Swapping';
            document.querySelector('.login-description').textContent = 'Inicia sesión para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Iniciar Sesión';
            
            // Ocultar campos de registro
            if (registerFields) registerFields.style.display = 'none';
            if (roleSelector) roleSelector.style.display = 'none';
            if (vendorFields) vendorFields.style.display = 'none';
            
            // Mostrar opciones de recordar y olvidar contraseña
            const formOptions = document.querySelector('.form-options');
            if (formOptions) formOptions.style.display = 'flex';
            
            isLoginMode = true;
        });
        
        registerBtn.addEventListener('click', function() {
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            document.querySelector('.welcome-title').textContent = 'Crear una cuenta';
            document.querySelector('.login-description').textContent = 'Regístrate para comprar y vender productos electrónicos';
            document.querySelector('.login-submit-btn').textContent = 'Registrarse';
            
            // Mostrar campos de registro
            if (registerFields) registerFields.style.display = 'block';
            if (roleSelector) roleSelector.style.display = 'block';
            
            // Verificar si se debe mostrar los campos de vendedor
            if (roleSelector && vendorFields) {
                const selectedRole = document.querySelector('input[name="role"]:checked').value;
                vendorFields.style.display = selectedRole === 'vendor' ? 'block' : 'none';
            }
            
            // Ocultar opciones de recordar y olvidar contraseña
            const formOptions = document.querySelector('.form-options');
            if (formOptions) formOptions.style.display = 'none';
            
            isLoginMode = false;
        });
    }
    
    // Manejar cambio de rol
    if (roleSelector) {
        roleSelector.addEventListener('change', function(e) {
            if (e.target.name === 'role' && vendorFields) {
                vendorFields.style.display = e.target.value === 'vendor' ? 'block' : 'none';
            }
        });
    }
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (isLoginMode) {
                // Validación para inicio de sesión
                if (!email || !password) {
                    showMessage('Por favor, complete todos los campos', 'error');
                    return;
                }
            } else {
                // Validación para registro
                const firstName = document.getElementById('firstName')?.value;
                const lastName = document.getElementById('lastName')?.value;
                const phone = document.getElementById('phone')?.value;
                const confirmPassword = document.getElementById('confirmPassword')?.value;
                const role = document.querySelector('input[name="role"]:checked')?.value;
                
                if (!email || !password || !firstName || !lastName || !phone || !confirmPassword || !role) {
                    showMessage('Por favor, complete todos los campos obligatorios', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showMessage('Las contraseñas no coinciden', 'error');
                    return;
                }
                
                // Validación adicional para vendedores
                if (role === 'vendor') {
                    if (!dniPhotoFile) {
                        showMessage('Por favor, suba una foto de su DNI', 'error');
                        return;
                    }
                }
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
                    // Registrar usuario según el rol seleccionado
                    const role = document.querySelector('input[name="role"]:checked').value;
                    await registrarUsuario(role);
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
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                // Intentar obtener el mensaje de error del servidor
                let errorMessage = 'Error al iniciar sesión';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.mensaje || errorMessage;
                } catch (jsonError) {
                    // Si no se puede analizar como JSON, usar el texto de la respuesta
                    errorMessage = await response.text() || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            // Intentar analizar la respuesta como JSON
            let userData;
            try {
                userData = await response.json();
                console.log('Datos del usuario:', userData);
            } catch (jsonError) {
                console.error('Error al analizar la respuesta como JSON:', jsonError);
                throw new Error('Contraseña o correo equivocado');
            }
            
            // Guardar token si existe
            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
            }
            
            // Guardar la información completa del usuario
            localStorage.setItem('usuario', JSON.stringify(userData));
            
            showMessage('Inicio de sesión exitoso', 'success');
            
            // Determinar la página de redirección según el rol del usuario
            let redirectUrl = '/src/view/catalogoUsuario.html'; // Por defecto para usuarios normales
            
            // Verificar si el usuario es un vendedor (asumiendo que el ID de rol para vendedor es 2)
            if (userData.roles && userData.roles.idrol === 2) {
                redirectUrl = '/src/view/perfilVendedor.html'; // Redirección para vendedores
            }
            
            console.log('Redirigiendo a:', redirectUrl);
            
            // Redireccionar a la página correspondiente después de un breve retraso
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }
    
    // Función para subir imagen a Firebase Storage
    async function subirImagenFirebase(file, folder = 'images') {
        try {
            // Crear una referencia única para el archivo
            const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, `${folder}/${fileName}`);
            
            // Mostrar mensaje de carga
            showMessage(`Subiendo imagen a Firebase...`, 'info');
            
            // Subir el archivo
            const snapshot = await uploadBytes(storageRef, file);
            console.log(`Imagen subida a Firebase Storage (${folder}):`, snapshot);
            
            // Obtener la URL de descarga
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('URL de la imagen:', downloadURL);
            
            return downloadURL;
        } catch (error) {
            console.error('Error al subir la imagen a Firebase:', error);
            throw new Error('Error al subir la imagen. Por favor, inténtelo de nuevo.');
        }
    }
    
    // Función para registrar usuario
    async function registrarUsuario(role) {
        try {
            // Obtener datos comunes
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const secondName = document.getElementById('secondName')?.value || '';
            const secondLastName = document.getElementById('secondLastName')?.value || '';
            
            // Obtener la descripción según el rol
            let description = '';
            if (role === 'vendor') {
                description = document.getElementById('vendorDescription')?.value || '';
            } else {
                description = document.getElementById('userDescription')?.value || '';
            }
            
            // Crear objeto base de usuario según el formato JSON esperado
            const userData = {
                idusuario: 0,
                email: email,
                telefono: phone,
                password: password,
                descripcion: description,
                usuarioreportado: 0,
                primernombre: firstName,
                segundonombre: secondName,
                primerapellido: lastName,
                segundoapellido: secondLastName,
                fotoperfil: "", // Inicialmente vacío, se actualizará si hay foto
                statususuario: 1, // Activo por defecto
                calificacion: 0,
                roles: {
                    idrol: role === 'vendor' ? 2 : 1,
                    nombrerol: role === 'vendor' ? 'VENDEDOR' : 'USUARIO'
                },
                fotodni: role === 'vendor' ? { idfotosdni: 0, url: "" } : null,

            };
            
            // Si hay una foto de perfil, subirla a Firebase
            if (profilePhotoFile) {
                try {
                    // Subir la imagen a Firebase y obtener la URL
                    const profileImageUrl = await subirImagenFirebase(profilePhotoFile, 'profiles');
                    
                    // Añadir la URL de la foto de perfil al objeto de usuario
                    userData.fotoperfil = profileImageUrl;
                } catch (uploadError) {
                    showMessage('Error al subir la foto de perfil: ' + uploadError.message, 'error');
                    throw uploadError;
                }
            }
            
            // Si hay una imagen de DNI y es un vendedor, subirla a Firebase
            if (role === 'vendor' && dniPhotoFile) {
                try {
                    // Subir la imagen a Firebase y obtener la URL
                    const dniImageUrl = await subirImagenFirebase(dniPhotoFile, 'dni');
                    
                    // Usar la URL en lugar de la imagen base64
                    userData.fotodni.url = dniImageUrl;
                } catch (uploadError) {
                    showMessage('Error al subir la imagen del DNI: ' + uploadError.message, 'error');
                    throw uploadError;
                }
            }
            
            // Determinar la URL según el rol
            const apiUrl = role === 'vendor' 
                ? 'http://localhost:8081/api/usuarios/crearVendedor' 
                : 'http://localhost:8081/api/usuarios/crearUsuario';
            
            console.log(`Registrando ${role === 'vendor' ? 'vendedor' : 'usuario'} con datos:`, userData);
            
            // Añadir logs para depuración
            console.log('URL de la API:', apiUrl);
            console.log('Datos enviados (JSON):', JSON.stringify(userData, null, 2));
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            // Obtener el texto de la respuesta para depuración
            const responseText = await response.text();
            console.log('Respuesta del servidor (texto):', responseText);
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                let errorMessage = `Error al registrar ${role === 'vendor' ? 'vendedor' : 'usuario'}`;
                try {
                    // Intentar analizar el texto como JSON
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.mensaje || errorMessage;
                } catch (jsonError) {
                    // Si no se puede analizar como JSON, usar el texto de la respuesta
                    errorMessage = responseText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            // Intentar analizar la respuesta como JSON
            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('Respuesta del servidor (JSON):', responseData);
            } catch (jsonError) {
                console.error('Error al analizar la respuesta como JSON:', jsonError);
                // Si no podemos analizar la respuesta como JSON pero la operación fue exitosa,
                // continuamos con el flujo normal
            }
            
            showMessage(`Registro de ${role === 'vendor' ? 'vendedor' : 'usuario'} exitoso`, 'success');
            
            // Redireccionar a la página de inicio de sesión después de un breve retraso
            setTimeout(() => {
                // Cambiar a modo de inicio de sesión
                if (loginBtn) loginBtn.click();
                
                // Limpiar el formulario
                loginForm.reset();
                
                // Limpiar la vista previa del DNI
                if (dniPreview) {
                    dniPreview.innerHTML = `
                        <i class="fas fa-id-card"></i>
                        <span>Ningún archivo seleccionado</span>
                    `;
                }
                
                // Limpiar la vista previa de la foto de perfil
                if (profilePreview) {
                    profilePreview.innerHTML = `
                        <i class="fas fa-user-circle"></i>
                        <span>Ningún archivo seleccionado</span>
                    `;
                }
                
                dniPhotoFile = null;
                dniPhotoBase64 = null;
                profilePhotoFile = null;
                profilePhotoBase64 = null;
                
                showMessage('Por favor, inicie sesión con sus nuevas credenciales', 'info');
            }, 2000);
            
        } catch (error) {
            console.error('Error al registrar usuario:', error);
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