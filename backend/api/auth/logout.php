<?php
session_start();
require_once __DIR__ . '/../../helpers/response.php';

session_destroy();
respuestaExitosa();