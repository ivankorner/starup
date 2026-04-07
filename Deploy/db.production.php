<?php
/**
 * Conexión a BD — Producción Cloudways
 *
 * INSTRUCCIONES: Subir como api/db.php (REEMPLAZA el existente)
 */

$host = 'localhost';
$dbname = 'tpwtvzukqe';
$user = 'tpwtvzukqe';
$pass = 'kdT8XYz3e6';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}
?>
