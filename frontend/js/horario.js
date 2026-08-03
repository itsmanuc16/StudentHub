const API_BASE_HORARIO = '/StudentHub/backend/api/horario';
const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';

const NOMBRES_DIAS = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
};

function mostrarMensaje(id, mensaje, esExito = true) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.classList.remove('mensaje-exito', 'mensaje-error');
    elemento.classList.add(esExito ? 'mensaje-exito' : 'mensaje-error');
}


async function cargarMateriasEnSelect() {
    const select = document.getElementById('id_materia');
    if (!select) return;

    try {
        const materias = await enviarDatosGet(`${API_BASE_MATERIAS}/listar.php`);

        materias.forEach((materia) => {
            const opcion = document.createElement('option');
            opcion.value = materia.id_materia;
            opcion.textContent = materia.nombre;
            select.appendChild(opcion);
        });
    } catch (error) {
        mostrarMensaje('No se pudieron cargar tus materias.', false);
    }
}

function renderizarHorario(horarios) {
    const contenedor = document.getElementById('lista-horario');
    if (!contenedor) return;

    if (!Array.isArray(horarios) || horarios.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="5">No hay horarios registrados.</td></tr>';
        return;
    }

    contenedor.innerHTML = horarios.map((horario) => {
        const nombreDia = NOMBRES_DIAS[horario.dia_semana] || horario.dia_semana;

        return `
            <tr>
                <td>${escaparHtml(horario.nombre_materia)}</td>
                <td>${escaparHtml(nombreDia)}</td>
                <td>${formatearHora(horario.hora_inicio)}</td>
                <td>${formatearHora(horario.hora_fin)}</td>
                <td>
                    <button type="button" class="btn-eliminar-horario" data-id="${horario.id_horario}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function obtenerHorario() {
    try {
        const horarios = await enviarDatosGet(`${API_BASE_HORARIO}/listar.php`);
        renderizarHorario(horarios);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarFormulario(event) {
    event.preventDefault();

    const idMateria = document.getElementById('id_materia')?.value;
    const diaSemana = document.getElementById('dia_semana')?.value;
    const horaInicio = document.getElementById('hora_inicio')?.value;
    const horaFin = document.getElementById('hora_fin')?.value;

    if (!idMateria || !diaSemana || !horaInicio || !horaFin) {
        mostrarMensaje('Todos los campos son obligatorios.', false);
        return;
    }

    try {
        await enviarDatos(`${API_BASE_HORARIO}/crear.php`, {
            id_materia: idMateria,
            dia_semana: diaSemana,
            hora_inicio: horaInicio,
            hora_fin: horaFin
        });
        mostrarMensaje('Bloque de horario guardado correctamente.', true);
        event.target.reset();
        await obtenerHorario();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarEliminar(idHorario) {
    try {
        await enviarDatos(`${API_BASE_HORARIO}/eliminar.php`, { id_horario: idHorario });
        await obtenerHorario();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-horario');
    if (formulario) {
        formulario.addEventListener('submit', manejarFormulario);
    }

    const contenedor = document.getElementById('lista-horario');
    if (contenedor) {
        contenedor.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-eliminar-horario')) {
                const idHorario = event.target.dataset.id;
                manejarEliminar(idHorario);
            }
        });
    }

    cargarMateriasEnSelect();
    obtenerHorario();
});