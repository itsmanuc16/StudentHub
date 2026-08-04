const CLAVE_TEMA = 'studenthub_tema';

function aplicarTema(tema) {
    if (tema === 'claro') {
        document.documentElement.setAttribute('data-theme', 'claro');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function actualizarBotonTema(tema) {
    const boton = document.getElementById('btn-tema');
    if (!boton) return;

    const esClaro = tema === 'claro';
    boton.setAttribute('aria-pressed', String(esClaro));
    boton.setAttribute('aria-label', esClaro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
}

function alternarTema() {
    const temaActual = document.documentElement.getAttribute('data-theme') === 'claro' ? 'claro' : 'oscuro';
    const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';

    aplicarTema(nuevoTema);
    localStorage.setItem(CLAVE_TEMA, nuevoTema);
    actualizarBotonTema(nuevoTema);
}

document.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem(CLAVE_TEMA) || 'oscuro';
    actualizarBotonTema(temaGuardado);

    const boton = document.getElementById('btn-tema');
    if (boton) {
        boton.addEventListener('click', alternarTema);
    }
});