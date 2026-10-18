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
(3, 'Maíz', 'Zea mays', 'Poaceae', 'cereal', 'TTGCAACCGGTT'),
(4, 'Café', 'Coffea arabica', 'Rubiaceae', 'otro', 'GGCATTACGCAT'),
(5, 'Banano', 'Musa paradisiaca', 'Musaceae', 'frutal', 'CCGTAAGGTCAA'),
(6, 'Rosa', 'Rosa hybrida', 'Rosaceae', 'ornamental', 'ATGCCGTAGGCT'),
(7, 'Arroz', 'Oryza sativa', 'Poaceae', 'cereal', 'GATTACAGATTA'),
(8, 'Fresa', 'Fragaria ananassa', 'Rosaceae', 'frutal', 'TACGGATCCAGT');

INSERT IGNORE INTO patogenos (id, nombre, nombreCientifico, tipo, transmision, secuenciaGenetica) VALUES
(1, 'Hongo del tizón temprano', 'Alternaria solani', 'hongo', 'viento y salpicaduras de agua', 'ACGTACGTAAAA'),
(2, 'Oomiceto del tizón tardío', 'Phytophthora infestans', 'oomiceto', 'agua y viento', 'ACGTACGTCCCC'),
(3, 'Virus del mosaico', 'Tomato mosaic virus', 'virus', 'contacto y herramientas contaminadas', 'TTGCAACCGGAA'),
(4, 'Hongo de la roya del cafeto', 'Hemileia vastatrix', 'hongo', 'viento y lluvia', 'CGTAGCTAGGAT'),
(5, 'Hongo de la sigatoka negra', 'Mycosphaerella fijiensis', 'hongo', 'viento y agua lluvia', 'TTAGCCGATCGA'),
(6, 'Mosca blanca', 'Bemisia tabaci', 'insecto', 'insectos vectores y plantas infestadas', 'ACCGTTAGGCAA'),
(7, 'Nematodo agallador', 'Meloidogyne incognita', 'nematodo', 'suelo y agua de riego', 'GGATCCATTGCA'),
(8, 'Bacteria del marchitamiento', 'Ralstonia solanacearum', 'bacteria', 'suelo, agua y herramientas', 'CATGGTCAAGCT');

INSERT IGNORE INTO enfermedades (id, nombre, descripcionSintomas, epocaRiesgo, patogenoId) VALUES
(1, 'Tizón temprano', 'Manchas oscuras concéntricas en hojas y amarillamiento progresivo.', 'verano', 1),
(2, 'Tizón tardío', 'Lesiones acuosas que se oscurecen y pueden afectar tallos y frutos.', 'todo el año', 2),
(3, 'Mosaico del tomate', 'Moteado verde claro y oscuro, deformación y reducción del crecimiento.', 'primavera', 3),
(4, 'Roya del café', 'Pústulas anaranjadas en el envés de las hojas y caída prematura del follaje.', 'otoño', 4),
(5, 'Sigatoka negra', 'Estrías y manchas negras en las hojas que reducen el área fotosintética.', 'todo el año', 5),
(6, 'Daño por mosca blanca', 'Amarillamiento, melaza y debilitamiento de la planta por la succión de savia.', 'verano', 6),
(7, 'Nudo radical', 'Agallas en las raíces, marchitez y bajo desarrollo de la planta.', 'todo el año', 7),
(8, 'Marchitez bacteriana', 'Marchitamiento súbito de la planta sin amarillamiento previo.', 'verano', 8),
(9, 'Mancha foliar por Alternaria', 'Manchas circulares marrones con halo amarillo en las hojas.', 'primavera', 1);

INSERT IGNORE INTO tratamientos (id, nombre, descripcionAplicacion, tipo, enfermedadId) VALUES
(1, 'Manejo preventivo del follaje', 'Retirar hojas afectadas, mejorar ventilación y evitar mojar el follaje.', 'cultural', 1),
(2, 'Control biológico preventivo', 'Aplicar un agente biológico autorizado siguiendo la etiqueta técnica.', 'biológico', 1),
(3, 'Manejo integrado del tizón tardío', 'Retirar plantas afectadas y aplicar únicamente productos autorizados según etiqueta.', 'químico', 2),
(4, 'Fungicida cúprico', 'Aplicar un fungicida a base de cobre autorizado, según la etiqueta técnica, en horas de baja radiación.', 'químico', 4),
(5, 'Variedades resistentes', 'Renovar el lote con variedades de café resistentes a la roya y mantener un sombrío adecuado.', 'cultural', 4),
(6, 'Deshoje sanitario', 'Retirar y destruir las hojas con lesiones avanzadas para reducir la fuente de infección.', 'cultural', 5),
(7, 'Aplicación de Trichoderma', 'Aplicar Trichoderma al suelo y al follaje según la dosis indicada por el fabricante.', 'biológico', 9),
(8, 'Control biológico de mosca blanca', 'Liberar parasitoides del género Encarsia y usar trampas cromáticas amarillas.', 'biológico', 6),
(9, 'Rotación de cultivos', 'Rotar con gramíneas durante al menos dos ciclos para reducir los nematodos en el suelo.', 'cultural', 7),
(10, 'Nematicida biológico', 'Aplicar hongos nematófagos al suelo antes de la siembra según la etiqueta.', 'biológico', 7),
(11, 'Desinfección de herramientas y calzado', 'Desinfectar herramientas y calzado entre lotes y eliminar las plantas marchitas.', 'cultural', 8),
(12, 'Higiene de manos y herramientas', 'Lavar manos y herramientas con solución desinfectante y retirar las plantas con síntomas.', 'cultural', 3);

