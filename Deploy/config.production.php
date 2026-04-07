<?php
/**
 * Configuración de PRODUCCIÓN — Cloudways
 *
 * INSTRUCCIONES:
 * 1. Subir este archivo al servidor como api/config.php (REEMPLAZA el existente)
 * 2. Cambiar JWT_SECRET por un string aleatorio seguro
 * 3. Cambiar SMTP_USER y SMTP_PASS si usas email
 */

// ============================================================================
// BASE DE DATOS — Cloudways
// ============================================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'tpwtvzukqe');
define('DB_USER', 'tpwtvzukqe');
define('DB_PASS', 'kdT8XYz3e6');

// ============================================================================
// AUTENTICACIÓN
// ============================================================================
// IMPORTANTE: Cambiar este valor por un string aleatorio de 32+ caracteres
// Generar uno en: https://randomkeygen.com/ (usar "CodeIgniter Encryption Keys")
define('JWT_SECRET', 'cW9xR2kL8mN4pV7sT3uY6wZ0aB5dF1hJ');
define('SESSION_TIMEOUT', 86400); // 24 horas

// ============================================================================
// EMAIL SMTP
// ============================================================================
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'ivankorner@gmail.com');
define('SMTP_PASS', 'vlzy eaiw xnuh ykhl');
define('SMTP_FROM_NAME', 'Radar de Proyectos');
define('NOTIFY_EMAIL', 'ivankorner@gmail.com');

// ============================================================================
// APLICACIÓN — Cambiar por tu dominio real
// ============================================================================
define('APP_NAME', 'Radar de Proyectos');
define('APP_URL', 'https://phpstack-998749-6320828.cloudwaysapps.com/');     // ← CAMBIAR
define('API_URL', 'https://phpstack-998749-6320828.cloudwaysapps.com/api');  // ← CAMBIAR

// ============================================================================
// LOGGING
// ============================================================================
define('LOG_DIR', __DIR__ . '/../logs');
define('DEBUG_MODE', false); // false en producción

// ============================================================================
// Crear directorio de logs si no existe
// ============================================================================
if (!file_exists(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

/**
 * Función de logging
 */
function log_message($message, $level = 'INFO') {
    if (!defined('LOG_DIR')) return;

    $timestamp = date('Y-m-d H:i:s');
    $log_file = LOG_DIR . '/' . date('Y-m-d') . '.log';
    $log_entry = "[$timestamp] [$level] $message\n";

    file_put_contents($log_file, $log_entry, FILE_APPEND);
}
?>
