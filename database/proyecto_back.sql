CREATE DATABASE IF NOT EXISTS proyecto_back
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE proyecto_back;

-- =====================================================
-- ISABELLA: plantas, susceptibilidades y cultivos
-- =====================================================

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS susceptibilidades (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  enfermedadId INT NOT NULL,
  nivel ENUM('baja', 'media', 'alta') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_susceptibilidad_planta_enfermedad (plantaId, enfermedadId),
  KEY IDX_susceptibilidades_enfermedadId (enfermedadId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cultivos (
  id INT NOT NULL AUTO_INCREMENT,
  plantaId INT NOT NULL,
  lote VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  fechaSiembra DATE NOT NULL,
  codigoGeneticoSemilla TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_cultivos_plantaId (plantaId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ISAAC: patogenos, enfermedades y tratamientos
-- =====================================================

CREATE TABLE IF NOT EXISTS patogenos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  nombreCientifico VARCHAR(150) NOT NULL,
  tipo ENUM('virus', 'hongo', 'oomiceto', 'bacteria', 'insecto', 'nematodo') NOT NULL,
  transmision VARCHAR(150) NOT NULL,
  secuenciaGenetica TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UQ_patogenos_nombre_cientifico (nombreCientifico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enfermedades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcionSintomas TEXT NOT NULL,
  epocaRiesgo ENUM('primavera', 'verano', 'otoño', 'invierno', 'todo el año') NOT NULL,
  patogenoId INT NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_enfermedades_patogenoId (patogenoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tratamientos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcionAplicacion TEXT NOT NULL,
  tipo ENUM('químico', 'biológico', 'cultural') NOT NULL,
  enfermedadId INT NOT NULL,
  PRIMARY KEY (id),
  KEY IDX_tratamientos_enfermedadId (enfermedadId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- JULIANA: brotes
-- =====================================================

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Normalizar ENUMs si la base ya existía con las variantes anteriores.
ALTER TABLE enfermedades MODIFY epocaRiesgo
  ENUM('primavera', 'verano', 'otoño', 'invierno', 'todo_el_año', 'todo el año') NOT NULL;
UPDATE enfermedades SET epocaRiesgo = 'todo el año' WHERE epocaRiesgo = 'todo_el_año';
ALTER TABLE enfermedades MODIFY epocaRiesgo
  ENUM('primavera', 'verano', 'otoño', 'invierno', 'todo el año') NOT NULL;

ALTER TABLE tratamientos MODIFY tipo
  ENUM('quimico', 'biologico', 'químico', 'biológico', 'cultural') NOT NULL;
UPDATE tratamientos SET tipo = 'químico' WHERE tipo = 'quimico';
UPDATE tratamientos SET tipo = 'biológico' WHERE tipo = 'biologico';
ALTER TABLE tratamientos MODIFY tipo
  ENUM('químico', 'biológico', 'cultural') NOT NULL;

-- =====================================================
-- DATOS DE EJEMPLO PARA LA SUSTENTACIÓN
-- Se pueden volver a insertar solo después de limpiar las tablas.
-- Los IDs explícitos permiten que las referencias sean reproducibles.
-- =====================================================
INSERT IGNORE INTO plantas (id, nombreComun, nombreCientifico, familiaBotanica, tipoCultivo, secuenciaGenetica) VALUES
(1, 'Tomate', 'Solanum lycopersicum', 'Solanaceae', 'hortaliza', 'ACGTACGTACGT'),
(2, 'Papa', 'Solanum tuberosum', 'Solanaceae', 'hortaliza', 'ACGTTCGTACGT'),
(3, 'Maíz', 'Zea mays', 'Poaceae', 'cereal', 'TTGCAACCGGTT');

INSERT IGNORE INTO patogenos (id, nombre, nombreCientifico, tipo, transmision, secuenciaGenetica) VALUES
(1, 'Hongo del tizón temprano', 'Alternaria solani', 'hongo', 'viento y salpicaduras de agua', 'ACGTACGTAAAA'),
(2, 'Oomiceto del tizón tardío', 'Phytophthora infestans', 'oomiceto', 'agua y viento', 'ACGTACGTCCCC'),
(3, 'Virus del mosaico', 'Tomato mosaic virus', 'virus', 'contacto y herramientas contaminadas', 'TTGCAACCGGAA');

INSERT IGNORE INTO enfermedades (id, nombre, descripcionSintomas, epocaRiesgo, patogenoId) VALUES
(1, 'Tizón temprano', 'Manchas oscuras concéntricas en hojas y amarillamiento progresivo.', 'verano', 1),
(2, 'Tizón tardío', 'Lesiones acuosas que se oscurecen y pueden afectar tallos y frutos.', 'todo el año', 2),
(3, 'Mosaico del tomate', 'Moteado verde claro y oscuro, deformación y reducción del crecimiento.', 'primavera', 3);

INSERT IGNORE INTO tratamientos (id, nombre, descripcionAplicacion, tipo, enfermedadId) VALUES
(1, 'Manejo preventivo del follaje', 'Retirar hojas afectadas, mejorar ventilación y evitar mojar el follaje.', 'cultural', 1),
(2, 'Control biológico preventivo', 'Aplicar un agente biológico autorizado siguiendo la etiqueta técnica.', 'biológico', 1),
(3, 'Manejo integrado del tizón tardío', 'Retirar plantas afectadas y aplicar únicamente productos autorizados según etiqueta.', 'químico', 2);

INSERT IGNORE INTO susceptibilidades (id, plantaId, enfermedadId, nivel) VALUES
(1, 1, 1, 'alta'),
(2, 2, 2, 'alta'),
(3, 1, 3, 'media'),
(4, 3, 1, 'baja');

INSERT IGNORE INTO cultivos (id, plantaId, lote, region, fechaSiembra, codigoGeneticoSemilla) VALUES
(1, 1, 'Lote-TOM-01', 'Caldas', '2025-02-10', 'ACGTACGTACGT'),
(2, 2, 'Lote-PAP-02', 'Antioquia', '2025-03-15', 'ACGTTCGTACGT'),
(3, 3, 'Lote-MAI-03', 'Risaralda', '2025-01-20', 'TTGCAACCGGTA');

INSERT IGNORE INTO brotes (id, plantaId, enfermedadId, fecha, region, hectareasAfectadas) VALUES
(1, 1, 1, '2025-04-10', 'Caldas', 2.50),
(2, 2, 2, '2025-05-18', 'Antioquia', 1.25),
(3, 1, 3, '2025-06-03', 'Caldas', 0.75),
(4, 3, 1, '2025-06-20', 'Risaralda', 3.00);
