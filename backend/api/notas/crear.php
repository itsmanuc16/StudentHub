<?php
require_once __DIR__ . '/../../controllers/NotaController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idMateria = $datos['id_materia'] ?? '';
$valor = $datos['valor'] ?? '';
$descripcion = $datos['descripcion'] ?? '';

crearNotaControlador($idMateria, $valor, $descripcion);