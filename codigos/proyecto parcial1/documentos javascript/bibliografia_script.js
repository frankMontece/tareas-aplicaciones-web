let contadorBasicas = 1;
let contadorWeb = 1;

// Configuración para generar HTML de referencias (se mantiene igual)
const configReferencias = {
    basica: {
        selector: '.bibliografia-section:first-child',
        titulo: 'Referencia',
        contadorProp: 'contadorBasicas',
        campos: [
            { label: 'Autor(es):', id: 'autor', placeholder: 'Ej: Apellido, N., Apellido2, M.', required: true },
            { label: 'Año:', id: 'anio', type: 'number', placeholder: 'Ej: 2023', attrs: 'min="1900" max="2030"', required: true, dual: true },
            { label: 'Título:', id: 'titulo', placeholder: 'Ej: Título del libro o recurso', required: true, dual: true },
            { label: 'Fuente/Editorial:', id: 'fuente', placeholder: 'Ej: Editorial o URL del recurso', required: true }
        ]
    },
    web: {
        selector: '.bibliografia-section:last-child',
        titulo: 'Referencia Web',
        contadorProp: 'contadorWeb',
        campos: [
            { label: 'Autor(es) o Organización:', id: 'web-autor', placeholder: 'Ej: Organización o autor del recurso web', required: true },
            { label: 'Año de publicación/actualización:', id: 'web-anio', type: 'number', placeholder: 'Ej: 2024', attrs: 'min="1900" max="2030"', required: true, dual: true },
            { label: 'Título del recurso:', id: 'web-titulo', placeholder: 'Ej: Título específico de la página o recurso', required: true, dual: true },
            { label: 'URL:', id: 'web-url', type: 'url', placeholder: 'Ej: https://ejemplo.com/recurso', required: true },
            { label: 'Fecha de acceso:', id: 'web-fecha-acceso', type: 'date', required: true }
        ]
    }
};

// Helper: devuelve la sección DOM correspondiente a 'basica' o 'web'
function getSeccionByTipo(tipo) {
    const secciones = document.querySelectorAll('.bibliografia-section');
    if (!secciones || secciones.length === 0) return null;
    return tipo === 'basica' ? secciones[0] : secciones[secciones.length - 1];
}

/**
 * Genera el HTML para los campos de una referencia.
 * @param {Array} campos - La configuración de los campos.
 * @param {number} contador - El número actual de la referencia.
 * @returns {string} El HTML generado.
 */
function generarCamposHTML(campos, contador) {
    let html = '';
    let camposDuales = [];

    campos.forEach(campo => {
        const requiredAttr = campo.required ? 'required' : '';
        const inputHTML = `<div class="form-group">
            <label for="${campo.id}${contador}">${campo.label}${campo.required ? ' <span class="required-star">*</span>' : ''}</label>
            <input type="${campo.type || 'text'}" id="${campo.id}${contador}" name="${campo.id}${contador}" 
                placeholder="${campo.placeholder || ''}" ${campo.attrs || ''} ${requiredAttr}>
        </div>`;

        if (campo.dual) {
            camposDuales.push(inputHTML);
            if (camposDuales.length === 2) {
                html += `<div class="form-group-dual">${camposDuales.join('')}</div>`;
                camposDuales = [];
            }
        } else {
            if (camposDuales.length > 0) { // Si queda un campo dual pendiente (no debería pasar con tu estructura, pero por seguridad)
                html += `<div class="form-group-dual">${camposDuales.join('')}</div>`;
                camposDuales = [];
            }
            html += inputHTML;
        }
    });
    return html;
}


// Función para agregar nueva referencia (unificada)
function agregarReferencia(tipo) {
    const config = configReferencias[tipo];
    if (!config) return;

    let contador;
    if (tipo === 'basica') {
        contador = ++contadorBasicas;
    } else {
        contador = ++contadorWeb;
    }

    const seccion = getSeccionByTipo(tipo);
    if (!seccion) return; // Protección si la estructura HTML cambia
    const botonAgregar = seccion.querySelector('.btn-outline');

    const htmlCampos = generarCamposHTML(config.campos, contador);

    const nuevaReferencia = document.createElement('div');
    nuevaReferencia.className = 'referencia-item';
    nuevaReferencia.innerHTML = `
        <div class="referencia-header">
            <h4>${config.titulo} ${contador}</h4>
            <button type="button" class="btn-eliminar" onclick="eliminarReferencia(this, '${tipo}')">🗑️</button>
        </div>
        <div class="referencia-content">${htmlCampos}</div>
    `;

    // Inserta la nueva referencia antes del botón "Agregar"
    seccion.insertBefore(nuevaReferencia, botonAgregar);
    // Nota: El HTML inicial ya tiene un campo, por eso empezamos en 1.
}

// Funciones específicas para los botones del HTML
function agregarReferenciaBasica() {
    agregarReferencia('basica');
}
function agregarReferenciaWeb() {
    agregarReferencia('web');
}

// Eliminar referencia
function eliminarReferencia(button, tipo) {
    const referencia = button.closest('.referencia-item');
    const seccion = referencia.closest('.bibliografia-section');
    const referenciasActuales = seccion.querySelectorAll('.referencia-item').length;

    // Se requiere al menos una referencia por tipo
    if (referenciasActuales > 1) {
        referencia.remove();
        if (tipo === 'basica') {
            contadorBasicas--;
        } else {
            contadorWeb--;
        }
        renumerarReferencias(tipo);
    } else {
        alert(`Debe haber al menos una ${tipo === 'basica' ? 'Referencia Básica' : 'Referencia Web'}.`);
    }
}

