# Radar de Proyectos — Evaluador de Iniciativas Startup

Aplicación web completa para que emprendedores envíen iniciativas a través de un formulario guiado de 5 pasos, con scoring automático y panel de evaluación interno.

## Stack

- **Frontend:** React 18 + Vite
- **Backend:** PHP 8.2 + MySQL 8
- **Persistencia (dev):** localStorage
- **Estilos:** CSS puro con variables CSS

## Instalación

### 1. Instalar dependencias (ya realizado)

```bash
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abrirá automáticamente `http://localhost:5173` en tu navegador.

### 3. Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`.

## Uso en Desarrollo

**Sin necesidad de base de datos ni PHP.**

Las submissions se guardan en `localStorage` del navegador:
- Completá el formulario de 5 pasos
- Al enviar, se guarda en `localStorage` y aparece en el panel evaluador
- Los datos persisten entre sesiones del navegador

Para limpiar: abre DevTools → Console → `localStorage.clear()`

## Uso en Producción (con MySQL + PHP)

### 1. Crear la base de datos

```bash
mysql -u root -p < sql/schema.sql
```

### 2. Configurar la base de datos

Editar `api/db.php` con tus credenciales MySQL:

```php
$host = 'localhost';
$dbname = 'radar_proyectos';
$user = 'root';
$pass = '';
```

### 3. Compilar React y servir con Apache/XAMPP

```bash
npm run build
```

El contenido de `dist/` se sirve desde Apache en `localhost/starup/`.

El API PHP estará accesible en:
- `localhost/starup/api/submit.php` — POST para enviar iniciativas
- `localhost/starup/api/submissions.php` — GET para listar
- `localhost/starup/api/submission.php?id=X` — GET para detalle

### 4. Cambiar contraseña admin

En `sql/schema.sql` hay un admin por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

Para cambiar, genera un hash bcrypt:

```php
echo password_hash('tu-nueva-contraseña', PASSWORD_BCRYPT);
```

Y actualiza en la base de datos:

```sql
UPDATE admins SET password_hash = 'tu-hash-aqui' WHERE username = 'admin';
```

## Estructura de Directorios

```
starup/
  ├── src/
  │   ├── components/          # Componentes React
  │   │   ├── ProgressBar.jsx
  │   │   ├── StepIntro.jsx
  │   │   ├── Step1Idea.jsx
  │   │   ├── Step2Dolor.jsx
  │   │   ├── Step3Madurez.jsx
  │   │   ├── Step4Vision.jsx
  │   │   ├── Step5Viabilidad.jsx
  │   │   ├── StepDone.jsx
  │   │   ├── AdminPanel.jsx
  │   │   └── AdminDetail.jsx
  │   ├── utils/
  │   │   └── scoring.js       # Algoritmo de scoring
  │   ├── App.jsx              # Componente principal
  │   ├── index.jsx            # Punto de entrada React
  │   └── styles.css           # Estilos globales
  ├── api/
  │   ├── db.php               # Conexión MySQL
  │   ├── submit.php           # POST nueva iniciativa
  │   ├── submissions.php      # GET listado
  │   ├── submission.php       # GET detalle
  │   └── login.php            # Autenticación admin
  ├── sql/
  │   └── schema.sql           # DDL de base de datos
  ├── index.html               # HTML principal
  ├── package.json             # Dependencias
  ├── vite.config.js           # Configuración Vite
  └── node_modules/            # Dependencias npm
```

## Algoritmo de Scoring

El score máximo es 100 puntos. Se calcula según:

- **Madurez del proyecto** (0-45 pts): idea inicial (15), problema identificado (15), propuesta preliminar (30), piloto (45), solución parcial (45)
- **Presupuesto** (0-30 pts): confirmado (30), posible (20), requiere financiamiento (10), desconocido (0)
- **Equipo interno** (0-30 pts): asignado (30), parcialmente (20), no (10), desconocido (0)
- **Dificultades** (0-15 pts): 3+ identificadas (15), 1-2 (8), ninguna (0)
- **Necesidades** (0-10 pts): 2+ seleccionadas (10), 1 (5), ninguna (0)
- **Descripción del problema** (0-10 pts): >30 caracteres (10)
- **Sector** (0-5 pts): seleccionado (5)
- **Dispositivo** (0-5 pts): seleccionado (5)
- **Urgencia** (0-10 pts): identificada (10)
- **Timeline** (0-10 pts): definido (10), sin fecha definida (0)

### Veredictos

- **Startup** (≥70 pts): Madurez sólida, problema claro, recursos para avanzar → Priorizar para Fase 2
- **Potencial Startup** (45-69 pts): Idea con potencial pero necesita desarrollar aspectos clave
- **No Califica** (<45 pts): Estado actual no cumple criterios mínimos

## Validaciones

**Pantalla Intro:**
- Nombre: requerido
- Email: requerido, formato válido

**Paso 1 (La Idea):**
- Sector: requerido

**Paso 2 (El Dolor):**
- Cómo resuelven hoy: requerido
- Urgencia: requerido

**Paso 3 (Madurez):**
- Estado actual: requerido

**Paso 4 (Visión):**
- Dispositivo: requerido

**Paso 5 (Viabilidad):**
- Timeline: requerido
- Presupuesto: requerido
- Equipo interno: requerido

## Diseño

- **Ancho máximo:** 700px
- **Tipografía:** Inter sans-serif
- **Colores:** Paleta morada/gris (ver `src/styles.css`)
- **Responsive:** 100% usable en 375px (iPhone SE)

## Responsabilidades de la aplicación

El usuario (emprendedor):
1. Completa los 5 pasos del formulario
2. Envía y ve confirmación

El evaluador:
1. Accede al "Panel evaluador"
2. Revisa cada iniciativa con su score y veredicto automático
3. Ve el detalle completo de cada propuesta

## Notas para el desarrollador

- En modo dev (localhost:5173), usa `localStorage` — sin necesidad de PHP
- El algoritmo de scoring está implementado 2 veces (en JavaScript y PHP) para sincronía
- La base de datos incluye índices en `veredicto`, `score` y `created_at` para queries rápidas
- El CSS es vanilla (sin Bootstrap/Tailwind) pero usa variables CSS para mantenerlo DRY
- Responsive breakpoint principal: 500px

## Troubleshooting

**"Cannot find module 'react'"**
→ Ejecutá `npm install`

**"localhost:5173 no abre"**
→ Vite se inicia en el primer puerto disponible. Revisá la consola.

**CORS errors en API**
→ Los headers CORS están habilitados en los archivos PHP. Si persistise, configurá Apache.

**MySQL no conecta**
→ Verificá que XAMPP está corriendo (`mysql -u root -p`)

---

_Radar de Proyectos v1.0 — Marzo 2026_
