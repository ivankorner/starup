<?php
/**
 * Script de verificacion post-deploy
 *
 * INSTRUCCIONES:
 * 1. Subir a public_html/verificar_deploy.php
 * 2. Abrir en navegador: https://tu-dominio.com/verificar_deploy.php
 * 3. Verificar que todo este en verde
 * 4. ELIMINAR este archivo despues de verificar (seguridad)
 */

header('Content-Type: text/html; charset=utf-8');
echo '<html><head><title>Verificacion Deploy</title>';
echo '<style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px}';
echo '.ok{color:#2e7d32;}.fail{color:#c62828;}.warn{color:#f57f17;}';
echo 'h1{border-bottom:2px solid #1976d2;padding-bottom:10px;}';
echo 'p{padding:8px 0;border-bottom:1px solid #eee;}</style></head><body>';
echo '<h1>Verificacion de Deploy — Radar de Proyectos</h1>';

// 1. PHP Version
$phpVersion = phpversion();
$phpOk = version_compare($phpVersion, '7.4', '>=');
echo '<p>' . ($phpOk ? '✅' : '❌') . " PHP Version: $phpVersion " . ($phpOk ? '<span class="ok">(OK)</span>' : '<span class="fail">(Requiere 7.4+)</span>') . '</p>';

// 2. PDO MySQL
$pdoOk = extension_loaded('pdo_mysql');
echo '<p>' . ($pdoOk ? '✅' : '❌') . ' PDO MySQL: ' . ($pdoOk ? '<span class="ok">Disponible</span>' : '<span class="fail">NO disponible</span>') . '</p>';

// 3. JSON extension
$jsonOk = extension_loaded('json');
echo '<p>' . ($jsonOk ? '✅' : '❌') . ' JSON extension: ' . ($jsonOk ? '<span class="ok">Disponible</span>' : '<span class="fail">NO disponible</span>') . '</p>';

// 4. Conexion BD
$dbOk = false;
try {
    $pdo = new PDO("mysql:host=localhost;dbname=tpwtvzukqe;charset=utf8mb4", "tpwtvzukqe", "kdT8XYz3e6");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbOk = true;
    echo '<p>✅ Conexion BD: <span class="ok">OK</span></p>';
} catch (PDOException $e) {
    echo '<p>❌ Conexion BD: <span class="fail">' . $e->getMessage() . '</span></p>';
}

// 5. Tablas
if ($dbOk) {
    $tables = ['users', 'sessions', 'submissions', 'forms', 'form_fields', 'form_responses', 'banners'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
            $count = $stmt->fetchColumn();
            echo "<p>✅ Tabla <code>$table</code>: <span class='ok'>OK ($count registros)</span></p>";
        } catch (PDOException $e) {
            echo "<p>❌ Tabla <code>$table</code>: <span class='fail'>NO existe</span></p>";
        }
    }
}

// 6. Archivos clave
$files = [
    'api/config.php' => 'Configuracion',
    'api/db.php' => 'Conexion BD',
    'api/middleware.php' => 'Middleware auth',
    'api/forms.php' => 'API Formularios',
    'api/form_fields.php' => 'API Campos',
    'api/form_responses.php' => 'API Respuestas',
    'api/auth/login.php' => 'API Login',
    'api/auth/me.php' => 'API Me',
    'index.html' => 'Frontend React',
    '.htaccess' => 'Rewrite rules',
];

echo '<h2>Archivos</h2>';
foreach ($files as $file => $desc) {
    $exists = file_exists(__DIR__ . '/' . $file);
    echo '<p>' . ($exists ? '✅' : '❌') . " $desc (<code>$file</code>): " . ($exists ? '<span class="ok">Existe</span>' : '<span class="fail">NO encontrado</span>') . '</p>';
}

// 7. Permisos escritura
echo '<h2>Permisos</h2>';
$dirs = ['api/uploads/banners', 'logs'];
foreach ($dirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (!is_dir($path)) {
        echo "<p>⚠️ <code>$dir/</code>: <span class='warn'>No existe — crear con permisos 755</span></p>";
    } elseif (is_writable($path)) {
        echo "<p>✅ <code>$dir/</code>: <span class='ok'>Escritura OK</span></p>";
    } else {
        echo "<p>❌ <code>$dir/</code>: <span class='fail'>Sin permisos de escritura</span></p>";
    }
}

// 8. mod_rewrite
$modRewrite = in_array('mod_rewrite', apache_get_modules() ?? []);
echo '<p>' . ($modRewrite ? '✅' : '⚠️') . ' mod_rewrite: ' . ($modRewrite ? '<span class="ok">Activo</span>' : '<span class="warn">No detectado (puede funcionar igual)</span>') . '</p>';

echo '<hr><p style="color:#c62828;font-weight:bold;">⚠️ ELIMINAR este archivo despues de verificar</p>';
echo '</body></html>';
?>
