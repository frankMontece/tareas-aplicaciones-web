// Manejar el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevenir envío normal del formulario

    const button = this.querySelector('.login-btn');
    const originalText = button.innerHTML;

    // Obtener credenciales del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validación básica
    if (!email || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Simular proceso de autenticación
    button.disabled = true;
    button.innerHTML = '<div class="loading"></div>Validando credenciales...';

    try {
        // 1. Cargar usuarios desde el archivo JSON
        const response = await fetch('../data/usuarios.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos de usuarios');
        }
        
        const usuarios = await response.json();
        
        // Simular delay de autenticación (1.5 segundos en lugar de 2)
        setTimeout(function () {
            // 2. Buscar usuario que coincida
            const usuarioEncontrado = usuarios.find(usuario => {
                return usuario.email === email && 
                    usuario.password === password &&
                    usuario.activo === true;
            });

            if (usuarioEncontrado) {
                // 3. Determinar redirección según el rol
                let redirectUrl = '';
                
                switch (usuarioEncontrado.rol) {
                    case 'profesor':
                        redirectUrl = 'dashboard.html';
                        break;
                    case 'comision_academica':
                        redirectUrl = 'pendientes.html';
                        break;
                    default:
                        throw new Error('Rol no reconocido');
                }

                // 4. Guardar información del usuario en localStorage
                const usuarioSession = {
                    id: usuarioEncontrado.id,
                    nombre: usuarioEncontrado.nombre,
                    email: usuarioEncontrado.email,
                    rol: usuarioEncontrado.rol,
                    departamento: usuarioEncontrado.departamento,
                    facultad: usuarioEncontrado.facultad,
                    materias: usuarioEncontrado.materias,
                    permisos: usuarioEncontrado.permisos
                };
                
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioSession));
                localStorage.setItem('ultimoLogin', new Date().toISOString());

                // 5. Mostrar mensaje de bienvenida
                button.innerHTML = '<div class="loading" style="border-color: #2ecc71; border-top-color: transparent;"></div>¡Acceso concedido!';
                
                // 6. Redirigir después de breve delay
                setTimeout(function() {
                    window.location.href = redirectUrl;
                }, 800);

            } else {
                // Credenciales incorrectas o usuario inactivo
                button.disabled = false;
                button.innerHTML = originalText;
                
                // Verificar si el usuario existe pero está inactivo
                const usuarioInactivo = usuarios.find(u => u.email === email && u.password === password && u.activo === false);
                
                if (usuarioInactivo) {
                    alert('Su cuenta está desactivada. Contacte al administrador.');
                } else {
                    alert('Credenciales incorrectas. Por favor, intente nuevamente.');
                }
            }
        }, 1500); // Reduced from 2000 to 1500ms

    } catch (error) {
        console.error('Error en el login:', error);
        
        button.disabled = false;
        button.innerHTML = originalText;
        
        alert('Error del sistema. Intente nuevamente o use credenciales de prueba:\n\n' +
            'Profesor: profesor@uleam.edu.ec / profesora\n' +
            'Comisión Académica: revision@uleam.edu.ec / revision');
    }
});

// Agregar estilos para la animación de carga si no existen
if (!document.querySelector('#login-styles')) {
    const style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = `
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        .loading.success {
            border-color: #2ecc71;
            border-top-color: transparent;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Estilos para mensajes de error/éxito */
        .login-message {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            display: none;
        }
        
        .login-message.error {
            background: #ffeaea;
            border: 1px solid #ffcccc;
            color: #cc0000;
        }
        
        .login-message.success {
            background: #eaffea;
            border: 1px solid #ccffcc;
            color: #00cc00;
        }
    `;
    document.head.appendChild(style);
}

// Función para mostrar mensajes en el formulario
function mostrarMensajeLogin(mensaje, tipo = 'error') {
    let mensajeDiv = document.getElementById('login-message');
    
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'login-message';
        mensajeDiv.className = `login-message ${tipo}`;
        document.querySelector('form').prepend(mensajeDiv);
    }
    
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `login-message ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    if (tipo === 'success') {
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 3000);
    }
}

// Cargar usuarios al iniciar para mostrar estadísticas (opcional)
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('../data/usuarios.json');
        const usuarios = await response.json();
        
        const usuariosActivos = usuarios.filter(u => u.activo).length;
        const profesores = usuarios.filter(u => u.rol === 'profesor' && u.activo).length;
        const comision = usuarios.filter(u => u.rol === 'comision_academica' && u.activo).length;
        
        console.log(`📊 Sistema de Sílabos ULEAM - ${usuariosActivos} usuarios activos (${profesores} profesores, ${comision} comisión académica)`);
        
    } catch (error) {
        console.warn('No se pudieron cargar las estadísticas:', error);
    }
});
