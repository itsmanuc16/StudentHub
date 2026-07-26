<?php
require_once __DIR__ . '/../helpers/validar.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/session.php';
require_once __DIR__ . '/../models/Horario.php';
require_once __DIR__ . '/../models/Materia.php';

$DIAS_VALIDOS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

function crearHorarioControlador($idMateria, $diaSemana, $horaInicio, $horaFin) {
    global $DIAS_VALIDOS;
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idMateria) || campoVacio($diaSemana) || campoVacio($horaInicio) || campoVacio($horaFin)) {
        respuestaError("Todos los campos son obligatorios.");
    }

    if (!in_array($diaSemana, $DIAS_VALIDOS)) {
        respuestaError("El día de la semana no es válido.");
    }

    if ($horaInicio >= $horaFin) {
        respuestaError("La hora de inicio debe ser anterior a la hora de fin.");
    }

    $materia = obtenerMateriaPorId($idMateria);
    if (!$materia || (int)$materia['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("La materia indicada no existe o no te pertenece.", 403);
    }

    if (existeSolapamiento($idEstudiante, $diaSemana, $horaInicio, $horaFin)) {
        respuestaError("Ya tienes un horario registrado que se cruza con este rango de horas.");
    }

    $idHorario = crearHorario($idMateria, $diaSemana, $horaInicio, $horaFin);

    respuestaExitosa(["id_horario" => $idHorario]);
}

function listarHorarioControlador() {
    $idEstudiante = obtenerIdEstudianteSesion();
    $horario = obtenerHorarioPorEstudiante($idEstudiante);

    respuestaExitosa($horario);
}

function eliminarHorarioControlador($idHorario) {
    $idEstudiante = obtenerIdEstudianteSesion();

    if (campoVacio($idHorario)) {
        respuestaError("Debes indicar qué bloque de horario deseas eliminar.");
    }

    $horario = obtenerHorarioPorId($idHorario);
    if (!$horario || (int)$horario['id_estudiante'] !== (int)$idEstudiante) {
        respuestaError("El horario indicado no existe o no te pertenece.", 403);
    }

    eliminarHorarioPorId($idHorario);

    respuestaExitosa();
}