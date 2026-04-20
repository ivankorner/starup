-- ============================================================================
-- Migración: agregar columna cover_image a forms
-- Correr con la BD ya seleccionada (phpMyAdmin: elegir BD → pestaña SQL)
-- ============================================================================

ALTER TABLE forms
  ADD COLUMN cover_image VARCHAR(255) NULL AFTER descripcion;
