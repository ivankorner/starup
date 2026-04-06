# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Descripción General

**Radar de Proyectos** es una plataforma fullstack para gestionar formularios dinámicos y evaluar iniciativas startup mediante un scoring automático. A diferencia de versiones anteriores, los formularios ahora se crean desde el panel admin sin necesidad de modificar código.

**Arquitectura actual (v2.0):**
- Frontend: React 18 + Vite (sin librerías UI, CSS vanilla)
- Backend: PHP 8.2 con PDO + MySQL 8
- Autenticación: JWT con roles (admin/evaluador)
- Formularios: Sistema dinámico con tipos field configurables

---

## Stack y Convenciones

| Aspecto | Tech | Notas |
|--------|------|-------|
| Frontend | React 18.2, Vite 5 | Sin TypeScript, sin tests |
| Backend | PHP 8.2, MySQL 8 | PDO, sin frameworks ORM |
| Auth | JWT en localStorage | Token bearer en headers |
| Estilos | CSS vanilla + vars | No Bootstrap/Tailwind. Variables en `:root` |
| Node/npm | v25.6.1 / v11.9.0 | Disponibles en sistema |

**Comandos principales:**
```bash
npm run dev      # Vite dev server en localhost:5173
npm run build    # Build para producción (crea dist/)
npm run preview  # Preview de dist/ localmente
```

---

## Arquitectura Actual

### Core Conceptual

1. **Formularios Dinámicos**: Un admin crea/publica un formulario (tabla `forms`) con campos configurables (tabla `form_fields`)
2. **Publicación Condicional**: Los usuarios públicos solo ven formularios con `estado='publicado'`
3. **Respuestas**: Cuando un usuario llena un formulario dinámico, se guarda en `form_responses`
4. **Scoring Automático**: Algunos formularios (como el "Radar" original) incluyen lógica de puntuación

### Flujo de Datos

```
[User llena formulario dinámico] 
  → Frontend valida
  → POST /api/form_responses.php 
  → Backend inserta en form_responses (JSON)
  → (Opcionalmente: Calcula score si el formulario lo requiere)
```

```
[Admin crea/modifica formulario]
  → Dashboard → Tab "Formularios"
  → FormsList.jsx carga /api/forms.php (todos los estados)
  → Admin publica → estado='publicado'
  → Frontend carga formularios publicados en App.jsx
  → Si hay publicados, muestra; si no, muestra "No hay formularios disponibles"
```

### Autenticación

```
[Admin login] 
  → POST /api/auth/login.php (email + password)
  → Backend genera JWT token
  → Frontend almacena token en localStorage
  → Requests: Header 'Authorization: Bearer <token>'
  → /api/auth/me.php verifica token y retorna user (admin/evaluador)
```

---

## Base de Datos (v2.0)

**Usar schema_v2.sql en producción.** El schema.sql original está desactualizado.

Nuevas tablas vs v1.0:

| Tabla | Rol | Campo clave |
|-------|-----|------------|
| `users` | Reemplaza `admins`. Roles: admin/evaluador | `role`, `password_hash` |
| `sessions` | Maneja tokens JWT | `token`, `expires_at` |
| `forms` | Define formularios dinámicos | `estado` (borrador/publicado/archivado) |
| `form_fields` | Campos dentro de un formulario | `tipo` (texto/chip-single/selector-grid/etc), `paso`, `orden` |
| `form_responses` | Respuestas de usuarios | `respuestas` (JSON con slug→valor) |
| `submissions` | Antiguo: propuestas del formulario "Radar" | Aún existe para el flujo original de scoring |

**Campos importantes:**
- `form_fields.tipo`: `'texto', 'textarea', 'chip-single', 'chip-multi', 'selector-grid', 'timeline', 'card-3'`
- `form_fields.paso`: 1-N (agrupa campos por pasos/paneles)
- `form_fields.opciones`: JSON array `["opción1", "opción2", ...]`
- `form_responses.respuestas`: JSON `{ "field_slug": "respuesta" }`

**Índices críticos:**
```sql
INDEX idx_estado (estado)  -- Filtrar formularios por estado rápidamente
INDEX idx_form_id (form_id) -- Obtener campos de un formulario
```

---

## Componentes y Responsabilidades

### Frontend Principal

**App.jsx:**
- Ruteador central (step = 'intro' | 1-5 | 'done' | 'admin' | 'admin-usuarios')
- Carga `publishedForms` al montar: `fetch('/api/forms.php?estado=publicado')`
- Si hay formularios publicados → renderiza StepIntro, etc.
- Si NO hay → muestra "No hay formularios disponibles"

**Dashboard.jsx:**
- Página para usuarios autenticados (admin/evaluador)
- Tabs: "Propuestas" (lista de submissions) | "Formularios" (solo admin)

