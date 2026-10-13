CREATE DATABASE IF NOT EXISTS proyecto_back
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE proyecto_back;

-- plantas, susceptibilidades y cultivos

CREATE TABLE IF NOT EXISTS plantas (
  id INT NOT NULL AUTO_INCREMENT,
  nombreComun VARCHAR(100) NOT NULL,
  nombreCientifico VARCHAR(150) NOT NULL,
  familiaBotanica VARCHAR(100) NOT NULL,
  tipoCultivo ENUM(
    'hortaliza',
    'frutal',
    'cereal',
    'ornamental',
    'otro'
  ) NOT NULL,
  secuenciaGenetica TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_plantas_nombre_cientifico (nombreCientifico)
);

CREATE TABLE IF NOT EXISTS susceptibilidades (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  enfermedadId INT NOT NULL,
  nivel ENUM('baja', 'media', 'alta') NOT NULL,
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

-- patogenos, enfermedades y tratamientos

CREATE TABLE IF NOT EXISTS patogenos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  nombreCientifico VARCHAR(150) NOT NULL,
  tipo ENUM('virus','hongo','oomiceto','bacteria','insecto','nematodo') NOT NULL,
  transmision VARCHAR(150) NOT NULL,
  secuenciaGenetica TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_patogenos_nombre_cientifico (nombreCientifico)
);

CREATE TABLE IF NOT EXISTS enfermedades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcionSintomas TEXT NOT NULL,
  epocaRiesgo ENUM('primavera','verano','otoño','invierno','todo_el_año') NOT NULL,
  patogenoId INT NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_enfermedades_patogenoId (patogenoId)
);

CREATE TABLE IF NOT EXISTS tratamientos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcionAplicacion TEXT NOT NULL,
  tipo ENUM('quimico','biologico','cultural') NOT NULL,
  enfermedadId INT NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_tratamientos_enfermedadId (enfermedadId)
);


-- brotes

CREATE TABLE IF NOT EXISTS brotes (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  enfermedadId INT NOT NULL,
  fecha DATE NOT NULL,
  region VARCHAR(100) NOT NULL,
  hectareasAfectadas DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_brotes_plantaId (plantaId),
  KEY IDX_brotes_enfermedadId (enfermedadId),
  KEY IDX_brotes_fecha (fecha),
  KEY IDX_brotes_region (region)
);

-- Nota: las referencias entre entidades se gestionan manualmente desde NestJS;
-- por eso este esquema conserva los IDs sin restricciones FOREIGN KEY.
