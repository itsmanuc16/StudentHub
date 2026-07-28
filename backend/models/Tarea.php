<?php
require_once __DIR__ . '/../config/database.php';

function crearTarea($idMateria, $titulo, $fechaEntrega) {
    $conexion = conectarDB();

    $sql = "INSERT INTO tareas (id_materia, titulo, fecha_entrega)
            VALUES (:id_materia, :titulo, :fecha_entrega)";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_materia' => $idMateria,
        ':titulo' => $titulo,
        ':fecha_entrega' => $fechaEntrega
    ]);

    return $conexion->lastInsertId();
}

function obtenerTareasPorEstudiante($idEstudiante) {
    $conexion = conectarDB();

    $sql = "SELECT t.id_tarea, t.titulo, t.fecha_entrega, t.estado,
                   m.id_materia, m.nombre AS nombre_materia
            FROM tareas t
            INNER JOIN materias m ON t.id_materia = m.id_materia
            WHERE m.id_estudiante = :id_estudiante
            ORDER BY t.fecha_entrega ASC";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_estudiante' => $idEstudiante]);

    return $consulta->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerTareaPorId($idTarea) {
    $conexion = conectarDB();

    $sql = "SELECT t.id_tarea, t.id_materia, t.titulo, t.fecha_entrega, t.estado,
                   m.id_estudiante
            FROM tareas t
            INNER JOIN materias m ON t.id_materia = m.id_materia
            WHERE t.id_tarea = :id_tarea";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_tarea' => $idTarea]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}

function actualizarTarea($idTarea, $titulo, $fechaEntrega) {
    $conexion = conectarDB();

    $sql = "UPDATE tareas SET titulo = :titulo, fecha_entrega = :fecha_entrega
            WHERE id_tarea = :id_tarea";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':titulo' => $titulo,
        ':fecha_entrega' => $fechaEntrega,
        ':id_tarea' => $idTarea
    ]);

    return $consulta->rowCount() > 0;
}

function actualizarEstadoTarea($idTarea, $nuevoEstado) {
    $conexion = conectarDB();

    $sql = "UPDATE tareas SET estado = :estado WHERE id_tarea = :id_tarea";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':estado' => $nuevoEstado,
        ':id_tarea' => $idTarea
    ]);

    return $consulta->rowCount() > 0;
}

function eliminarTareaPorId($idTarea) {
    $conexion = conectarDB();

    $sql = "DELETE FROM tareas WHERE id_tarea = :id_tarea";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_tarea' => $idTarea]);

    return $consulta->rowCount() > 0;
}