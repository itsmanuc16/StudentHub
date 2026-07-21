<?php

function conectarDB() {
    $host = "localhost";
    $nombre_bd = "studenthub";
    $usuario = "root";
    $contrasena = "manuela14012";
    $puerto = "3307";

    try {
        $conexion = new PDO(
            "mysql:host=$host;port=$puerto;dbname=$nombre_bd;charset=utf8mb4",
            $usuario,
            $contrasena
        );
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}