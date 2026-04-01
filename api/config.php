<?php
/**
 * Configuración global de la aplicación
 *
 * IMPORTANTE: Cambiar estas credenciales en producción
 */

// ============================================================================
// BASE DE DATOS
// ============================================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'radar_proyectos');
define('DB_USER', 'root');
define('DB_PASS', '');

// ============================================================================
// AUTENTICACIÓN
// ============================================================================
define('JWT_SECRET', 'tu-secreto-super-seguro-cambiar-en-produccion-min-32-chars');
define('SESSION_TIMEOUT', 86400); // 24 horas en segundos

// ============================================================================
// EMAIL SMTP (Gmail)
// ============================================================================

// Instrucciones para obtener las credenciales:
// 1. Ir a https://myaccount.google.com/apppasswords
// 2. Asegurarse de tener verificación 2FA activada
// 3. Crear un "App Password" para "Mail" y "Windows Computer"
// 4. Copiar la contraseña generada (16 caracteres sin espacios)
// 5. Pegar debajo en SMTP_PASS

define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'ivankorner@gmail.com'); // ← CAMBIAR: tu correo Gmail
define('SMTP_PASS', 'vlzy eaiw xnuh ykhl'); // ← CAMBIAR: App Password de Google (sin espacios: xxxxxxxxxxxxxxxx)
define('SMTP_FROM_NAME', 'Radar de Proyectos');

// Email destino para notificaciones
define('NOTIFY_EMAIL', 'ivankorner@gmail.com');

// ============================================================================
// APLICACIÓN
// ============================================================================
define('APP_NAME', 'Radar de Proyectos');
define('APP_URL', 'http://localhost:5173'); // En dev; cambiar en producción
define('API_URL', 'http://localhost/starup/api'); // En dev/XAMPP

// ============================================================================
// LOGGING
// ============================================================================
define('LOG_DIR', __DIR__ . '/../logs');
define('DEBUG_MODE', true); // Cambiar a false en producción

// ============================================================================
// Crear directorio de logs si no existe
// ============================================================================
if (!file_exists(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

/**
 * Función de logging simple
 */
function log_message($message, $level = 'INFO') {
    if (!defined('LOG_DIR')) return;

    $timestamp = date('Y-m-d H:i:s');
    $log_file = LOG_DIR . '/' . date('Y-m-d') . '.log';
    $log_entry = "[$timestamp] [$level] $message\n";

    file_put_contents($log_file, $log_entry, FILE_APPEND);
}
?>
