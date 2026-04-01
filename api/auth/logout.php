<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once '../db.php';
require_once '../middleware.php';

try {
    // Obtener token del header
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';

    if (preg_match('/^Bearer\s+(.+)$/i', $auth, $matches)) {
        $token = $matches[1];

        // Eliminar la sesión
        $stmt = $pdo->prepare("DELETE FROM sessions WHERE token = ?");
        $stmt->execute([$token]);
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logout exitoso']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en logout: " . $e->getMessage(), 'ERROR');
}
?>
