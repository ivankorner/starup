# Deploy a Cloudways — Radar de Proyectos

## Datos del servidor

| Campo         | Valor          |
|---------------|----------------|
| DB Name       | tpwtvzukqe     |
| DB User       | tpwtvzukqe     |
| DB Password   | kdT8XYz3e6     |
| DB Host       | localhost      |
| Metodo deploy | FTP            |

---

## Paso 1: Crear la base de datos

1. Ir a **Cloudways Panel → Tu App → Database Manager** (Adminer/phpMyAdmin)
2. Click en **"SQL command"** o **"Import"**
3. Pegar el contenido de `schema_cloudways.sql` y ejecutar
4. Verificar que se crearon las 7 tablas: `users`, `sessions`, `submissions`, `forms`, `form_fields`, `form_responses`, `banners`
5. Verificar que existe el usuario admin (tabla `users`)

---

## Paso 2: Build del frontend

En tu maquina local:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/starup
npm run build
```

Esto genera la carpeta `dist/` con el frontend compilado.

---

## Paso 3: Subir archivos por FTP

Conectar a Cloudways por FTP (los datos FTP estan en Cloudways Panel → Tu App → Access Details).

### Estructura en el servidor

Subir todo al directorio `public_html/` de Cloudways:

```
public_html/
├── index.html              ← desde dist/index.html
├── assets/                 ← desde dist/assets/ (JS, CSS compilados)
├── .htaccess               ← desde Deploy/.htaccess
├── api/
│   ├── config.php          ← desde Deploy/config.production.php (RENOMBRAR)
│   ├── db.php              ← desde Deploy/db.production.php (RENOMBRAR)
│   ├── middleware.php       ← desde api/middleware.php
│   ├── forms.php            ← desde api/forms.php
│   ├── form_fields.php      ← desde api/form_fields.php
│   ├── form_responses.php   ← desde api/form_responses.php
│   ├── submissions.php      ← desde api/submissions.php
│   ├── submission.php       ← desde api/submission.php
│   ├── submit.php           ← desde api/submit.php
│   ├── users.php            ← desde api/users.php
│   ├── banners.php          ← desde api/banners.php
│   ├── login.php            ← desde api/login.php
│   ├── auth/
│   │   ├── login.php        ← desde api/auth/login.php
│   │   ├── logout.php       ← desde api/auth/logout.php
│   │   └── me.php           ← desde api/auth/me.php
│   ├── libs/
│   │   ├── Exception.php    ← desde api/libs/Exception.php
│   │   └── Mailer.php       ← desde api/libs/Mailer.php
│   └── uploads/
│       └── banners/         ← crear carpeta vacia (permisos 755)
└── logs/                    ← crear carpeta vacia (permisos 755)
```

### Orden de subida

1. **Primero:** Crear carpetas `api/`, `api/auth/`, `api/libs/`, `api/uploads/`, `api/uploads/banners/`, `logs/`
2. **Segundo:** Subir los archivos de produccion:
   - `Deploy/.htaccess` → `public_html/.htaccess`
   - `Deploy/config.production.php` → `public_html/api/config.php` **(renombrar!)**
   - `Deploy/db.production.php` → `public_html/api/db.php` **(renombrar!)**
3. **Tercero:** Subir todos los PHP de la carpeta `api/` (excepto db.php y config.php que ya subiste)
   - `api/middleware.php` → `public_html/api/middleware.php`
   - `api/forms.php` → `public_html/api/forms.php`
   - `api/form_fields.php` → `public_html/api/form_fields.php`
   - `api/form_responses.php` → `public_html/api/form_responses.php`
   - ... (todos los demas .php)
   - `api/auth/*` → `public_html/api/auth/`
   - `api/libs/*` → `public_html/api/libs/`
4. **Cuarto:** Subir el frontend compilado:
   - `dist/index.html` → `public_html/index.html`
   - `dist/assets/` → `public_html/assets/` (toda la carpeta)

---

## Paso 4: Configurar dominio

1. En `public_html/api/config.php`, cambiar:
   ```php
   define('APP_URL', 'https://tu-dominio.com');
   define('API_URL', 'https://tu-dominio.com/api');
   ```
2. Si usas SSL (recomendado), activarlo en Cloudways Panel → SSL Certificate

---

## Paso 5: Verificar permisos

En Cloudways SSH o File Manager:

```bash
chmod 755 public_html/api/uploads/
chmod 755 public_html/api/uploads/banners/
chmod 755 public_html/logs/
chmod 644 public_html/api/config.php
chmod 644 public_html/api/db.php
```

---

## Paso 6: Probar

1. Abrir `https://tu-dominio.com` — debe cargar la app React
2. Abrir `https://tu-dominio.com/api/forms.php?estado=publicado` — debe devolver `[]` (JSON vacio)
3. Login: `admin@radar.com` / `admin123`
4. Si funciona, **cambiar la contraseña del admin** desde el panel de usuarios

---

## Troubleshooting

### Error 500

- Revisar `logs/` en el servidor para ver el error PHP
- Verificar que `api/config.php` y `api/db.php` tienen las credenciales correctas
- Verificar que PHP 8.x esta habilitado en Cloudways

### Error 404 en rutas

- Verificar que `.htaccess` esta en `public_html/` (raiz)
- Verificar que `mod_rewrite` esta habilitado (Cloudways lo tiene por defecto)

### Error 401 en login / API

- El header `Authorization` no llega al PHP
- Verificar que el `.htaccess` tiene la regla de `HTTP_AUTHORIZATION`
- En Cloudways, verificar que Apache pasa los headers

### Formularios no cargan / API devuelve error de conexion

- Verificar credenciales BD en `api/db.php`
- Probar conexion: crear un archivo `test_db.php` temporal:
  ```php
  <?php
  $pdo = new PDO("mysql:host=localhost;dbname=tpwtvzukqe", "tpwtvzukqe", "kdT8XYz3e6");
  echo "Conexion OK";
  ```
- Subir a `public_html/api/test_db.php`, abrir en navegador, luego **eliminar**

### Banners no se suben

- Verificar permisos de `api/uploads/banners/` (755)
- Verificar `upload_max_filesize` en PHP (Cloudways: Settings → PHP Settings)

---

## Actualizaciones futuras

Cuando hagas cambios al codigo:

1. **Frontend:** `npm run build` y subir `dist/index.html` + `dist/assets/` por FTP
2. **Backend:** Subir solo los `.php` modificados a `api/`
3. **NUNCA** sobreescribir `api/config.php` y `api/db.php` del servidor (tienen las credenciales de produccion)
4. **BD:** Si cambias el schema, ejecutar los ALTER TABLE necesarios en Adminer
