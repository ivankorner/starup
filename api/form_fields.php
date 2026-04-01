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
    // GET /api/form_fields?form_id=X — obtener campos de un formulario
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $formId = $_GET['form_id'] ?? null;
        $fieldId = $_GET['id'] ?? null;

        if ($fieldId) {
            // GET /api/form_fields?id=X
            $stmt = $pdo->prepare("
                SELECT id, form_id, paso, orden, tipo, label, descripcion,
                       obligatorio, opciones, max_seleccion, max_length, slug
                FROM form_fields
                WHERE id = ?
            ");
            $stmt->execute([$fieldId]);
            $field = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$field) {
                http_response_code(404);
                echo json_encode(['error' => 'Campo no encontrado']);
                exit;
            }

            $field['opciones'] = json_decode($field['opciones'] ?? '[]');

            http_response_code(200);
            echo json_encode($field);

        } elseif ($formId) {
            // GET /api/form_fields?form_id=X
            $stmt = $pdo->prepare("
                SELECT id, form_id, paso, orden, tipo, label, descripcion,
                       obligatorio, opciones, max_seleccion, max_length, slug
                FROM form_fields
                WHERE form_id = ?
                ORDER BY paso, orden
            ");
            $stmt->execute([$formId]);
            $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($fields as &$field) {
                $field['opciones'] = json_decode($field['opciones'] ?? '[]');
            }

            http_response_code(200);
            echo json_encode($fields);

        } else {
            http_response_code(400);
            echo json_encode(['error' => 'form_id o id requerido']);
            exit;
        }

    // POST /api/form_fields — crear campo
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = requireAuth();

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $formId = $data['form_id'] ?? null;
        $paso = $data['paso'] ?? 1;
        $orden = $data['orden'] ?? 0;
        $tipo = $data['tipo'] ?? 'texto';
        $label = $data['label'] ?? '';
        $descripcion = $data['descripcion'] ?? '';
        $obligatorio = $data['obligatorio'] ?? 1;
        $opciones = json_encode($data['opciones'] ?? []);
        $maxSeleccion = $data['max_seleccion'] ?? null;
        $maxLength = $data['max_length'] ?? null;
        $slug = $data['slug'] ?? null;

        if (!$formId || !$label) {
            http_response_code(400);
            echo json_encode(['error' => 'form_id y label requeridos']);
            exit;
        }

        // Verificar que el formulario existe
        $stmt = $pdo->prepare("SELECT id FROM forms WHERE id = ?");
        $stmt->execute([$formId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO form_fields
            (form_id, paso, orden, tipo, label, descripcion, obligatorio,
             opciones, max_seleccion, max_length, slug)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $formId, $paso, $orden, $tipo, $label, $descripcion, $obligatorio,
            $opciones, $maxSeleccion, $maxLength, $slug,
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $pdo->lastInsertId(),
            'message' => 'Campo creado',
        ]);

        log_message("Campo creado en form $formId: $label por {$user['email']}", 'INFO');

    // PUT /api/form_fields?id=X — actualizar campo
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
        $stmt = $pdo->prepare("SELECT id FROM form_fields WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Campo no encontrado']);
            exit;
        }

        $updates = [];
        $params = [];

        if (isset($data['label'])) {
            $updates[] = 'label = ?';
            $params[] = $data['label'];
        }

        if (isset($data['descripcion'])) {
            $updates[] = 'descripcion = ?';
            $params[] = $data['descripcion'];
        }

        if (isset($data['obligatorio'])) {
            $updates[] = 'obligatorio = ?';
            $params[] = (int)$data['obligatorio'];
        }

        if (isset($data['opciones'])) {
            $updates[] = 'opciones = ?';
            $params[] = json_encode($data['opciones']);
        }

        if (isset($data['max_seleccion'])) {
            $updates[] = 'max_seleccion = ?';
            $params[] = $data['max_seleccion'];
        }

        if (isset($data['max_length'])) {
            $updates[] = 'max_length = ?';
            $params[] = $data['max_length'];
        }

        if (isset($data['paso'])) {
            $updates[] = 'paso = ?';
            $params[] = $data['paso'];
        }

        if (isset($data['orden'])) {
            $updates[] = 'orden = ?';
            $params[] = $data['orden'];
        }

        if (empty($updates)) {
            http_response_code(200);
            echo json_encode(['message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $query = "UPDATE form_fields SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Campo actualizado']);

    // DELETE /api/form_fields?id=X — eliminar campo
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $user = requireAuth();
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        // Verificar que existe
        $stmt = $pdo->prepare("SELECT id FROM form_fields WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Campo no encontrado']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM form_fields WHERE id = ?");
        $stmt->execute([$id]);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Campo eliminado']);

        log_message("Campo eliminado: id=$id por {$user['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en form_fields.php: " . $e->getMessage(), 'ERROR');
}
?>
