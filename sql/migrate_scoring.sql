-- ============================================================================
-- Migración: Sistema de Scoring / Viabilidad automática para formularios
-- ============================================================================
-- Ejecutar después de schema_v2.sql
--
-- Agrega puntaje por opción + cálculo de viabilidad:
--   - form_fields.puntaje_completo: puntos si el campo (texto/textarea/timeline)
--     está respondido. Para opciones (chip/selector/card-3) los puntos se
--     guardan dentro del JSON `opciones` con formato { texto, puntos }.
--   - form_responses.score: score normalizado 0-100.
--   - form_responses.veredicto: viable / potencial / no-viable.
--   - form_responses.raw_obtenido / raw_maximo: puntos crudos.
--
-- Clasificación automática (normalizada 0-100):
--   score >= 70         → viable
--   40 <= score < 70    → potencial
--   score < 40          → no-viable
-- ============================================================================

USE radar_proyectos;

-- ── form_fields: puntos si el campo está completo (para texto/textarea/timeline)
ALTER TABLE form_fields
  ADD COLUMN IF NOT EXISTS puntaje_completo INT NOT NULL DEFAULT 0;

-- ── form_responses: score + veredicto + crudo
ALTER TABLE form_responses
  ADD COLUMN IF NOT EXISTS score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS veredicto ENUM('viable', 'potencial', 'no-viable') NOT NULL DEFAULT 'no-viable',
  ADD COLUMN IF NOT EXISTS raw_obtenido INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS raw_maximo INT NOT NULL DEFAULT 0,
  ADD INDEX IF NOT EXISTS idx_veredicto (veredicto),
  ADD INDEX IF NOT EXISTS idx_score (score);
