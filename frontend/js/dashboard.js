const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';
const API_BASE_TAREAS = '/StudentHub/backend/api/tareas';
const API_BASE_HORARIO = '/StudentHub/backend/api/horario';

const DIA_ACTUAL = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()];

const NOMBRES_DIAS_DASHBOARD = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
    jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
};

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

async function cargarResumenHorario() {
    const contenedor = document.getElementById('resumen-horario');
    if (!contenedor) return;

    try {
        const horario = await enviarDatosGet(`${API_BASE_HORARIO}/listar.php`);
        const bloquesDeHoy = horario.filter((bloque) => bloque.dia_semana === DIA_ACTUAL);

        if (bloquesDeHoy.length === 0) {
            contenedor.textContent = `No tienes bloques de horario registrados para hoy (${NOMBRES_DIAS_DASHBOARD[DIA_ACTUAL]}).`;
            return;
        }

        contenedor.innerHTML = '<ul>' + bloquesDeHoy.map((bloque) => `
            <li>${escaparHtml(bloque.nombre_materia)}:
                ${formatearHora(bloque.hora_inicio)} - ${formatearHora(bloque.hora_fin)}</li>
        `).join('') + '</ul>';
    } catch (error) {
        contenedor.textContent = 'No se pudo cargar la información de horario.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarResumenMaterias();
    cargarResumenTareas();
    cargarResumenHorario();
});