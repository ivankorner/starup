# CLAUDE.md — Radar de Proyectos

## Descripción del Proyecto

**Radar de Proyectos** es una aplicación web fullstack para que emprendedores evalúen y envíen iniciativas startup. Consiste en:

1. **Formulario de 5 pasos** guiado para recopilar información sobre la iniciativa
2. **Algoritmo de scoring automático** (0-100 pts) que clasifica propuestas
3. **Panel evaluador** interno para revisar iniciativas con detalle

El proyecto está desplegado en `/Applications/XAMPP/xamppfiles/htdocs/starup/`.

---

## Stack Tecnológico

| Capítulo | Tecnología | Versión |
|----------|-----------|---------|
| Frontend | React | 18.2.0 |
| Build Tool | Vite | 5.0.0+ |
| Backend | PHP | 8.2.4 (XAMPP) |
| Database | MySQL | 8 |
| Estilos | CSS vanilla + variables | — |
| Persistencia (dev) | localStorage | — |

### Notas importantes:

- **No se usa Bootstrap, Tailwind ni librerías UI.** Todos los estilos son CSS vanilla con variables CSS.
- **Sin librerías de validación ni estado global sofisticado.** React hooks vanilla (`useState`).
- **Sin TypeScript, sin tests integrados.** Es v1.0 MVP.
- **Node.js v25.6.1, npm 11.9.0** disponibles en el sistema.

---

## Estructura de Directorios

```
starup/
├── src/
│   ├── components/                 # Componentes React funcionales
│   │   ├── ProgressBar.jsx         # Barra de progreso (paso X/5)
│   │   ├── StepIntro.jsx           # Pantalla inicial (nombre, email, proyecto)
│   │   ├── Step1Idea.jsx           # Paso 1: descripción, sector, problema (tweet)
│   │   ├── Step2Dolor.jsx          # Paso 2: cómo resuelven, dificultades, urgencia
│   │   ├── Step3Madurez.jsx        # Paso 3: estado actual (timeline vertical)
│   │   ├── Step4Vision.jsx         # Paso 4: dispositivo, uso, necesidades (máx 3)
│   │   ├── Step5Viabilidad.jsx     # Paso 5: timeline, presupuesto, equipo, notas
│   │   ├── StepDone.jsx            # Pantalla de confirmación post-envío
│   │   ├── AdminPanel.jsx          # Listado de submissions para evaluador
│   │   └── AdminDetail.jsx         # Vista de detalle de una submission
│   │
│   ├── utils/
│   │   └── scoring.js              # Función calcularScore() + clasificarVeredicto()
│   │
│   ├── App.jsx                     # Componente raíz: navegación global, estado
│   ├── index.jsx                   # ReactDOM.createRoot()
│   └── styles.css                  # Estilos globales + variables CSS
│
├── api/                            # Endpoints PHP (AccesO en /api/...)
│   ├── db.php                      # PDO connection
│   ├── submit.php                  # POST: guardar nueva submission
│   ├── submissions.php             # GET: listado de submissions
│   ├── submission.php              # GET ?id=X: detalle de una submission
│   └── login.php                   # POST: autenticación admin (TBD)
│
├── sql/
│   └── schema.sql                  # DDL: creación de DB, tablas, índices, admin
│
├── public/                         # Assets estáticos (vacío por ahora)
│
├── dist/                           # Build de producción (gitignore)
│
├── index.html                      # HTML principal (punto de entrada)
├── package.json                    # Dependencias npm
├── vite.config.js                  # Config Vite + React plugin
├── README.md                       # Documentación de usuario
├── CLAUDE.md                       # Este archivo
└── node_modules/                   # Dependencias instaladas

```

---

## Convenciones de Código

### React Components

- **Nombres en PascalCase:** `StepIntro.jsx`, `AdminPanel.jsx`
- **Imports:** ES6 modules (`import X from 'Y'`)
- **Hooks:** Solo `useState`, `useEffect` si es necesario
- **Props:** Pasadas directamente, no desestructuradas en parámetros (para claridad)
- **Estilo de renderizado:** JSX limpio, clases dinámicas con template literals

