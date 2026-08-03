const API_BASE_PERFIL = '/StudentHub/backend/api/perfil';

function mostrarMensajePerfil(mensaje, esExito = true) {
    const elemento = document.getElementById('mensaje-perfil');
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.classList.remove('mensaje-exito', 'mensaje-error');
    elemento.classList.add(esExito ? 'mensaje-exito' : 'mensaje-error');
}

function mostrarMensajeContrasena(mensaje, esExito = true) {
    const elemento = document.getElementById('mensaje-contrasena');
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.classList.remove('mensaje-exito', 'mensaje-error');
    elemento.classList.add(esExito ? 'mensaje-exito' : 'mensaje-error');
}

async function cargarPerfil() {
    try {
        const perfil = await enviarDatosGet(`${API_BASE_PERFIL}/obtener.php`);

        document.getElementById('nombre').value = perfil.nombre;
        document.getElementById('correo').value = perfil.correo;
    } catch (error) {
        mostrarMensajePerfil('No se pudo cargar tu información de perfil.', false);
    }
}

async function manejarFormularioPerfil(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const correo = document.getElementById('correo')?.value.trim();

    if (!nombre || !correo) {
        mostrarMensajePerfil('El nombre y el correo son obligatorios.', false);
        return;
    }

    try {
        await enviarDatos(`${API_BASE_PERFIL}/actualizar.php`, { nombre, correo });
        mostrarMensajePerfil('Perfil actualizado correctamente.', true);
    } catch (error) {
        mostrarMensajePerfil(error.message, false);
    }
}

async function manejarFormularioContrasena(event) {
    event.preventDefault();

    const contrasenaActual = document.getElementById('contrasena_actual')?.value;
    const contrasenaNueva = document.getElementById('contrasena_nueva')?.value;
    const confirmarContrasenaNueva = document.getElementById('confirmar_contrasena_nueva')?.value;

    if (!contrasenaActual || !contrasenaNueva || !confirmarContrasenaNueva) {
        mostrarMensajeContrasena('Debes completar todos los campos.', false);
        return;
    }

    if (contrasenaNueva !== confirmarContrasenaNueva) {
        mostrarMensajeContrasena('La nueva contraseña y su confirmación no coinciden.', false);
        return;
    }

    try {
        await enviarDatos(`${API_BASE_PERFIL}/cambiar_contrasena.php`, {
            contrasena_actual: contrasenaActual,
            contrasena_nueva: contrasenaNueva,
            confirmar_contrasena_nueva: confirmarContrasenaNueva
        });
        mostrarMensajeContrasena('Contraseña actualizada correctamente.', true);
        event.target.reset();
    } catch (error) {
        mostrarMensajeContrasena(error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();

    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', manejarFormularioPerfil);
    }

    const formContrasena = document.getElementById('form-contrasena');
    if (formContrasena) {
        formContrasena.addEventListener('submit', manejarFormularioContrasena);
    }
});