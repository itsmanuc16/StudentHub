<?php

require_once __DIR__ . '/response.php';

/**
 * Inicia la sesión PHP si aún no se ha iniciado.
 */
function iniciarSesionSiNoIniciada() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Verifica que exista una sesión válida de estudiantes.
 * Si no existe, devuelve un error JSON con código 401.
 */
function verificarAutenticacion() {
    iniciarSesionSiNoIniciada();

    if (empty($_SESSION['id_estudiante'])) {
        respuestaError('No autorizado. Inicia sesión para continuar.', 401);
    }
}

/**
 * Retorna el id_estudante guardado en la sesión.
 * Si no hay sesión válida, el proceso ya terminó en verificarAutentificacion().
 * 
 * @return int
 */
function obtenerIdEstudianteSesion() {
    verificarAutenticacion();
    return (int) $_SESSION['id_estudiante'];
}

/**
 * Retorna el nombre del estudiante guardado en la sesión.
 * 
 * @return string
 */
function obtenerNombreEstudianteSesion() {
    verificarAutenticacion();
    return trim($_SESSION['nombre'] ?? '');
}

/**
 * Cierra la sesión actual de forma segura.
 */
function cerrarSesion() {
    iniciarSesionSiNoIniciada();
    $_SESSION = [];
    if(ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
}