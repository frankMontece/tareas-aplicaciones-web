// Datos de ejemplo para 15 sílabos pendientes
const silabosPendientes = [
    {
        id: 1,
        codigo: "TDI-503",
        materia: "Aplicaciones Web I",
        docente: "Quiroz Palma Patricia Alexandra",
        facultad: "Sistemas",
        periodo: "2025-2",
        paralelo: "A",
        nivel: 5,
        fechaEnvio: "2025-03-15",
        diasPendientes: 2,
        estado: "pendiente",
        estudiantes: 45,
        contacto: "48h",
        practica: "48h",
        autonomo: "4h"
    }
];

// Variables globales
let silabosFiltrados = [...silabosPendientes];
let silabosPaginaActual = [];
const silabosPorPagina = 8;
let paginaActual = 1;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarDashboard();
    configurarEventListeners();
    actualizarEstadisticas();
    renderizarSilabos();
});

function inicializarDashboard() {
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

    // Configurar paginación
    actualizarPaginacion();
}

function configurarEventListeners() {
    // Filtros
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
    document.getElementById('facultadFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('periodoFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('estadoFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('resetFilters').addEventListener('click', resetearFiltros);

    // Botones de acción
    document.getElementById('exportBtn').addEventListener('click', exportarLista);
    document.getElementById('refreshBtn').addEventListener('click', actualizarDashboard);

    // Paginación
    document.getElementById('prevPage').addEventListener('click', paginaAnterior);
    document.getElementById('nextPage').addEventListener('click', paginaSiguiente);

    // Modal
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    document.getElementById('closeModalBtn').addEventListener('click', cerrarModal);
    document.getElementById('reviewModalBtn').addEventListener('click', iniciarRevision);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('syllabusModal');
        if (event.target === modal) {
            cerrarModal();
        }
    });
}

function aplicarFiltros() {
    const textoBusqueda = document.getElementById('searchInput').value.toLowerCase();
    const facultad = document.getElementById('facultadFilter').value;
    const periodo = document.getElementById('periodoFilter').value;
    const estado = document.getElementById('estadoFilter').value;

    silabosFiltrados = silabosPendientes.filter(silabo => {
        const coincideTexto = 
            silabo.codigo.toLowerCase().includes(textoBusqueda) ||
            silabo.materia.toLowerCase().includes(textoBusqueda) ||
            silabo.docente.toLowerCase().includes(textoBusqueda);
        
        const coincideFacultad = !facultad || silabo.facultad === facultad;
        const coincidePeriodo = !periodo || silabo.periodo === periodo;
        const coincideEstado = !estado || silabo.estado === estado;

        return coincideTexto && coincideFacultad && coincidePeriodo && coincideEstado;
    });

    paginaActual = 1;
    actualizarEstadisticas();
    renderizarSilabos();
    actualizarPaginacion();
}

function resetearFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('facultadFilter').value = '';
    document.getElementById('periodoFilter').value = '';
    document.getElementById('estadoFilter').value = '';
    
    aplicarFiltros();
}

function actualizarEstadisticas() {
    const totalPendientes = silabosFiltrados.length;
    const totalUrgentes = silabosFiltrados.filter(s => s.estado === 'urgente').length;
    const proximaSemana = silabosFiltrados.filter(s => s.diasPendientes <= 7).length;
    const promedioDias = totalPendientes > 0 ? 
        (silabosFiltrados.reduce((sum, s) => sum + s.diasPendientes, 0) / totalPendientes).toFixed(1) : '0.0';

    document.getElementById('totalPendientes').textContent = totalPendientes;
    document.getElementById('totalUrgentes').textContent = totalUrgentes;
    document.getElementById('proximaSemana').textContent = proximaSemana;
    document.getElementById('promedioDias').textContent = promedioDias;
    document.getElementById('contadorSilabos').textContent = totalPendientes;
}

