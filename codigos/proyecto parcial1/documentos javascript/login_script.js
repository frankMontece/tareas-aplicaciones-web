// Manejar el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir envío normal del formulario

    const button = this.querySelector('.login-btn');
    const originalText = button.innerHTML;

    // Obtener credenciales del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simular proceso de autenticación
    button.disabled = true;
    button.innerHTML = '<div class="loading"></div>Iniciando sesión...';

    // Simular delay de autenticación (2 segundos)
    setTimeout(function () {
        // Validar credenciales y redirigir según el rol
        let redirectUrl = '';
        
        if (email === 'profesor@uleam.edu.ec' && password === 'profesora') {
            // Rol: Profesor - Redirigir al dashboard del profesor
            redirectUrl = 'dashboard.html';
        } else if (email === 'revision@uleam.edu.ec' && password === 'revision') {
            // Rol: Comisión Académica/Decanato - Redirigir a pendientes.html
            redirectUrl = 'pendientes.html';
        } else {
            // Credenciales incorrectas
            button.disabled = false;
            button.innerHTML = originalText;
            alert('Credenciales incorrectas. Por favor, intente nuevamente.');
            return;
        }

        // Redirigir a la página correspondiente
        window.location.href = redirectUrl;
    }, 2000);
});

// Agregar estilos para la animación de carga si no existen
const style = document.createElement('style');
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
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);