<?php
require_once __DIR__ . '/../config/database.php';

function crearHorario($idMateria, $diaSemana, $horaInicio, $horaFin) {
    $conexion = conectarDB();

    $sql = "INSERT INTO horarios (id_materia, dia_semana, hora_inicio, hora_fin)
            VALUES (:id_materia, :dia_semana, :hora_inicio, :hora_fin)";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_materia' => $idMateria,
        ':dia_semana' => $diaSemana,
        ':hora_inicio' => $horaInicio,
        ':hora_fin' => $horaFin
    ]);

    return $conexion->lastInsertId();
}

function obtenerHorarioPorEstudiante($idEstudiante) {
    $conexion = conectarDB();

    $sql = "SELECT h.id_horario, h.dia_semana, h.hora_inicio, h.hora_fin,
                   m.id_materia, m.nombre AS nombre_materia
            FROM horarios h
            INNER JOIN materias m ON h.id_materia = m.id_materia
            WHERE m.id_estudiante = :id_estudiante
            ORDER BY FIELD(h.dia_semana, 'lunes','martes','miercoles','jueves','viernes','sabado','domingo'),
                     h.hora_inicio";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_estudiante' => $idEstudiante]);

    return $consulta->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerHorarioPorId($idHorario) {
    $conexion = conectarDB();

    $sql = "SELECT h.id_horario, h.id_materia, h.dia_semana, h.hora_inicio, h.hora_fin,
                   m.id_estudiante
            FROM horarios h
            INNER JOIN materias m ON h.id_materia = m.id_materia
            WHERE h.id_horario = :id_horario";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_horario' => $idHorario]);

    return $consulta->fetch(PDO::FETCH_ASSOC);
}

function existeSolapamiento($idEstudiante, $diaSemana, $horaInicio, $horaFin) {
    $conexion = conectarDB();

    $sql = "SELECT COUNT(*) AS total
            FROM horarios h
            INNER JOIN materias m ON h.id_materia = m.id_materia
            WHERE m.id_estudiante = :id_estudiante
              AND h.dia_semana = :dia_semana
              AND h.hora_inicio < :hora_fin
              AND h.hora_fin > :hora_inicio";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([
        ':id_estudiante' => $idEstudiante,
        ':dia_semana' => $diaSemana,
        ':hora_inicio' => $horaInicio,
        ':hora_fin' => $horaFin
    ]);

    $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
    return $resultado['total'] > 0;
}

function eliminarHorarioPorId($idHorario) {
    $conexion = conectarDB();

    $sql = "DELETE FROM horarios WHERE id_horario = :id_horario";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([':id_horario' => $idHorario]);

    return $consulta->rowCount() > 0;
}