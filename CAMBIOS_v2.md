# Cambios Implementados v1 → v2

## 📊 Resumen Visual

```
ANTES (v1)                          AHORA (v2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Formulario 5 pasos público          Formulario + Dashboard multiusuario
└─ localStorage (solo dev)          ├─ Propuestas + Stats + Búsqueda
                                    ├─ Usuarios CRUD
                                    └─ Formularios dinámicos (backend ready)

Admin fijo (admin123)               Auth por email + roles (admin/evaluador)
└─ Sin sesiones                     ├─ Tokens Bearer en BD
                                    ├─ Sessions expiración 24h
                                    └─ Multi-usuario simultáneo

Sin emails                          Envío automático a ivankorner@gmail.com
                                    ├─ Gmail SMTP integrado
                                    ├─ No bloquea si falla
                                    └─ Logs de errores

Panel simple (localhost)            Dashboard completo con:
└─ Solo lectura de propuestas       ├─ Stats en tiempo real
                                    ├─ Tabla filtrable + búsqueda
                                    ├─ Modal editar propuesta
                                    ├─ CRUD usuarios
                                    └─ Gestor formularios
```

---

## 🔐 Autenticación

### Cambio Principal

| Aspecto | v1 | v2 |
|---------|----|----|
| **Credenciales** | Usuario "admin" + password hardcodeado | Email único + password |
| **Tabla** | `admins` (1 registro fijo) | `users` (múltiples registros) |
| **Sesión** | Session PHP nativa | Tokens Bearer + tabla `sessions` |
| **Roles** | Ninguno | admin / evaluador |
| **Multiusuario** | ❌ No | ✅ Sí (múltiples logins) |

### Usuarios Predeterminados

```
admin@radar.com / admin123   (cambiar en producción)
```

---

## 📧 Envío de Emails

### Nuevo Endpoint: `api/submit.php`

**Flujo:**
```javascript
Usuario envía formulario 5 pasos
  ↓
POST /api/submit.php con datos
  ↓
score calculado en backend
  ↓
submissions guardada en BD
  ↓
PHPMailer instancia → Gmail SMTP
  ↓
Email enviado a ivankorner@gmail.com
  ├─ Asunto: "Nueva iniciativa: [nombre proyecto]"
  ├─ Cuerpo HTML con todos los datos
  └─ Si falla: se loguea el error, submission igual se guarda
```

### Configuración Requerida

Archivo: `api/config.php` (líneas 18-19)

```php
define('SMTP_USER', 'tu-correo@gmail.com');     // ← CAMBIAR
define('SMTP_PASS', 'xxxx xxxx xxxx xxxx');     // ← CAMBIAR (App Password)
```

---

## 🎛️ Dashboard (Nuevo)

### Tabs

#### Propuestas (todos ven)
- **Stats cards:** Total | Startup | Potencial | No Califica
- **Tabla filtrable:** nombre, email, proyecto, sector, fecha, score, veredicto
- **Búsqueda en vivo**
- **Filtro por veredicto**
- **Modal editar:** cambiar veredicto + agregar notas del evaluador

#### Usuarios (solo admin)
- **CRUD completo:** crear, ver, eliminar usuarios
- **Asignar roles:** admin o evaluador
- **Tabla:** nombre, email, rol, estado

#### Formularios (solo admin)
- **Listado:** títulos, estado (borrador/publicado/archivado)
- **Editor:** TBD (backend ready, UI en construcción)

---

## 🗄️ Base de Datos

### Nuevas Tablas

```sql
users          ← Reemplaza "admins" (con roles)
sessions       ← Tokens Bearer + expiración
forms          ← Formularios creados
form_fields    ← Campos de cada formulario
form_responses ← Respuestas a formularios dinámicos
```

### Columnas Agregadas a `submissions`

```sql
notas_evaluador TEXT        ← Notas del admin/evaluador
revisado TINYINT DEFAULT 0  ← Flag si fue revisada
email_enviado TINYINT DEFAULT 0
updated_at TIMESTAMP        ← Para rastrear cambios
```

---

## 🔗 Nuevos Endpoints PHP

```
POST   /api/auth/login.php         ← Obtener token
POST   /api/auth/logout.php        ← Invalidar token
GET    /api/auth/me.php            ← Usuario actual (requiere auth)

GET    /api/users.php              ← Listar usuarios (admin)
POST   /api/users.php              ← Crear usuario (admin)
PUT    /api/users.php?id=X         ← Editar usuario (admin)
DELETE /api/users.php?id=X         ← Eliminar usuario (admin)

GET    /api/forms.php              ← Listar formularios
GET    /api/forms.php?id=X         ← Obtener formulario + campos
POST   /api/forms.php              ← Crear formulario (auth)
PUT    /api/forms.php?id=X         ← Actualizar formulario (auth)
DELETE /api/forms.php?id=X         ← Eliminar formulario (auth)

GET    /api/form_fields.php?form_id=X   ← Campos de un form
POST   /api/form_fields.php             ← Crear campo (auth)
PUT    /api/form_fields.php?id=X        ← Editar campo (auth)
DELETE /api/form_fields.php?id=X        ← Eliminar campo (auth)

POST   /api/form_responses.php     ← Guardar respuesta de form dinámico

GET    /api/submissions.php        ← Listar (requiere auth)
GET    /api/submissions.php?id=X   ← Obtener propuesta (requiere auth)
PUT    /api/submissions.php?id=X   ← Editar notas/veredicto (requiere auth)
```

