<?php

function respuestaExitosa($datos = []) {
    header('Content-Type: application/json');
    echo json_encode([
        "exito" => true,
        "datos" => $datos
    ]);
    exit;
}

function respuestaError($mensaje, $codigoHttp = 400) {
    header('Content-Type: application/json');
    http_response_code($codigoHttp);
    echo json_encode([
        "exito" => false,
        "mensaje" => $mensaje
    ]);
    exit;
}