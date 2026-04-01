<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once '../db.php';
require_once '../middleware.php';

try {
    $user = getCurrentUser();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email'],
            'role' => $user['role'],
            'activo' => $user['activo'],
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login'],
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en me: " . $e->getMessage(), 'ERROR');
}
?>
