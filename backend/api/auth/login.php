<?php
session_start();
require_once __DIR__ . '/../../controllers/AuthController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$correo = $datos['correo'] ?? '';
$contrasena = $datos['contrasena'] ?? '';

iniciarSesion($correo, $contrasena);