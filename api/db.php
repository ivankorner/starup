<?php
$isProd = str_contains($_SERVER['HTTP_HOST'] ?? '', 'cloudwaysapps.com');

if ($isProd) {
    $host = 'localhost';
    $dbname = 'tpwtvzukqe';
    $user = 'tpwtvzukqe';
    $pass = 'kdT8XYz3e6';
} else {
    $host = 'localhost';
    $dbname = 'radar_proyectos';
    $user = 'root';
    $pass = '';
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}
?>
