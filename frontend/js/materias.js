const API_BASE = '/StudentHub/backend/api/materias';

function mostrarMensaje(mensaje, esExito = true) {
    const elemento = document.getElementById('mensaje-materia');
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.style.color = esExito ? '#1f7a1f' : '#b00020';
}

function renderizarMaterias(materias) {
    const contenedor = document.getElementById('lista-materias');
    if (!contenedor) return;

    if (!Array.isArray(materias) || materias.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="3">No hay materias registradas.</td></tr>';
        return;
    }

    contenedor.innerHTML = materias.map((materia) => {
        const fecha = new Date(materia.fecha_creacion).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr>
                <td>${materia.nombre}</td>
                <td>${materia.periodo_academico}</td>
                <td>${fecha}</td>
            </tr>
        `;
    }).join('');
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
        throw new Error('Respuesta inválida del servidor.');
    }

    if (!respuesta.ok || contenido.exito === false) {
        throw new Error(contenido.mensaje || `Error del servidor (${respuesta.status})`);
    }

    return contenido.datos;
}

async function obtenerMaterias() {
    const respuesta = await fetch(`${API_BASE}/listar.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
        throw new Error('Respuesta inválida del servidor.');
    }

    if (!respuesta.ok || contenido.exito === false) {
        throw new Error(contenido.mensaje || `Error del servidor (${respuesta.status})`);
    }

    renderizarMaterias(contenido.datos);
}

async function manejarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const periodoAcademico = document.getElementById('periodo_academico')?.value.trim();

    if (!nombre || !periodoAcademico) {
        mostrarMensaje('Debes completar nombre y periodo académico.', false);
        return;
    }

    try {
        await enviarDatos('crear.php', { nombre, periodo_academico: periodoAcademico });
        mostrarMensaje('Materia guardada correctamente.', true);
        event.target.reset();
        await obtenerMaterias();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-materia');
    if (formulario) {
        formulario.addEventListener('submit', manejarFormulario);
    }

    obtenerMaterias().catch((error) => {
        mostrarMensaje(error.message, false);
    });
});
