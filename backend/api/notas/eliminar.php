<?php
require_once __DIR__ . '/../../controllers/NotaController.php';

$datos = json_decode(file_get_contents("php://input"), true);

$idNota = $datos['id_nota'] ?? '';

eliminarNotaControlador($idNota);