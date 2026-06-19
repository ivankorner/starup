# Graph Report - starup  (2026-06-19)

## Corpus Check
- 92 files · ~66,907 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 367 nodes · 386 edges · 56 communities (43 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e2b762c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `Deploy a Cloudways — Radar de Proyectos` - 13 edges
2. `Mailer` - 11 edges
3. `normalizeOptions()` - 11 edges
4. `What You Must Do When Invoked` - 11 edges
5. `/graphify` - 10 edges
6. `Sistema de Scoring — Radar de Proyectos` - 8 edges
7. `2. Detalle por Componente` - 8 edges
8. `graphify reference: extra exports and benchmark` - 7 edges
9. `API Endpoints` - 6 edges
10. `Troubleshooting` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AdminDetail()` --calls--> `textoVeredicto()`  [EXTRACTED]
  src/components/AdminDetail.jsx → src/utils/scoring.js
- `Card3Options()` --calls--> `normalizeOptions()`  [EXTRACTED]
  src/components/DynamicForm/fieldComponents/Card3Options.jsx → src/utils/fieldOptions.js
- `ChipGroup()` --calls--> `normalizeOptions()`  [EXTRACTED]
  src/components/DynamicForm/fieldComponents/ChipGroup.jsx → src/utils/fieldOptions.js
- `SelectorGrid()` --calls--> `normalizeOptions()`  [EXTRACTED]
  src/components/DynamicForm/fieldComponents/SelectorGrid.jsx → src/utils/fieldOptions.js
- `TimelineSelector()` --calls--> `normalizeOptions()`  [EXTRACTED]
  src/components/DynamicForm/fieldComponents/TimelineSelector.jsx → src/utils/fieldOptions.js

## Import Cycles
- None detected.

## Communities (56 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (18): AdminDetail(), SECTORES, COMO_RESUELVEN, DIFICULTADES, URGENCIA_OPTIONS, MADUREZ_OPTIONS, DISPOSITIVOS, NECESIDADES (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (23): assignmentSelectStyle, exportBtnStyle, iconBtnStyle, inputStyle, labelStyle, STATUS_MAP, STATUS_OPTIONS, statusSelectStyle (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (13): FIELD_TYPES, Card3Options(), ChipGroup(), SelectorGrid(), TimelineSelector(), ICON_NAMES, iconDefs, renderIcon() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (27): API Endpoints, Archivos Críticos, Arquitectura Actual, Autenticación, Autenticación, Autenticación en Endpoints PHP, Banners y Portadas, Base de Datos (v2.0) (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (20): Actualizaciones futuras, Banners no se suben, Datos del servidor, Deploy a Cloudways — Radar de Proyectos, Error 401 en login / API, Error 404 en rutas, Error 500, Estructura en el servidor (+12 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): dependencies, html2canvas, jspdf, react, react-dom, sweetalert2, xlsx, description (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (15): 1. Componentes del Score, 2.1 Madurez (máx 45 pts) — peso mayor, 2.2 Presupuesto (máx 30 pts), 2.3 Equipo interno (máx 30 pts), 2.4 Dificultades identificadas (máx 15 pts), 2.5 Necesidades seleccionadas (máx 10 pts), 2.6 Tweet del problema (máx 10 pts), 2.7–2.10 Campos binarios (definido / no definido) (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.36
Nodes (8): banners, form_fields, form_responses, forms, sessions, submissions, users, work_areas

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 11 - "Community 11"
Cohesion: 0.43
Nodes (7): form_fields, form_responses, forms, sessions, submissions, users, work_areas

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): Apr 23, 2026, Apr 27, 2026, Apr 28, 2026, graphify, Memory Context, [starup] recent context, 2026-06-11 4:43pm GMT-3

### Community 14 - "Community 14"
Cohesion: 0.70
Nodes (4): getCurrentUser(), requireAdmin(), requireAuth(), requireRole()

### Community 15 - "Community 15"
Cohesion: 0.70
Nodes (4): calcularScore(), normalizeOption(), optionMatches(), resolveFieldValue()

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (3): columnExists(), PDO, tableExists()

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): admins, banners, submissions

## Knowledge Gaps
- **152 isolated node(s):** `submissions`, `banners`, `PDO`, `name`, `version` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `submissions`, `banners`, `PDO` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05230496453900709 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08901515151515152 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._