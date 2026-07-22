<?php
require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/Estudiante.php';

function registrarEstudiante($nombre, $correo, $contrasena) {
    if (campoVacio($nombre) || campoVacio($correo) || campoVacio($contrasena)) {
        respuestaError("Todos los campos son obligatorios.");
    }

    if (!correoValido($correo)) {
        respuestaError("El formato del correo no es válido.");
    }

    $estudianteExistente = buscarEstudiantePorCorreo($correo);
    if ($estudianteExistente) {
        respuestaError("Ya existe una cuenta registrada con este correo.");
    }

    $contrasenaHash = password_hash($contrasena, PASSWORD_BCRYPT);
    $idEstudiante = crearEstudiante($nombre, $correo, $contrasenaHash);

    respuestaExitosa(["id_estudiante" => $idEstudiante]);
}

function iniciarSesion($correo, $contrasena) {
    if (campoVacio($correo) || campoVacio($contrasena)) {
        respuestaError("Debes ingresar tu correo y contraseña.");
    }

    $estudiante = buscarEstudiantePorCorreo($correo);

    if (!$estudiante || !password_verify($contrasena, $estudiante['contrasena'])) {
        respuestaError("Correo o contraseña incorrectos.", 401);
    }

    $_SESSION['id_estudiante'] = $estudiante['id_estudiante'];
    $_SESSION['nombre'] = $estudiante['nombre'];

    respuestaExitosa([
        "id_estudiante" => $estudiante['id_estudiante'],
        "nombre" => $estudiante['nombre']
    ]);
}