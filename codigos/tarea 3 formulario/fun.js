// Validación del formulario de sorteo SuperMart
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioSorteo');
    const mensajeExito = document.getElementById('mensajeExito');

    // Función principal de validación al enviar el formulario
    formulario.addEventListener('submit', function(evento) {
        // Prevenir el envío por defecto para validar primero
        evento.preventDefault();
        
        // Validar todos los campos
        if (validarFormulario()) {
            // Si todas las validaciones son exitosas
            mostrarMensajeExito();
            // Aquí normalmente enviarías los datos al servidor
            // formulario.submit();
        }
    });

    // Validación en tiempo real para campos específicos
    document.getElementById('nombre').addEventListener('blur',validarNombre);
    document.getElementById('cedula').addEventListener('blur', validarCedula);
    document.getElementById('email').addEventListener('blur', validarEmail);
    document.getElementById('telefono').addEventListener('blur', validarTelefono);
    document.getElementById('fechaNacimiento').addEventListener('blur', validarEdad);

    // Función principal que valida todos los campos
    function validarFormulario() {
        let esValido = true;
        
        // Validar cada campo individualmente
        if (!validarNombre()) esValido =false;
        if (!validarCedula()) esValido = false;
        if (!validarEmail()) esValido = false;
        if (!validarTelefono()) esValido = false;
        if (!validarCampoRequerido('direccion')) esValido = false;
        if (!validarEdad()) esValido = false;
        
        return esValido;
    }

    // Función genérica para validar campos requeridos (opcional)
    function validarCampoRequerido(idCampo) {
        const campo = document.getElementById(idCampo);
        const valor = campo.value.trim();
        
        if (valor === null || valor.length === 0) {
            mostrarError(campo, 'Este campo no puede estar vacío');
            return false;
        }
        
        limpiarError(campo);
        return true;
    }
    //validacion NOmbre
        function validarNombre() {
        const nombre = document.getElementById('nombre');
        const valor = nombre.value.trim();
        
        // Primero validar que no esté vacío
        if (valor === null || valor.length === 0) {
            mostrarError(nombre, 'El nombre no puede estar vacío');
            return false;
        }
        
        // Validar que solo contenga letras, espacios
        //  y algunos caracteres especiales permitidos
        const regexSoloTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
        
        if (!regexSoloTexto.test(valor)) {
            mostrarError(nombre, 'El nombre solo puede contener letras, espacios y apóstrofes');
            return false;
        }
        
        // Validar longitud mínima y máxima
        if (valor.length < 2) {
            mostrarError(nombre, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        
        if (valor.length > 50) {
            mostrarError(nombre, 'El nombre no puede exceder los 50 caracteres');
            return false;
        }
        
        // Validar que no sean solo espacios
        if (valor.replace(/\s+/g, '').length === 0) {
            mostrarError(nombre, 'El nombre no puede consistir solo en espacios');
            return false;
        }
        
        limpiarError(nombre);
        return true;
    }
    // Validación de cédula (solo números, basado en validación numérica del PDF)
    function validarCedula() {
        const cedula = document.getElementById('cedula');
        const valor = cedula.value.trim();
        
        if (valor === null || valor.length === 0) {
            mostrarError(cedula, 'La cédula no puede estar vacía');
            return false;
        }
        
        // Validar que solo contenga números
        if (isNaN(valor)) {
            mostrarError(cedula, 'La cédula debe contener solo números');
            return false;
        }
        
         // Longitud exacta de 10 dígitos
        if (valor.length !== 10) {
            mostrarError(cedula, 'La cédula debe tener exactamente 10 dígitos');
            return false;
        }
        
        limpiarError(cedula);
        return true;
    }

    // Validación de email con expresión regular (basado en el PDF)
    function validarEmail() {
        const email = document.getElementById('email');
        const valor = email.value.trim();
        
        if (valor === null || valor.length === 0) {
            mostrarError(email, 'El correo electrónico no puede estar vacío');
            return false;
        }
        
        // Expresión regular para validar email (adaptada del PDF)
        const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        
        if (!regexEmail.test(valor)) {
            mostrarError(email, 'Por favor ingresa un correo electrónico válido');
            return false;
        }
        
        limpiarError(email);
        return true;
    }

    // Validación de teléfono (solo números, basado en validación numérica del PDF)
    function validarTelefono() {
        const telefono = document.getElementById('telefono');
        const valor = telefono.value.trim();
        
        if (valor === null || valor.length === 0) {
            mostrarError(telefono, 'El teléfono no puede estar vacío');
            return false;
        }
        
        // Validar que solo contenga números
        if (isNaN(valor)) {
            mostrarError(telefono, 'El teléfono debe contener solo números');
            return false;
        }
        
        // Validar longitud mínima
        if (valor.length !== 10) {
            mostrarError(telefono, 'El teléfono debe tener al menos 10 dígitos');
            return false;
        }
        
        limpiarError(telefono);
        return true;
    }

    // Validación de edad (mínimo 18 años, basado en validación de fecha del PDF)
    function validarEdad() {
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        const valor = fechaNacimiento.value;
        
        if (valor === null || valor.length === 0) {
            mostrarError(fechaNacimiento, 'La fecha de nacimiento no puede estar vacía');
            return false;
        }
        
        // Calcular edad
        const fechaNac = new Date(valor);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        // Validar que sea mayor de 18 años
        if (edad < 18) {
            mostrarError(fechaNacimiento, 'Debes ser mayor de 18 años para participar');
            return false;
        }
        
        // Validar que la fecha no sea futura
        if (fechaNac > hoy) {
            mostrarError(fechaNacimiento, 'La fecha de nacimiento no puede ser futura');
            return false;
        }
        
        limpiarError(fechaNacimiento);
        return true;
    }

    // Función para mostrar mensajes de error
    function mostrarError(campo, mensaje) {
        // Limpiar error previo
        limpiarError(campo);
        
        // Crear elemento de error
        const error = document.createElement('div');
        error.className = 'mensaje-error';
        error.textContent = mensaje;
        
        // Aplicar estilos al mensaje de error
        error.style.color = '#ff0000';
        error.style.fontSize = '14px';
        error.style.marginTop = '5px';
        
        // Insertar después del campo
        campo.parentNode.insertBefore(error, campo.nextSibling);
        
        // Resaltar el campo con borde rojo
        campo.style.borderColor = '#ff0000';
    }

    // Función para limpiar mensajes de error
    function limpiarError(campo) {
        // Restaurar borde original
        campo.style.borderColor = '#ddd';
        
        // Eliminar mensaje de error si existe
        const error = campo.parentNode.querySelector('.mensaje-error');
        if (error) {
            error.remove();
        }
    }

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito() {
        // Ocultar formulario
        formulario.style.display = 'none';
        
        // Mostrar mensaje de éxito
        mensajeExito.classList.remove('oculto');
        
        // Desplazarse suavemente al mensaje
        mensajeExito.scrollIntoView({ behavior: 'smooth' });
    }
});