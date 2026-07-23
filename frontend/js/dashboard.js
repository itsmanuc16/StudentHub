const API_BASE_MATERIAS = '/StudentHub/backend/api/materias';

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

document.addEventListener('DOMContentLoaded', () => {
    cargarResumenMaterias();
});