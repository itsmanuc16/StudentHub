<?php
require_once __DIR__ . '/../../controllers/PerfilController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$contrasenaActual = $datos['contrasena_actual'] ?? '';
$contrasenaNueva = $datos['contrasena_nueva'] ?? '';
$confirmarContrasenaNueva = $datos['confirmar_contrasena_nueva'] ?? '';

cambiarContrasenaControlador($contrasenaActual, $contrasenaNueva, $confirmarContrasenaNueva);