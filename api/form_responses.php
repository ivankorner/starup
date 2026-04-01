<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'middleware.php';

try {
    // GET /api/form_responses — obtener respuestas de un formulario (requiere auth)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user = requireAuth();

        $formId = $_GET['form_id'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($id) {
            // GET /api/form_responses?id=X
            $stmt = $pdo->prepare("
                SELECT id, form_id, nombre, email, respuestas, created_at
                FROM form_responses
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $response = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$response) {
                http_response_code(404);
                echo json_encode(['error' => 'Respuesta no encontrada']);
                exit;
            }

            $response['respuestas'] = json_decode($response['respuestas']);

            http_response_code(200);
            echo json_encode($response);

        } elseif ($formId) {
            // GET /api/form_responses?form_id=X
            $stmt = $pdo->prepare("
                SELECT id, form_id, nombre, email, respuestas, created_at
                FROM form_responses
                WHERE form_id = ?
                ORDER BY created_at DESC
            ");
            $stmt->execute([$formId]);
            $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($responses as &$response) {
                $response['respuestas'] = json_decode($response['respuestas']);
            }

            http_response_code(200);
            echo json_encode($responses);

        } else {
            http_response_code(400);
            echo json_encode(['error' => 'form_id o id requerido']);
            exit;
        }

    // POST /api/form_responses — crear respuesta (público, sin auth)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $formId = $data['form_id'] ?? null;
        $nombre = $data['nombre'] ?? '';
        $email = $data['email'] ?? '';
        $respuestas = json_encode($data['respuestas'] ?? []);

        if (!$formId || !$nombre || !$email) {
            http_response_code(400);
            echo json_encode(['error' => 'form_id, nombre y email requeridos']);
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
            INSERT INTO form_responses (form_id, nombre, email, respuestas)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$formId, $nombre, $email, $respuestas]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $pdo->lastInsertId(),
            'message' => 'Respuesta guardada',
        ]);

        log_message("Respuesta guardada para form $formId de $email", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en form_responses.php: " . $e->getMessage(), 'ERROR');
}
?>
