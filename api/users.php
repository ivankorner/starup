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

try {
    // Todas las operaciones requieren autenticación
    $currentUser = requireAuth();

    // GET /api/users — listar usuarios (solo admins)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden listar usuarios']);
            exit;
        }

        $id = $_GET['id'] ?? null;

        if ($id) {
            // GET /api/users?id=X — obtener usuario específico
            $stmt = $pdo->prepare("
                SELECT id, nombre, email, role, activo, created_at, last_login
                FROM users
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                exit;
            }

            http_response_code(200);
            echo json_encode($user);

        } else {
            // GET /api/users — listar todos
            $stmt = $pdo->query("
                SELECT id, nombre, email, role, activo, created_at, last_login
                FROM users
                ORDER BY created_at DESC
            ");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode($users);
        }

    // POST /api/users — crear usuario (solo admins)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
        $role = 'admin';

        // Validaciones
        if (!$nombre) {
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

        // Solo se permite crear administradores
        if ($role !== 'admin') {
            http_response_code(400);
            echo json_encode(['error' => 'Solo se pueden crear administradores']);
            exit;
        }

        // Verificar que el email no exista
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'El email ya está en uso']);
            exit;
        }

        // Crear usuario
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("
            INSERT INTO users (nombre, email, password_hash, role, activo)
            VALUES (?, ?, ?, ?, 1)
        ");
        $stmt->execute([$nombre, $email, $passwordHash, $role]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $pdo->lastInsertId(),
            'message' => 'Usuario creado exitosamente',
        ]);

        log_message("Nuevo usuario creado: $email (role: $role) por {$currentUser['email']}", 'INFO');

    // PUT /api/users — actualizar usuario (solo admins)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        if ($currentUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Solo administradores pueden editar usuarios']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario requerido']);
            exit;
        }

        // Verificar que el usuario existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            exit;
        }

        // Actualizar campos permitidos
        $updates = [];
        $params = [];

        if (isset($data['nombre'])) {
            $nombre = trim($data['nombre'] ?? '');
            if ($nombre) {
                $updates[] = 'nombre = ?';
                $params[] = $nombre;
            }
        }

        if (isset($data['password']) && $data['password']) {
            if (strlen($data['password']) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'Contraseña debe tener mínimo 6 caracteres']);
                exit;
            }
            $updates[] = 'password_hash = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        // El rol no se puede cambiar (todos son administradores)
        if (isset($data['role'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El rol no puede ser modificado']);
            exit;
        }

        if (isset($data['activo'])) {
            $updates[] = 'activo = ?';
            $params[] = (int)$data['activo'];
        }

        if (empty($updates)) {
            http_response_code(200);
            echo json_encode(['message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Usuario actualizado']);

        log_message("Usuario actualizado: id=$id por {$currentUser['email']}", 'INFO');

    // DELETE /api/users?id=X — eliminar usuario (solo admins)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
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

        // No permitir eliminar el último admin
        if ($id === $currentUser['id']) {
            http_response_code(400);
            echo json_encode(['error' => 'No puedes eliminar tu propia cuenta']);
            exit;
        }

        // Verificar que existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            exit;
        }

        // Eliminar sesiones del usuario
        $stmt = $pdo->prepare("DELETE FROM sessions WHERE user_id = ?");
        $stmt->execute([$id]);

        // Eliminar usuario
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Usuario eliminado']);

        log_message("Usuario eliminado: id=$id por {$currentUser['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en users.php: " . $e->getMessage(), 'ERROR');
}
?>
