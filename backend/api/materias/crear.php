<?php
require_once __DIR__ . '/../../controllers/MateriaController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$periodoAcademico = $datos['periodo_academico'] ?? '';

crearMateriaControlador($nombre, $periodoAcademico);