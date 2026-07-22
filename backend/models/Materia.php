<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Crea una nueva materia asociada a un estudiante.
 *
 * @param int $idEstudiante
 * @param string $nombre
 * @param string $periodoAcademico
 * @return int
 */
function crearMateria($idEstudiante, $nombre, $periodoAcademico) {
    $conexion = conectarDB();

    $sql = "INSERT INTO materias (id_estudiante, nombre, periodo_academico)
            VALUES (:id_estudiante, :nombre, :periodo_academico)";

    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_estudiante' => (int) $idEstudiante,
        ':nombre' => trim($nombre),
        ':periodo_academico' => trim($periodoAcademico)
    ]);

    return (int) $conexion->lastInsertId();
}

/**
 * Obtiene todas las materias registradas por un estudiante.
 *
 * @param int $idEstudiante
 * @return array
 */
function obtenerMateriasPorEstudiante($idEstudiante) {
    $conexion = conectarDB();

    $sql = "SELECT id_materia, id_estudiante, nombre, periodo_academico, fecha_creacion
            FROM materias
            WHERE id_estudiante = :id_estudiante
            ORDER BY fecha_creacion DESC";

    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_estudiante' => (int) $idEstudiante
    ]);

    return $consulta->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Busca una materia por su identificador.
 *
 * @param int $idMateria
 * @return array|false
 */
function buscarMateriaPorId($idMateria) {
    $conexion = conectarDB();

    $sql = "SELECT id_materia, id_estudiante, nombre, periodo_academico, fecha_creacion
            FROM materias
            WHERE id_materia = :id_materia";

    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_materia' => (int) $idMateria
    ]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}
