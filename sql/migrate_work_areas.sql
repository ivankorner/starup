-- ============================================================================
-- Migración: áreas de trabajo para usuarios
-- Ejecutar sobre la base ya existente antes o después del deploy
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_areas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(120) NOT NULL UNIQUE,
  activo          TINYINT DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS area_id INT UNSIGNED NULL AFTER role;

ALTER TABLE users
  ADD INDEX idx_area_id (area_id);

ALTER TABLE users
  ADD CONSTRAINT fk_users_work_area
  FOREIGN KEY (area_id) REFERENCES work_areas(id) ON DELETE SET NULL;

INSERT IGNORE INTO work_areas (nombre, activo) VALUES
('OCE', 1),
('Conocimiento', 1),
('Negocios', 1),
('Comunicación', 1),
('IDi', 1);