-- ============================================================================
-- Radar de Proyectos — Schema v2 (Multiusuario + Formularios dinámicos)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS radar_proyectos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE radar_proyectos;

-- ============================================================================
-- TABLA: users (reemplaza admins)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('admin', 'evaluador') NOT NULL DEFAULT 'evaluador',
  activo          TINYINT DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login      TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ============================================================================
-- TABLA: sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  token           VARCHAR(128) PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  expires_at      TIMESTAMP NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
);

-- ============================================================================
-- TABLA: submissions (existente + columnas nuevas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS submissions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL,
  nombre_proyecto VARCHAR(200) DEFAULT NULL,
  sector          VARCHAR(100) DEFAULT NULL,
  descripcion     TEXT DEFAULT NULL,
  tweet           VARCHAR(280) DEFAULT NULL,
  como_resuelven  VARCHAR(100) DEFAULT NULL,
  dificultades    JSON DEFAULT NULL,
  urgencia        VARCHAR(100) DEFAULT NULL,
  madurez         VARCHAR(50) DEFAULT NULL,
  dispositivo     VARCHAR(50) DEFAULT NULL,
  uso_descripcion TEXT DEFAULT NULL,
  necesidades     JSON DEFAULT NULL,
  timeline        VARCHAR(50) DEFAULT NULL,
  presupuesto     VARCHAR(100) DEFAULT NULL,
  budget_score    TINYINT DEFAULT 0,
  equipo_interno  VARCHAR(100) DEFAULT NULL,
  team_score      TINYINT DEFAULT 0,
  notas           TEXT DEFAULT NULL,
  score           TINYINT UNSIGNED NOT NULL DEFAULT 0,
  veredicto       ENUM('startup', 'potencial', 'no-califica') NOT NULL,
  notas_evaluador TEXT DEFAULT NULL,
  revisado        TINYINT DEFAULT 0,
  email_enviado   TINYINT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_veredicto (veredicto),
  INDEX idx_score (score),
  INDEX idx_fecha (created_at),
  INDEX idx_revisado (revisado)
);

-- ============================================================================
-- TABLA: forms
-- ============================================================================
CREATE TABLE IF NOT EXISTS forms (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(200) NOT NULL,
  descripcion     TEXT DEFAULT NULL,
  estado          ENUM('borrador', 'publicado', 'archivado') NOT NULL DEFAULT 'borrador',
  created_by      INT UNSIGNED NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_estado (estado),
  INDEX idx_created_by (created_by)
);

-- ============================================================================
-- TABLA: form_fields
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_fields (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_id         INT UNSIGNED NOT NULL,
  paso            INT DEFAULT 1,
  orden           INT DEFAULT 0,
  tipo            ENUM('texto', 'textarea', 'chip-single', 'chip-multi', 'selector-grid', 'timeline', 'card-3') NOT NULL DEFAULT 'texto',
  label           VARCHAR(255) NOT NULL,
  descripcion     TEXT DEFAULT NULL,
  obligatorio     TINYINT DEFAULT 1,
  opciones        JSON DEFAULT NULL,
  max_seleccion   INT DEFAULT NULL,
  max_length      INT DEFAULT NULL,
  slug            VARCHAR(100) DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  INDEX idx_form_id (form_id),
  INDEX idx_paso (paso),
  INDEX idx_slug (slug)
);

-- ============================================================================
-- TABLA: form_responses
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_responses (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_id         INT UNSIGNED NOT NULL,
  nombre          VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL,
  respuestas      JSON NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  INDEX idx_form_id (form_id),
  INDEX idx_fecha (created_at)
);

-- ============================================================================
-- INSERTS INICIALES
-- ============================================================================

-- Admin por defecto (email: admin@radar.com, password: admin123)
INSERT INTO users (nombre, email, password_hash, role, activo) VALUES
('Administrador', 'admin@radar.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);
