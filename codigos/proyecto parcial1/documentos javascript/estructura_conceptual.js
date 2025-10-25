
let unidadCount = 1;

// Agregar nueva unidad
document.getElementById('btn-agregar-unidad').addEventListener('click', function () {
    unidadCount++;
    const formContainer = document.querySelector('.form-container form');

    const nuevaUnidad = document.createElement('div');
    nuevaUnidad.className = 'unidad-section';
    nuevaUnidad.innerHTML = `
                <div class="unidad-header">
                    <h3>📖 UNIDAD ${unidadCount}: </h3>
                    <button type="button" class="btn-eliminar" onclick="eliminarUnidad(this)">🗑️</button>
                </div>
                
                <div class="unidad-content">
                    <div class="form-group">
                        <label for="resultado-unidad${unidadCount}">Resultado de Aprendizaje *</label>
                        <textarea id="resultado-unidad${unidadCount}" name="resultado-unidad${unidadCount}" 
                                rows="2" placeholder="Describe el resultado de aprendizaje..." required></textarea>
                    </div>
                    
                    <div class="fechas-container">
                        <div class="form-group">
                            <label for="fecha-inicio${unidadCount}">Fecha Inicio *</label>
                            <input type="date" id="fecha-inicio${unidadCount}" name="fecha-inicio${unidadCount}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="fecha-fin${unidadCount}">Fecha Fin *</label>
                            <input type="date" id="fecha-fin${unidadCount}" name="fecha-fin${unidadCount}" required>
                        </div>
                    </div>
                </div>

                <!-- Secciones de contenidos, actividades y autónomo se agregarían aquí -->
                <div class="contenidos-section">
                    <h4>📋 CONTENIDOS Y ACTIVIDADES - UNIDAD ${unidadCount}</h4>
                    <div class="tabla-contenidos">
                        <div class="tabla-header">
                            <div class="tabla-col">CONTENIDOS</div>
                            <div class="tabla-col">PROCESOS DIDÁCT.</div>
                            <div class="tabla-col">RECURSOS</div>
                            <div class="tabla-col">ESCENARIO</div>
                            <div class="tabla-col">HORAS</div>
                            <div class="tabla-col">ACCIONES</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-outline" onclick="agregarContenido(this)">➕ Agregar Contenido</button>
                </div>
            `;

    // Insertar antes de las horas calculadas
    const horasCalculadas = document.querySelector('.horas-calculadas');
    formContainer.insertBefore(nuevaUnidad, horasCalculadas);
});

// Funciones para eliminar elementos
function eliminarUnidad(button) {
    if (document.querySelectorAll('.unidad-section').length > 1) {
        button.closest('.unidad-section').remove();
        // Recalcular horas
        calcularHoras();
    } else {
        alert('Debe haber al menos una unidad de aprendizaje.');
    }
}

function agregarContenido(button) {
    const tabla = button.previousElementSibling;
    const nuevaFila = document.createElement('div');
    nuevaFila.className = 'tabla-row';
    nuevaFila.innerHTML = `
                <div class="tabla-col">
                    <input type="text" placeholder="Nuevo contenido..." required>
                </div>
                <div class="tabla-col">
                    <select required>
                        <option value="">Seleccionar</option>
                        <option value="conferencia">Conferencia</option>
                        <option value="taller">Taller</option>
                        <option value="laboratorio">Laboratorio</option>
                    </select>
                </div>
                <div class="tabla-col">
                    <input type="text" placeholder="Recursos..." required>
                </div>
                <div class="tabla-col">
                    <input type="text" placeholder="Escenario..." required>
                </div>
                <div class="tabla-col">
                    <input type="number" placeholder="Horas" min="1" required onchange="calcularHoras()">
                </div>
                <div class="tabla-col">
                    <button type="button" class="btn-eliminar-pequeno" onclick="eliminarContenido(this)">🗑️</button>
                </div>
            `;
    tabla.appendChild(nuevaFila);
}

function eliminarContenido(button) {
    button.closest('.tabla-row').remove();
    calcularHoras();
}

function agregarActividad(button) {
    const tabla = button.previousElementSibling;
    const nuevaFila = document.createElement('div');
    nuevaFila.className = 'tabla-row';
    nuevaFila.innerHTML = `
                <div class="tabla-col">
                    <input type="text" placeholder="Nueva actividad..." required>
                </div>
                <div class="tabla-col">
                    <input type="text" placeholder="Escenario..." required>
                </div>
                <div class="tabla-col">
                    <input type="number" placeholder="Horas" min="1" required onchange="calcularHoras()">
                </div>
                <div class="tabla-col">
                    <button type="button" class="btn-eliminar-pequeno" onclick="eliminarActividad(this)">🗑️</button>
                </div>
            `;
    tabla.appendChild(nuevaFila);
}

function eliminarActividad(button) {
    button.closest('.tabla-row').remove();
    calcularHoras();
}

function agregarAutonomo(button) {
    const tabla = button.previousElementSibling;
    const nuevaFila = document.createElement('div');
    nuevaFila.className = 'tabla-row';
    nuevaFila.innerHTML = `
                <div class="tabla-col">
                    <input type="text" placeholder="Nueva actividad autónoma..." required>
                </div>
                <div class="tabla-col">
                    <input type="number" placeholder="Horas" min="1" required onchange="calcularHoras()">
                </div>
                <div class="tabla-col">
                    <button type="button" class="btn-eliminar-pequeno" onclick="eliminarAutonomo(this)">🗑️</button>
                </div>
            `;
    tabla.appendChild(nuevaFila);
}

function eliminarAutonomo(button) {
    button.closest('.tabla-row').remove();
    calcularHoras();
}

// Manejo del formulario
document.getElementById('estructuraForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const button = document.getElementById('btn-siguiente');
    const originalText = button.innerHTML;

    // Simular procesamiento
    button.disabled = true;
    button.innerHTML = '<div class="loading"></div>Procesando...';

    setTimeout(function () {
        alert('Estructura conceptual guardada correctamente. Redirigiendo al siguiente paso...');
        window.location.href = 'bibliografia.html';

        button.disabled = false;
        button.innerHTML = originalText;
    }, 2000);
});

