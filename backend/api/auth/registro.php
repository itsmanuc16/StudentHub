<?php
require_once __DIR__ . '/../../controllers/AuthController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$correo = $datos['correo'] ?? '';
$contrasena = $datos['contrasena'] ?? '';

registrarEstudiante($nombre, $correo, $contrasena);