Ejemplo:

```jsx
export default function Step1Idea({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="form-container">
      <ProgressBar step={1} />
      {/* contenido */}
    </div>
  );
}
```

### Estilos CSS

- **Variables globales** definidas en `:root` en `styles.css`
- **Clases reutilizables:** `.chip`, `.selector-card`, `.radio-box`, `.button`
- **Mobile-first:** Media query único en `@media (max-width: 500px)`
- **Sin !important** salvo en excepciones controladas
- **Nombrado BEM-like:** `.form-group`, `.submission-card`, `.detail-row`

Variables principales:

```css
:root {
  --primary: #5B5BD6;
  --primary-light: #EEEDFE;
  --primary-dark: #3C3489;
  --text-main: #1A1A2E;
  --text-body: #333333;
  --text-muted: #888888;
  --border: #E0E0E0;
  --bg-light: #F5F5F5;
  --bg-white: #FFFFFF;
  /* Veredictos */
  --green-bg: #E1F5EE;
  --green-text: #085041;
  /* ... etc */
}
```

### Estado Global (App.jsx)

```javascript
const initialFormData = {
  // Intro
  nombre: '', email: '', nombreProyecto: '',
  // Paso 1
  descripcion: '', sector: '', tweet: '',
  // Paso 2
  comoResuelven: '', dificultades: [], urgencia: '',
  // Paso 3
  madurez: '',
  // Paso 4
  dispositivo: '', usoDescripcion: '', necesidades: [],
  // Paso 5
  timeline: '', presupuesto: '', budgetScore: 0,
  equipoInterno: '', teamScore: 0, notasAdicionales: '',
  // Calculados
  score: 0, veredicto: '',
};
```

- **step:** `'intro' | 1 | 2 | 3 | 4 | 5 | 'done' | 'admin'`
- **formData:** objeto con todos los campos
- **submissions:** array de objetos guardados en localStorage

### Scoring (src/utils/scoring.js)

Dos funciones exportadas:

```javascript
export function calcularScore(formData) { ... }  // → número 0-100
export function clasificarVeredicto(score) { ... }  // → 'startup' | 'potencial' | 'no-califica'
export function textoVeredicto(veredicto) { ... }  // → string explicativo
```

**Criterios (ver detalles en README.md):**
- Madurez (0-45)
- Presupuesto (0-30)
- Equipo (0-30)
- Dificultades (0-15)
- Necesidades (0-10)
- Tweet (0-10)
- Sector, dispositivo, urgencia, timeline (5+5+10+10)

---

## Flujo de Navegación

```
[Inicio]
   ↓
[Intro: nombre, email, proyecto]
   ↓
[Paso 1: idea, sector, problema]
   ↓
[Paso 2: dolor, dificultades, urgencia]
   ↓
[Paso 3: madurez (timeline)]
   ↓
[Paso 4: visión, dispositivo, necesidades]
   ↓
[Paso 5: viabilidad, timeline, presupuesto, equipo]
   ↓
[Enviar → calcularScore() + clasificarVeredicto()]
   ↓
[Confirmación + guardar en localStorage]
   ↓
[Panel Admin: ver todas las submissions]
   └→ [Click en card → vista de detalle]
```

**Header Navigation:**
- Tab "Enviar Iniciativa" → vuelve a intro y reinicia
- Tab "Panel evaluador" → admin listado/detalle

---

## Setup Local

### Desarrollo (sin base de datos)

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/starup
npm install          # Ya realizado
npm run dev          # Inicia Vite en puerto 5173
```

Abre `http://localhost:5173`. Los datos se guardan en `localStorage`.

Para limpiar: `localStorage.clear()` en DevTools console.

### Producción (con MySQL + PHP)