**FormsList.jsx:**
- Gestión CRUD de formularios (admin only)
- Carga: `fetch('/api/forms.php')` sin filtro → todos los estados
- Permite crear, editar, publicar, eliminar formularios
- Subcomponente: lista de fields con drag/edit

**LoginScreen.jsx:**
- Modal de login
- POST `/api/auth/login.php` con email + password
- Guarda token en localStorage

**UsersList.jsx** (admin only):
- Gestión de usuarios (crear, editar, cambiar rol, activar/desactivar)
- POST/PUT/DELETE `/api/users.php`

### Hooks Customizados

**useAuth.js:**
- Estado global de autenticación
- Lee token de localStorage al montar
- Verifica validez con `/api/auth/me.php`
- Expone: `{ user, token, isAuthenticated, isAdmin, login(), logout() }`

---

## API Endpoints

### Autenticación

```
POST /api/auth/login.php
  Body: { email, password }
  Response: { success, token, user: { id, nombre, email, role } }

POST /api/auth/logout.php
  Headers: Authorization: Bearer <token>

GET /api/auth/me.php
  Headers: Authorization: Bearer <token>
  Response: { user: { ... } }
```

### Formularios (CRUD)

```
GET /api/forms.php                      # Listar todos (sin filtro)
GET /api/forms.php?estado=publicado     # Solo publicados
GET /api/forms.php?id=X                 # Detalle + fields

POST /api/forms.php
  Headers: Authorization: Bearer <token> (admin only)
  Body: { titulo, descripcion, estado: 'borrador'|'publicado'|'archivado' }

PUT /api/forms.php?id=X
  Headers: Authorization: Bearer <token>
  Body: { titulo?, descripcion?, estado? }

DELETE /api/forms.php?id=X
  Headers: Authorization: Bearer <token>
```

### Form Fields

```
POST /api/form_fields.php
  Headers: Authorization: Bearer <token>
  Body: { 
    form_id, paso, orden, tipo, label, descripcion, obligatorio,
    opciones?, max_seleccion?, max_length?
  }

PUT /api/form_fields.php?id=X
  Headers: Authorization: Bearer <token>

DELETE /api/form_fields.php?id=X
  Headers: Authorization: Bearer <token>
```

### Form Responses (envío de formularios)

```
POST /api/form_responses.php
  Body: { form_id, nombre, email, respuestas: { field_slug: valor, ... } }
  Response: { success, id }

GET /api/form_responses.php?form_id=X
  Headers: Authorization: Bearer <token> (admin/evaluador)
  Response: [ { id, nombre, email, respuestas, created_at }, ... ]
```

### Submissions (formulario "Radar" original)

```
GET /api/submissions.php
  Headers: Authorization: Bearer <token>
  Response: [ { id, nombre, sector, score, veredicto, ... }, ... ]

GET /api/submission.php?id=X
  Headers: Authorization: Bearer <token>

POST /api/submit.php
  Body: { nombre, email, nombreProyecto, sector, ... }  # Form "Radar"
  Response: { success, score, veredicto }
```

### Users (admin only)

```
GET /api/users.php
  Headers: Authorization: Bearer <token> (admin)

POST /api/users.php
  Headers: Authorization: Bearer <token> (admin)
  Body: { nombre, email, password, role: 'admin'|'evaluador', activo: 1|0 }

PUT /api/users.php?id=X
  Headers: Authorization: Bearer <token> (admin)

DELETE /api/users.php?id=X
  Headers: Authorization: Bearer <token> (admin)
```

---

## Patrones Clave

### 1. Autenticación en Endpoints

Todos los endpoints críticos incluyen middleware `requireAuth()` en PHP:

```php
// api/middleware.php
function requireAuth() {
    $token = getBearer();  // Extrae Bearer token del header
    if (!$token) { 
        http_response_code(401); 
        exit; 
    }
    $user = verifyToken($token);
    return $user;  // { id, email, role, nombre }
}
```

### 2. JSON en MySQL

Arrays en BD se guardan como JSON:

```javascript
// Frontend: pasar array de strings
{ opciones: ["Opción A", "Opción B", "Opción C"] }

// Backend PHP: decodificar
$opciones = json_decode($field['opciones']);  // → array
$opciones = json_encode($opciones);  // → guardar
```

### 3. Scoring (Formulario "Radar")

El scoring original aún funciona, pero es específico del formulario hardcodeado:

```javascript
// src/utils/scoring.js
export function calcularScore(formData) { ... }  // 0-100
export function clasificarVeredicto(score) { ... }  // 'startup'|'potencial'|'no-califica'
```

Lógica:
- Madurez (0-45), Presupuesto (0-30), Equipo (0-30), Dificultades (0-15), etc.
- Backend PHP (`api/submit.php`) recalcula al guardar

### 4. Estado Global (useAuth)

No hay Redux/Zustand. Autenticación maneja estado global via hook. Otros datos son locales a componentes o via props.

