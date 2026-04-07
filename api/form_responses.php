<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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
            // GET /api/form_responses?id=X — detalle con campos del formulario
            $stmt = $pdo->prepare("
                SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.created_at,
                       f.titulo AS form_titulo
                FROM form_responses fr
                JOIN forms f ON f.id = fr.form_id
                WHERE fr.id = ?
            ");
            $stmt->execute([$id]);
            $response = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$response) {
                http_response_code(404);
                echo json_encode(['error' => 'Respuesta no encontrada']);
                exit;
            }

            $response['respuestas'] = json_decode($response['respuestas']);

            // Incluir campos del formulario para mostrar labels
            $stmtFields = $pdo->prepare("
                SELECT id, label, tipo, slug, paso, orden, opciones
                FROM form_fields
                WHERE form_id = ?
                ORDER BY paso ASC, orden ASC
            ");
            $stmtFields->execute([$response['form_id']]);
            $response['fields'] = $stmtFields->fetchAll(PDO::FETCH_ASSOC);
            foreach ($response['fields'] as &$field) {
                if ($field['opciones']) {
                    $field['opciones'] = json_decode($field['opciones']);
                }
            }

            http_response_code(200);
            echo json_encode($response);

        } elseif ($formId) {
            // GET /api/form_responses?form_id=X
            $stmt = $pdo->prepare("
                SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.created_at,
                       f.titulo AS form_titulo
                FROM form_responses fr
                JOIN forms f ON f.id = fr.form_id
                WHERE fr.form_id = ?
                ORDER BY fr.created_at DESC
            ");
            $stmt->execute([$formId]);
            $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($responses as &$response) {
                $response['respuestas'] = json_decode($response['respuestas']);
            }

            http_response_code(200);
            echo json_encode($responses);

        } else {
            // GET /api/form_responses — todas las respuestas de todos los formularios
            $stmt = $pdo->query("
                SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.created_at,
                       f.titulo AS form_titulo
                FROM form_responses fr
                JOIN forms f ON f.id = fr.form_id
                ORDER BY fr.created_at DESC
            ");
            $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($responses as &$response) {
                $response['respuestas'] = json_decode($response['respuestas']);
            }

            http_response_code(200);
            echo json_encode($responses);
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

        // Verificar que el formulario existe y obtener datos
        $stmt = $pdo->prepare("SELECT id, titulo, email_destino FROM forms WHERE id = ?");
        $stmt->execute([$formId]);
        $form = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$form) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO form_responses (form_id, nombre, email, respuestas)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$formId, $nombre, $email, $respuestas]);

        $responseId = $pdo->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $responseId,
            'message' => 'Respuesta guardada',
        ]);

        // Enviar respuesta al cliente inmediatamente antes de procesar email
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        } else {
            if (ob_get_level() > 0) ob_end_flush();
            flush();
        }

        log_message("Respuesta guardada para form $formId de $email", 'INFO');

        // Enviar email de notificación si el formulario tiene email_destino
        if (!empty($form['email_destino'])) {
            try {
                require_once __DIR__ . '/config.php';
                require_once __DIR__ . '/libs/Mailer.php';

                // Obtener campos del formulario para mostrar labels
                $stmtFields = $pdo->prepare("SELECT id, label, tipo FROM form_fields WHERE form_id = ? ORDER BY paso, orden");
                $stmtFields->execute([$formId]);
                $fields = $stmtFields->fetchAll(PDO::FETCH_ASSOC);

                $respuestasData = json_decode($respuestas, true);

                // Construir tabla HTML con las respuestas
                $filasHtml = '';
                foreach ($fields as $field) {
                    $fieldId = $field['id'];
                    $valor = isset($respuestasData[$fieldId]) ? $respuestasData[$fieldId] : (isset($respuestasData[(string)$fieldId]) ? $respuestasData[(string)$fieldId] : '');
                    if (is_array($valor)) {
                        $valor = implode(', ', $valor);
                    }
                    $valor = htmlspecialchars($valor);
                    $label = htmlspecialchars($field['label']);
                    $filasHtml .= "<tr><td style='padding:8px 12px;border:1px solid #e0e0e0;font-weight:600;background:#f5f5f5;width:35%;'>{$label}</td><td style='padding:8px 12px;border:1px solid #e0e0e0;'>{$valor}</td></tr>";
                }

                $formTitulo = htmlspecialchars($form['titulo']);
                $nombreHtml = htmlspecialchars($nombre);
                $emailHtml = htmlspecialchars($email);
                $fecha = date('d/m/Y H:i');

                $htmlBody = "
                <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
                    <div style='background:#6C63FF;color:white;padding:20px;border-radius:8px 8px 0 0;'>
                        <h2 style='margin:0;'>Nueva respuesta recibida</h2>
                        <p style='margin:5px 0 0;opacity:0.9;'>{$formTitulo}</p>
                    </div>
                    <div style='padding:20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;'>
                        <p><strong>Nombre:</strong> {$nombreHtml}</p>
                        <p><strong>Email:</strong> {$emailHtml}</p>
                        <p><strong>Fecha:</strong> {$fecha}</p>
                        <hr style='border:none;border-top:1px solid #e0e0e0;margin:15px 0;'>
                        <h3 style='color:#333;margin-bottom:10px;'>Respuestas</h3>
                        <table style='width:100%;border-collapse:collapse;'>{$filasHtml}</table>
                        <hr style='border:none;border-top:1px solid #e0e0e0;margin:15px 0;'>
                        <p style='font-size:12px;color:#999;'>Este email fue enviado automáticamente desde Radar de Proyectos.</p>
                    </div>
                </div>";

                $mailer = new Mailer(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USER, SMTP_FROM_NAME);
                $mailer->addAddress($form['email_destino']);
                $mailer->subject("Nueva respuesta: {$form['titulo']} - {$nombre}");
                $mailer->body($htmlBody);
                $mailer->isHtml(true);

                log_message("Intentando enviar email a {$form['email_destino']} (SMTP: " . SMTP_HOST . ":" . SMTP_PORT . ")", 'INFO');

                if ($mailer->send()) {
                    log_message("Email enviado exitosamente a {$form['email_destino']} para respuesta $responseId", 'INFO');
                } else {
                    log_message("Error enviando email a {$form['email_destino']}: " . $mailer->getError(), 'ERROR');
                    log_message("Debug SMTP: " . $mailer->getDebug(), 'ERROR');
                }
            } catch (Exception $e) {
                log_message("Excepción enviando email: " . $e->getMessage(), 'ERROR');
            }
        }

    // DELETE /api/form_responses?id=X — eliminar respuesta (requiere auth)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $user = requireAuth();

        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        // Verificar que existe
        $stmt = $pdo->prepare("SELECT id FROM form_responses WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Respuesta no encontrada']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM form_responses WHERE id = ?");
        $stmt->execute([$id]);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Respuesta eliminada']);

        log_message("Respuesta eliminada: id=$id por {$user['email']}", 'INFO');

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
