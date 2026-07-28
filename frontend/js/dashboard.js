const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';
const API_BASE_TAREAS = '/StudentHub/backend/api/tareas';

async function cargarResumenMaterias() {
    const contenedor = document.getElementById('resumen-materias');
    if (!contenedor) return;

    try {
        const materias = await enviarDatosGet(`${API_BASE_MATERIAS}/listar.php`);

        if (!Array.isArray(materias) || materias.length === 0) {
            contenedor.textContent = 'Aún no has registrado ninguna materia.';
            return;
        }

        const nombres = materias.map((materia) => escaparHtml(materia.nombre)).join(', ');
        contenedor.innerHTML = `Tienes <strong>${materias.length}</strong> materia(s) registrada(s): ${nombres}.`;
    } catch (error) {
        contenedor.textContent = 'No se pudo cargar la información de materias.';
    }
}

function formatearFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
}

function sumarDias(fechaISO, dias) {
    const fecha = new Date(fechaISO + 'T00:00:00');
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
}

async function cargarResumenTareas() {
    const contenedor = document.getElementById('resumen-tareas');
    if (!contenedor) return;

    try {
        const tareas = await enviarDatosGet(`${API_BASE_TAREAS}/listar.php`);
        const hoy = new Date().toISOString().slice(0, 10);

        const pendientes = tareas.filter((tarea) => tarea.estado !== 'completada');
        const enRango = pendientes.filter((tarea) => tarea.fecha_entrega <= sumarDias(hoy, 7));

        if (enRango.length === 0) {
            contenedor.textContent = 'No tienes tareas próximas ni atrasadas.';
            return;
        }

        contenedor.innerHTML = '<ul>' + enRango.map((tarea) => {
            const estaAtrasada = tarea.fecha_entrega < hoy;
            const etiqueta = estaAtrasada
                ? ' <strong style="color:#b00020;">(Atrasada)</strong>'
                : '';

            return `<li>${escaparHtml(tarea.titulo)} — ${escaparHtml(tarea.nombre_materia)}
                     (${formatearFecha(tarea.fecha_entrega)})${etiqueta}</li>`;
        }).join('') + '</ul>';
    } catch (error) {
        contenedor.textContent = 'No se pudo cargar la información de tareas.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarResumenMaterias();
    cargarResumenTareas();
});