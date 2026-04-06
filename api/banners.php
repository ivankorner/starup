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
    // GET /api/banners — listar todos (público, sin auth)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, step, image_path FROM banners ORDER BY FIELD(step, 'intro', '1', '2', '3', '4', '5')");
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Construir URLs completas para imágenes
        foreach ($banners as &$banner) {
            if ($banner['image_path']) {
                $banner['image_url'] = '/api/uploads/banners/' . basename($banner['image_path']);
            } else {
                $banner['image_url'] = null;
            }
        }

        http_response_code(200);
        echo json_encode($banners);

    // POST /api/banners — subir imagen (requiere auth)
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = requireAuth();

        $step = $_POST['step'] ?? null;

        if (!$step) {
            http_response_code(400);
            echo json_encode(['error' => 'Step requerido']);
            exit;
        }

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Archivo no proporcionado']);
            exit;
        }

        $file = $_FILES['image'];

        // Validar que es una imagen
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowed_types)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de archivo no permitido. Use JPEG, PNG, GIF o WebP']);
            exit;
        }

        // Validar tamaño (máx 5MB)
        if ($file['size'] > 5242880) {
            http_response_code(400);
            echo json_encode(['error' => 'Archivo muy grande (máx 5MB)']);
            exit;
        }

        // Validar que el step existe
        $stmt = $pdo->prepare("SELECT id FROM banners WHERE step = ?");
        $stmt->execute([$step]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Step no válido']);
            exit;
        }

        // Guardar archivo
        $upload_dir = __DIR__ . '/uploads/banners/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Generar nombre: banner_<step>.<ext>
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = 'banner_' . $step . '.' . $ext;
        $filepath = $upload_dir . $filename;

        // Eliminar imagen anterior si existe
        $stmt = $pdo->prepare("SELECT image_path FROM banners WHERE step = ?");
        $stmt->execute([$step]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing && $existing['image_path']) {
            $old_file = $upload_dir . basename($existing['image_path']);
            if (file_exists($old_file)) {
                unlink($old_file);
            }
        }

        // Mover archivo
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al guardar el archivo']);
            exit;
        }

        // Actualizar DB
        $stmt = $pdo->prepare("UPDATE banners SET image_path = ? WHERE step = ?");
        $stmt->execute([$filename, $step]);

        // Retornar banner actualizado
        $stmt = $pdo->prepare("SELECT id, step, image_path FROM banners WHERE step = ?");
        $stmt->execute([$step]);
        $banner = $stmt->fetch(PDO::FETCH_ASSOC);
        $banner['image_url'] = '/api/uploads/banners/' . $banner['image_path'];

        http_response_code(200);
        echo json_encode(['success' => true, 'banner' => $banner]);

        log_message("Banner actualizado: step=$step por {$user['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en banners.php: " . $e->getMessage(), 'ERROR');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno']);
    log_message("Error en banners.php: " . $e->getMessage(), 'ERROR');
}
?>
