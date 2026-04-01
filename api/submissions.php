<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'middleware.php';

try {
    // GET /api/submissions — listar submissions (requiere auth)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user = requireAuth();

        $veredicto = $_GET['veredicto'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($id) {
            // GET /api/submissions?id=X
            $stmt = $pdo->prepare("SELECT * FROM submissions WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                http_response_code(404);
                echo json_encode(['error' => 'Submission no encontrada']);
                exit;
            }

            $row['dificultades'] = json_decode($row['dificultades'] ?? '[]');
            $row['necesidades'] = json_decode($row['necesidades'] ?? '[]');

            http_response_code(200);
            echo json_encode($row);

        } else {
            // GET /api/submissions — listar todas (o filtrar por veredicto)
            if ($veredicto) {
                $stmt = $pdo->prepare("SELECT * FROM submissions WHERE veredicto = ? ORDER BY created_at DESC");
                $stmt->execute([$veredicto]);
            } else {
                $stmt = $pdo->query("SELECT * FROM submissions ORDER BY created_at DESC");
            }

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($rows as &$row) {
                $row['dificultades'] = json_decode($row['dificultades'] ?? '[]');
                $row['necesidades'] = json_decode($row['necesidades'] ?? '[]');
            }

            http_response_code(200);
            echo json_encode($rows);
        }

    // PUT /api/submissions?id=X — actualizar submission (requiere auth)
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
        $stmt = $pdo->prepare("SELECT id FROM submissions WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Submission no encontrada']);
            exit;
        }

        $updates = [];
        $params = [];

        if (isset($data['notas_evaluador'])) {
            $updates[] = 'notas_evaluador = ?';
            $params[] = $data['notas_evaluador'];
        }

        if (isset($data['veredicto'])) {
            $veredicto = $data['veredicto'];
            if (in_array($veredicto, ['startup', 'potencial', 'no-califica'])) {
                $updates[] = 'veredicto = ?';
                $params[] = $veredicto;
            }
        }

        if (isset($data['revisado'])) {
            $updates[] = 'revisado = ?';
            $params[] = (int)$data['revisado'];
        }

        if (empty($updates)) {
            http_response_code(200);
            echo json_encode(['message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $query = "UPDATE submissions SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Submission actualizada']);

        log_message("Submission actualizada: id=$id por {$user['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en submissions.php: " . $e->getMessage(), 'ERROR');
}
?>
