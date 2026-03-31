<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// TODO: Agregar validación de token/sesión para proteger este endpoint

require_once 'db.php';

$veredicto = $_GET['veredicto'] ?? null;

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

echo json_encode($rows);
?>
