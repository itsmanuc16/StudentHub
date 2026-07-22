<?php

require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/session.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/Materia.php';

/**
 * Crea una nueva materia para el estudiante autenticado.
 * 
 * @param string $nombre
 * @param string $periodoAcademico
 */
function crearMateriaControlador($nombre, $periodoAcademico) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($nombre) || campoVacio($periodoAcademico)) {
        respuestaError('Todos los campos son obligatorios.');
    }

    $idMateria = crearMateria($idEstudiante, $nombre, $periodoAcademico);

    respuestaExitosa([
        'id_materia' => $idMateria,
    ]);
}

/**
 * Lista las materias del estudiante autenticado.
 */
function listarMateriasControlador() {
    $idEstudiante = obtenerIdEstudianteSesion();

    $materias = obtenerMateriasPorEstudiante($idEstudiante);

    respuestaExitosa($materias);
}