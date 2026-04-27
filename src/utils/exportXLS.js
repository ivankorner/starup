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

  // Agrupar respuestas por formulario
  const byForm = {};
  responses.forEach(r => {
    const key = r.form_titulo || 'Sin formulario';
    if (!byForm[key]) byForm[key] = [];
    byForm[key].push(r);
  });

  Object.entries(byForm).forEach(([formTitle, formResponses]) => {
    // Recolectar todos los slugs/labels únicos de todas las respuestas de este formulario
    const slugOrder = [];
    const slugToLabel = {};

    formResponses.forEach(r => {
      const fields = r.fields || [];
      if (r.respuestas && typeof r.respuestas === 'object') {
        Object.keys(r.respuestas).forEach(slug => {
          if (!slugToLabel[slug]) {
            slugOrder.push(slug);
            slugToLabel[slug] = getFieldLabel(slug, fields);
          }
        });
      }
    });

    // Detectar si alguna respuesta tiene scoring
    const anyScoring = formResponses.some(hasScoring);

    // Cabecera: campos fijos + preguntas del formulario + scoring si aplica
    const fixedHeaders = ['Nombre', 'Email', 'Formulario', 'Fecha de Envío'];
    const scoringHeaders = anyScoring ? ['Score', 'Viabilidad'] : [];
    const questionHeaders = slugOrder.map(s => slugToLabel[s]);
    const header = [...fixedHeaders, ...scoringHeaders, ...questionHeaders];

    const data = [header];

    formResponses.forEach(r => {
      const fixedCols = [
        r.nombre || '',
        r.email || '',
        r.form_titulo || '',
        formatDate(r.created_at),
      ];
      const scoringCols = anyScoring
        ? [
            hasScoring(r) ? `${r.score}/100` : '—',
            hasScoring(r) ? (VEREDICTO_LABELS[r.veredicto] || r.veredicto) : '—',
          ]
        : [];
      const questionCols = slugOrder.map(slug => {
        const val = r.respuestas ? r.respuestas[slug] : '';
        return Array.isArray(val) ? val.join(', ') : String(val ?? '');
      });

      data.push([...fixedCols, ...scoringCols, ...questionCols]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Anchos de columna
    const colWidths = [
      { wch: 25 }, // Nombre
      { wch: 25 }, // Email
      { wch: 25 }, // Formulario
      { wch: 20 }, // Fecha
      ...scoringHeaders.map(() => ({ wch: 14 })),
      ...questionHeaders.map(() => ({ wch: 30 })),
    ];
    ws['!cols'] = colWidths;

    // Nombre de hoja: truncar a 31 chars (límite Excel), único por índice si hay colisión
    const sheetName = formTitle.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

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
