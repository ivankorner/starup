export function calcularScore(formData) {
  let score = 0;

  // Madurez del proyecto (máx 45 pts)
  const madurezScores = {
    idea: 15,
    problema: 15,
    propuesta: 30,
    piloto: 45,
    parcial: 45,
  };
  score += madurezScores[formData.madurez] || 0;

  // Presupuesto (máx 30 pts)
  score += (formData.budgetScore || 0) * 10;

  // Equipo interno (máx 30 pts)
  score += (formData.teamScore || 0) * 10;

  // Dificultades identificadas (máx 15 pts)
  const numDiff = Array.isArray(formData.dificultades) ? formData.dificultades.length : 0;
  if (numDiff >= 3) score += 15;
  else if (numDiff >= 1) score += 8;

  // Necesidades seleccionadas (máx 10 pts)
  const numNeeds = Array.isArray(formData.necesidades) ? formData.necesidades.length : 0;
  if (numNeeds >= 2) score += 10;
  else if (numNeeds === 1) score += 5;

  // Tweet del problema (máx 10 pts)
  if (formData.tweet && formData.tweet.length > 30) score += 10;

  // Sector seleccionado (5 pts)
  if (formData.sector) score += 5;

  // Dispositivo de uso (5 pts)
  if (formData.dispositivo) score += 5;

  // Urgencia identificada (10 pts)
  if (formData.urgencia) score += 10;

  // Timeline definido (10 pts)
  if (formData.timeline && formData.timeline !== 'Sin fecha definida') score += 10;

  return Math.min(score, 100);
}

export function clasificarVeredicto(score) {
  if (score >= 70) return 'startup';
  if (score >= 45) return 'potencial';
  return 'no-califica';
}

export function textoVeredicto(veredicto) {
  const textos = {
    startup:
      'El proyecto muestra madurez sólida, problema claro y recursos para avanzar. Priorizar para reunión de Fase 2.',
    potencial:
      'La idea tiene potencial pero necesita desarrollar mejor algunos aspectos clave antes de avanzar.',
    'no-califica':
      'El proyecto en su estado actual no cumple los criterios mínimos. Se puede reaplicar en el futuro.',
  };
  return textos[veredicto] || '';
}
