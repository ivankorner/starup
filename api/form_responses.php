<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'config.php';
require_once 'middleware.php';
require_once 'scoring.php';
require_once 'libs/Mailer.php';

function responseEstadoLabel($estado) {
    $labels = [
        'recepcionado' => 'Recepcionado',
        'pendiente_revision' => 'Pendiente de revisión',
        'derivado' => 'Derivado',
        'leido' => 'Leído',
        'en_analisis' => 'En análisis',
        'solicita_informacion' => 'Solicita información',
        'en_proceso' => 'En proceso',
        'aprobado' => 'Aprobado',
        'rechazado' => 'Rechazado',
        'implementado' => 'Implementado',
        'archivado' => 'Archivado',
    ];

    return $labels[$estado] ?? $estado;
}

function getResponseDetail(PDO $pdo, $id) {
    $stmt = $pdo->prepare("\n        SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.estado_proyecto, fr.designado_user_id,\n               fr.created_at, fr.updated_at, fr.score, fr.veredicto, fr.raw_obtenido, fr.raw_maximo,\n               f.titulo AS form_titulo,\n               u.nombre AS designado_nombre, u.email AS designado_email\n        FROM form_responses fr\n        JOIN forms f ON f.id = fr.form_id\n        LEFT JOIN users u ON u.id = fr.designado_user_id\n        WHERE fr.id = ?\n    ");
    $stmt->execute([$id]);
    $response = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$response) {
        return null;
    }

    $response['respuestas'] = json_decode($response['respuestas'], true);

    $stmtFields = $pdo->prepare("\n        SELECT id, label, tipo, slug, paso, orden, opciones, puntaje_completo\n        FROM form_fields\n        WHERE form_id = ?\n        ORDER BY paso ASC, orden ASC\n    ");
    $stmtFields->execute([$response['form_id']]);
    $response['fields'] = $stmtFields->fetchAll(PDO::FETCH_ASSOC);
    foreach ($response['fields'] as &$field) {
        if ($field['opciones']) {
            $field['opciones'] = json_decode($field['opciones']);
        }
    }

    return $response;
}

