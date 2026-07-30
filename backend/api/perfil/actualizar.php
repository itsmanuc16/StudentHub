<?php
require_once __DIR__ . '/../../controllers/PerfilController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$correo = $datos['correo'] ?? '';

actualizarPerfilControlador($nombre, $correo);