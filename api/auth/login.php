<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido']);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email y contraseña requeridos']);
    exit;
}

try {
    // Buscar usuario por email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND activo = 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Validar contraseña
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }

    // Generar token (32 bytes hex = 64 caracteres)
    $token = bin2hex(random_bytes(32));

    // Calcular expiración (24 horas)
    $expiresAt = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);

    // Guardar sesión
    $stmt = $pdo->prepare("
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$token, $user['id'], $expiresAt]);

    // Actualizar last_login
    $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Responder con token y datos del usuario
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);

    log_message("Login exitoso: {$user['email']}", 'INFO');

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en login: " . $e->getMessage(), 'ERROR');
}
?>
