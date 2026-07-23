async function realizarSolicitud(urlCompleta, metodo, datos) {
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (datos !== undefined) {
        opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(urlCompleta, opciones);

    const texto = await respuesta.text();
    let contenido;

    if (texto.trim() === '') {
        throw new Error(`Respuesta vacía del servidor (${respuesta.status})`);
    }

    try {
        contenido = JSON.parse(texto);
    } catch (error) {
        console.error('Error parseando JSON:', texto);
        throw new Error('Respuesta inválida del servidor.');
    }

    if (respuesta.status === 401) {
        alert('Tu sesión ha expirado. Debes iniciar sesión nuevamente.');
        window.location.href = 'login.html';
        throw new Error('Sesión expirada.');
    }

    if (!respuesta.ok || contenido.exito === false) {
        throw new Error(contenido.mensaje || `Error del servidor (${respuesta.status})`);
    }

    return contenido.datos;
}

async function enviarDatos(urlCompleta, datos) {
    return realizarSolicitud(urlCompleta, 'POST', datos);
}

async function enviarDatosGet(urlCompleta) {
    return realizarSolicitud(urlCompleta, 'GET');
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

async function manejarLogout() {
    try {
        await enviarDatos('/StudentHub/backend/api/auth/logout.php', {});
    } catch (error) {
        // Si falla, igualmente redirigimos: no tiene sentido dejar al usuario
        // en una página que requiere sesión si su intención era cerrarla.
    }
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const botonLogout = document.getElementById('btn-logout');
    if (botonLogout) {
        botonLogout.addEventListener('click', manejarLogout);
    }
});