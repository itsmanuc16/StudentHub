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

function obtenerEstudiantePorId($idEstudiante) {
    $conexion = conectarDB();

    $sql = "SELECT id_estudiante, nombre, correo, contrasena FROM estudiantes WHERE id_estudiante = :id_estudiante";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_estudiante' => $idEstudiante]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}

function actualizarEstudiante($idEstudiante, $nombre, $correo) {
    $conexion = conectarDB();

    $sql = "UPDATE estudiantes SET nombre = :nombre, correo = :correo WHERE id_estudiante = :id_estudiante";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':id_estudiante' => $idEstudiante
    ]);

    return $consulta->rowCount() > 0;
}

function actualizarContrasena($idEstudiante, $contrasenaHash) {
    $conexion = conectarDB();

    $sql = "UPDATE estudiantes SET contrasena = :contrasena WHERE id_estudiante = :id_estudiante";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':contrasena' => $contrasenaHash,
        ':id_estudiante' => $idEstudiante
    ]);

    return $consulta->rowCount() > 0;
}