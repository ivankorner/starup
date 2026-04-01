<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once 'db.php';
require_once 'config.php';
require_once 'libs/Mailer.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido']);
    exit;
}

// Calcular score en backend (misma lógica que scoring.js)
function calcScore($d) {
    $s = 0;
    $madurezMap = ['idea' => 15, 'problema' => 15, 'propuesta' => 30, 'piloto' => 45, 'parcial' => 45];
    $s += $madurezMap[$d['madurez'] ?? ''] ?? 0;
    $s += (int)($d['budgetScore'] ?? 0) * 10;
    $s += (int)($d['teamScore'] ?? 0) * 10;
    $diff = is_array($d['dificultades'] ?? null) ? count($d['dificultades']) : 0;
    if ($diff >= 3) $s += 15; elseif ($diff >= 1) $s += 8;
    $needs = is_array($d['necesidades'] ?? null) ? count($d['necesidades']) : 0;
    if ($needs >= 2) $s += 10; elseif ($needs === 1) $s += 5;
    if (strlen($d['tweet'] ?? '') > 30) $s += 10;
    if (!empty($d['sector'])) $s += 5;
    if (!empty($d['dispositivo'])) $s += 5;
    if (!empty($d['urgencia'])) $s += 10;
    if (!empty($d['timeline']) && $d['timeline'] !== 'Sin fecha definida') $s += 10;
    return min($s, 100);
}

$score = calcScore($data);
$veredicto = $score >= 70 ? 'startup' : ($score >= 45 ? 'potencial' : 'no-califica');

$stmt = $pdo->prepare("
    INSERT INTO submissions
    (nombre, email, nombre_proyecto, sector, descripcion, tweet, como_resuelven,
     dificultades, urgencia, madurez, dispositivo, uso_descripcion, necesidades,
     timeline, presupuesto, budget_score, equipo_interno, team_score, notas, score, veredicto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['nombre'] ?? '',
    $data['email'] ?? '',
    $data['nombreProyecto'] ?? null,
    $data['sector'] ?? null,
    $data['descripcion'] ?? null,
    $data['tweet'] ?? null,
    $data['comoResuelven'] ?? null,
    json_encode($data['dificultades'] ?? []),
    $data['urgencia'] ?? null,
    $data['madurez'] ?? null,
    $data['dispositivo'] ?? null,
    $data['usoDescripcion'] ?? null,
    json_encode($data['necesidades'] ?? []),
    $data['timeline'] ?? null,
    $data['presupuesto'] ?? null,
    (int)($data['budgetScore'] ?? 0),
    $data['equipoInterno'] ?? null,
    (int)($data['teamScore'] ?? 0),
    $data['notasAdicionales'] ?? null,
    $score,
    $veredicto,
]);

$submissionId = $pdo->lastInsertId();

// ============================================================================
// ENVIAR EMAIL DE NOTIFICACIÓN
// ============================================================================
try {
    $mailer = new Mailer(
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        SMTP_USER,
        SMTP_FROM_NAME
    );

    // Construir cuerpo HTML del email
    $projectName = $data['nombreProyecto'] ?? 'Sin nombre';
    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #5B5BD6; color: white; padding: 20px; border-radius: 8px; }
        .section { background: white; margin: 15px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #5B5BD6; }
        .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .startup { background: #E1F5EE; color: #085041; }
        .potencial { background: #FAEEDA; color: #633806; }
        .no-califica { background: #FCEBEB; color: #501313; }
        .score { font-size: 32px; font-weight: bold; color: #5B5BD6; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; width: 40%; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📡 Nueva Iniciativa Recibida</h1>
            <p>Se ha enviado una nueva propuesta al sistema Radar de Proyectos</p>
        </div>

        <div class="section">
            <h2>$projectName</h2>
            <p><strong>Emprendedor:</strong> {$data['nombre']}</p>
            <p><strong>Email:</strong> {$data['email']}</p>
            <div class="score">Puntaje: $score/100</div>
            <div>
                <span class="badge HTML;

    // Agregar badge según veredicto
    if ($veredicto === 'startup') {
        $htmlBody .= 'startup">✓ STARTUP</span>';
    } elseif ($veredicto === 'potencial') {
        $htmlBody .= 'potencial">△ POTENCIAL STARTUP</span>';
    } else {
        $htmlBody .= 'no-califica">✗ NO CALIFICA</span>';
    }

    $htmlBody .= <<<HTML
            </div>
        </div>

        <div class="section">
            <h3>📋 Información Enviada</h3>
            <table>
                <tr><td class="label">Sector:</td><td>{$data['sector']}</td></tr>
                <tr><td class="label">Problema:</td><td>{$data['tweet']}</td></tr>
                <tr><td class="label">Descripción:</td><td>{$data['descripcion']}</td></tr>
                <tr><td class="label">¿Cómo resuelven hoy?:</td><td>{$data['comoResuelven']}</td></tr>
                <tr><td class="label">Madurez:</td><td>{$data['madurez']}</td></tr>
                <tr><td class="label">Dispositivo:</td><td>{$data['dispositivo']}</td></tr>
                <tr><td class="label">Timeline:</td><td>{$data['timeline']}</td></tr>
                <tr><td class="label">Presupuesto:</td><td>{$data['presupuesto']}</td></tr>
                <tr><td class="label">Equipo Interno:</td><td>{$data['equipoInterno']}</td></tr>
            </table>
        </div>

        <div class="section">
            <p><strong>ID Submission:</strong> $submissionId</p>
            <p><strong>Fecha:</strong> {date('d/m/Y H:i')}</p>
            <p>Accedé al Dashboard para revisar esta iniciativa y agregar notas.</p>
        </div>
    </div>
</body>
</html>
HTML;

    $mailer
        ->addAddress(NOTIFY_EMAIL, 'Radar Proyectos')
        ->subject("Nueva iniciativa: $projectName")
        ->body($htmlBody)
        ->isHtml(true)
        ->send();

    // Marcar que el email fue enviado
    $stmt = $pdo->prepare("UPDATE submissions SET email_enviado = 1 WHERE id = ?");
    $stmt->execute([$submissionId]);

    log_message("Email enviado para submission $submissionId a " . NOTIFY_EMAIL, 'INFO');

} catch (Exception $e) {
    // No bloquear la respuesta si falla el email
    log_message("Error enviando email para submission $submissionId: " . $e->getMessage(), 'ERROR');
}

echo json_encode([
    'success' => true,
    'id' => $submissionId,
    'score' => $score,
    'veredicto' => $veredicto,
]);
?>
