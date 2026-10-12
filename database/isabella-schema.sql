CREATE DATABASE IF NOT EXISTS breaze_in_the_moon
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE breaze_in_the_moon;

-- Esquema de referencia para las tres tablas de Isabella.
-- En el proyecto, TypeORM puede crear/actualizar estas tablas en desarrollo
-- cuando DB_SYNCHRONIZE=true. No ejecutar este archivo encima de tablas con datos
-- sin revisar primero el esquema existente.

CREATE TABLE IF NOT EXISTS plantas (
  id INT NOT NULL AUTO_INCREMENT,
  nombreComun VARCHAR(100) NOT NULL,
  nombreCientifico VARCHAR(150) NOT NULL,
  familiaBotanica VARCHAR(100) NOT NULL,
  tipoCultivo ENUM('hortaliza','frutal','cereal','ornamental','otro') NOT NULL,
  secuenciaGenetica TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_plantas_nombre_cientifico (nombreCientifico)
);

CREATE TABLE IF NOT EXISTS susceptibilidades (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  enfermedadId INT NOT NULL,
  nivel ENUM('baja','media','alta') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_susceptibilidad_planta_enfermedad (plantaId, enfermedadId)
);

CREATE TABLE IF NOT EXISTS cultivos (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  lote VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  fechaSiembra DATE NOT NULL,
  codigoGeneticoSemilla TEXT NOT NULL,
  PRIMARY KEY (id)
);
