CREATE DATABASE IF NOT EXISTS radar_proyectos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE radar_proyectos;

CREATE TABLE submissions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(200) NOT NULL,
  email        VARCHAR(200) NOT NULL,
  nombre_proyecto VARCHAR(200) DEFAULT NULL,
  sector       VARCHAR(100) DEFAULT NULL,
  descripcion  TEXT DEFAULT NULL,
  tweet        VARCHAR(280) DEFAULT NULL,
  como_resuelven VARCHAR(100) DEFAULT NULL,
  dificultades JSON DEFAULT NULL,
  urgencia     VARCHAR(100) DEFAULT NULL,
  madurez      VARCHAR(50) DEFAULT NULL,
  dispositivo  VARCHAR(50) DEFAULT NULL,
  uso_descripcion TEXT DEFAULT NULL,
  necesidades  JSON DEFAULT NULL,
  timeline     VARCHAR(50) DEFAULT NULL,
  presupuesto  VARCHAR(100) DEFAULT NULL,
  budget_score TINYINT DEFAULT 0,
  equipo_interno VARCHAR(100) DEFAULT NULL,
  team_score   TINYINT DEFAULT 0,
  notas        TEXT DEFAULT NULL,
  score        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  veredicto    ENUM('startup','potencial','no-califica') NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_veredicto (veredicto),
  INDEX idx_score (score),
  INDEX idx_fecha (created_at)
);

CREATE TABLE admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin por defecto (password: admin123 — cambiar en producción)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  step VARCHAR(20) NOT NULL UNIQUE,
  image_path VARCHAR(300) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO banners (step) VALUES ('intro'), ('1'), ('2'), ('3'), ('4'), ('5');