// Renumerar referencias (unificada)
function renumerarReferencias(tipo) {
    const config = configReferencias[tipo];
    const seccion = getSeccionByTipo(tipo);
    if (!seccion) return;

    seccion.querySelectorAll('.referencia-item').forEach((ref, index) => {
        const nuevoNumero = index + 1;
        const h4 = ref.querySelector('.referencia-header h4');
        if (h4) h4.textContent = `${config.titulo} ${nuevoNumero}`;

        // Actualizar los IDs y Nombres para que sean únicos
        ref.querySelectorAll('[id]').forEach(input => {
            const oldId = input.id;
            const baseId = oldId.replace(/\d+$/, ''); // Elimina el número final
            input.id = baseId + nuevoNumero;
            input.name = baseId + nuevoNumero;
            // Actualizar el 'for' de la etiqueta
            const label = ref.querySelector(`label[for="${oldId}"]`);
            if (label) label.setAttribute('for', baseId + nuevoNumero);
        });
    });
}

// Función de VALIDACIÓN PRINCIPAL
function validarFormulario() {
    let esValido = true;
    let primerError = null;

    // 1. Validar Bibliografía Básica
    const seccionBasica = getSeccionByTipo('basica');
    if (seccionBasica) {
        seccionBasica.querySelectorAll('.referencia-item').forEach((ref, refIndex) => {
            // Campos obligatorios: autor, anio, titulo, fuente
            ['autor', 'anio', 'titulo', 'fuente'].forEach(idBase => {
                const input = ref.querySelector(`[name^="${idBase}"]`);
                if (input && input.value.trim() === '') {
                    esValido = false;
                    input.classList.add('is-invalid'); // Clase para resaltar en rojo
                    if (!primerError) primerError = input;
                } else if (input) {
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    // 2. Validar Bibliografía Web
    const seccionWeb = getSeccionByTipo('web');
    if (seccionWeb) {
        seccionWeb.querySelectorAll('.referencia-item').forEach((ref, refIndex) => {
            // Campos obligatorios: web-autor, web-anio, web-titulo, web-url, web-fecha-acceso
            ['web-autor', 'web-anio', 'web-titulo', 'web-url', 'web-fecha-acceso'].forEach(idBase => {
                const input = ref.querySelector(`[name^="${idBase}"]`);
                if (input && input.value.trim() === '') {
                    esValido = false;
                    input.classList.add('is-invalid');
                    if (!primerError) primerError = input;
                } else if (input) {
                    input.classList.remove('is-invalid');
                }
            });

            // 3. Validación específica de URL (opcional pero útil)
            const urlInput = ref.querySelector('[name^="web-url"]');
            if (urlInput && urlInput.value.trim() !== '') {
                try {
                    new URL(urlInput.value.trim()); // Intenta crear un objeto URL
                    urlInput.classList.remove('is-invalid');
                } catch (e) {
                    esValido = false;
                    urlInput.classList.add('is-invalid');
                    if (!primerError) primerError = urlInput;
                }
            }
        });
    }

    if (!esValido) {
        alert('Por favor, rellene todos los campos obligatorios (*) y asegúrese de que la URL es válida.');
        if (primerError) primerError.focus(); // Enfoca el primer campo con error
    }

    return esValido;
}


// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro de que desea limpiar todo el formulario? Se perderán todos los datos.')) {
        document.getElementById('bibliografiaForm').reset();

        // Eliminar referencias extras, dejando solo la primera de cada tipo
        const seccionBasica = getSeccionByTipo('basica');
        if (seccionBasica) {
            seccionBasica.querySelectorAll('.referencia-item').forEach((ref, index) => { if (index > 0) ref.remove(); });
        }
        const seccionWeb = getSeccionByTipo('web');
        if (seccionWeb) {
            seccionWeb.querySelectorAll('.referencia-item').forEach((ref, index) => { if (index > 0) ref.remove(); });
        }

        contadorBasicas = 1;
        contadorWeb = 1;

        // Opcional: limpiar las clases de error
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        alert('Formulario limpiado.');
    }
}


// Manejo del envío del formulario (Botón "Guardar y Finalizar")
document.getElementById('bibliografiaForm').addEventListener('submit', e => {
    e.preventDefault();

    // **AQUÍ SE EJECUTA LA VALIDACIÓN**
    if (!validarFormulario()) {
        return; // Detiene el envío si la validación falla
    }

    const button = document.getElementById('btn-guardar');
    const originalText = button.innerHTML;

    // 1. Bloqueo y estado de carga
    button.disabled = true;
    button.innerHTML = '<div class="loading"></div>Guardando...';

    // 2. Simulación de envío (AQUÍ DEBERÍA IR LA LLAMADA AJAX/FETCH REAL)
    setTimeout(() => {
        // En un escenario real, aquí se procesarían los datos y se enviaría al servidor.

        alert('Bibliografía guardada correctamente. El sílabo ha sido completado.');

        // 3. Redirección y restablecimiento
        window.location.href = 'dashboard.html';
        button.disabled = false;
        button.innerHTML = originalText;
    }, 2000);
});

// Inicialización (Se asegura que las funciones agregar/eliminar estén globalmente disponibles)
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que las referencias iniciales tengan los atributos 'required'
    // Esto se maneja mejor en el HTML original o modificando el DOM si fuera necesario.

    // Se agregan listeners a los botones si fuese necesario, pero en tu HTML están con 'onclick'
    // document.querySelector('.btn-outline').addEventListener('click', agregarReferenciaBasica);
});