# 🔐 Referencia Rápida — URLs, Credenciales y Comandos

## 🔑 BASE DE DATOS

```
Host:     localhost (típicamente)
Database: tpwtvzukqe
User:     tpwtvzukqe
Password: kdT8XYz3e6
```

### En PHPMyAdmin (Cloudways)
- URL: https://www.cloudways.com → Manage Database
- Credenciales: mismas que arriba

---

## 👤 USUARIO ADMIN INICIAL

```
Email:    admin@radar.com
Password: admin123
```

⚠️ **CAMBIAR DESPUÉS DEL PRIMER LOGIN**

---

## 🌐 URLs EN PRODUCCIÓN

Reemplazar `tu-dominio.com` con tu dominio real:

```
Frontend:        https://tu-dominio.com/starup/
Dashboard Admin: https://tu-dominio.com/starup/#/admin
API Base:        https://tu-dominio.com/starup/api/

Endpoints API:
  GET  /api/forms.php
  GET  /api/forms.php?estado=publicado
  POST /api/auth/login.php
  POST /api/form_responses.php
  GET  /api/submissions.php
```

---

## 🛠️ COMANDOS ÚTILES

### Local (antes de subir)

```bash
# Build
npm run build

# Verificar build
ls dist/
ls dist/assets/

# Copy config
cp Deploy/config_production.php api/config.php

# Ver estructura
tree -L 2 . -I node_modules
```

### Via SSH en Cloudways

```bash
# Conectar SSH
ssh user@server

# Ver estructura
ls -la /home/user/public_html/starup/

# Ver permisos
ls -la /home/user/public_html/starup/api/
chmod 755 /home/user/public_html/starup/api/
chmod 755 /home/user/public_html/starup/logs

# BD
mysql -u tpwtvzukqe -p tpwtvzukqe -e "USE tpwtvzukqe; SHOW TABLES;"

# Ver logs
tail -f /home/user/public_html/starup/logs/*.log

# PHP info
php -v
```

---

## 📋 ARCHIVOS A COPIAR

### Antes de Subir por FTP

| De Local | A Servidor |
|----------|-----------|
| `Deploy/config_production.php` | `api/config.php` |
| `Deploy/.htaccess` | `/.htaccess` |
| `Deploy/init_data_cloudways.sql` | PHPMyAdmin (import) |

---

## 🔐 SEGURIDAD

### Cambiar DESPUÉS de deploy

1. **JWT_SECRET** (en `api/config.php`)
   ```bash
   php -r "echo bin2hex(random_bytes(32));"
   # Copiar output
   ```

2. **Contraseña Admin**
   ```bash
   php -r "echo password_hash('NUEVA_CONTRASEÑA', PASSWORD_BCRYPT);"
   # Copiar output
   # Actualizar en BD:
   UPDATE users SET password_hash = '$2y$10$...' WHERE email = 'admin@radar.com';
   ```

3. **DEBUG_MODE**
   ```php
   define('DEBUG_MODE', false);  // No true en producción
   ```

---

## 🧪 TESTING POST-DEPLOY

### Test 1: Frontend
```
Acceder a: https://tu-dominio.com/starup/
Esperado: Se carga interfaz React
```

### Test 2: API Forms
```
URL: https://tu-dominio.com/starup/api/forms.php (GET)
Esperado: [] o array de formularios (JSON)
```

### Test 3: Login
```
URL: https://tu-dominio.com/starup/api/auth/login.php (POST)
Body: {"email":"admin@radar.com","password":"admin123"}
Esperado: {"success":true,"token":"...","user":{...}}
```

### Test 4: Dashboard
1. Acceder a frontend
2. Click "Login"
3. admin@radar.com / admin123
4. Esperado: Ir a dashboard admin

---

## 📞 REFERENCIA RÁPIDA DE ERRORES

| Error | Causa Probable | Solución |
|-------|---|---|
| 404 en frontend | .htaccess ausente | Subir Deploy/.htaccess |
| "Error de conexión" API | Credenciales BD incorrectas | Verificar api/config.php |
| Login no funciona | Usuario no existe | Insertar en BD |
| CORS error | Headers mal configurados | Ver TROUBLESHOOTING.md |
| logs: Permission denied | Permisos incorrectos | chmod 755 logs/ |

---

## 📁 ESTRUCTURA FINAL (Referencia)

```
/public_html/starup/
├── dist/
│   ├── index.html
│   ├── assets/
│   │   ├── index.*.js
│   │   └── main.*.css
│   └── ...
├── api/
│   ├── config.php ← ACTUALIZADO CON CREDENCIALES
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── me.php
│   ├── forms.php
│   ├── form_fields.php
│   ├── form_responses.php
│   ├── submissions.php
│   ├── middleware.php
│   ├── db.php
│   └── ...
├── sql/
│   └── schema_v2.sql
├── logs/
│   ├── 2026-04-06.log
│   └── ...
├── .htaccess ← De Deploy/
└── index.html ← Redirige a dist/
```

---

## 📝 CHECKLIST FINAL

Antes de dar por terminado:

- [ ] BD creada con schema_v2.sql
- [ ] Usuario admin insertado
- [ ] api/config.php tiene credenciales correctas
- [ ] JWT_SECRET cambiado y es único
- [ ] DEBUG_MODE = false
- [ ] .htaccess subido
- [ ] Frontend carga sin errores
- [ ] Login funciona
- [ ] API responde correctamente
- [ ] Carpeta logs/ existe con permisos correctos
- [ ] HTTPS está habilitado

---

## 🆘 LINKS DE SOPORTE

- **Cloudways:** https://www.cloudways.com/support
- **Proyecto Local:** `/Applications/XAMPP/xamppfiles/htdocs/starup/`
- **Docs Deploy:** Archivos .md en carpeta Deploy/

---

**Creado:** 2026-04-06
**Última revisión:** 2026-04-06
**Status:** ✅ Listo
