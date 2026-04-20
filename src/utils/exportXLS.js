import * as XLSX from 'xlsx';

function getFieldLabel(key, fields) {
  if (!fields) return key;
  const field = fields.find(f => f.slug === key || String(f.id) === String(key));
  return field ? field.label : key;
}

const VEREDICTO_LABELS = {
  viable: 'Viable',
  potencial: 'Potencial',
  'no-viable': 'No viable',
};

function hasScoring(response) {
  return response && response.veredicto && Number(response.raw_maximo) > 0;
}

export function exportResponseToXLS(response) {
  const data = [];

  // Header
  data.push(['RESPUESTA DE USUARIO']);
  data.push([]);
  data.push(['Nombre:', response.nombre]);
  data.push(['Email:', response.email]);
  data.push(['Formulario:', response.form_titulo]);
  data.push(['Enviado:', formatDate(response.created_at)]);
  if (hasScoring(response)) {
    data.push([]);
    data.push(['VIABILIDAD']);
    data.push(['Veredicto:', VEREDICTO_LABELS[response.veredicto] || response.veredicto]);
    data.push(['Score:', `${response.score}/100`]);
    data.push(['Puntos:', `${response.raw_obtenido}/${response.raw_maximo}`]);
  }
  data.push([]);
  data.push(['RESPUESTAS']);
  data.push([]);

  // Responses
  if (response.respuestas && typeof response.respuestas === 'object') {
    Object.entries(response.respuestas).forEach(([slug, value]) => {
      const label = getFieldLabel(slug, response.fields);
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '');
      data.push([label, displayValue]);
    });
  }

  // Create workbook
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Respuesta');

  // Set column widths
  ws['!cols'] = [
    { wch: 30 },
    { wch: 50 }
  ];

  // Download
  const filename = `respuesta_${response.nombre}_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportAllResponsesToXLS(responses) {
  const wb = XLSX.utils.book_new();

  // Si tenemos respuestas, usamos los fields de la primera para crear headers
  if (responses.length > 0 && responses[0].fields) {
    const firstResponse = responses[0];
    const fields = firstResponse.fields;

    // Crear una hoja por cada respuesta
    responses.forEach((response, index) => {
      const data = [];

      // Header individual
      data.push([`${response.nombre} - ${response.form_titulo}`]);
      data.push(['Email:', response.email]);
      data.push(['Enviado:', formatDate(response.created_at)]);
      if (hasScoring(response)) {
        data.push(['Viabilidad:', VEREDICTO_LABELS[response.veredicto] || response.veredicto]);
        data.push(['Score:', `${response.score}/100 (${response.raw_obtenido}/${response.raw_maximo} pts)`]);
      }
      data.push([]);
      data.push(['Pregunta', 'Respuesta']);

      // Respuestas con labels
      if (response.respuestas && typeof response.respuestas === 'object') {
        Object.entries(response.respuestas).forEach(([slug, value]) => {
          const label = getFieldLabel(slug, response.fields);
          const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '');
          data.push([label, displayValue]);
        });
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [
        { wch: 30 },
        { wch: 50 }
      ];

      const sheetName = `${response.nombre}`.substring(0, 31); // Excel límite de 31 caracteres
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  } else {
    // Fallback: crear tabla resumen simple
    const data = [];
    data.push(['REPORTE DE RESPUESTAS']);
    data.push([`Generado: ${formatDate(new Date().toISOString())}`]);
    data.push([`Total de respuestas: ${responses.length}`]);
    data.push([]);
    data.push(['Nombre', 'Email', 'Formulario', 'Fecha de Envío', 'Score', 'Viabilidad']);

    responses.forEach(response => {
      data.push([
        response.nombre,
        response.email,
        response.form_titulo,
        formatDate(response.created_at),
        hasScoring(response) ? `${response.score}/100` : '—',
        hasScoring(response) ? (VEREDICTO_LABELS[response.veredicto] || response.veredicto) : '—',
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 12 },
      { wch: 14 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');
  }

  // Download
  const filename = `respuestas_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
