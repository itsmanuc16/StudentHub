<?php
require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/session.php';
require_once __DIR__ . '/../models/Nota.php';
require_once __DIR__ . '/../models/Materia.php';

function crearNotaControlador($idMateria, $valor, $descripcion) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idMateria) || campoVacio($valor)) {
        respuestaError("La materia y el valor de la nota son obligatorios.");
    }

    if (!is_numeric($valor) || $valor < 0 || $valor > 5) {
        respuestaError("El valor de la nota debe estar entre 0.00 y 5.00.");
    }

    $materia = obtenerMateriaPorId($idMateria);
    if (!$materia || (int)$materia['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La materia indicada no existe o no te pertenece.", 403);
    }

    $idNota = crearNota($idMateria, $valor, $descripcion ?: null);

    respuestaExitosa(["id_nota" => $idNota]);
}

function listarNotasControlador($idMateria) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idMateria)) {
        respuestaError("Debes indicar la materia de la cual deseas ver las notas.");
    }

    $materia = obtenerMateriaPorId($idMateria);
    if (!$materia || (int)$materia['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La materia indicada no existe o no te pertenece.", 403);
    }

    $notas = obtenerNotasPorMateria($idMateria);
    $promedio = obtenerPromedioPorMateria($idMateria);

    respuestaExitosa([
        "notas" => $notas,
        "promedio" => $promedio
    ]);
}

function eliminarNotaControlador($idNota) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idNota)) {
        respuestaError("Debes indicar qué nota deseas eliminar.");
    }

    $nota = obtenerNotaPorId($idNota);
    if (!$nota || (int)$nota['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La nota indicada no existe o no te pertenece.", 403);
    }

    eliminarNotaPorId($idNota);

    respuestaExitosa();
}