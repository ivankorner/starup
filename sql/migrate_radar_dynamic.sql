-- ============================================================================
-- Migración: Convertir "Radar de Proyectos" a formulario dinámico
-- Inserta el formulario clásico de 5 pasos como formulario dinámico en la BD
-- ============================================================================

USE radar_proyectos;

-- ============================================================================
-- 1. INSERTAR FORMULARIO PRINCIPAL
-- ============================================================================

INSERT INTO forms (id, titulo, descripcion, estado, created_by, created_at)
VALUES (
  1,
  'Radar de Proyectos',
  'Cuéntanos sobre tu proyecto startup y evaluaremos su potencial.',
  'publicado',
  1,
  NOW()
)
ON DUPLICATE KEY UPDATE estado='publicado';

-- ============================================================================
-- 2. INSERTAR FIELDS - PASO 0 (Información de contacto)
-- ============================================================================

-- Campo: Nombre completo
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 0, 1, 'texto', 'Nombre completo', 'Tu nombre y apellido', 1, 200, 'nombre')
ON DUPLICATE KEY UPDATE paso=0, orden=1;

-- Campo: Email
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 0, 2, 'texto', 'Correo electrónico', 'Tu email de contacto', 1, 200, 'email')
ON DUPLICATE KEY UPDATE paso=0, orden=2;

-- Campo: Nombre del proyecto
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 0, 3, 'texto', 'Nombre del proyecto', 'Ej. AgroTrack, EduFácil...', 0, 200, 'nombreProyecto')
ON DUPLICATE KEY UPDATE paso=0, orden=3;

-- ============================================================================
-- 3. INSERTAR FIELDS - PASO 1 (La Idea)
-- ============================================================================

-- Campo: Descripción breve
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 1, 1, 'textarea', 'Breve descripción de la actividad', 'Describe brevemente de qué se trata el proyecto.', 0, 1000, 'descripcion')
ON DUPLICATE KEY UPDATE paso=1, orden=1;

-- Campo: Sector principal
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 1, 2, 'selector-grid', 'Rubro o Sector principal',
  'Elige el sector al que apunta tu proyecto.',
  1,
  JSON_ARRAY('Salud', 'Agro', 'Educación', 'Comercio', 'Industria', 'Servicios', 'Gobierno', 'Otro'),
  'sector'
)
ON DUPLICATE KEY UPDATE paso=1, orden=2;

-- Campo: El problema en un tweet
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 1, 3, 'textarea', 'El problema en un Tweet', '¿Qué problema principal quieren resolver? Sé breve.', 0, 280, 'tweet')
ON DUPLICATE KEY UPDATE paso=1, orden=3;

-- ============================================================================
-- 4. INSERTAR FIELDS - PASO 2 (El Dolor)
-- ============================================================================

-- Campo: Cómo resuelven hoy
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 2, 1, 'chip-single', '¿Cómo resuelven hoy esta necesidad?',
  'Elige la opción que mejor describe cómo lo hacen ahora.',
  1,
  JSON_ARRAY('Excel / Planillas', 'Papel y Lápiz', 'WhatsApp / Correos', 'Software obsoleto', 'No lo resolvemos', 'Otro'),
  'comoResuelven'
)
ON DUPLICATE KEY UPDATE paso=2, orden=1;

-- Campo: Dificultades actuales (múltiple)
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, max_seleccion, slug)
VALUES (
  1, 2, 2, 'chip-multi', '¿Cuál es la principal dificultad actual?',
  'Elige una o más opciones (múltiples selecciones)',
  0,
  JSON_ARRAY('Pérdida de tiempo', 'Errores o retrabajo', 'Información dispersa', 'Falta de trazabilidad', 'Mala comunicación', 'Dependencia manual', 'Falta de datos para decidir'),
  3,
  'dificultades'
)
ON DUPLICATE KEY UPDATE paso=2, orden=2;

-- Campo: Urgencia
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 2, 3, 'chip-single', '¿Por qué este proyecto es importante hoy?',
  'Elige el motivo principal.',
  1,
  JSON_ARRAY('Pérdida de dinero/clientes', 'Crecimiento desorganizado', 'Exigencia legal/normativa', 'Oportunidad de mercado', 'Eficiencia operativa'),
  'urgencia'
)
ON DUPLICATE KEY UPDATE paso=2, orden=3;

-- ============================================================================
-- 5. INSERTAR FIELDS - PASO 3 (Madurez)
-- ============================================================================

