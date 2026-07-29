<?php
require_once __DIR__ . '/../config/database.php';

function crearNota($idMateria, $valor, $descripcion) {
    $conexion = conectarDB();

    $sql = "INSERT INTO notas (id_materia, valor, descripcion)
            VALUES (:id_materia, :valor, :descripcion)";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_materia' => $idMateria,
        ':valor' => $valor,
        ':descripcion' => $descripcion
    ]);

    return $conexion->lastInsertId();
}

function obtenerNotasPorMateria($idMateria) {
    $conexion = conectarDB();

    $sql = "SELECT id_nota, valor, descripcion, fecha_registro
            FROM notas
            WHERE id_materia = :id_materia
            ORDER BY fecha_registro DESC";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_materia' => $idMateria]);

    return $consulta->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerPromedioPorMateria($idMateria) {
    $conexion = conectarDB();

    $sql = "SELECT AVG(valor) AS promedio FROM notas WHERE id_materia = :id_materia";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_materia' => $idMateria]);

    $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
    return $resultado['promedio'] !== null ? round((float)$resultado['promedio'], 2) : null;
}

function obtenerNotaPorId($idNota) {
    $conexion = conectarDB();

    $sql = "SELECT n.id_nota, n.id_materia, n.valor, n.descripcion,
                   m.id_estudiante
            FROM notas n
            INNER JOIN materias m ON n.id_materia = m.id_materia
            WHERE n.id_nota = :id_nota";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_nota' => $idNota]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}

function eliminarNotaPorId($idNota) {
    $conexion = conectarDB();

    $sql = "DELETE FROM notas WHERE id_nota = :id_nota";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_nota' => $idNota]);

    return $consulta->rowCount() > 0;
}