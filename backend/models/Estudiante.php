<?php
require_once __DIR__ . '/../config/database.php';

function crearEstudiante($nombre, $correo, $contrasenaHash) {
    $conexion = conectarDB();

    $sql = "INSERT INTO estudiantes (nombre, correo, contrasena) VALUES (:nombre, :correo, :contrasena)";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':contrasena' => $contrasenaHash
    ]);

    return $conexion->lastInsertId();
}

function buscarEstudiantePorCorreo($correo) {
    $conexion = conectarDB();

    $sql = "SELECT * FROM estudiantes WHERE correo = :correo";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':correo' => $correo]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}