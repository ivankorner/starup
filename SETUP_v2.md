# Configuración v2 — Multiusuario + Emails + Formularios Dinámicos

## Lo que cambió

✅ **Autenticación por email** (no más admin123 default)  
✅ **Sistema multiusuario** con roles (admin/evaluador)  
✅ **Envío de emails** a `ivankorner@gmail.com` cuando se recibe una propuesta  
✅ **Dashboard mejorado** con stats, tabla filtrable, edición de veredictos  
✅ **Backend listo** para formularios dinámicos (todavía sin UI para crearlos)  

---

## 1. Base de Datos — Migración

### Antes (v1):

```bash
mysql -u root -p < sql/schema.sql
```

### Ahora (v2):

```bash
mysql -u root -p < sql/schema_v2.sql
```

**Nota:** v2 crea tablas **nuevas** (users, sessions, forms, form_fields, form_responses). Las tablas antiguas (admins) NO se tocan, es backward compatible.

**Credenciales por defecto:**
- Email: `admin@radar.com`
- Contraseña: `admin123`

---

## 2. Configuración SMTP para Emails

**Archivo:** `api/config.php`

Necesitás configurar las credenciales de Gmail:

### Paso 1: Preparar cuenta Google

1. Ve a https://myaccount.google.com
2. Menú lateral → Seguridad
3. Activa **Verificación en 2 pasos** (si no la tienes)
4. Busca **"Contraseñas de aplicación"** (aparece después de 2FA)
5. Selecciona:
   - Aplicación: **Correo**
   - Dispositivo: **Windows (o tu SO)**
6. Google te genera una contraseña de **16 caracteres sin espacios**

### Paso 2: Actualizar config.php

Abre `api/config.php` y edita:

```php
define('SMTP_USER', 'tu-correo@gmail.com'); // ← TU EMAIL
define('SMTP_PASS', 'xxxx xxxx xxxx xxxx'); // ← App Password sin espacios
```

### Prueba

Envía el formulario de 5 pasos. Si todo está bien, recibirás un email en `ivankorner@gmail.com` con:
- Datos de la propuesta
- Score calculado
- Veredicto automático

---

## 3. Ejecutar la Aplicación

### Desarrollo (con localStorage + emails)

```bash
npm run dev
```

Abre http://localhost:5173

- El formulario público de 5 pasos funciona sin login
- Al enviar, se calcula score y se intenta enviar email
- Los datos se guardan en localStorage (persistencia local)

### Acceder al Dashboard

1. Haz clic en **"Dashboard"** en el header
2. Te pide login. Usa:
   - Email: `admin@radar.com`
   - Contraseña: `admin123`
3. Verás:
   - **Tab Propuestas:** tabla con todas las iniciativas, filtros, stats
   - **Tab Usuarios:** CRUD de usuarios (solo admin)
   - **Tab Formularios:** visor de formularios (solo admin)

### Producción (con MySQL + XAMPP)

```bash
# 1. Crear BD
mysql -u root -p < sql/schema_v2.sql

# 2. Build
npm run build

# 3. Servir desde Apache
# Los archivos en dist/ se sirven automáticamente desde XAMPP
# http://localhost/starup → funciona igual que dev
```

---

## 4. Crear Usuarios

### Como Admin

1. Login con `admin@radar.com`
2. Dashboard → Tab **Usuarios**
3. Botón "+ Nuevo Usuario"
4. Llena:
   - **Nombre:** cualquiera (ej: "Juan Evaluador")
   - **Email:** email único (ej: juan@tuempresa.com)
   - **Contraseña:** mín. 6 caracteres
   - **Rol:** Evaluador o Admin

### El usuario evaluador puede:
- Ver todas las propuestas
- Editar notas y veredictos
- Ver estadísticas

### El usuario admin además puede:
- Crear/eliminar usuarios
- Editar formularios (cuando esté implementado)

---

## 5. Flujo de Propuestas

