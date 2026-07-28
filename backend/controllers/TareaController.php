<?php
require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/session.php';
require_once __DIR__ . '/../models/Tarea.php';
require_once __DIR__ . '/../models/Materia.php';

$ESTADOS_VALIDOS = ['pendiente', 'en_progreso', 'completada'];

function crearTareaControlador($idMateria, $titulo, $fechaEntrega) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idMateria) || campoVacio($titulo) || campoVacio($fechaEntrega)) {
        respuestaError("Todos los campos son obligatorios.");
    }

    $materia = obtenerMateriaPorId($idMateria);
    if (!$materia || (int)$materia['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La materia indicada no existe o no te pertenece.", 403);
    }

    $idTarea = crearTarea($idMateria, $titulo, $fechaEntrega);

    respuestaExitosa(["id_tarea" => $idTarea]);
}

function listarTareasControlador() {
    $idEstudiante = obtenerIdEstudianteSesion();
    $tareas = obtenerTareasPorEstudiante($idEstudiante);

    respuestaExitosa($tareas);
}

function actualizarTareaControlador($idTarea, $titulo, $fechaEntrega) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idTarea) || campoVacio($titulo) || campoVacio($fechaEntrega)) {
        respuestaError("Todos los campos son obligatorios.");
    }

    $tarea = obtenerTareaPorId($idTarea);
    if (!$tarea || (int)$tarea['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La tarea indicada no existe o no te pertenece.", 403);
    }

    actualizarTarea($idTarea, $titulo, $fechaEntrega);

    respuestaExitosa();
}

function cambiarEstadoControlador($idTarea, $nuevoEstado) {
    global $ESTADOS_VALIDOS;
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idTarea) || campoVacio($nuevoEstado)) {
        respuestaError("Debes indicar la tarea y el nuevo estado.");
    }

    if (!in_array($nuevoEstado, $ESTADOS_VALIDOS)) {
        respuestaError("El estado indicado no es válido.");
    }

    $tarea = obtenerTareaPorId($idTarea);
    if (!$tarea || (int)$tarea['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La tarea indicada no existe o no te pertenece.", 403);
    }

    actualizarEstadoTarea($idTarea, $nuevoEstado);

    respuestaExitosa();
}

function eliminarTareaControlador($idTarea) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idTarea)) {
        respuestaError("Debes indicar qué tarea deseas eliminar.");
    }

    $tarea = obtenerTareaPorId($idTarea);
    if (!$tarea || (int)$tarea['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La tarea indicada no existe o no te pertenece.", 403);
    }

    eliminarTareaPorId($idTarea);

    respuestaExitosa();
}