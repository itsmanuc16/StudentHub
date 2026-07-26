<?php 
require_once __DIR__ . '/../../controllers/HorarioController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idMateria = $datos['id_materia'] ?? '';
$diaSemana = $datos['dia_semana'] ?? '';
$horaInicio = $datos['hora_inicio'] ?? '';
$horaFin = $datos['hora_fin'] ?? '';

crearHorarioControlador($idMateria, $diaSemana, $horaInicio, $horaFin);