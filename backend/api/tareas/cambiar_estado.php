<?php
require_once __DIR__ . '/../../controllers/TareaController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idTarea = $datos['id_tarea'] ?? '';
$nuevoEstado = $datos['estado'] ?? '';

cambiarEstadoControlador($idTarea, $nuevoEstado);