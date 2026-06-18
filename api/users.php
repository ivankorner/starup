<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'middleware.php';
require_once 'config.php';

function columnExists(PDO $pdo, string $table, string $column): bool {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?");
    $stmt->execute([$table, $column]);
    return (int)$stmt->fetchColumn() > 0;
}

function tableExists(PDO $pdo, string $table): bool {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?");
    $stmt->execute([$table]);
    return (int)$stmt->fetchColumn() > 0;
}

try {
    $currentUser = requireAuth();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden listar usuarios']);
            exit;
        }

        $hasAreaColumn = columnExists($pdo, 'users', 'area_id');
        $hasAreasTable = $hasAreaColumn && tableExists($pdo, 'work_areas');
        $id = $_GET['id'] ?? null;

        if ($id) {
            if ($hasAreasTable) {
                $stmt = $pdo->prepare("SELECT u.id, u.nombre, u.email, u.role, u.activo, u.created_at, u.last_login, wa.id AS area_id, wa.nombre AS area_name FROM users u LEFT JOIN work_areas wa ON wa.id = u.area_id WHERE u.id = ?");
            } else {
                $stmt = $pdo->prepare("SELECT id, nombre, email, role, activo, created_at, last_login FROM users WHERE id = ?");
            }

            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                exit;
            }

            echo json_encode($user);
            exit;
        }

        if ($hasAreasTable) {
            $stmt = $pdo->query("SELECT u.id, u.nombre, u.email, u.role, u.activo, u.created_at, u.last_login, wa.id AS area_id, wa.nombre AS area_name FROM users u LEFT JOIN work_areas wa ON wa.id = u.area_id ORDER BY u.created_at DESC");
        } else {
            $stmt = $pdo->query("SELECT id, nombre, email, role, activo, created_at, last_login FROM users ORDER BY created_at DESC");
        }

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden crear usuarios']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $nombre = trim($data['nombre'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $areaId = $data['area_id'] ?? null;

        if ($nombre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre requerido']);
            exit;
        }

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email válido requerido']);
            exit;
        }

        if (!$password || strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Contraseña debe tener mínimo 6 caracteres']);
            exit;
        }

        $hasAreaColumn = columnExists($pdo, 'users', 'area_id');
        $hasAreasTable = $hasAreaColumn && tableExists($pdo, 'work_areas');

        if ($hasAreasTable) {
            if ($areaId !== null && $areaId !== '') {
                $stmt = $pdo->prepare("SELECT id FROM work_areas WHERE id = ? AND activo = 1");
                $stmt->execute([$areaId]);
                if (!$stmt->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Área de trabajo inválida']);
                    exit;
                }
            } else {
                $areaId = null;
            }
        } else {
            $areaId = null;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'El email ya está en uso']);
            exit;
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        if ($hasAreaColumn) {
            $stmt = $pdo->prepare("INSERT INTO users (nombre, email, password_hash, role, activo, area_id) VALUES (?, ?, ?, 'admin', 1, ?)");
            $stmt->execute([$nombre, $email, $passwordHash, $areaId]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO users (nombre, email, password_hash, role, activo) VALUES (?, ?, ?, 'admin', 1)");
            $stmt->execute([$nombre, $email, $passwordHash]);
        }

        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Usuario creado exitosamente']);
        log_message("Nuevo usuario creado: $email por {$currentUser['email']}", 'INFO');
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden editar usuarios']);
            exit;
        }

        $id = $_GET['id'] ?? null;
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario requerido']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            exit;
        }

        $hasAreaColumn = columnExists($pdo, 'users', 'area_id');
        $hasAreasTable = $hasAreaColumn && tableExists($pdo, 'work_areas');
        $updates = [];
        $params = [];

        if (isset($data['nombre'])) {
            $nombre = trim($data['nombre']);
            if ($nombre !== '') {
                $updates[] = 'nombre = ?';
                $params[] = $nombre;
            }
        }

        if (!empty($data['password'])) {
            if (strlen($data['password']) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'Contraseña debe tener mínimo 6 caracteres']);
                exit;
            }
            $updates[] = 'password_hash = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if ($hasAreaColumn && array_key_exists('area_id', $data) && $hasAreasTable) {
            $areaId = $data['area_id'];
            if ($areaId === '' || $areaId === null) {
                $updates[] = 'area_id = ?';
                $params[] = null;
            } else {
                $stmt = $pdo->prepare("SELECT id FROM work_areas WHERE id = ? AND activo = 1");
                $stmt->execute([$areaId]);
                if (!$stmt->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Área de trabajo inválida']);
                    exit;
                }
                $updates[] = 'area_id = ?';
                $params[] = $areaId;
            }
        }

        if (isset($data['activo'])) {
            $updates[] = 'activo = ?';
            $params[] = (int)$data['activo'];
        }

        if (isset($data['role'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El rol no puede ser modificado']);
            exit;
        }

        if (empty($updates)) {
            echo json_encode(['message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'Usuario actualizado']);
        log_message("Usuario actualizado: id=$id por {$currentUser['email']}", 'INFO');
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden eliminar usuarios']);
            exit;
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario requerido']);
            exit;
        }

        if ((string)$id === (string)$currentUser['id']) {
            http_response_code(400);
            echo json_encode(['error' => 'No puedes eliminar tu propia cuenta']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM sessions WHERE user_id = ?");
        $stmt->execute([$id]);

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Usuario eliminado']);
        log_message("Usuario eliminado: id=$id por {$currentUser['email']}", 'INFO');
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en users.php: " . $e->getMessage(), 'ERROR');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno']);
    log_message("Error en users.php: " . $e->getMessage(), 'ERROR');
}
?>