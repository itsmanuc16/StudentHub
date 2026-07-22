<?php

function campoVacio($valor) {
    return trim($valor) === "";
}

function correoValido($correo) {
    return filter_var($correo, FILTER_VALIDATE_EMAIL) !== false;
}