INSERT IGNORE INTO susceptibilidades (id, plantaId, enfermedadId, nivel) VALUES
(1, 1, 1, 'alta'),
(2, 2, 2, 'alta'),
(3, 1, 3, 'media'),
(4, 3, 1, 'baja'),
(5, 4, 4, 'alta'),
(6, 5, 5, 'alta'),
(7, 1, 6, 'media'),
(8, 6, 6, 'alta'),
(9, 2, 7, 'media'),
(10, 1, 7, 'alta'),
(11, 2, 8, 'alta'),
(12, 1, 8, 'media'),
(13, 6, 9, 'alta'),
(14, 8, 9, 'media'),
(15, 2, 1, 'media'),
(16, 1, 2, 'alta');

-- Cultivos: el 1, 2, 5 y 8 no tienen mutaciones; el 3, 4 y 6 sí (1, 1 y 2 mutaciones).
-- El cultivo 7 tiene una semilla de longitud distinta a la referencia, a propósito,
-- para demostrar el error de longitudes distintas en la verificación de mutaciones.
INSERT IGNORE INTO cultivos (id, plantaId, lote, region, fechaSiembra, codigoGeneticoSemilla) VALUES
(1, 1, 'Lote-TOM-01', 'Caldas', '2025-02-10', 'ACGTACGTACGT'),
(2, 2, 'Lote-PAP-02', 'Antioquia', '2025-03-15', 'ACGTTCGTACGT'),
(3, 3, 'Lote-MAI-03', 'Risaralda', '2025-01-20', 'TTGCAACCGGTA'),
(4, 4, 'Finca La Esperanza', 'Caldas', '2025-08-05', 'GGCATTACGCAA'),
(5, 5, 'Finca El Edén', 'Antioquia', '2025-09-12', 'CCGTAAGGTCAA'),
(6, 6, 'Invernadero Rosas-02', 'Cundinamarca', '2025-10-01', 'ATGCCGTTGGCA'),
(7, 1, 'Lote-TOM-07', 'Valle del Cauca', '2026-02-20', 'ACGTACGTACG'),
(8, 7, 'Lote-ARR-04', 'Tolima', '2026-03-10', 'GATTACAGATTA');

INSERT IGNORE INTO brotes (id, plantaId, enfermedadId, fecha, region, hectareasAfectadas) VALUES
(1, 1, 1, '2025-04-10', 'Caldas', 2.50),
(2, 2, 2, '2025-05-18', 'Antioquia', 1.25),
(3, 1, 3, '2025-06-03', 'Caldas', 0.75),
(4, 3, 1, '2025-06-20', 'Risaralda', 3.00),
(5, 4, 4, '2025-09-14', 'Caldas', 4.20),
(6, 4, 4, '2025-10-22', 'Risaralda', 2.80),
(7, 4, 4, '2025-11-05', 'Caldas', 5.10),
(8, 5, 5, '2025-08-30', 'Antioquia', 6.40),
(9, 5, 5, '2025-12-02', 'Antioquia', 3.90),
(10, 1, 6, '2026-01-15', 'Valle del Cauca', 1.80),
(11, 6, 6, '2026-02-10', 'Cundinamarca', 0.60),
(12, 2, 7, '2026-02-25', 'Antioquia', 2.20),
(13, 1, 7, '2026-03-18', 'Valle del Cauca', 1.10),
(14, 2, 8, '2026-04-07', 'Cundinamarca', 1.75),
(15, 1, 8, '2026-05-12', 'Tolima', 0.95),
(16, 6, 9, '2026-05-28', 'Cundinamarca', 0.45),
(17, 8, 9, '2026-06-14', 'Cundinamarca', 0.80),
(18, 1, 2, '2026-07-03', 'Caldas', 2.10),
(19, 2, 2, '2026-07-21', 'Antioquia', 3.35),
(20, 1, 1, '2026-08-09', 'Valle del Cauca', 1.60),
(21, 3, 1, '2026-09-02', 'Risaralda', 2.45),
(22, 1, 3, '2026-09-16', 'Caldas', 0.55);
