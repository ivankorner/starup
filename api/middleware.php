<?php
/**
 * Middleware de autenticación
 * Valida tokens Bearer en el header Authorization
 */

require_once 'db.php';
require_once 'config.php';

/**
 * Obtener usuario actual si el token es válido
 *
 * @return array|false Usuario si token válido, false si no
 */
function getCurrentUser() {
    // Obtener header Authorization (compatible con diferentes servidores)
    $auth = '';

    // Intenta múltiples formas de obtener el header Authorization
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (empty($auth) || !preg_match('/^Bearer\s+(.+)$/i', $auth, $matches)) {
        return false;
    }

    $token = trim($matches[1]);
    global $pdo;

    try {
        // Buscar el token en la BD
        $stmt = $pdo->prepare("
            SELECT u.*
            FROM users u
            JOIN sessions s ON u.id = s.user_id
            WHERE s.token = ?
            AND s.expires_at > NOW()
            AND u.activo = 1
        ");
        $stmt->execute([$token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        log_message("Error al verificar token: " . $e->getMessage(), 'ERROR');
        return false;
    }
}

/**
 * Requerir autenticación
 * Si no hay token válido, devuelve error 401 y termina ejecución
 *
 * @return array Usuario actual
 */
function requireAuth() {
    $user = getCurrentUser();

    if (!$user) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    return $user;
}

/**
 * Requerir rol específico
 *
 * @param string $role 'admin' o 'evaluador'
 * @return array Usuario actual
 */
function requireRole($role) {
    $user = requireAuth();

    if ($user['role'] !== $role) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }

    return $user;
}

/**
 * Requerir admin
 *
 * @return array Usuario admin
 */
function requireAdmin() {
    return requireRole('admin');
}
?>
