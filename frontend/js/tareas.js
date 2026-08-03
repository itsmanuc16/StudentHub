const API_BASE_TAREAS = '/StudentHub/backend/api/tareas';
const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';

const ESTADOS_LABELS = {
    pendiente: 'Pendiente',
    en_progreso: 'En progreso',
    completada: 'Completada'
};

let idTareaEnEdicion = null;
let tareasActuales = [];

function mostrarMensaje(mensaje, esExito = true) {
    const elemento = document.getElementById('mensaje-tarea');
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

function construirSelectEstado(tarea) {
    const opciones = Object.entries(ESTADOS_LABELS).map(([valor, etiqueta]) => {
        const seleccionado = valor === tarea.estado ? 'selected' : '';
        return `<option value="${valor}" ${seleccionado}>${etiqueta}</option>`;
    }).join('');

    return `<select class="select-estado-tarea" data-id="${tarea.id_tarea}">${opciones}</select>`;
}

function renderizarTareas(tareas) {
    tareasActuales = tareas;
    const contenedor = document.getElementById('lista-tareas');
    if (!contenedor) return;

    if (!Array.isArray(tareas) || tareas.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="5">No hay tareas registradas.</td></tr>';
        return;
    }

    contenedor.innerHTML = tareas.map((tarea) => `
        <tr>
            <td>${escaparHtml(tarea.nombre_materia)}</td>
            <td>${escaparHtml(tarea.titulo)}</td>
            <td>${tarea.fecha_entrega}</td>
            <td>${construirSelectEstado(tarea)}</td>
            <td>
                <button type="button" class="btn-editar-tarea" data-id="${tarea.id_tarea}">Editar</button>
                <button type="button" class="btn-eliminar-tarea" data-id="${tarea.id_tarea}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function obtenerTareas() {
    try {
        const tareas = await enviarDatosGet(`${API_BASE_TAREAS}/listar.php`);
        renderizarTareas(tareas);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

function entrarModoEdicion(idTarea) {
    const tarea = tareasActuales.find((t) => String(t.id_tarea) === String(idTarea));
    if (!tarea) return;

    idTareaEnEdicion = tarea.id_tarea;

    document.getElementById('titulo-formulario').textContent = 'Editar tarea';
    document.getElementById('titulo').value = tarea.titulo;
    document.getElementById('fecha_entrega').value = tarea.fecha_entrega;

    const selectMateria = document.getElementById('id_materia');
    selectMateria.value = tarea.id_materia;
    selectMateria.disabled = true;

    document.getElementById('btn-guardar-tarea').textContent = 'Guardar cambios';
    document.getElementById('btn-cancelar-edicion').style.display = 'inline-block';
}

function cancelarEdicion() {
    idTareaEnEdicion = null;

    document.getElementById('form-tarea').reset();
    document.getElementById('titulo-formulario').textContent = 'Agregar tarea';
    document.getElementById('id_materia').disabled = false;
    document.getElementById('btn-guardar-tarea').textContent = 'Guardar tarea';
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
}

async function manejarFormulario(event) {
    event.preventDefault();

    const idMateria = document.getElementById('id_materia')?.value;
    const titulo = document.getElementById('titulo')?.value.trim();
    const fechaEntrega = document.getElementById('fecha_entrega')?.value;

    if (!titulo || !fechaEntrega || (!idTareaEnEdicion && !idMateria)) {
        mostrarMensaje('Todos los campos son obligatorios.', false);
        return;
    }

    try {
        if (idTareaEnEdicion) {
            await enviarDatos(`${API_BASE_TAREAS}/actualizar.php`, {
                id_tarea: idTareaEnEdicion,
                titulo,
                fecha_entrega: fechaEntrega
            });
            mostrarMensaje('Tarea actualizada correctamente.', true);
        } else {
            await enviarDatos(`${API_BASE_TAREAS}/crear.php`, {
                id_materia: idMateria,
                titulo,
                fecha_entrega: fechaEntrega
            });
            mostrarMensaje('Tarea guardada correctamente.', true);
        }

        cancelarEdicion();
        await obtenerTareas();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarCambiarEstado(idTarea, nuevoEstado) {
    try {
        await enviarDatos(`${API_BASE_TAREAS}/cambiar_estado.php`, {
            id_tarea: idTarea,
            estado: nuevoEstado
        });
        await obtenerTareas();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarEliminar(idTarea) {
    try {
        await enviarDatos(`${API_BASE_TAREAS}/eliminar.php`, { id_tarea: idTarea });
        if (String(idTareaEnEdicion) === String(idTarea)) {
            cancelarEdicion();
        }
        await obtenerTareas();
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-tarea');
    if (formulario) {
        formulario.addEventListener('submit', manejarFormulario);
    }

    const botonCancelar = document.getElementById('btn-cancelar-edicion');
    if (botonCancelar) {
        botonCancelar.addEventListener('click', cancelarEdicion);
    }

    const contenedor = document.getElementById('lista-tareas');
    if (contenedor) {
        contenedor.addEventListener('click', (event) => {
            const idTarea = event.target.dataset.id;
            if (!idTarea) return;

            if (event.target.classList.contains('btn-editar-tarea')) {
                entrarModoEdicion(idTarea);
            } else if (event.target.classList.contains('btn-eliminar-tarea')) {
                manejarEliminar(idTarea);
            }
        });

        contenedor.addEventListener('change', (event) => {
            if (event.target.classList.contains('select-estado-tarea')) {
                const idTarea = event.target.dataset.id;
                const nuevoEstado = event.target.value;
                manejarCambiarEstado(idTarea, nuevoEstado);
            }
        });
    }

    cargarMateriasEnSelect();
    obtenerTareas();
});