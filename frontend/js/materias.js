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
                <td>${escaparHtml(materia.nombre)}</td>
                <td>${escaparHtml(materia.periodo_academico)}</td>
                <td>${fecha}</td>
            </tr>
        `;
    }).join('');
}

async function obtenerMaterias() {
    try {
        const materias = await enviarDatosGet(`${API_BASE}/listar.php`);
        renderizarMaterias(materias);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
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
        await enviarDatos(`${API_BASE}/crear.php`, { nombre, periodo_academico: periodoAcademico });
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