-- Campo: Estado actual de madurez (timeline)
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 3, 1, 'timeline', 'Estado actual de la iniciativa',
  'Indicá en qué etapa de desarrollo se encuentra hoy tu idea.',
  1,
  JSON_ARRAY(
    'Idea inicial|||Recién empezamos a charlarlo.',
    'Problema identificado, sin propuesta definida|||Sabemos qué duele, pero no cómo solucionarlo.',
    'Propuesta preliminar definida|||Tenemos un boceto o idea de cómo debería ser.',
    'Ya existe prueba o piloto|||Armamos algo básico (ej. en Excel) que funciona.',
    'Ya existe una solución parcial a mejorar|||Tenemos un sistema pero quedó obsoleto o chico.'
  ),
  'madurez'
)
ON DUPLICATE KEY UPDATE paso=3, orden=1;

-- ============================================================================
-- 6. INSERTAR FIELDS - PASO 4 (La Visión)
-- ============================================================================

-- Campo: Dispositivo
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 4, 1, 'selector-grid', 'Si el proyecto avanzara, ¿cómo imaginas el uso práctico?',
  'Elige la plataforma principal.',
  1,
  JSON_ARRAY('Celular o Tablet', 'Computadora', 'Desde ambos'),
  'dispositivo'
)
ON DUPLICATE KEY UPDATE paso=4, orden=1;

-- Campo: Descripción de uso
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 4, 2, 'textarea', '¿Cómo necesitarían usar esta solución?', 'Describe el caso de uso principal.', 0, 1000, 'usoDescripcion')
ON DUPLICATE KEY UPDATE paso=4, orden=2;

-- Campo: Necesidades principales (multi-select grid, máx 3)
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, max_seleccion, slug)
VALUES (
  1, 4, 3, 'selector-grid', 'Necesidad principal que debería cubrir (Elegí hasta 3)',
  'Selecciona las funcionalidades clave.',
  0,
  JSON_ARRAY('Registrar información', 'Consultar información', 'Automatizar acciones', 'Comunicar o alertar', 'Analizar y decidir', 'Conectar con clientes'),
  3,
  'necesidades'
)
ON DUPLICATE KEY UPDATE paso=4, orden=3;

-- ============================================================================
-- 7. INSERTAR FIELDS - PASO 5 (Viabilidad)
-- ============================================================================

-- Campo: Timeline
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 5, 1, 'chip-single', '¿Para cuándo les gustaría contar con una primera solución?',
  'Elige el timeframe más realista.',
  1,
  JSON_ARRAY('Menos de 3 meses', 'Entre 3 y 6 meses', 'Entre 6 y 12 meses', 'Más de 12 meses', 'Sin fecha definida'),
  'timeline'
)
ON DUPLICATE KEY UPDATE paso=5, orden=1;

-- Campo: Presupuesto
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 5, 2, 'card-3', '¿Cuentan con presupuesto o financiamiento?',
  'Selecciona la opción que mejor describe tu situación.',
  1,
  JSON_ARRAY('Sí, confirmado', 'Posible, no confirmado', 'No, requerimos apoyo / financiamiento', 'No lo sabemos'),
  'presupuesto'
)
ON DUPLICATE KEY UPDATE paso=5, orden=2;

-- Campo: Equipo interno
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, opciones, slug)
VALUES (
  1, 5, 3, 'card-3', '¿Cuentan con personas internas que acompañen el proyecto?',
  'Selecciona el estado de tu equipo.',
  1,
  JSON_ARRAY('Sí, equipo asignado', 'Sí, parcialmente', 'No', 'No lo sabemos'),
  'equipoInterno'
)
ON DUPLICATE KEY UPDATE paso=5, orden=3;

-- Campo: Notas adicionales
INSERT INTO form_fields (form_id, paso, orden, tipo, label, descripcion, obligatorio, max_length, slug)
VALUES (1, 5, 4, 'textarea', '¿Algo más que quieras agregar?', 'Notas, comentarios, información adicional.', 0, 2000, 'notasAdicionales')
ON DUPLICATE KEY UPDATE paso=5, orden=4;

-- ============================================================================
-- 8. VERIFICACIÓN
-- ============================================================================

SELECT 'Formulario creado/actualizado:' AS status;
SELECT id, titulo, estado, created_by FROM forms WHERE id = 1;

SELECT paso, COUNT(*) as cantidad_fields FROM form_fields WHERE form_id = 1 GROUP BY paso ORDER BY paso;

SELECT COUNT(*) as total_fields FROM form_fields WHERE form_id = 1;
