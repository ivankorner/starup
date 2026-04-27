# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Descripción General

**Radar de Proyectos** es una plataforma fullstack para gestionar formularios dinámicos y evaluar iniciativas startup mediante un scoring automático. Los formularios se crean desde el panel admin sin modificar código.

**Arquitectura actual (v2.0):**
- Frontend: React 18 + Vite (sin librerías UI, CSS vanilla)
- Backend: PHP 8.2 con PDO + MySQL 8 (servido por XAMPP)
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
| Diálogos | SweetAlert2 | Usado para confirmaciones y alertas en toda la app |
| Node/npm | v25.6.1 / v11.9.0 | Disponibles en sistema |

**Comandos principales:**
```bash
npm run dev      # Vite dev server en localhost:5173
npm run build    # Build para producción (crea dist/)
npm run preview  # Preview de dist/ localmente
```

---

## Setup de Desarrollo (DOS SERVIDORES)

En dev corren dos servidores en paralelo:

1. **XAMPP** (Apache + MySQL) en `http://localhost/starup/` — sirve PHP y BD
2. **Vite** en `http://localhost:5173/` — sirve React con HMR

**Vite proxy** (`vite.config.js`): cualquier request a `/api/*` se redirige automáticamente a `http://localhost/starup/api/*`. Por eso el frontend usa rutas `/api/forms.php` en ambos entornos.

```bash
# Antes de npm run dev, verificar que XAMPP esté corriendo (Apache + MySQL)
# BD local: host=localhost, user=root, pass='' (ver api/config.php)
# Login dev: admin@radar.com / admin123
```

**Config central:** `api/config.php` — DB creds, JWT secret. Prod usa credenciales distintas.

---

## Arquitectura Actual

### Core Conceptual

1. **Formularios Dinámicos**: Admin crea un formulario (`forms`) con campos configurables (`form_fields`)
2. **Publicación Condicional**: Usuarios públicos solo ven formularios con `estado='publicado'`
3. **Respuestas**: Usuario llena → guarda en `form_responses` como JSON
4. **Scoring Automático**: Formulario "Radar" legacy incluye scoring hardcodeado 0-100

### Flujo de Datos

```
[User llena formulario dinámico] 
  → Frontend valida
  → POST /api/form_responses.php 
  → Backend inserta en form_responses (JSON)

[Admin crea/modifica formulario]
  → Dashboard → Tab "Formularios"
  → FormsList.jsx carga /api/forms.php (todos los estados)
  → Admin publica → estado='publicado'
  → App.jsx recarga formularios publicados
```

### Autenticación

```
[Admin login] 
  → POST /api/auth/login.php (email + password)
  → Backend genera JWT → guarda en localStorage
  → Requests: Header 'Authorization: Bearer <token>'
  → /api/auth/me.php verifica token y retorna user
```

---

## Base de Datos (v2.0)

**Usar `sql/schema_v2.sql` en producción.** El `schema.sql` original está desactualizado.

| Tabla | Rol | Campo clave |
|-------|-----|------------|
| `users` | Reemplaza `admins`. Roles: admin/evaluador | `role`, `password_hash` |
| `sessions` | Tokens JWT | `token`, `expires_at` |
| `forms` | Formularios dinámicos | `estado` (borrador/publicado/archivado) |
| `form_fields` | Campos de un formulario | `tipo`, `paso`, `orden` |
| `form_responses` | Respuestas de usuarios | `respuestas` (JSON slug→valor) |
| `submissions` | Legado: formulario "Radar" con scoring | Aún activo |

**Campos importantes:**
- `form_fields.tipo`: `'texto', 'textarea', 'chip-single', 'chip-multi', 'selector-grid', 'timeline', 'card-3'`
- `form_fields.paso`: 1-N (agrupa campos por pasos/paneles)
- `form_fields.opciones`: JSON array `["opción1", "opción2", ...]`
- `form_responses.respuestas`: JSON `{ "field_slug": "respuesta" }`

---

## Componentes y Responsabilidades

### Frontend Principal

**App.jsx** — Router central
- `step` = `'intro' | 1-5 | 'done' | 'admin' | 'admin-usuarios'`
- Carga `publishedForms` al montar desde `/api/forms.php?estado=publicado`
- Si hay publicados → renderiza formulario dinámico; si no → "No hay formularios disponibles"

**Dashboard.jsx** — Panel autenticado
- Tabs: "Propuestas" | "Formularios" (solo admin) | "Banners" (solo admin)
- Subcomponentes: `SubmissionsTable`, `FormsList`, `BannersManager`, `DashboardStats`