---

## Flujos Comunes

### Crear un Formulario Dinámico

1. Admin login → Dashboard → Tab "Formularios"
2. Click "+ Nuevo Formulario"
3. Modal: ingresa título, descripción, estado='borrador'
4. POST `/api/forms.php` → recibe `id`
5. Click "Ver campos" → detalle del formulario
6. "+ Agregar Campo": define tipo, label, opciones, etc.
7. POST `/api/form_fields.php` con form_id
8. Cambiar estado a 'publicado' → PUT `/api/forms.php?id=X` con `{ estado: 'publicado' }`
9. Frontend recarga formularios publicados → usuario ve el nuevo

### Un Usuario Llena el Formulario

1. Accede a `http://localhost/starup`
2. App.jsx carga formularios publicados
3. Si hay, muestra StepIntro (antiguo) O el nuevo formulario dinámico (TBD: implementar renderización dinámica)
4. Usuario completa y envía
5. Frontend valida
6. POST `/api/form_responses.php` → guarda respuesta

### Setup Local (Desarrollo)

```bash
# 1. Crear BD
mysql -u root -p < sql/schema_v2.sql

# 2. Verificar credenciales en api/db.php
# (host=localhost, user=root, pass='')

# 3. Instalar deps y iniciar
cd /Applications/XAMPP/xamppfiles/htdocs/starup
npm install
npm run dev  # http://localhost:5173

# 4. Login
# Email: admin@radar.com
# Password: admin123
```

---

## Cambios Desde v1.0

| Aspecto | v1.0 | v2.0 |
|--------|------|-----|
| **Formularios** | Hardcodeado (5 pasos fijos) | Dinámicos, creados desde admin |
| **Usuarios** | Solo 1 admin (tabla `admins`) | Multi-usuario con roles (tabla `users`) |
| **Auth** | Login simple, sin token | JWT con Bearer token, middleware |
| **Respuestas** | Solo `submissions` | `submissions` + `form_responses` |
| **Publicación** | N/A | Formularios se publican/archivan |
| **Banners** | Estáticos | Gestionables desde admin |

---

## Puntos Críticos para Futuros Cambios

### Si cambias la lógica de scoring:

1. Editar `src/utils/scoring.js` (calcularScore)
2. Editar idéntico en `api/submit.php` (función calcScore)
3. Testear que ambos generan el mismo score

### Si agregás un nuevo tipo de field:

1. Agregar a ENUM en `form_fields` table: `CREATE TABLE form_fields (... tipo ENUM('texto', ..., 'nuevo-tipo') ...)`
2. Agregar lógica de validación frontend (React component)
3. Agregar lógica de guardado en `form_responses.php`

### Si cambias rutas de API:

1. Actualizar `const API_URL = '/api'` en archivos que usen fetch
2. Verificar CORS headers en `api/.../*.php`

### Si agregas seguridad (HTTPS en prod):

1. Cambiar `localStorage` token a HttpOnly cookie (requiere cambios en middleware)
2. Implementar CSRF tokens si agrega forms HTML nativos

---

## Archivos Críticos (v2.0)

| Archivo | Propósito | Criticidad |
|---------|-----------|-----------|
| `src/App.jsx` | Router principal, carga formularios | 🔴 Crítico |
| `src/hooks/useAuth.js` | Autenticación global | 🔴 Crítico |
| `api/auth/login.php` | Generación de JWT token | 🔴 Crítico |
| `api/middleware.php` | Verificación de token y permisos | 🔴 Crítico |
| `api/forms.php` | CRUD de formularios | 🟠 Alto |
| `api/form_fields.php` | CRUD de fields | 🟠 Alto |
| `api/form_responses.php` | Guardado de respuestas | 🟠 Alto |
| `src/components/Dashboard.jsx` | Panel admin | 🟠 Alto |
| `src/components/FormsList.jsx` | Gestión de formularios | 🟠 Alto |
| `sql/schema_v2.sql` | DDL (usar en prod) | 🔴 Crítico (prod) |
| `src/styles.css` | Todos los estilos CSS | 🟠 Alto |

---

## Checklist para PR / Review

- [ ] Testeado en `npm run dev` (frontend + backend)
- [ ] `npm run build` sin errores
- [ ] Si tocaste auth: verifica que useAuth.js y middleware.php estén en sync
- [ ] Si tocaste BD: backup antes, migration en schema_v2.sql
- [ ] Si tocaste API: testea con curl / Postman
- [ ] Si tocaste formularios dinámicos: testea creación, publicación, llenado de respuestas
- [ ] Responsive: testea en 375px y 1200px

---

**Actualizado:** 2026-04-06  
**Versión:** v2.0 (Multiusuario + Formularios Dinámicos)  
**Estado:** ✅ Arquitectura moderna, en desarrollo activo