try {
    // GET /api/form_responses — obtener respuestas de un formulario (requiere auth)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user = requireAuth();

        $formId = $_GET['form_id'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($id) {
            // GET /api/form_responses?id=X — detalle con campos del formulario
            $response = getResponseDetail($pdo, $id);

            if (!$response) {
                http_response_code(404);
                echo json_encode(['error' => 'Respuesta no encontrada']);
                exit;
            }

            http_response_code(200);
            echo json_encode($response);

        } elseif ($formId) {
            // GET /api/form_responses?form_id=X
            $stmt = $pdo->prepare("
                SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.estado_proyecto, fr.designado_user_id, fr.created_at,
                       fr.updated_at, fr.score, fr.veredicto, fr.raw_obtenido, fr.raw_maximo,
                       f.titulo AS form_titulo,
                       u.nombre AS designado_nombre, u.email AS designado_email
                FROM form_responses fr
                JOIN forms f ON f.id = fr.form_id
                LEFT JOIN users u ON u.id = fr.designado_user_id
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
                SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.estado_proyecto, fr.designado_user_id, fr.created_at,
                       fr.updated_at, fr.score, fr.veredicto, fr.raw_obtenido, fr.raw_maximo,
                       f.titulo AS form_titulo,
                       u.nombre AS designado_nombre, u.email AS designado_email
                FROM form_responses fr
                JOIN forms f ON f.id = fr.form_id
                LEFT JOIN users u ON u.id = fr.designado_user_id
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
        $respuestasArr = $data['respuestas'] ?? [];
        $respuestas = json_encode($respuestasArr);

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

        // Calcular scoring de viabilidad
        $scoring = calcularScore($pdo, $formId, $respuestasArr);

        $stmt = $pdo->prepare("
            INSERT INTO form_responses
            (form_id, nombre, email, respuestas, score, veredicto, raw_obtenido, raw_maximo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $formId, $nombre, $email, $respuestas,
            $scoring['score'], $scoring['veredicto'],
            $scoring['raw_obtenido'], $scoring['raw_maximo'],
        ]);

        $responseId = $pdo->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $responseId,
            'score' => $scoring['score'],
            'veredicto' => $scoring['veredicto'],
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

        // Enviar correo de confirmación al usuario que completó el formulario
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            try {
                $nombreHtml = htmlspecialchars($nombre);
                $formTituloHtml = htmlspecialchars($form['titulo']);
                $emailHtml = htmlspecialchars($email);
                $fecha = date('d/m/Y H:i');

                $confirmacionHtml = "
                <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;'>
                    <div style='background:#111827;color:#ffffff;padding:24px 28px;'>
                        <h2 style='margin:0;font-size:24px;line-height:1.2;'>Datos registrados correctamente</h2>
                        <p style='margin:8px 0 0;color:#d1d5db;font-size:15px;'>{$formTituloHtml}</p>
                    </div>
                    <div style='padding:28px;color:#1f2937;font-size:15px;line-height:1.7;'>
                        <p style='margin-top:0;'>Hola {$nombreHtml},</p>
                        <p>Tus datos fueron correctamente registrados en nuestro sistema. Nos comunicaremos a la brevedad al correo {$emailHtml}.</p>
                        <div style='background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px 18px;margin:20px 0;'>
                            <p style='margin:0 0 6px;font-weight:700;'>Resumen del envío</p>
                            <p style='margin:0;color:#4b5563;'><strong>Formulario:</strong> {$formTituloHtml}</p>
                            <p style='margin:4px 0 0;color:#4b5563;'><strong>Fecha:</strong> {$fecha}</p>
                        </div>
                        <p style='margin-bottom:0;color:#4b5563;'>Este correo fue enviado automáticamente. No es necesario responderlo.</p>
                    </div>
                </div>";

                $confirmMailer = new Mailer(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USER, SMTP_FROM_NAME);
                $confirmMailer
                    ->addAddress($email, $nombre)
                    ->subject("Confirmación de registro: {$form['titulo']}")
                    ->body($confirmacionHtml)
                    ->isHtml(true);

                log_message("Intentando enviar confirmación a {$email} para respuesta $responseId", 'INFO');

                if ($confirmMailer->send()) {
                    log_message("Correo de confirmación enviado exitosamente a {$email} para respuesta $responseId", 'INFO');
                } else {
                    log_message("Error enviando confirmación a {$email}: " . $confirmMailer->getError(), 'ERROR');
                    log_message("Debug SMTP confirmación: " . $confirmMailer->getDebug(), 'ERROR');
                }
            } catch (Exception $e) {
                log_message("Excepción enviando confirmación a {$email}: " . $e->getMessage(), 'ERROR');
            }
        } else {
            log_message("No se envió confirmación porque el email es inválido: {$email}", 'WARNING');
        }

        // Enviar email de notificación si el formulario tiene email_destino
        if (!empty($form['email_destino'])) {
            try {
                // Obtener campos del formulario para mostrar labels
                $stmtFields = $pdo->prepare("SELECT id, label, tipo FROM form_fields WHERE form_id = ? ORDER BY paso, orden");
                $stmtFields->execute([$formId]);
                $fields = $stmtFields->fetchAll(PDO::FETCH_ASSOC);

                $respuestasData = json_decode($respuestas, true);

                // Construir tabla HTML con las respuestas
                $filasHtml = '';
                foreach ($fields as $field) {
                    if (($field['tipo'] ?? '') === 'titulo') continue;
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

                // Bloque de viabilidad (mismo formato que el PDF)
                $viabilidadHtml = '';
                if (!empty($scoring['veredicto']) && !empty($scoring['raw_maximo']) && $scoring['raw_maximo'] > 0) {
                    $veredictoLabels = [
                        'viable' => 'Viable',
                        'potencial' => 'Potencial',
                        'no-viable' => 'No viable',
                    ];
                    $veredictoColors = [
                        'viable' => '#2E7D32',
                        'potencial' => '#B28704',
                        'no-viable' => '#C62828',
                    ];
                    $vKey = $scoring['veredicto'];
                    $vLabel = $veredictoLabels[$vKey] ?? $vKey;
                    $vColor = $veredictoColors[$vKey] ?? '#505050';
                    $vScore = (int)$scoring['score'];
                    $vRaw = (int)$scoring['raw_obtenido'];
                    $vMax = (int)$scoring['raw_maximo'];
                    $viabilidadHtml = "
                        <div style='background:{$vColor};color:white;padding:14px 18px;border-radius:6px;margin:15px 0;'>
                            <div style='font-size:12px;font-weight:700;letter-spacing:1px;opacity:0.9;'>VIABILIDAD</div>
                            <div style='font-size:18px;font-weight:700;margin-top:4px;'>{$vLabel} — {$vScore}/100 ({$vRaw}/{$vMax} pts)</div>
                        </div>";
                }

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
                        {$viabilidadHtml}
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

    // PUT /api/form_responses?id=X — actualizar estado y/o designado (requiere auth)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $user = requireAuth();

        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT fr.id, fr.form_id, fr.nombre, fr.email, fr.respuestas, fr.estado_proyecto, fr.designado_user_id,
                   fr.created_at, fr.updated_at, fr.score, fr.veredicto, fr.raw_obtenido, fr.raw_maximo,
                   f.titulo AS form_titulo
            FROM form_responses fr
            JOIN forms f ON f.id = fr.form_id
            WHERE fr.id = ?
        ");
        $stmt->execute([$id]);
        $current = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$current) {
            http_response_code(404);
            echo json_encode(['error' => 'Respuesta no encontrada']);
            exit;
        }

        $allowedEstados = [
            'recepcionado', 'pendiente_revision', 'derivado', 'leido', 'en_analisis',
            'solicita_informacion', 'en_proceso', 'aprobado', 'rechazado', 'implementado', 'archivado'
        ];

        $updates = [];
        $params = [];
        $designadoAnterior = $current['designado_user_id'];

        if (array_key_exists('estado_proyecto', $data)) {
            $estadoProyecto = trim((string)$data['estado_proyecto']);
            if (!in_array($estadoProyecto, $allowedEstados, true)) {
                http_response_code(400);
                echo json_encode(['error' => 'Estado del proyecto inválido']);
                exit;
            }

            $updates[] = 'estado_proyecto = ?';
            $params[] = $estadoProyecto;
        }

        $designadoProvided = array_key_exists('designado_user_id', $data);
        $designadoUserId = null;
        $designadoUser = null;

        if ($designadoProvided) {
            if ($data['designado_user_id'] === null || $data['designado_user_id'] === '') {
                $designadoUserId = null;
            } else {
                $designadoUserId = (int)$data['designado_user_id'];
                $stmtUser = $pdo->prepare("SELECT id, nombre, email FROM users WHERE id = ? AND activo = 1");
                $stmtUser->execute([$designadoUserId]);
                $designadoUser = $stmtUser->fetch(PDO::FETCH_ASSOC);

                if (!$designadoUser) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Usuario designado inválido o inactivo']);
                    exit;
                }
            }

            $updates[] = 'designado_user_id = ?';
            $params[] = $designadoUserId;
        }

        if (empty($updates)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Nada que actualizar']);
            exit;
        }

        $params[] = $id;
        $stmtUpdate = $pdo->prepare("UPDATE form_responses SET " . implode(', ', $updates) . " WHERE id = ?");
        $stmtUpdate->execute($params);

        $response = getResponseDetail($pdo, $id);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Respuesta actualizada',
            'response' => $response,
        ]);

        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        } else {
            if (ob_get_level() > 0) ob_end_flush();
            flush();
        }

        if ($designadoProvided && $designadoUserId !== null && (string)$designadoUserId !== (string)$designadoAnterior) {
            try {
                if (!$designadoUser) {
                    $stmtUser = $pdo->prepare("SELECT id, nombre, email FROM users WHERE id = ? AND activo = 1");
                    $stmtUser->execute([$designadoUserId]);
                    $designadoUser = $stmtUser->fetch(PDO::FETCH_ASSOC);
                }

                if ($designadoUser && filter_var($designadoUser['email'], FILTER_VALIDATE_EMAIL)) {
                    $respuestasData = is_array($response['respuestas']) ? $response['respuestas'] : [];

                    $stmtFields = $pdo->prepare("SELECT id, label, tipo FROM form_fields WHERE form_id = ? ORDER BY paso, orden");
                    $stmtFields->execute([$response['form_id']]);
                    $fields = $stmtFields->fetchAll(PDO::FETCH_ASSOC);

                    $filasHtml = '';
                    foreach ($fields as $field) {
                        if (($field['tipo'] ?? '') === 'titulo') continue;
                        $fieldId = $field['id'];
                        $valor = $respuestasData[$fieldId] ?? ($respuestasData[(string)$fieldId] ?? '');
                        if (is_array($valor)) {
                            $valor = implode(', ', $valor);
                        }
                        $filasHtml .= "<tr><td style='padding:8px 12px;border:1px solid #e0e0e0;font-weight:600;background:#f5f5f5;width:35%;'>" . htmlspecialchars($field['label']) . "</td><td style='padding:8px 12px;border:1px solid #e0e0e0;'>" . htmlspecialchars((string)$valor) . "</td></tr>";
                    }

                    $estadoLabel = htmlspecialchars(responseEstadoLabel($response['estado_proyecto']));
                    $formTitulo = htmlspecialchars($response['form_titulo']);
                    $nombreHtml = htmlspecialchars($response['nombre']);
                    $emailHtml = htmlspecialchars($response['email']);
                    $designadoNombre = htmlspecialchars($designadoUser['nombre']);
                    $designadoEmail = htmlspecialchars($designadoUser['email']);

                    $htmlBody = "
                    <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
                        <div style='background:#111827;color:white;padding:20px;border-radius:8px 8px 0 0;'>
                            <h2 style='margin:0;'>Proyecto asignado</h2>
                            <p style='margin:5px 0 0;opacity:0.9;'>{$formTitulo}</p>
                        </div>
                        <div style='padding:20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;'>
                            <p>Hola {$designadoNombre},</p>
                            <p>Te fue asignado un nuevo proyecto dentro del sistema.</p>
                            <div style='background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px 18px;margin:20px 0;'>
                                <p style='margin:0 0 6px;font-weight:700;'>Datos del proyecto</p>
                                <p style='margin:0;color:#4b5563;'><strong>Formulario:</strong> {$formTitulo}</p>
                                <p style='margin:4px 0 0;color:#4b5563;'><strong>Estado:</strong> {$estadoLabel}</p>
                                <p style='margin:4px 0 0;color:#4b5563;'><strong>Nombre:</strong> {$nombreHtml}</p>
                                <p style='margin:4px 0 0;color:#4b5563;'><strong>Email:</strong> {$emailHtml}</p>
                                <p style='margin:4px 0 0;color:#4b5563;'><strong>Asignado a:</strong> {$designadoNombre} ({$designadoEmail})</p>
                            </div>
                            <h3 style='color:#333;margin-bottom:10px;'>Respuestas</h3>
                            <table style='width:100%;border-collapse:collapse;'>{$filasHtml}</table>
                        </div>
                    </div>";

                    $mailer = new Mailer(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USER, SMTP_FROM_NAME);
                    $mailer->addAddress($designadoUser['email'], $designadoUser['nombre']);
                    $mailer->subject("Proyecto asignado: {$response['form_titulo']} - {$response['nombre']}");
                    $mailer->body($htmlBody);
                    $mailer->isHtml(true);
                    $mailer->send();
                }
            } catch (Exception $e) {
                log_message("Error enviando correo de asignación para respuesta $id: " . $e->getMessage(), 'ERROR');
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
