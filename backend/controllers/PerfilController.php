<?php
require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/session.php';
require_once __DIR__ . '/../models/Estudiante.php';

function obtenerPerfilControlador() {
    $idEstudiante = obtenerIdEstudianteSesion();
    $estudiante = obtenerEstudiantePorId($idEstudiante);

    respuestaExitosa([
        "nombre" => $estudiante['nombre'],
        "correo" => $estudiante['correo']
    ]);
}

function actualizarPerfilControlador($nombre, $correo) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($nombre) || campoVacio($correo)) {
        respuestaError("El nombre y el correo son obligatorios.");
    }

    if (!correoValido($correo)) {
        respuestaError("El formato del correo no es válido.");
    }

    $estudianteConEseCorreo = buscarEstudiantePorCorreo($correo);
    if ($estudianteConEseCorreo && (int)$estudianteConEseCorreo['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("Ese correo ya está en uso por otra cuenta.");
    }

    actualizarEstudiante($idEstudiante, $nombre, $correo);

    respuestaExitosa();
}

function cambiarContrasenaControlador($contrasenaActual, $contrasenaNueva, $confirmarContrasenaNueva) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($contrasenaActual) || campoVacio($contrasenaNueva) || campoVacio($confirmarContrasenaNueva)) {
        respuestaError("Debes completar todos los campos de contraseña.");
    }

    if ($contrasenaNueva !== $confirmarContrasenaNueva) {
        respuestaError("La nueva contraseña y su confirmación no coinciden.");
    }

    $estudiante = obtenerEstudiantePorId($idEstudiante);

    if (!password_verify($contrasenaActual, $estudiante['contrasena'])) {
        respuestaError("La contraseña actual no es correcta.", 401);
    }

    $nuevoHash = password_hash($contrasenaNueva, PASSWORD_BCRYPT);
    actualizarContrasena($idEstudiante, $nuevoHash);

    respuestaExitosa();
}