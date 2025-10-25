// Funcionalidad básica del dashboard
function mostrarDetalles() {
    document.getElementById('syllabusModal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('syllabusModal').style.display = 'none';
}

function iniciarRevision() {
    // Redirigir al formulario de crear silabo
    window.location.href = 'pendientes.html';
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    const modal = document.getElementById('syllabusModal');
    if (event.target === modal) {
        cerrarModal();
    }
});

// Efectos hover para tarjetas
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.syllabus-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Activar elementos del menú al hacer clic
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (!this.classList.contains('logout')) {
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});