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

try {
    $currentUser = requireAuth();

    if ($currentUser['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Solo administradores pueden gestionar áreas']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, nombre, activo, created_at, updated_at FROM work_areas ORDER BY nombre ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $nombre = trim($data['nombre'] ?? '');

        if ($nombre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre requerido']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM work_areas WHERE nombre = ?");
        $stmt->execute([$nombre]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Ya existe un área con ese nombre']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO work_areas (nombre, activo) VALUES (?, 1)");
        $stmt->execute([$nombre]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $pdo->lastInsertId(),
            'message' => 'Área creada',
        ]);

        log_message("Área creada: $nombre por {$currentUser['email']}", 'INFO');
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $updates = [];
        $params = [];

        if (isset($data['nombre'])) {
            $nombre = trim($data['nombre']);
            if ($nombre === '') {
                http_response_code(400);
                echo json_encode(['error' => 'Nombre requerido']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT id FROM work_areas WHERE nombre = ? AND id <> ?");
            $stmt->execute([$nombre, $id]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Ya existe un área con ese nombre']);
                exit;
            }

            $updates[] = 'nombre = ?';
            $params[] = $nombre;
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
        $query = "UPDATE work_areas SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Área actualizada']);

        log_message("Área actualizada: id=$id por {$currentUser['email']}", 'INFO');
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE area_id = ? LIMIT 1");
        $stmt->execute([$id]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'No se puede eliminar un área que está asignada a usuarios']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM work_areas WHERE id = ?");
        $stmt->execute([$id]);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Área eliminada']);

        log_message("Área eliminada: id=$id por {$currentUser['email']}", 'INFO');
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en work_areas.php: " . $e->getMessage(), 'ERROR');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno']);
    log_message("Error en work_areas.php: " . $e->getMessage(), 'ERROR');
}
?>