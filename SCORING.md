# Sistema de Scoring — Radar de Proyectos

Documento explica cómo el formulario "Radar" calcula la **viabilidad** de una iniciativa startup a partir de las respuestas del usuario.

- **Frontend:** [src/utils/scoring.js](src/utils/scoring.js) → función `calcularScore(formData)`
- **Backend:** [api/submit.php](api/submit.php#L25-L41) → función `calcScore($d)` (réplica exacta, recalcula al guardar)
- **Rango final:** 0 – 100 puntos (con `Math.min(score, 100)` como tope)

Ambas funciones deben mantenerse **en sync**: cualquier cambio en la fórmula requiere tocar los dos archivos.

---

## 1. Componentes del Score

El puntaje final es la **suma** de 10 componentes independientes. Cada uno aporta un máximo distinto según su peso en la evaluación de viabilidad.

| # | Componente | Campo(s) | Máx | Lógica |
|---|------------|----------|-----|--------|
| 1 | **Madurez del proyecto** | `madurez` | 45 | Mapa fijo por estado |
| 2 | **Presupuesto** | `budgetScore` | 30 | `budgetScore × 10` |
| 3 | **Equipo interno** | `teamScore` | 30 | `teamScore × 10` |
| 4 | **Dificultades identificadas** | `dificultades[]` | 15 | ≥3 → 15 / ≥1 → 8 / 0 → 0 |
| 5 | **Necesidades seleccionadas** | `necesidades[]` | 10 | ≥2 → 10 / 1 → 5 / 0 → 0 |
| 6 | **Tweet del problema** | `tweet` | 10 | `length > 30` → 10 |
| 7 | **Sector** | `sector` | 5 | Definido → 5 |
| 8 | **Dispositivo de uso** | `dispositivo` | 5 | Definido → 5 |
| 9 | **Urgencia** | `urgencia` | 10 | Definida → 10 |
| 10 | **Timeline** | `timeline` | 10 | Distinto de `"Sin fecha definida"` → 10 |

**Suma teórica máxima:** 45 + 30 + 30 + 15 + 10 + 10 + 5 + 5 + 10 + 10 = **170**.
El tope duro `min(score, 100)` achata el resultado — en la práctica, proyectos fuertes saturan rápido a 100.

---

## 2. Detalle por Componente

### 2.1 Madurez (máx 45 pts) — peso mayor

Mide qué tan avanzado está el proyecto. Mapa fijo:

```js
{
  idea:      15,   // Solo idea
  problema:  15,   // Problema detectado
  propuesta: 30,   // Propuesta de solución
  piloto:    45,   // Piloto en curso
  parcial:   45,   // Implementación parcial
}
```

Viabilidad: un piloto o implementación parcial vale **3× una idea**. Es el componente más determinante del score.

### 2.2 Presupuesto (máx 30 pts)

`budgetScore` es un entero 0–3 que el usuario elige en un selector (ej. `sin-presupuesto=0`, `bajo=1`, `medio=2`, `alto=3`). Se multiplica por 10.

### 2.3 Equipo interno (máx 30 pts)

`teamScore` es un entero 0–3 que refleja si hay equipo comprometido (sin equipo=0, parcial=1, medio=2, completo=3). Se multiplica por 10.

> Juntos, **Presupuesto + Equipo** pueden aportar 60 pts — mismo peso que Madurez + algo más.

### 2.4 Dificultades identificadas (máx 15 pts)

Array de strings. Premia **diagnóstico claro**:
- 3 o más dificultades → 15 pts
- 1 o 2 → 8 pts
- 0 → 0 pts

Racional: equipo que identifica más obstáculos muestra mayor comprensión del problema.

### 2.5 Necesidades seleccionadas (máx 10 pts)

Array de strings. Qué tipo de ayuda requiere (mentoría, inversión, talento, etc.):
- ≥2 → 10 pts
- 1 → 5 pts

### 2.6 Tweet del problema (máx 10 pts)

Descripción corta del problema (campo `tweet`). Si supera **30 caracteres** → 10 pts. Filtro anti-respuestas vacías.

### 2.7–2.10 Campos binarios (definido / no definido)

| Campo | Pts | Condición |
|-------|-----|-----------|
| `sector` | 5 | Truthy |
| `dispositivo` | 5 | Truthy |
| `urgencia` | 10 | Truthy |
| `timeline` | 10 | Truthy **y** distinto de `"Sin fecha definida"` |

Timeline tiene una excepción explícita: elegir "Sin fecha definida" no cuenta.

---

## 3. Clasificación de Viabilidad (Veredicto)

Tras sumar, el score se traduce a una categoría vía `clasificarVeredicto(score)`:

```js
if (score >= 70) return 'startup';
return 'potencial';
```

| Score | Veredicto | Texto mostrado |
|-------|-----------|----------------|
| **≥ 70** | `startup` | *"El proyecto muestra madurez sólida, problema claro y recursos para avanzar. Priorizar para reunión de Fase 2."* |
| **< 70** | `potencial` | *"La idea tiene potencial pero necesita desarrollar mejor algunos aspectos clave antes de avanzar."* |

> El código de `textoVeredicto` contempla también un caso histórico `'no-califica'` (email template incluye clase CSS `.no-califica`), pero **la lógica actual solo emite `startup` o `potencial`**. No hay umbral inferior que descarte proyectos.

---

## 4. Flujo End-to-End

```
Usuario completa formulario Radar
        ↓
Frontend calcula score (scoring.js) → muestra en pantalla
        ↓
POST /api/submit.php con formData
        ↓
Backend recalcula score (calcScore) ← fuente de verdad
        ↓
INSERT en submissions (score, veredicto)
        ↓
Email de notificación con puntaje + badge
        ↓
Response { success, id, score, veredicto }
```

**Por qué recalcular en backend:** evita manipulación del score desde el cliente. El valor guardado en BD es el del servidor.

---

## 5. Ejemplo de Cálculo

Proyecto ficticio con respuestas:
- `madurez: "propuesta"` → **30**
- `budgetScore: 2` → **20**
- `teamScore: 1` → **10**
- `dificultades: ["A","B","C","D"]` (4) → **15**
- `necesidades: ["mentoría"]` (1) → **5**
- `tweet: "Problema de gestión docente en escuelas rurales"` (>30) → **10**
- `sector: "educación"` → **5**
- `dispositivo: "móvil"` → **5**
- `urgencia: "alta"` → **10**
- `timeline: "3-6 meses"` → **10**

**Total:** 30+20+10+15+5+10+5+5+10+10 = **120** → capped a **100** → veredicto `startup`.

---

## 6. Limitaciones Conocidas

1. **Tope de 100 oculta diferencias** entre proyectos "muy fuertes" (todos saturan en 100).
2. **Umbral único (70)** — no distingue proyectos débiles de medios. Todo < 70 cae en `potencial`.
3. **Campos binarios son baratos** — sumar sector/dispositivo/urgencia/timeline da 30 pts casi gratis (solo con seleccionar algo).
4. **Scoring duplicado** en JS y PHP → riesgo de divergencia si alguien edita solo uno.
5. **Tweet validado por longitud, no por calidad** — 31 caracteres random aprueban.

---

## 7. Referencias

- Lógica JS: [src/utils/scoring.js:1-61](src/utils/scoring.js#L1-L61)
- Lógica PHP: [api/submit.php:25-41](api/submit.php#L25-L41)
- Tabla destino: `submissions` (columnas `score` INT, `veredicto` VARCHAR)
- Dashboard muestra score en lista de propuestas: [src/components/Dashboard.jsx](src/components/Dashboard.jsx)
