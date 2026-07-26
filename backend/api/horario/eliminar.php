<?php
require_once __DIR__ . '/../../controllers/HorarioController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idHorario = $datos['id_horario'] ?? '';

eliminarHorarioControlador($idHorario);