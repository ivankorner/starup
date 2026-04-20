-- Agrega tipo 'titulo' al ENUM de form_fields.
-- Uso: separador/encabezado de sección dentro de un formulario.
ALTER TABLE form_fields
  MODIFY COLUMN tipo ENUM(
    'texto', 'textarea', 'chip-single', 'chip-multi',
    'selector-grid', 'timeline', 'card-3', 'titulo'
  ) NOT NULL DEFAULT 'texto';
