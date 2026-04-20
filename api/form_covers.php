<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'middleware.php';

try {
    // POST /api/form_covers.php — subir/reemplazar portada de un formulario
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = requireAuth();

        $form_id = $_POST['form_id'] ?? null;

        if (!$form_id) {
            http_response_code(400);
            echo json_encode(['error' => 'form_id requerido']);
            exit;
        }

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Archivo no proporcionado']);
            exit;
        }

        $file = $_FILES['image'];

        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowed_types)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de archivo no permitido. Use JPEG, PNG, GIF o WebP']);
            exit;
        }

        if ($file['size'] > 5242880) {
            http_response_code(400);
            echo json_encode(['error' => 'Archivo muy grande (máx 5MB)']);
            exit;
        }

        // Verificar que el formulario existe
        $stmt = $pdo->prepare("SELECT id, cover_image FROM forms WHERE id = ?");
        $stmt->execute([$form_id]);
        $form = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$form) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        $upload_dir = __DIR__ . '/uploads/form_covers/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $allowed_ext)) {
            http_response_code(400);
            echo json_encode(['error' => 'Extensión no permitida']);
            exit;
        }

        $filename = 'form_' . (int)$form_id . '_' . time() . '.' . $ext;
        $filepath = $upload_dir . $filename;

        // Eliminar imagen anterior si existe
        if (!empty($form['cover_image'])) {
            $old_file = $upload_dir . basename($form['cover_image']);
            if (file_exists($old_file)) {
                unlink($old_file);
            }
        }

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al guardar el archivo']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE forms SET cover_image = ? WHERE id = ?");
        $stmt->execute([$filename, $form_id]);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'cover_image' => $filename,
            'cover_image_url' => '/api/uploads/form_covers/' . $filename,
        ]);

        log_message("Cover image actualizada: form_id=$form_id por {$user['email']}", 'INFO');

    // DELETE /api/form_covers.php?form_id=X — eliminar portada
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $user = requireAuth();
        $form_id = $_GET['form_id'] ?? null;

        if (!$form_id) {
            http_response_code(400);
            echo json_encode(['error' => 'form_id requerido']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT cover_image FROM forms WHERE id = ?");
        $stmt->execute([$form_id]);
        $form = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$form) {
            http_response_code(404);
            echo json_encode(['error' => 'Formulario no encontrado']);
            exit;
        }

        if (!empty($form['cover_image'])) {
            $upload_dir = __DIR__ . '/uploads/form_covers/';
            $old_file = $upload_dir . basename($form['cover_image']);
            if (file_exists($old_file)) {
                unlink($old_file);
            }
        }

        $stmt = $pdo->prepare("UPDATE forms SET cover_image = NULL WHERE id = ?");
        $stmt->execute([$form_id]);

        http_response_code(200);
        echo json_encode(['success' => true]);

        log_message("Cover image eliminada: form_id=$form_id por {$user['email']}", 'INFO');

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    log_message("Error en form_covers.php: " . $e->getMessage(), 'ERROR');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno']);
    log_message("Error en form_covers.php: " . $e->getMessage(), 'ERROR');
}
?>
