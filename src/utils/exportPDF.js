import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const VEREDICTO_COLORS = {
  viable: [46, 125, 50],
  potencial: [178, 135, 4],
  'no-viable': [198, 40, 40],
};

function hasScoring(response) {
  return response && response.veredicto && Number(response.raw_maximo) > 0;
}

export async function exportResponseToPDF(response) {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Title
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('RESPUESTA DE USUARIO', margin, yPosition);
  yPosition += 12;

  // Divider
  pdf.setDrawColor(0, 102, 204);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // User info
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');

  pdf.setFont(undefined, 'bold');
  pdf.text('Nombre:', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  pdf.text(response.nombre, margin + 50, yPosition);
  yPosition += 7;

  pdf.setFont(undefined, 'bold');
  pdf.text('Email:', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  pdf.text(response.email, margin + 50, yPosition);
  yPosition += 7;

  pdf.setFont(undefined, 'bold');
  pdf.text('Formulario:', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  pdf.text(response.form_titulo || '—', margin + 50, yPosition);
  yPosition += 7;

  pdf.setFont(undefined, 'bold');
  pdf.text('Enviado:', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  pdf.text(formatDate(response.created_at), margin + 50, yPosition);
  yPosition += 12;

  // Viabilidad block
  if (hasScoring(response)) {
    const color = VEREDICTO_COLORS[response.veredicto] || [80, 80, 80];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 18, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(11);
    pdf.text('VIABILIDAD', margin + 3, yPosition + 6);
    pdf.setFontSize(14);
    pdf.text(
      `${VEREDICTO_LABELS[response.veredicto] || response.veredicto} — ${response.score}/100 (${response.raw_obtenido}/${response.raw_maximo} pts)`,
      margin + 3,
      yPosition + 13
    );
    pdf.setTextColor(0, 0, 0);
    yPosition += 24;
  }

  // Responses section
  pdf.setFontSize(13);
  pdf.setFont(undefined, 'bold');
  pdf.text('RESPUESTAS', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');

  // Add responses with labels
  if (response.respuestas && typeof response.respuestas === 'object') {
    Object.entries(response.respuestas).forEach(([slug, value]) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      // Question label
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 102, 204);
      const label = getFieldLabel(slug, response.fields);
      const splitLabel = pdf.splitTextToSize(label, pageWidth - 2 * margin);
      pdf.text(splitLabel, margin, yPosition);
      yPosition += splitLabel.length * 5 + 2;

      // Answer
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '—');
      const splitValue = pdf.splitTextToSize(displayValue, pageWidth - 2 * margin - 10);
      pdf.text(splitValue, margin + 5, yPosition);
      yPosition += splitValue.length * 5 + 5;
    });
  }

  // Footer
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'italic');
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generado: ${formatDate(new Date().toISOString())}`, margin, pageHeight - 10);

  // Download
  const filename = `respuesta_${response.nombre}_${new Date().getTime()}.pdf`;
  pdf.save(filename);
}

export async function exportAllResponsesToPDF(responses) {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Title
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(0, 102, 204);
  pdf.text('REPORTE DE RESPUESTAS', margin, yPosition);
  yPosition += 12;

  // Summary
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total de respuestas: ${responses.length}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Generado: ${formatDate(new Date().toISOString())}`, margin, yPosition);
  yPosition += 10;

  // Divider
  pdf.setDrawColor(0, 102, 204);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Add each response as a section
  responses.forEach((response, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Response header
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 102, 204);
    pdf.text(`${index + 1}. ${response.nombre}`, margin, yPosition);
    yPosition += 7;

    // User info
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Email: ${response.email} | Formulario: ${response.form_titulo}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Enviado: ${formatDate(response.created_at)}`, margin, yPosition);
    yPosition += 6;

    if (hasScoring(response)) {
      const color = VEREDICTO_COLORS[response.veredicto] || [80, 80, 80];
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.text(
        `Viabilidad: ${VEREDICTO_LABELS[response.veredicto] || response.veredicto} · Score: ${response.score}/100 (${response.raw_obtenido}/${response.raw_maximo} pts)`,
        margin,
        yPosition
      );
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      yPosition += 6;
    }
    yPosition += 2;

    // Responses
    pdf.setFontSize(8);
    if (response.respuestas && typeof response.respuestas === 'object') {
      Object.entries(response.respuestas).forEach(([slug, value]) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }

        // Question
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(80, 80, 80);
        const label = getFieldLabel(slug, response.fields);
        const splitLabel = pdf.splitTextToSize(`• ${label}:`, pageWidth - 2 * margin - 5);
        pdf.text(splitLabel, margin + 3, yPosition);
        yPosition += splitLabel.length * 3 + 1;

        // Answer
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(0, 0, 0);
        const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '—');
        const splitValue = pdf.splitTextToSize(displayValue, pageWidth - 2 * margin - 10);
        pdf.text(splitValue, margin + 7, yPosition);
        yPosition += splitValue.length * 3 + 2;
      });
    }

    yPosition += 3;
  });

  // Download
  const filename = `respuestas_${new Date().getTime()}.pdf`;
  pdf.save(filename);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
