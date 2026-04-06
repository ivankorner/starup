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
    // GET /api/forms — listar formularios
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $estado = $_GET['estado'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($id) {
            // GET /api/forms?id=X — obtener formulario específico con sus campos
            $stmt = $pdo->prepare("
                SELECT id, titulo, descripcion, estado, created_by, created_at, updated_at
                FROM forms
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $form = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$form) {
                http_response_code(404);
                echo json_encode(['error' => 'Formulario no encontrado']);
                exit;
            }

            // Obtener los campos del formulario
            $stmt = $pdo->prepare("
                SELECT id, paso, orden, tipo, label, descripcion, obligatorio,
                       opciones, max_seleccion, max_length, slug
                FROM form_fields
                WHERE form_id = ?
                ORDER BY paso, orden
            ");
            $stmt->execute([$id]);
            $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Parsear opciones JSON
            foreach ($fields as &$field) {
                $field['opciones'] = json_decode($field['opciones'] ?? '[]');
            }

            $form['fields'] = $fields;

            http_response_code(200);
            echo json_encode($form);

        } else {
            // GET /api/forms — listar todos los formularios (o filtrar por estado si se especifica)
            $query = "SELECT id, titulo, descripcion, estado, created_by, created_at, updated_at FROM forms";
            $params = [];

            if ($estado) {
                // Si se especifica estado explícitamente, usar ese filtro
                $query .= " WHERE estado = ?";
                $params[] = $estado;
            }

            $query .= " ORDER BY created_at DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode($forms);
        }

    // POST /api/forms — crear formulario (requiere auth)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = requireAuth();

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $titulo = trim($data['titulo'] ?? '');
        $descripcion = $data['descripcion'] ?? '';
        $estado = $data['estado'] ?? 'borrador';

        if (!$titulo) {
            http_response_code(400);
            echo json_encode(['error' => 'Título requerido']);
            exit;
        }

        if (!in_array($estado, ['borrador', 'publicado', 'archivado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Estado inválido']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO forms (titulo, descripcion, estado, created_by)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$titulo, $descripcion, $estado, $user['id']]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $pdo->lastInsertId(),
            'message' => 'Formulario creado',
        ]);

        log_message("Formulario creado: $titulo por {$user['email']}", 'INFO');

    // PUT /api/forms?id=X — actualizar formulario
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $user = requireAuth();
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

        // Verificar que existe
        $stmt = $pdo->prepare("SELECT id FROM forms WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        $updates = [];
        $params = [];

        if (isset($data['titulo'])) {
            $titulo = trim($data['titulo'] ?? '');
            if ($titulo) {
                $updates[] = 'titulo = ?';
                $params[] = $titulo;
            }
        }

        if (isset($data['descripcion'])) {
            $updates[] = 'descripcion = ?';
            $params[] = $data['descripcion'];
        }

        if (isset($data['estado'])) {
            if (in_array($data['estado'], ['borrador', 'publicado', 'archivado'])) {
                $updates[] = 'estado = ?';
                $params[] = $data['estado'];
            }
        }

        if (empty($updates)) {
            http_response_code(200);
            echo json_encode(['message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $query = "UPDATE forms SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Formulario actualizado']);

    // DELETE /api/forms?id=X — eliminar formulario
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $user = requireAuth();
        $id = $_GET['id'] ?? null;

        if (!$id || $id == 1) {
            http_response_code(400);
            echo json_encode(['error' => 'No puedes eliminar el formulario principal']);
            exit;
        }

        // Verificar que existe
        $stmt = $pdo->prepare("SELECT id FROM forms WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        // Eliminar campos (cascada en BD)
        $stmt = $pdo->prepare("DELETE FROM form_fields WHERE form_id = ?");
        $stmt->execute([$id]);

        // Eliminar formulario
        $stmt = $pdo->prepare("DELETE FROM forms WHERE id = ?");
        $stmt->execute([$id]);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Formulario eliminado']);

        log_message("Formulario eliminado: id=$id por {$user['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en forms.php: " . $e->getMessage(), 'ERROR');
}
?>
