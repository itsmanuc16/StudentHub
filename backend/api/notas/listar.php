<?php
require_once __DIR__ . '/../../controllers/NotaController.php';

$idMateria = $_GET['id_materia'] ?? '';

listarNotasControlador($idMateria);