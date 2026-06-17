-- Migracion aditiva: no elimina tablas, columnas ni datos existentes.
-- Ejecutar una sola vez en la base de datos remota antes de desplegar el frontend.

ALTER TABLE form_responses
  ADD COLUMN estado_proyecto ENUM('recepcionado', 'pendiente_revision', 'derivado', 'leido', 'en_analisis', 'solicita_informacion', 'en_proceso', 'aprobado', 'rechazado', 'implementado', 'archivado') NOT NULL DEFAULT 'recepcionado' AFTER respuestas,
  ADD COLUMN designado_user_id INT UNSIGNED DEFAULT NULL AFTER estado_proyecto,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

ALTER TABLE form_responses
  ADD INDEX idx_estado_proyecto (estado_proyecto),
  ADD INDEX idx_designado_user_id (designado_user_id);

ALTER TABLE form_responses
  ADD CONSTRAINT fk_form_responses_designado_user_id
  FOREIGN KEY (designado_user_id) REFERENCES users(id) ON DELETE SET NULL;