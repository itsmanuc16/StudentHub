const API_BASE = '/StudentHub/backend/api/auth';

function mostrarMensaje(id, mensaje, esExito = true) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.style.color = esExito ? '#1f7a1f' : '#b00020';
}

async function enviarDatos(endpoint, datos) {
    const respuesta = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const texto = await respuesta.text();
    let contenido;

    if (texto.trim() === '') {
        throw new Error(`Respuesta vacía del servidor (${respuesta.status})`);
    }

    try {
        contenido = JSON.parse(texto);
    } catch (error) {
        console.error('Error parseando JSON:', texto);
        throw new Error('Respuesta inválida del servidor. Revisa la consola para más detalles.');
    }

    if (!respuesta.ok || contenido.exito === false) {
        throw new Error(contenido.mensaje || `Error del servidor (${respuesta.status})`);
    }

    return contenido.datos;
}

async function manejarLogin(event) {
    event.preventDefault();

    const correo = document.getElementById('correo')?.value.trim();
    const contrasena = document.getElementById('contrasena')?.value.trim();

    if (!correo || !contrasena) {
        mostrarMensaje('mensaje-login', 'Debes completar el correo y la contraseña.', false);
        return;
    }

    try {
        const datos = await enviarDatos('login.php', { correo, contrasena });
        mostrarMensaje('mensaje-login', `¡Bienvenido, ${datos.nombre}!`, true);
        // Aquí puedes redirigir al usuario a un dashboard.
    } catch (error) {
        mostrarMensaje('mensaje-login', error.message, false);
    }
}

async function manejarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const correo = document.getElementById('correo')?.value.trim();
    const contrasena = document.getElementById('contrasena')?.value.trim();

    if (!nombre || !correo || !contrasena) {
        mostrarMensaje('mensaje-registro', 'Todos los campos son obligatorios.', false);
        return;
    }

    try {
        await enviarDatos('registro.php', { nombre, correo, contrasena });
        window.location.href = 'login.html';
    } catch (error) {
        mostrarMensaje('mensaje-registro', error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

    if (formLogin) {
        formLogin.addEventListener('submit', manejarLogin);
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', manejarRegistro);
    }
});