```bash
# 1. Crear DB
mysql -u root -p < sql/schema.sql

# 2. Verificar credenciales en api/db.php
# (Por defecto: host=localhost, user=root, pass='')

# 3. Build
npm run build

# 4. Mover dist/ o servir desde XAMPP
# Apache/XAMPP sirve desde: /Applications/XAMPP/xamppfiles/htdocs/starup
```

Acceso: `http://localhost/starup`

**Admin default:**
- Usuario: `admin`
- Contraseña: `admin123`
- ⚠️ **Cambiar en producción** (generar hash bcrypt)

---

## Decisiones de Diseño

### 1. localStorage para desarrollo

**Por qué:** MVP rápido sin dependencias de base de datos. Perfecto para testing local.

**Cómo migrar a API:**
- En `App.jsx` `handleSubmit()`: reemplazar guardado localStorage con `fetch('api/submit.php')`
- En `AdminPanel`: reemplazar carga de localStorage con `fetch('api/submissions.php')`

### 2. Sin librerías UI (Bootstrap, Tailwind)

**Por qué:** Especificación visual exacta. CSS vanilla permite control total.

**Trade-off:** +500 líneas CSS pero 0 dependencias UI.

### 3. React Hooks vanilla (sin Redux/Context)

**Por qué:** Formulario simple con 15 campos. `useState` es suficiente.

**Si crece:** Considerar Context API o Zustand para estado más complejo.

### 4. Scoring en JavaScript Y PHP

**Por qué:** Sincronía garantizada. Frontend calcula para preview, backend recalcula al guardar.

**Mantener:** Ambas funciones en sync si se cambia lógica.

### 5. JSON en MySQL para arrays

**Por qué:** `dificultades` y `necesidades` son arrays de strings. MySQL JSON es nativo.

**Query:** `json_decode()` en PHP, `JSON.parse()` en JS.

---

## Validaciones Implementadas

| Paso | Campo | Regla |
|------|-------|-------|
| Intro | nombre | No vacío |
| Intro | email | No vacío + formato válido (regex simple) |
| Intro | nombreProyecto | Opcional |
| P1 | descripcion | Opcional |
| P1 | **sector** | **Obligatorio** |
| P1 | tweet | Opcional, máx 280 chars |
| P2 | **comoResuelven** | **Obligatorio** |
| P2 | dificultades | Opcional, múltiple |
| P2 | **urgencia** | **Obligatorio** |
| P3 | **madurez** | **Obligatorio** |
| P4 | **dispositivo** | **Obligatorio** |
| P4 | usoDescripcion | Opcional |
| P4 | necesidades | Opcional, máximo 3 |
| P5 | **timeline** | **Obligatorio** |
| P5 | **presupuesto** | **Obligatorio** |
| P5 | **equipoInterno** | **Obligatorio** |
| P5 | notasAdicionales | Opcional |

**Estilo de error:** Mensaje inline bajo el campo, color rojo #d32f2f. No avanza sin completar obligatorios.

---

## Responsive Design

**Breakpoint único:** `@media (max-width: 500px)`

Cambios en móvil:
- Grillas: 4 col → 2 col
- Two-cols layout: 2 col → 1 col
- Font sizes: -2-4px
- Button nav: flex row → flex column

Testear en:
- 375px (iPhone SE)
- 768px (iPad)
- 1200px+ (desktop)

---

## Base de Datos

### Tabla: `submissions`

```sql
submissions (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(200),
  email VARCHAR(200),
  nombre_proyecto VARCHAR(200),
  sector VARCHAR(100),
  descripcion TEXT,
  tweet VARCHAR(280),
  como_resuelven VARCHAR(100),
  dificultades JSON,          -- array de strings
  urgencia VARCHAR(100),
  madurez VARCHAR(50),
  dispositivo VARCHAR(50),
  uso_descripcion TEXT,
  necesidades JSON,           -- array de strings
  timeline VARCHAR(50),
  presupuesto VARCHAR(100),
  budget_score TINYINT,       -- 0-3
  equipo_interno VARCHAR(100),
  team_score TINYINT,         -- 0-3
  notas TEXT,
  score TINYINT,              -- 0-100
  veredicto ENUM('startup','potencial','no-califica'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_veredicto (veredicto),
  INDEX idx_score (score),
  INDEX idx_fecha (created_at)
)
```

