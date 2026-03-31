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

echo json_encode([
    'success' => true,
    'id' => $pdo->lastInsertId(),
    'score' => $score,
    'veredicto' => $veredicto,
]);
?>