```
Usuario anónimo
  ↓ (rellena formulario 5 pasos)
  ↓ Haz clic "Enviar Proyecto"
    → score calculado
    → saved en DB (o localStorage en dev)
    → email enviado a ivankorner@gmail.com
    ↓
    Confirmación "¡Recibimos tu iniciativa!"

Admin/Evaluador
  ↓ (logueado en Dashboard)
  ↓ Tab Propuestas
    → Ver tabla todas las iniciativas
    → Filtrar por veredicto o buscar
    → Click en una → modal editar
    → Cambiar veredicto
    → Agregar notas del evaluador
    → Guardar
```

---

## 6. Estructura de Archivos Nuevos

```
starup/
  api/
    config.php              ← EDITAR: credenciales SMTP
    middleware.php          ← Validación de tokens Bearer
    libs/
      Mailer.php            ← Clase para envío SMTP
      Exception.php         ← Excepción PHP
    auth/
      login.php             ← POST email+password
      logout.php            ← DELETE token
      me.php                ← GET usuario actual
    users.php               ← CRUD usuarios (admin only)
    forms.php               ← CRUD formularios (admin only)
    form_fields.php         ← CRUD campos de formularios
    form_responses.php      ← Guardar respuestas de formularios dinámicos
    submit.php              ← MODIFICADO: ahora envía email
    submissions.php         ← MODIFICADO: ahora requiere auth + permite PUT
  src/
    hooks/
      useAuth.js            ← Hook para estado de sesión
    components/
      LoginScreen.jsx       ← Pantalla login
      Dashboard.jsx         ← Layout principal dashboard
      DashboardStats.jsx    ← Tarjetas de estadísticas
      SubmissionsTable.jsx  ← Tabla + búsqueda + filtros
      SubmissionEditModal.jsx ← Modal para editar propuesta
      UsersList.jsx         ← CRUD de usuarios
      UserModal.jsx         ← Modal crear usuario
      FormsList.jsx         ← Listado de formularios
  sql/
    schema_v2.sql           ← NUEVA: schema con tablas v2
  SETUP_v2.md               ← ESTE ARCHIVO
```

---

## 7. Notas Importantes

### Seguridad en Producción

- [ ] Cambiar `JWT_SECRET` en `api/config.php` (string random de +32 chars)
- [ ] Usar HTTPS en producción (no HTTP)
- [ ] Cambiar contraseña de admin default
- [ ] Usar variables de entorno para credenciales SMTP (no hardcodear)

### Si el email no llega

**Causas comunes:**

1. **SMTP_USER/SMTP_PASS incorrectos**
   - Verificá que sea App Password (de Google), no contraseña normal
   - Sin espacios: `xxxxxxxxxxxxxxxx` (16 caracteres)

2. **Firewall/router bloquea puerto 587**
   - Algunos ISP bloquean SMTP. Prueba Puerto 25 o 465 si es necesario
   - O usa una VPN / servidor SMTP diferente

3. **Gmail rechaza la sesión**
   - Verificá que tengas 2FA activado
   - Recrea el App Password

**Fallback:** Si los emails fallan, el sistema **NO bloquea** la submission. Se guarda igual en BD. Solo se loguea el error.

### Datos de prueba

Crear algunos usuarios y propuestas de prueba:

```bash
# Terminal
npm run dev

# Browser 1: llenar formulario 5 pasos
# http://localhost:5173

# Browser 2: login admin y ver propuestas
# http://localhost:5173 → Dashboard → login
```

---

## 8. Próximas Mejoras

- [ ] Editor completo de formularios (crear, editar, reordenar campos)
- [ ] Autenticación por Google (OAuth)
- [ ] Exportar propuestas a PDF/Excel
- [ ] Webhooks para integración con CRM
- [ ] Soporte multiidioma
- [ ] Tema oscuro

---

**Versión:** 2.0  
**Fecha:** Marzo 2026  
**Estado:** ✅ Producción-ready (con validaciones básicas)