### Tabla: `admins`

```sql
admins (
  id INT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),    -- bcrypt
  created_at TIMESTAMP
)
```

---

## Cómo Ejecutar en Local

### Primer tiempo

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/starup
npm install
npm run dev
# Abre automáticamente http://localhost:5173
```

### Subsecuentes

```bash
npm run dev
```

### Build para producción

```bash
npm run build
# Genera dist/ con archivos HTML, CSS, JS optimizados
```

---

## Decisiones Futuras (TBD)

- [ ] **Autenticación admin:** El endpoint `api/login.php` existe pero no está integrado en UI. Agregar login modal.
- [ ] **Persistencia API en dev:** Opción de toggle localStorage ↔ API para testing.
- [ ] **Filtros en admin:** Por veredicto, fecha, score range.
- [ ] **Export:** CSV/PDF de iniciativas.
- [ ] **Email notifications:** Al crear una submission.
- [ ] **Dark mode:** Variables CSS listas para ello.
- [ ] **Internacionalization (i18n):** Ahora solo español, estructura permite agregar idiomas.

---

## Notas para Futuros Cambios

### Si modificás el scoring:

1. **Editar** `src/utils/scoring.js` (función `calcularScore`)
2. **Editar idéntico** en `api/submit.php` (función `calcScore`)
3. **Testear** enviando una submission y verificando que score coincida
4. **Documentar** en README.md la nueva fórmula

### Si agregás campos al formulario:

1. **Agregar** al objeto `initialFormData` en `App.jsx`
2. **Agregar** input en el componente del paso correspondiente
3. **Agregar** a la tabla `submissions` en `schema.sql`
4. **Agregar** a `INSERT` en `api/submit.php`
5. **Agregar** a vista en `AdminDetail.jsx`

### Si cambias estilos:

1. **Preferir** variables CSS (`:root`)
2. **No usar !important** salvo excepciones
3. **Mobile first:** Definir en `@media (max-width: 500px)` los cambios para móvil
4. **Mantener aspect ratio** en grillas responsivas

---

## Archivos Críticos

| Archivo | Propósito | Prioridad |
|---------|-----------|-----------|
| `src/App.jsx` | Navegación global, estado | 🔴 Crítico |
| `src/utils/scoring.js` | Cálculo de score | 🔴 Crítico |
| `src/styles.css` | Todos los estilos | 🔴 Crítico |
| `api/submit.php` | Guardar submissions | 🔴 Crítico (prod) |
| `sql/schema.sql` | DDL base de datos | 🔴 Crítico (prod) |
| Componentes Step* | Lógica formulario | 🟠 Alto |
| `AdminPanel.jsx` | Listado evaluador | 🟠 Alto |
| `vite.config.js` | Build tool | 🟡 Medio |

---

## Contactos / Dónde Preguntar

**Prompt original:** `/Applications/XAMPP/xamppfiles/htdocs/starup/README.md`

**Stack questions:**
- React: src/components, src/App.jsx
- Scoring: src/utils/scoring.js
- Styles: src/styles.css
- PHP: api/*.php
- DB: sql/schema.sql

---

## Checklist para PR / Review

- [ ] Tests en localhost (`npm run dev`)
- [ ] Build sin errores (`npm run build`)
- [ ] Validaciones funcionan en todos los pasos
- [ ] Responsive en 375px y 1200px+
- [ ] Si modificaste scoring: verificar en admin que el número coincide
- [ ] Si agregaste CSS: usar variables, no hardcoded colors
- [ ] Si cambiaste DB schema: actualizar api/submit.php
- [ ] Si agregaste componente: seguir patrones de otros (prop names, estructura)

---

**Actualizado:** 31/03/2026  
**Versión:** 1.0 MVP  
**Estado:** ✅ Completo y funcional
