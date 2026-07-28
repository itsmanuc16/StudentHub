<?php
require_once __DIR__ . '/../../controllers/TareaController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idMateria = $datos['id_materia'] ?? '';
$titulo = $datos['titulo'] ?? '';
$fechaEntrega = $datos['fecha_entrega'] ?? '';

crearTareaControlador($idMateria, $titulo, $fechaEntrega);