**DynamicForm/** — Sistema de formulario dinámico (árbol de componentes):
```
DynamicForm.jsx         ← orquesta pasos, navegación, submit final
  └─ FieldRenderer.jsx  ← switch por field.tipo → componente correcto
       ├─ TextInput.jsx
       ├─ TextAreaInput.jsx
       ├─ ChipGroup.jsx        (chip-single y chip-multi)
       ├─ SelectorGrid.jsx
       ├─ TimelineSelector.jsx
       └─ Card3Options.jsx     (usa iconos de src/utils/cardIcons.jsx)
```

**FormsList.jsx** — CRUD de formularios (admin only)
- Carga sin filtro → todos los estados
- Inline: lista de fields con edit/delete

**BannersManager.jsx** — Gestión de banners de formulario (admin only)
- CRUD via `api/banners.php`

**AdminDetail.jsx / AdminPanel.jsx** — Vista detalle y panel de admin para submissions legacy

**ResponseDetailModal.jsx / SubmissionEditModal.jsx** — Modales para ver/editar respuestas

**LoginScreen.jsx** — Modal de login, guarda token en localStorage

**UsersList.jsx / UserModal.jsx** — Gestión usuarios (admin only)

**FormBanner.jsx** — Muestra banner activo encima del formulario público

### Hooks Customizados

**useAuth.js:**
- Lee token de localStorage al montar, verifica con `/api/auth/me.php`
- Expone: `{ user, token, isAuthenticated, isAdmin, login(), logout() }`
- No hay Redux/Zustand — este hook es el único estado global

### Utilidades

| Archivo | Propósito |
|---------|-----------|
| `src/utils/scoring.js` | `calcularScore()` + `clasificarVeredicto()` para formulario Radar |
| `src/utils/exportXLS.js` | Export XLS individual y bulk (lib: `xlsx`) |
| `src/utils/exportPDF.js` | Export PDF (libs: `jspdf`, `html2canvas`) |
| `src/utils/fieldOptions.js` | Constantes de opciones para tipos de fields |
| `src/utils/cardIcons.jsx` | SVG inline para el tipo de field `card-3` |

---

## API Endpoints

### Autenticación

```
POST /api/auth/login.php        Body: { email, password }
POST /api/auth/logout.php       Auth requerida
GET  /api/auth/me.php           Auth requerida → { user }
```

### Formularios

```
GET    /api/forms.php                   # Todos
GET    /api/forms.php?estado=publicado  # Solo publicados
GET    /api/forms.php?id=X              # Detalle + fields
POST   /api/forms.php                   # Crear (admin)
PUT    /api/forms.php?id=X              # Editar (admin)
DELETE /api/forms.php?id=X              # Eliminar (admin)

POST   /api/form_fields.php             # Crear field (admin)
PUT    /api/form_fields.php?id=X        # Editar field (admin)
DELETE /api/form_fields.php?id=X        # Eliminar field (admin)

POST   /api/form_responses.php          # Enviar respuesta (público)
GET    /api/form_responses.php?form_id=X # Ver respuestas (auth)
```

### Banners y Portadas

```
GET/POST/PUT/DELETE /api/banners.php
GET/POST            /api/form_covers.php
```

### Submissions Legado (formulario "Radar")

```
GET  /api/submissions.php       Auth → lista submissions con score
GET  /api/submission.php?id=X   Auth → detalle
POST /api/submit.php            Público → { success, score, veredicto }
```

### Users

```
GET/POST        /api/users.php          Admin
PUT/DELETE      /api/users.php?id=X     Admin
```

---

## Patrones Clave

### Autenticación en Endpoints PHP

```php
// api/middleware.php
function requireAuth() {
    $token = getBearer();
    if (!$token) { http_response_code(401); exit; }
    return verifyToken($token);  // { id, email, role, nombre }
}
```

### JSON en MySQL

```javascript
// Frontend → array de strings
{ opciones: ["Opción A", "Opción B"] }
// PHP → json_decode() al leer, json_encode() al guardar
```

### Scoring Duplicado

`src/utils/scoring.js` y `api/submit.php` implementan la misma lógica. Si cambiás uno, cambiá el otro y verificá que producen el mismo resultado.

---

## Puntos Críticos para Futuros Cambios

### Nuevo tipo de field:
1. Agregar al ENUM `tipo` en `sql/schema_v2.sql`
2. Crear componente en `src/components/DynamicForm/fieldComponents/`
3. Agregar case en `FieldRenderer.jsx`
4. Agregar manejo en `api/form_responses.php`

### Nuevo API endpoint:
- Incluir `require_once '../middleware.php'` + llamar `requireAuth()` al inicio
- Agregar CORS headers como los demás endpoints existentes

### Deploy a producción:
- `npm run build` → sube `dist/` por FTP
- Sube también los archivos PHP de `api/` que cambiaron
- Si hay cambios de BD: ejecutar migration SQL en prod (sin `USE db_name` en el script)

---

## Archivos Críticos

| Archivo | Propósito | Criticidad |
|---------|-----------|-----------|
| `src/App.jsx` | Router, carga formularios publicados | 🔴 |
| `src/hooks/useAuth.js` | Estado global de auth | 🔴 |
| `api/config.php` | DB creds + JWT secret | 🔴 |
| `api/middleware.php` | Verificación token | 🔴 |
| `api/auth/login.php` | Generación JWT | 🔴 |
| `sql/schema_v2.sql` | DDL producción | 🔴 |
| `src/components/DynamicForm/DynamicForm.jsx` | Formulario dinámico | 🟠 |
| `src/components/DynamicForm/FieldRenderer.jsx` | Switch por tipo de field | 🟠 |
| `src/styles.css` | Todos los estilos | 🟠 |
| `vite.config.js` | Proxy `/api` → XAMPP | 🟠 |

---

**Actualizado:** 2026-04-27  
**Versión:** v2.0 (Multiusuario + Formularios Dinámicos)