function renderizarSilabos() {
    const grid = document.getElementById('syllabusGrid');
    const inicio = (paginaActual - 1) * silabosPorPagina;
    const fin = inicio + silabosPorPagina;
    silabosPaginaActual = silabosFiltrados.slice(inicio, fin);

    grid.innerHTML = '';

    if (silabosPaginaActual.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No se encontraron sílabos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    silabosPaginaActual.forEach(silabo => {
        const card = crearTarjetaSilabo(silabo);
        grid.appendChild(card);
    });
}

function crearTarjetaSilabo(silabo) {
    const card = document.createElement('div');
    card.className = 'syllabus-card';
    card.setAttribute('data-id', silabo.id);

    // Determinar ícono según la materia
    let icono = '📚';
    if (silabo.materia.includes('Web') || silabo.materia.includes('Programación')) icono = '🌐';
    else if (silabo.materia.includes('Base de Datos')) icono = '🗄️';
    else if (silabo.materia.includes('Inteligencia')) icono = '🤖';
    else if (silabo.materia.includes('Redes')) icono = '🌐';
    else if (silabo.facultad === 'Administración') icono = '💼';
    else if (silabo.facultad === 'Civil') icono = '🏗️';
    else if (silabo.facultad === 'Industrial') icono = '🏭';

    card.innerHTML = `
        <div class="card-header">
            <h3>${icono} ${silabo.materia} - ${silabo.codigo}</h3>
            <span class="status-badge ${silabo.estado}">
                ${silabo.estado === 'pendiente' ? 'Pendiente' : 
                  silabo.estado === 'urgente' ? 'Urgente' : 'En Revisión'}
            </span>
        </div>
        <div class="card-content">
            <p><strong>Docente:</strong> <span class="value">${silabo.docente}</span></p>
            <p><strong>Facultad:</strong> <span class="value">${silabo.facultad}</span></p>
            <p><strong>Período:</strong> <span class="value">${silabo.periodo} | ${silabo.paralelo} | Nivel ${silabo.nivel}</span></p>
            <p><strong>Fecha envío:</strong> <span class="value">${formatearFecha(silabo.fechaEnvio)}</span></p>
            <p><strong>Días pendientes:</strong> <span class="value ${silabo.diasPendientes > 5 ? 'text-urgent' : ''}">${silabo.diasPendientes} días</span></p>
        </div>
        <div class="card-actions">
            <button class="btn btn-outline ver-detalles" data-id="${silabo.id}">👁️ Ver</button>
            <button class="btn btn-primary revisar-silabo" data-id="${silabo.id}">📝 Revisar</button>
        </div>
    `;

    // Agregar event listeners a los botones
    card.querySelector('.ver-detalles').addEventListener('click', () => mostrarDetalles(silabo.id));
    card.querySelector('.revisar-silabo').addEventListener('click', () => iniciarRevision(silabo.id));

    return card;
}

function formatearFecha(fecha) {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function mostrarDetalles(id) {
    const silabo = silabosPendientes.find(s => s.id === id);
    if (!silabo) return;

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Código:</span>
            <span class="detail-value">${silabo.codigo}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Materia:</span>
            <span class="detail-value">${silabo.materia}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Docente:</span>
            <span class="detail-value">${silabo.docente}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Facultad:</span>
            <span class="detail-value">${silabo.facultad}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Período:</span>
            <span class="detail-value">${silabo.periodo} | Paralelo ${silabo.paralelo} | Nivel ${silabo.nivel}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Estudiantes:</span>
            <span class="detail-value">${silabo.estudiantes}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Horas Contacto:</span>
            <span class="detail-value">${silabo.contacto}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Horas Práctica:</span>
            <span class="detail-value">${silabo.practica}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Horas Autónomo:</span>
            <span class="detail-value">${silabo.autonomo}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Fecha de Envío:</span>
            <span class="detail-value">${formatearFecha(silabo.fechaEnvio)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Días Pendientes:</span>
            <span class="detail-value ${silabo.diasPendientes > 5 ? 'text-urgent' : ''}">${silabo.diasPendientes} días</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Estado:</span>
            <span class="detail-value">
                <span class="status-badge ${silabo.estado}">
                    ${silabo.estado === 'pendiente' ? 'Pendiente' : 
                      silabo.estado === 'urgente' ? 'Urgente' : 'En Revisión'}
                </span>
            </span>
        </div>
    `;

    document.getElementById('reviewModalBtn').setAttribute('data-id', id);
    document.getElementById('syllabusModal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('syllabusModal').style.display = 'none';
}

function iniciarRevision(id) {
    const silaboId = id || document.getElementById('reviewModalBtn').getAttribute('data-id');
    const silabo = silabosPendientes.find(s => s.id === parseInt(silaboId));
    
    if (silabo) {
        alert(`Iniciando revisión del silabo: ${silabo.materia} - ${silabo.codigo}`);
        // Aquí se redirigiría a la página de revisión del silabo
        // window.location.href = `revision_silabo.html?id=${silaboId}`;
    }
    
    cerrarModal();
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(silabosFiltrados.length / silabosPorPagina);
    
    document.getElementById('currentPage').textContent = paginaActual;
    document.getElementById('totalPages').textContent = totalPaginas;
    
    document.getElementById('prevPage').disabled = paginaActual === 1;
    document.getElementById('nextPage').disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarSilabos();
        actualizarPaginacion();
    }
}

function paginaSiguiente() {
    const totalPaginas = Math.ceil(silabosFiltrados.length / silabosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarSilabos();
        actualizarPaginacion();
    }
}

function exportarLista() {
    const datosExportar = silabosFiltrados.map(silabo => ({
        Código: silabo.codigo,
        Materia: silabo.materia,
        Docente: silabo.docente,
        Facultad: silabo.facultad,
        Período: silabo.periodo,
        Paralelo: silabo.paralelo,
        'Fecha Envío': formatearFecha(silabo.fechaEnvio),
        'Días Pendientes': silabo.diasPendientes,
        Estado: silabo.estado
    }));

    // En un entorno real, aquí se generaría un archivo Excel o CSV
    alert(`Exportando ${datosExportar.length} sílabos pendientes`);
    console.table(datosExportar);
}

function actualizarDashboard() {
    // Simular actualización de datos
    alert('Actualizando lista de sílabos...');
    aplicarFiltros();
}

// Efectos hover mejorados para tarjetas
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.syllabus-card')) {
            const card = e.target.closest('.syllabus-card');
            card.style.transform = 'translateY(-8px)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.syllabus-card')) {
            const card = e.target.closest('.syllabus-card');
            card.style.transform = 'translateY(0)';
        }
    });
});