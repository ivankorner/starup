// ============================================================================
// Normalizador de opciones de campo + scoring en frontend
// ============================================================================
// Soporta formatos legacy y nuevo con puntaje:
//   - "Texto"                          → { texto, puntos: 0 }
//   - { text, icon }                   → card-3 legacy, puntos 0
//   - { texto, puntos }                → nuevo estándar
//   - { texto, puntos, icon }          → card-3 con puntaje
// Timeline: texto = "Título|||Descripción" (se parsea al render)
// ============================================================================

export function normalizeOption(opt) {
  if (opt && typeof opt === 'object') {
    return {
      texto: opt.texto ?? opt.text ?? '',
      puntos: Number.isFinite(Number(opt.puntos)) ? Number(opt.puntos) : 0,
      icon: opt.icon ?? null,
    };
  }
  return { texto: String(opt ?? ''), puntos: 0, icon: null };
}

export function normalizeOptions(opciones) {
  if (!Array.isArray(opciones)) return [];
  return opciones.map(normalizeOption);
}

// Devuelve el texto visible (sin la parte ||| de descripción de timeline)
export function getOptionDisplayText(texto) {
  if (!texto) return '';
  return String(texto).split('|||')[0];
}

// Match entre texto de opción y valor respondido por usuario
export function optionMatches(optTexto, userValue) {
  if (userValue == null) return false;
  const userStr = String(userValue);
  if (optTexto === userStr) return true;
  return getOptionDisplayText(optTexto) === userStr;
}

// Busca puntos asociados al valor seleccionado por el usuario
export function findPointsForValue(opciones, userValue) {
  const normalized = normalizeOptions(opciones);
  for (const opt of normalized) {
    if (optionMatches(opt.texto, userValue)) return opt.puntos;
  }
  return 0;
}