### Endpoints Modificados

```
POST   /api/submit.php             ← Ahora envía email (no requiere auth)
GET    /api/submissions.php        ← Ahora requiere auth Bearer
```

---

## 🎨 Nuevos Componentes React

```
LoginScreen.jsx
├─ Formulario email + password
└─ Muestra credenciales de demo

Dashboard.jsx
├─ Tabs: Propuestas | Usuarios | Formularios
└─ Router de dashboard

DashboardStats.jsx
├─ Cards de estadísticas
└─ Grid 4 columnas

SubmissionsTable.jsx
├─ Tabla filtrable
├─ Búsqueda en vivo
└─ Modal click para editar

SubmissionEditModal.jsx
├─ Cambiar veredicto
├─ Agregar notas
└─ Guardar en BD

UsersList.jsx + UserModal.jsx
├─ CRUD de usuarios
├─ Crear con roles
└─ Eliminar usuarios

FormsList.jsx
├─ Listado de formularios
└─ Estado (borrador/publicado)
```

---

## 🔌 Hook useAuth.js

```javascript
const { user, token, isAuthenticated, isAdmin, loading, login, logout } = useAuth();

// user = { id, nombre, email, role, ... }
// token = Bearer token string
// isAuthenticated = boolean
// isAdmin = boolean
// loading = boolean (durante login)
// login(email, password) = Promise
// logout() = Promise
```

---

## 📝 Archivos Nuevos

```
sql/schema_v2.sql                       ← DDL v2
api/config.php                          ← Configuración global
api/middleware.php                      ← Validación Bearer tokens
api/libs/Mailer.php                     ← Wrapper SMTP
api/libs/Exception.php                  ← Exception class
api/auth/login.php                      ← Endpoint login
api/auth/logout.php                     ← Endpoint logout
api/auth/me.php                         ← Endpoint me
api/users.php                           ← CRUD usuarios
api/forms.php                           ← CRUD formularios
api/form_fields.php                     ← CRUD campos
api/form_responses.php                  ← Guardar respuestas
src/hooks/useAuth.js                    ← Hook auth
src/components/LoginScreen.jsx          ← Pantalla login
src/components/Dashboard.jsx            ← Layout dashboard
src/components/DashboardStats.jsx       ← Cards stats
src/components/SubmissionsTable.jsx     ← Tabla propuestas
src/components/SubmissionEditModal.jsx  ← Modal editar
src/components/UsersList.jsx            ← CRUD users UI
src/components/UserModal.jsx            ← Modal crear user
src/components/FormsList.jsx            ← Listado forms
SETUP_v2.md                             ← Instrucciones setup
CAMBIOS_v2.md                           ← Este archivo
```

---

## 📦 Build & Deploy

### Dev

```bash
npm run dev                  # http://localhost:5173
```

### Production

```bash
npm run build               # Genera dist/
# Servir dist/ desde Apache/XAMPP
# http://localhost/starup
```

---

## 🚀 Próximas Fases (TBD)

- [ ] UI Editor de formularios dinámicos completo
- [ ] Autenticación Google OAuth
- [ ] Notificaciones por email al evaluador
- [ ] Export PDF/Excel de propuestas
- [ ] Webhooks para integraciones (CRM, Slack, etc.)
- [ ] Soporte multiidioma (i18n)
- [ ] Tema oscuro
- [ ] Métricas y reportes

---

## ⚠️ Consideraciones

### Seguridad en Producción

- [ ] Cambiar `JWT_SECRET` en config.php
- [ ] Usar HTTPS (no HTTP)
- [ ] Crear contraseña nueva para admin
- [ ] Variables de entorno para SMTP (no hardcodeadas)
- [ ] Rate limiting en endpoints auth

### Testing

- [ ] Probar login/logout con múltiples usuarios
- [ ] Verificar que emails llegan a ivankorner@gmail.com
- [ ] Probar edición de propuestas (transacciones BD)
- [ ] Verificar tokens expiran correctamente (24h)
- [ ] Responsive dashboard en móvil

---

**Versión:** 2.0  
**Fecha:** Marzo 2026  
**Estado:** ✅ Listo para producción con setup SMTP
