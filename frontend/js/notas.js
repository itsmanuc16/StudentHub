const API_BASE_NOTAS = '/StudentHub/backend/api/notas';
const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';

function mostrarMensaje(mensaje, esExito = true) {
    const elemento = document.getElementById('mensaje-nota');
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

function renderizarNotas(notas) {
    const contenedor = document.getElementById('lista-notas');
    if (!contenedor) return;

    if (!Array.isArray(notas) || notas.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="4">No hay notas registradas para esta materia.</td></tr>';
        return;
    }

    contenedor.innerHTML = notas.map((nota) => `
        <tr>
            <td>${escaparHtml(nota.valor)}</td>
            <td>${escaparHtml(nota.descripcion || '—')}</td>
            <td>${nota.fecha_registro}</td>
            <td>
                <button type="button" class="btn-eliminar-nota" data-id="${nota.id_nota}">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

function mostrarPromedio(promedio) {
    const elemento = document.getElementById('promedio-materia');
    if (!elemento) return;

    elemento.textContent = promedio !== null
        ? `Promedio actual: ${promedio}`
        : 'Sin notas registradas todavía para esta materia.';
}

async function cargarNotas(idMateria) {
    if (!idMateria) {
        document.getElementById('promedio-materia').textContent = 'Selecciona una materia para ver sus notas.';
        document.getElementById('lista-notas').innerHTML = '';
        return;
    }

    try {
        const resultado = await enviarDatosGet(`${API_BASE_NOTAS}/listar.php?id_materia=${idMateria}`);
        renderizarNotas(resultado.notas);
        mostrarPromedio(resultado.promedio);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarFormulario(event) {
    event.preventDefault();

    const idMateria = document.getElementById('id_materia')?.value;
    const valor = document.getElementById('valor')?.value;
    const descripcion = document.getElementById('descripcion')?.value.trim();

    if (!idMateria) {
        mostrarMensaje('Debes seleccionar una materia primero.', false);
        return;
    }

    if (!valor) {
        mostrarMensaje('El valor de la nota es obligatorio.', false);
        return;
    }

    try {
        await enviarDatos(`${API_BASE_NOTAS}/crear.php`, {
            id_materia: idMateria,
            valor: valor,
            descripcion: descripcion
        });
        mostrarMensaje('Nota guardada correctamente.', true);
        document.getElementById('valor').value = '';
        document.getElementById('descripcion').value = '';
        await cargarNotas(idMateria);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

async function manejarEliminar(idNota) {
    const idMateria = document.getElementById('id_materia')?.value;

    try {
        await enviarDatos(`${API_BASE_NOTAS}/eliminar.php`, { id_nota: idNota });
        await cargarNotas(idMateria);
    } catch (error) {
        mostrarMensaje(error.message, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selectMateria = document.getElementById('id_materia');
    if (selectMateria) {
        selectMateria.addEventListener('change', (event) => {
            cargarNotas(event.target.value);
        });
    }

    const formulario = document.getElementById('form-nota');
    if (formulario) {
        formulario.addEventListener('submit', manejarFormulario);
    }

    const contenedor = document.getElementById('lista-notas');
    if (contenedor) {
        contenedor.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-eliminar-nota')) {
                const idNota = event.target.dataset.id;
                manejarEliminar(idNota);
            }
        });
    }

    cargarMateriasEnSelect();
});