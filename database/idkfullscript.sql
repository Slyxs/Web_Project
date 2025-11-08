-- SQL para crear la base de datos y tablas principales de la web de doctores en línea
-- Codificación: utf8mb4

CREATE DATABASE IF NOT EXISTS web_project
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE web_project;

-- Tabla principal de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tipo ENUM('paciente', 'doctor', 'admin') NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  fecha_nacimiento DATE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- Tabla de doctores
CREATE TABLE IF NOT EXISTS doctores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  descripcion TEXT,
  numero_licencia VARCHAR(50) UNIQUE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB;

-- Tabla de especialidades médicas
CREATE TABLE IF NOT EXISTS especialidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB;

-- Relación doctores-especialidades (muchos a muchos)
CREATE TABLE IF NOT EXISTS doctor_especialidad (
  doctor_id INT NOT NULL,
  especialidad_id INT NOT NULL,
  PRIMARY KEY (doctor_id, especialidad_id),
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  FOREIGN KEY (especialidad_id) REFERENCES especialidades(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de disponibilidad de doctores
CREATE TABLE IF NOT EXISTS disponibilidad_doctor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  dia_semana ENUM('lunes','martes','miércoles','jueves','viernes','sábado','domingo') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  INDEX idx_doctor_dia (doctor_id, dia_semana)
) ENGINE=InnoDB;

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
  motivo TEXT,
  notas_doctor TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  INDEX idx_paciente (paciente_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_fecha (fecha_hora),
  INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NOT NULL,
  remitente_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (remitente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_cita (cita_id),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB;

-- Tabla de valoraciones
CREATE TABLE IF NOT EXISTS valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  paciente_id INT NOT NULL,
  cita_id INT,
  puntuacion TINYINT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
  comentario TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_valoracion (doctor_id, paciente_id, cita_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_puntuacion (puntuacion)
) ENGINE=InnoDB;

-- Tabla de historial médico del paciente
CREATE TABLE IF NOT EXISTS historial_medico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT,
  cita_id INT,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE SET NULL,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  INDEX idx_paciente (paciente_id),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('cita', 'mensaje', 'pago', 'sistema') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_leido (usuario_id, leido),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB;

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NOT NULL,
  paciente_id INT NOT NULL,
  doctor_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
  estado ENUM('pendiente','pagado','fallido','reembolsado') DEFAULT 'pendiente',
  fecha_pago DATETIME,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  INDEX idx_cita (cita_id),
  INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pago_id INT NOT NULL UNIQUE,
  numero_factura VARCHAR(50) NOT NULL UNIQUE,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pago_id) REFERENCES pagos(id) ON DELETE CASCADE,
  INDEX idx_numero (numero_factura)
) ENGINE=InnoDB;


-- Recomendado: ejecutar en este orden con la BD web_project seleccionada
USE web_project;
START TRANSACTION;
-- 1) Especialidades (las que enviaste)
INSERT INTO especialidades (nombre) VALUES
('Dermatólogo'),
('Médico general'),
('Pediatra'),
('Cirujano'),
('Neurólogo'),
('Psiquiatra'),
('Oncólogo'),
('Cardiólogo'),
('Cirujano ortopédico'),
('Radiólogo'),
('Anestesiólogo'),
('Endocrinólogo'),
('Gastroenterólogo'),
('Oftalmólogo'),
('Patólogo'),
('Neumólogo'),
('Oftalmología'),
('Odontólogo'),
('Podólogos'),
('Reumatólogo'),
('Otorrinolaringología'),
('Medicina interna'),
('Otorrinolaringólogo'),
('Dermatología');
-- 2) Usuarios: 25 doctores (1-25), 25 pacientes (26-50), 1 admin (51)
-- Password genérico (placeholder); en práctica usa password_hash() en PHP
INSERT INTO usuarios (id, nombre, email, password, tipo, telefono, direccion, fecha_nacimiento)
VALUES
-- Doctores (id 1..25)
(1,'Dr. Ana Torres','dr1@example.com','$2y$10$demoHashedPassword','doctor','555-0001','Calle Salud 1, Ciudad','1980-01-15'),
(2,'Dr. Bruno Díaz','dr2@example.com','$2y$10$demoHashedPassword','doctor','555-0002','Calle Salud 2, Ciudad','1979-02-20'),
(3,'Dr. Carla Ruiz','dr3@example.com','$2y$10$demoHashedPassword','doctor','555-0003','Calle Salud 3, Ciudad','1982-03-12'),
(4,'Dr. Diego Pérez','dr4@example.com','$2y$10$demoHashedPassword','doctor','555-0004','Calle Salud 4, Ciudad','1981-04-18'),
(5,'Dr. Elena Gómez','dr5@example.com','$2y$10$demoHashedPassword','doctor','555-0005','Calle Salud 5, Ciudad','1983-05-22'),
(6,'Dr. Fernando León','dr6@example.com','$2y$10$demoHashedPassword','doctor','555-0006','Calle Salud 6, Ciudad','1978-06-30'),
(7,'Dr. Gabriela Soto','dr7@example.com','$2y$10$demoHashedPassword','doctor','555-0007','Calle Salud 7, Ciudad','1984-07-09'),
(8,'Dr. Héctor Vela','dr8@example.com','$2y$10$demoHashedPassword','doctor','555-0008','Calle Salud 8, Ciudad','1977-08-14'),
(9,'Dr. Inés Pardo','dr9@example.com','$2y$10$demoHashedPassword','doctor','555-0009','Calle Salud 9, Ciudad','1985-09-25'),
(10,'Dr. Javier Mora','dr10@example.com','$2y$10$demoHashedPassword','doctor','555-0010','Calle Salud 10, Ciudad','1976-10-11'),
(11,'Dr. Karla Ríos','dr11@example.com','$2y$10$demoHashedPassword','doctor','555-0011','Calle Salud 11, Ciudad','1986-11-05'),
(12,'Dr. Luis Cano','dr12@example.com','$2y$10$demoHashedPassword','doctor','555-0012','Calle Salud 12, Ciudad','1975-12-19'),
(13,'Dr. Mariana Paz','dr13@example.com','$2y$10$demoHashedPassword','doctor','555-0013','Calle Salud 13, Ciudad','1987-01-07'),
(14,'Dr. Nicolás Gil','dr14@example.com','$2y$10$demoHashedPassword','doctor','555-0014','Calle Salud 14, Ciudad','1988-02-16'),
(15,'Dr. Olivia Cruz','dr15@example.com','$2y$10$demoHashedPassword','doctor','555-0015','Calle Salud 15, Ciudad','1989-03-03'),
(16,'Dr. Pablo Lara','dr16@example.com','$2y$10$demoHashedPassword','doctor','555-0016','Calle Salud 16, Ciudad','1974-04-27'),
(17,'Dr. Queralt Rey','dr17@example.com','$2y$10$demoHashedPassword','doctor','555-0017','Calle Salud 17, Ciudad','1990-05-13'),
(18,'Dr. Raúl Nieto','dr18@example.com','$2y$10$demoHashedPassword','doctor','555-0018','Calle Salud 18, Ciudad','1973-06-06'),
(19,'Dr. Silvia Vidal','dr19@example.com','$2y$10$demoHashedPassword','doctor','555-0019','Calle Salud 19, Ciudad','1991-07-21'),
(20,'Dr. Tomás Ibáñez','dr20@example.com','$2y$10$demoHashedPassword','doctor','555-0020','Calle Salud 20, Ciudad','1972-08-28'),
(21,'Dr. Úrsula Peña','dr21@example.com','$2y$10$demoHashedPassword','doctor','555-0021','Calle Salud 21, Ciudad','1992-09-17'),
(22,'Dr. Víctor Roa','dr22@example.com','$2y$10$demoHashedPassword','doctor','555-0022','Calle Salud 22, Ciudad','1971-10-04'),
(23,'Dr. Wendy Sol','dr23@example.com','$2y$10$demoHashedPassword','doctor','555-0023','Calle Salud 23, Ciudad','1993-11-29'),
(24,'Dr. Xavier Quesada','dr24@example.com','$2y$10$demoHashedPassword','doctor','555-0024','Calle Salud 24, Ciudad','1970-12-08'),
(25,'Dr. Yolanda Vera','dr25@example.com','$2y$10$demoHashedPassword','doctor','555-0025','Calle Salud 25, Ciudad','1994-01-26'),
-- Pacientes (id 26..50)
(26,'Paciente 1','pac1@example.com','$2y$10$demoHashedPassword','paciente','555-1001','Calle Paciente 1, Ciudad','1995-01-10'),
(27,'Paciente 2','pac2@example.com','$2y$10$demoHashedPassword','paciente','555-1002','Calle Paciente 2, Ciudad','1996-02-11'),
(28,'Paciente 3','pac3@example.com','$2y$10$demoHashedPassword','paciente','555-1003','Calle Paciente 3, Ciudad','1997-03-12'),
(29,'Paciente 4','pac4@example.com','$2y$10$demoHashedPassword','paciente','555-1004','Calle Paciente 4, Ciudad','1998-04-13'),
(30,'Paciente 5','pac5@example.com','$2y$10$demoHashedPassword','paciente','555-1005','Calle Paciente 5, Ciudad','1999-05-14'),
(31,'Paciente 6','pac6@example.com','$2y$10$demoHashedPassword','paciente','555-1006','Calle Paciente 6, Ciudad','1990-06-15'),
(32,'Paciente 7','pac7@example.com','$2y$10$demoHashedPassword','paciente','555-1007','Calle Paciente 7, Ciudad','1991-07-16'),
(33,'Paciente 8','pac8@example.com','$2y$10$demoHashedPassword','paciente','555-1008','Calle Paciente 8, Ciudad','1992-08-17'),
(34,'Paciente 9','pac9@example.com','$2y$10$demoHashedPassword','paciente','555-1009','Calle Paciente 9, Ciudad','1993-09-18'),
(35,'Paciente 10','pac10@example.com','$2y$10$demoHashedPassword','paciente','555-1010','Calle Paciente 10, Ciudad','1994-10-19'),
(36,'Paciente 11','pac11@example.com','$2y$10$demoHashedPassword','paciente','555-1011','Calle Paciente 11, Ciudad','1989-11-20'),
(37,'Paciente 12','pac12@example.com','$2y$10$demoHashedPassword','paciente','555-1012','Calle Paciente 12, Ciudad','1988-12-21'),
(38,'Paciente 13','pac13@example.com','$2y$10$demoHashedPassword','paciente','555-1013','Calle Paciente 13, Ciudad','1987-01-22'),
(39,'Paciente 14','pac14@example.com','$2y$10$demoHashedPassword','paciente','555-1014','Calle Paciente 14, Ciudad','1986-02-23'),
(40,'Paciente 15','pac15@example.com','$2y$10$demoHashedPassword','paciente','555-1015','Calle Paciente 15, Ciudad','1985-03-24'),
(41,'Paciente 16','pac16@example.com','$2y$10$demoHashedPassword','paciente','555-1016','Calle Paciente 16, Ciudad','1984-04-25'),
(42,'Paciente 17','pac17@example.com','$2y$10$demoHashedPassword','paciente','555-1017','Calle Paciente 17, Ciudad','1983-05-26'),
(43,'Paciente 18','pac18@example.com','$2y$10$demoHashedPassword','paciente','555-1018','Calle Paciente 18, Ciudad','1982-06-27'),
(44,'Paciente 19','pac19@example.com','$2y$10$demoHashedPassword','paciente','555-1019','Calle Paciente 19, Ciudad','1981-07-28'),
(45,'Paciente 20','pac20@example.com','$2y$10$demoHashedPassword','paciente','555-1020','Calle Paciente 20, Ciudad','1980-08-29'),
(46,'Paciente 21','pac21@example.com','$2y$10$demoHashedPassword','paciente','555-1021','Calle Paciente 21, Ciudad','1979-09-30'),
(47,'Paciente 22','pac22@example.com','$2y$10$demoHashedPassword','paciente','555-1022','Calle Paciente 22, Ciudad','1978-10-01'),
(48,'Paciente 23','pac23@example.com','$2y$10$demoHashedPassword','paciente','555-1023','Calle Paciente 23, Ciudad','1977-11-02'),
(49,'Paciente 24','pac24@example.com','$2y$10$demoHashedPassword','paciente','555-1024','Calle Paciente 24, Ciudad','1976-12-03'),
(50,'Paciente 25','pac25@example.com','$2y$10$demoHashedPassword','paciente','555-1025','Calle Paciente 25, Ciudad','1975-01-04'),

-- Admin (id 51)
(51,'Admin Principal','admin@example.com','$2y$10$demoHashedPassword','admin','555-2000','Av. Central 100, Ciudad','1970-01-01');

-- 3) Doctores (ids 1..25) mapeando a usuarios 1..25
INSERT INTO doctores (id, usuario_id, descripcion, numero_licencia) VALUES
(1, 1, 'Especialista con 10 años de experiencia', 'LIC-0001'),
(2, 2, 'Atención integral y preventiva', 'LIC-0002'),
(3, 3, 'Enfoque en diagnóstico temprano', 'LIC-0003'),
(4, 4, 'Cirugía general y laparoscópica', 'LIC-0004'),
(5, 5, 'Tratamientos personalizados', 'LIC-0005'),
(6, 6, 'Docente universitario', 'LIC-0006'),
(7, 7, 'Investigación clínica', 'LIC-0007'),
(8, 8, 'Experto en urgencias', 'LIC-0008'),
(9, 9, 'Enfoque en medicina familiar', 'LIC-0009'),
(10, 10, 'Experiencia en UCI y cuidados críticos', 'LIC-0010'),
(11, 11, 'Neurodiagnóstico y manejo avanzado', 'LIC-0011'),
(12, 12, 'Salud mental y terapia integral', 'LIC-0012'),
(13, 13, 'Tracto digestivo y endoscopía', 'LIC-0013'),
(14, 14, 'Cirugía y cuidado ocular', 'LIC-0014'),
(15, 15, 'Análisis histopatológico', 'LIC-0015'),
(16, 16, 'Afecciones respiratorias crónicas', 'LIC-0016'),
(17, 17, 'Vía aérea superior y audición', 'LIC-0017'),
(18, 18, 'Otorrinolaringología avanzada', 'LIC-0018'),
(19, 19, 'Odontología general y preventiva', 'LIC-0019'),
(20, 20, 'Enfermedades autoinmunes', 'LIC-0020'),
(21, 21, 'Medicina general y seguimiento', 'LIC-0021'),
(22, 22, 'Cirugía mínimamente invasiva', 'LIC-0022'),
(23, 23, 'Trastornos del sistema nervioso', 'LIC-0023'),
(24, 24, 'Oncología clínica', 'LIC-0024'),
(25, 25, 'Cardiología clínica y preventiva', 'LIC-0025');
-- 4) Relación doctores-especialidades (al menos 25 filas)
-- IDs de especialidades según inserción previa:
-- 1 Dermatólogo, 2 Médico general, 3 Pediatra, 4 Cirujano, 5 Neurólogo, 6 Psiquiatra,
-- 7 Oncólogo, 8 Cardiólogo, 9 Cirujano ortopédico, 10 Radiólogo, 11 Anestesiólogo,
-- 12 Endocrinólogo, 13 Gastroenterólogo, 14 Oftalmólogo, 15 Patólogo, 16 Neumólogo,
-- 17 Oftalmología, 18 Odontólogo, 19 Podólogos, 20 Reumatólogo, 21 Otorrinolaringología,
-- 22 Medicina interna, 23 Otorrinolaringólogo, 24 Dermatología
INSERT INTO doctor_especialidad (doctor_id, especialidad_id) VALUES
(1, 1), (1, 24),
(2, 2), (2, 22),
(3, 3),
(4, 4), (4, 11),
(5, 8),
(6, 12),
(7, 7),
(8, 9),
(9, 22),
(10, 10),
(11, 5),
(12, 6),
(13, 13),
(14, 14), (14, 17),
(15, 15),
(16, 16),
(17, 21),
(18, 23),
(19, 18),
(20, 20),
(21, 2),
(22, 4),
(23, 5),
(24, 7),
(25, 8);
-- 5) Disponibilidad de doctores (al menos 25 filas, 1 por doctor)
INSERT INTO disponibilidad_doctor (doctor_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 'lunes', '09:00:00', '17:00:00'),
(2, 'martes', '09:00:00', '17:00:00'),
(3, 'miércoles', '09:00:00', '17:00:00'),
(4, 'jueves', '09:00:00', '17:00:00'),
(5, 'viernes', '09:00:00', '17:00:00'),
(6, 'sábado', '10:00:00', '14:00:00'),
(7, 'domingo', '10:00:00', '14:00:00'),
(8, 'lunes', '09:00:00', '17:00:00'),
(9, 'martes', '09:00:00', '17:00:00'),
(10, 'miércoles', '09:00:00', '17:00:00'),
(11, 'jueves', '09:00:00', '17:00:00'),
(12, 'viernes', '09:00:00', '17:00:00'),
(13, 'sábado', '10:00:00', '14:00:00'),
(14, 'domingo', '10:00:00', '14:00:00'),
(15, 'lunes', '09:00:00', '17:00:00'),
(16, 'martes', '09:00:00', '17:00:00'),
(17, 'miércoles', '09:00:00', '17:00:00'),
(18, 'jueves', '09:00:00', '17:00:00'),
(19, 'viernes', '09:00:00', '17:00:00'),
(20, 'sábado', '10:00:00', '14:00:00'),
(21, 'domingo', '10:00:00', '14:00:00'),
(22, 'lunes', '09:00:00', '17:00:00'),
(23, 'martes', '09:00:00', '17:00:00'),
(24, 'miércoles', '09:00:00', '17:00:00'),
(25, 'jueves', '09:00:00', '17:00:00');
-- 6) Citas (25 filas) paciente 26..50 con doctor 1..25
INSERT INTO citas (paciente_id, doctor_id, fecha_hora, estado, motivo, notas_doctor) VALUES
(26, 1, '2025-11-10 09:00:00', 'completada', 'Control general', 'Todo estable'),
(27, 2, '2025-11-10 09:30:00', 'completada', 'Dolor de cabeza', 'Posible tensión muscular'),
(28, 3, '2025-11-10 10:00:00', 'completada', 'Chequeo pediátrico', 'Crecimiento dentro de percentiles'),
(29, 4, '2025-11-10 10:30:00', 'completada', 'Evaluación prequirúrgica', 'Apto para cirugía'),
(30, 5, '2025-11-10 11:00:00', 'completada', 'Palpitaciones', 'Pedir ECG y Holter'),
(31, 6, '2025-11-10 11:30:00', 'completada', 'Fatiga', 'Revisar TSH, T3, T4'),
(32, 7, '2025-11-10 12:00:00', 'completada', 'Dolor persistente', 'Programar biopsia'),
(33, 8, '2025-11-10 12:30:00', 'completada', 'Dolor rodilla', 'Fisioterapia 6 semanas'),
(34, 9, '2025-11-10 13:00:00', 'completada', 'Control de hipertensión', 'Ajuste de dosis'),
(35, 10, '2025-11-10 13:30:00', 'completada', 'Lectura de Rayos X', 'Sin fracturas'),
(36, 11, '2025-11-10 14:00:00', 'completada', 'Migrañas', 'Iniciar profilaxis'),
(37, 12, '2025-11-10 14:30:00', 'completada', 'Ansiedad', 'Terapia cognitivo-conductual'),
(38, 13, '2025-11-10 15:00:00', 'completada', 'Reflujo', 'Omeprazol 20mg'),
(39, 14, '2025-11-10 15:30:00', 'completada', 'Visión borrosa', 'Recetar lentes'),
(40, 15, '2025-11-10 16:00:00', 'completada', 'Biopsia', 'Lesión benigna'),
(41, 16, '2025-11-10 16:30:00', 'completada', 'Tos crónica', 'Espirometría'),
(42, 17, '2025-11-10 17:00:00', 'completada', 'Otalgia', 'Amoxicilina 7 días'),
(43, 18, '2025-11-11 09:00:00', 'completada', 'Rinitis', 'Corticoide nasal'),
(44, 19, '2025-11-11 09:30:00', 'completada', 'Chequeo dental', 'Limpieza realizada'),
(45, 20, '2025-11-11 10:00:00', 'completada', 'Dolor articular', 'Iniciar AINEs'),
(46, 21, '2025-11-11 10:30:00', 'completada', 'Control general', 'Continuar dieta'),
(47, 22, '2025-11-11 11:00:00', 'completada', 'Consulta preoperatoria', 'Revisión favorable'),
(48, 23, '2025-11-11 11:30:00', 'completada', 'Temblor', 'Resonancia solicitada'),
(49, 24, '2025-11-11 12:00:00', 'completada', 'Masa palpable', 'Solicitar marcadores'),
(50, 25, '2025-11-11 12:30:00', 'completada', 'Dolor torácico', 'Prueba de esfuerzo');
-- 7) Mensajes (25 filas, 1 por cita)
INSERT INTO mensajes (cita_id, remitente_id, mensaje, fecha) VALUES
(1, 26, 'Hola doctor, confirmo mi asistencia', '2025-11-09 18:00:00'),
(2, 2, 'Traiga registro de dolores', '2025-11-09 18:05:00'),
(3, 28, 'Llevaremos cartilla de vacunación', '2025-11-09 18:10:00'),
(4, 4, 'Traiga estudios preoperatorios', '2025-11-09 18:15:00'),
(5, 30, 'He tenido palpitaciones nocturnas', '2025-11-09 18:20:00'),
(6, 6, 'Ayuno de 8 horas para análisis', '2025-11-09 18:25:00'),
(7, 32, '¿Debo suspender analgésicos?', '2025-11-09 18:30:00'),
(8, 8, 'Use compresas y descanse', '2025-11-09 18:35:00'),
(9, 34, 'Mi presión ha estado alta', '2025-11-09 18:40:00'),
(10, 10, 'Traiga la placa original', '2025-11-09 18:45:00'),
(11, 36, '¿La profilaxis tiene efectos?', '2025-11-09 18:50:00'),
(12, 12, 'Nos vemos a la hora acordada', '2025-11-09 18:55:00'),
(13, 38, '¿Puedo comer normal?', '2025-11-09 19:00:00'),
(14, 14, 'Evite conducir después de dilatación', '2025-11-09 19:05:00'),
(15, 40, '¿Cuándo entregan la biopsia?', '2025-11-09 19:10:00'),
(16, 16, 'Traiga espirometría anterior', '2025-11-09 19:15:00'),
(17, 42, 'Oído tapado desde ayer', '2025-11-09 19:20:00'),
(18, 18, 'Usaremos spray nasal', '2025-11-09 19:25:00'),
(19, 44, 'Necesito presupuesto', '2025-11-09 19:30:00'),
(20, 20, 'Hidratación y reposo', '2025-11-09 19:35:00'),
(21, 46, '¿Debo ir en ayunas?', '2025-11-09 19:40:00'),
(22, 22, 'Siga indicaciones preoperatorias', '2025-11-09 19:45:00'),
(23, 48, 'Tengo antecedentes familiares', '2025-11-09 19:50:00'),
(24, 24, 'Traiga estudios previos', '2025-11-09 19:55:00'),
(25, 50, '¿Puedo hacer ejercicio?', '2025-11-09 20:00:00');

-- 8) Valoraciones (25 filas) - idempotente gracias a ON DUPLICATE KEY UPDATE
INSERT INTO valoraciones (doctor_id, paciente_id, cita_id, puntuacion, comentario, fecha) VALUES
(1, 26, 1, 5, 'Excelente atención', '2025-11-10 18:00:00'),
(2, 27, 2, 4, 'Muy bien, algo de espera', '2025-11-10 18:05:00'),
(3, 28, 3, 5, 'Trato amable con el niño', '2025-11-10 18:10:00'),
(4, 29, 4, 5, 'Clara explicación', '2025-11-10 18:15:00'),
(5, 30, 5, 4, 'Buen diagnóstico', '2025-11-10 18:20:00'),
(6, 31, 6, 5, 'Muy profesional', '2025-11-10 18:25:00'),
(7, 32, 7, 4, 'Atención correcta', '2025-11-10 18:30:00'),
(8, 33, 8, 5, 'Mejoró mi dolor', '2025-11-10 18:35:00'),
(9, 34, 9, 4, 'Ajustó mi tratamiento', '2025-11-10 18:40:00'),
(10, 35, 10, 5, 'Explicó muy bien la imagen', '2025-11-10 18:45:00'),
(11, 36, 11, 5, 'Plan claro para migraña', '2025-11-10 18:50:00'),
(12, 37, 12, 5, 'Me sentí escuchado', '2025-11-10 18:55:00'),
(13, 38, 13, 4, 'Tratamiento efectivo', '2025-11-10 19:00:00'),
(14, 39, 14, 5, 'Excelente revisión ocular', '2025-11-10 19:05:00'),
(15, 40, 15, 4, 'Informe claro', '2025-11-10 19:10:00'),
(16, 41, 16, 5, 'Mejoría notoria', '2025-11-10 19:15:00'),
(17, 42, 17, 4, 'Buen manejo del dolor', '2025-11-10 19:20:00'),
(18, 43, 18, 5, 'Recomendaciones útiles', '2025-11-11 18:00:00'),
(19, 44, 19, 4, 'Buen trato y limpieza', '2025-11-11 18:05:00'),
(20, 45, 20, 5, 'Dolor articular controlado', '2025-11-11 18:10:00'),
(21, 46, 21, 4, 'Seguimiento adecuado', '2025-11-11 18:15:00'),
(22, 47, 22, 5, 'Todo muy claro antes de cirugía', '2025-11-11 18:20:00'),
(23, 48, 23, 5, 'Excelente trato y diagnóstico', '2025-11-11 18:25:00'),
(24, 49, 24, 4, 'Plan oncológico bien explicado', '2025-11-11 18:30:00'),
(25, 50, 25, 5, 'Atención rápida y precisa', '2025-11-11 18:35:00')
ON DUPLICATE KEY UPDATE
  puntuacion = VALUES(puntuacion),
  comentario = VALUES(comentario),
  fecha = VALUES(fecha);
-- 9) Historial médico (25 filas)
INSERT INTO historial_medico (paciente_id, doctor_id, cita_id, titulo, descripcion, fecha) VALUES
(26, 1, 1, 'Consulta general', 'Signos vitales estables. IMC 23. Plan: control en 6 meses.', '2025-11-10 09:20:00'),
(27, 2, 2, 'Cefalea tensional', 'Dolor occipital, sin náuseas. Plan: analgésico y fisioterapia cervical.', '2025-11-10 09:50:00'),
(28, 3, 3, 'Chequeo pediátrico', 'Percentiles normales. Vacunas al día. Recomendado control anual.', '2025-11-10 10:15:00'),
(29, 4, 4, 'Prequirúrgico aprobado', 'Laboratorios y ECG normales. Apto para procedimiento.', '2025-11-10 10:40:00'),
(30, 5, 5, 'Palpitaciones', 'ECG solicitado. Se descarta isquemia. Control 2 semanas.', '2025-11-10 11:20:00'),
(31, 6, 6, 'Fatiga', 'TSH/FT4 solicitados. Recomendado descanso e hidratación.', '2025-11-10 11:45:00'),
(32, 7, 7, 'Dolor persistente', 'Se programa biopsia. Analgésico de rescate.', '2025-11-10 12:10:00'),
(33, 8, 8, 'Dolor de rodilla', 'Sospecha meniscal. Fisioterapia 6 semanas.', '2025-11-10 12:40:00'),
(34, 9, 9, 'Hipertensión', 'Ajuste de IECA. Meta PA < 130/80.', '2025-11-10 13:10:00'),
(35, 10, 10, 'Lectura RX', 'Sin trazo de fractura. Reposo relativo 5 días.', '2025-11-10 13:40:00'),
(36, 11, 11, 'Migraña', 'Inicia profilaxis con betabloqueador. Diario de cefaleas.', '2025-11-10 14:10:00'),
(37, 12, 12, 'Ansiedad', 'TCC recomendada. Higiene del sueño.', '2025-11-10 14:40:00'),
(38, 13, 13, 'Reflujo gastroesofágico', 'IBP 20mg por 8 semanas. Dieta fraccionada.', '2025-11-10 15:10:00'),
(39, 14, 14, 'Visión borrosa', 'Miopía leve. Lentes correctivos recetados.', '2025-11-10 15:40:00'),
(40, 15, 15, 'Biopsia cutánea', 'Lesión benigna. Sin signos de malignidad.', '2025-11-10 16:10:00'),
(41, 16, 16, 'Tos crónica', 'Espirometría solicitada. Evitar irritantes.', '2025-11-10 16:40:00'),
(42, 17, 17, 'Otalgia', 'Otitis media. Amoxicilina 7 días.', '2025-11-10 17:10:00'),
(43, 18, 18, 'Rinitis alérgica', 'Corticoide nasal y lavado con solución salina.', '2025-11-11 09:15:00'),
(44, 19, 19, 'Limpieza dental', 'Profilaxis realizada. Control semestral.', '2025-11-11 09:45:00'),
(45, 20, 20, 'Artralgia', 'AINEs 5 días. Ejercicios de movilidad.', '2025-11-11 10:15:00'),
(46, 21, 21, 'Control general', 'Buen estado. Reforzar hidratación y actividad.', '2025-11-11 10:45:00'),
(47, 22, 22, 'Preoperatorio', 'Revisión favorable. Consentimiento informado.', '2025-11-11 11:15:00'),
(48, 23, 23, 'Temblor', 'Resonancia solicitada. Descartar Parkinson.', '2025-11-11 11:45:00'),
(49, 24, 24, 'Masa palpable', 'Solicitar marcadores tumorales. Seguimiento cercano.', '2025-11-11 12:15:00'),
(50, 25, 25, 'Dolor torácico', 'Prueba de esfuerzo. Educación en factores de riesgo.', '2025-11-11 12:45:00');
-- 10) Notificaciones (25 filas)
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, leido, fecha) VALUES
(26, 'cita', 'Cita completada', 'Tu cita #1 ha sido marcada como completada.', 1, '2025-11-10 18:10:00'),
(27, 'cita', 'Cita completada', 'Tu cita #2 ha sido marcada como completada.', 1, '2025-11-10 18:12:00'),
(28, 'cita', 'Cita completada', 'Tu cita #3 ha sido marcada como completada.', 1, '2025-11-10 18:14:00'),
(29, 'cita', 'Cita completada', 'Tu cita #4 ha sido marcada como completada.', 1, '2025-11-10 18:16:00'),
(30, 'cita', 'Cita completada', 'Tu cita #5 ha sido marcada como completada.', 1, '2025-11-10 18:18:00'),
(31, 'mensaje', 'Nuevo mensaje', 'Has recibido un mensaje en la cita #6.', 0, '2025-11-09 18:26:00'),
(32, 'mensaje', 'Nuevo mensaje', 'Has recibido un mensaje en la cita #7.', 0, '2025-11-09 18:31:00'),
(33, 'mensaje', 'Nuevo mensaje', 'Has recibido un mensaje en la cita #8.', 0, '2025-11-09 18:36:00'),
(34, 'mensaje', 'Nuevo mensaje', 'Has recibido un mensaje en la cita #9.', 0, '2025-11-09 18:41:00'),
(35, 'mensaje', 'Nuevo mensaje', 'Has recibido un mensaje en la cita #10.', 0, '2025-11-09 18:46:00'),
(1, 'cita', 'Nueva cita asignada', 'Se te asignó la cita #1.', 1, '2025-11-09 12:00:00'),
(2, 'cita', 'Nueva cita asignada', 'Se te asignó la cita #2.', 1, '2025-11-09 12:05:00'),
(3, 'cita', 'Nueva cita asignada', 'Se te asignó la cita #3.', 1, '2025-11-09 12:10:00'),
(4, 'cita', 'Nueva cita asignada', 'Se te asignó la cita #4.', 1, '2025-11-09 12:15:00'),
(5, 'cita', 'Nueva cita asignada', 'Se te asignó la cita #5.', 1, '2025-11-09 12:20:00'),
(26, 'pago', 'Pago registrado', 'Se registró el pago de la cita #1.', 1, '2025-11-10 18:32:00'),
(27, 'pago', 'Pago registrado', 'Se registró el pago de la cita #2.', 1, '2025-11-10 18:34:00'),
(28, 'pago', 'Pago registrado', 'Se registró el pago de la cita #3.', 1, '2025-11-10 18:36:00'),
(29, 'pago', 'Pago registrado', 'Se registró el pago de la cita #4.', 1, '2025-11-10 18:38:00'),
(30, 'pago', 'Pago registrado', 'Se registró el pago de la cita #5.', 1, '2025-11-10 18:40:00'),
(46, 'sistema', 'Actualización', 'Se actualizó tu perfil.', 0, '2025-11-08 10:00:00'),
(47, 'sistema', 'Actualización', 'Se actualizaron términos y condiciones.', 0, '2025-11-08 10:10:00'),
(48, 'sistema', 'Actualización', 'Nueva política de privacidad.', 0, '2025-11-08 10:20:00'),
(49, 'sistema', 'Actualización', 'Mejoras en rendimiento.', 0, '2025-11-08 10:30:00'),
(50, 'sistema', 'Actualización', 'Correcciones menores.', 0, '2025-11-08 10:40:00');
-- 11) Pagos (25 filas; asignados a citas 1..25)
INSERT INTO pagos (cita_id, paciente_id, doctor_id, monto, metodo_pago, estado, fecha_pago, fecha_creacion) VALUES
(1, 26, 1, 60.00, 'tarjeta', 'pagado', '2025-11-10 18:30:00', '2025-11-10 18:25:00'),
(2, 27, 2, 70.00, 'efectivo', 'pagado', '2025-11-10 18:31:00', '2025-11-10 18:26:00'),
(3, 28, 3, 65.00, 'transferencia', 'pagado', '2025-11-10 18:32:00', '2025-11-10 18:27:00'),
(4, 29, 4, 120.00, 'tarjeta', 'pagado', '2025-11-10 18:33:00', '2025-11-10 18:28:00'),
(5, 30, 5, 90.00, 'tarjeta', 'pagado', '2025-11-10 18:34:00', '2025-11-10 18:29:00'),
(6, 31, 6, 80.00, 'efectivo', 'pagado', '2025-11-10 18:35:00', '2025-11-10 18:30:00'),
(7, 32, 7, 85.00, 'transferencia', 'pagado', '2025-11-10 18:36:00', '2025-11-10 18:31:00'),
(8, 33, 8, 95.00, 'tarjeta', 'pagado', '2025-11-10 18:37:00', '2025-11-10 18:32:00'),
(9, 34, 9, 75.00, 'efectivo', 'pagado', '2025-11-10 18:38:00', '2025-11-10 18:33:00'),
(10, 35, 10, 110.00, 'transferencia', 'pagado', '2025-11-10 18:39:00', '2025-11-10 18:34:00'),
(11, 36, 11, 100.00, 'tarjeta', 'pagado', '2025-11-10 18:40:00', '2025-11-10 18:35:00'),
(12, 37, 12, 70.00, 'efectivo', 'pagado', '2025-11-10 18:41:00', '2025-11-10 18:36:00'),
(13, 38, 13, 85.00, 'transferencia', 'pagado', '2025-11-10 18:42:00', '2025-11-10 18:37:00'),
(14, 39, 14, 95.00, 'tarjeta', 'pagado', '2025-11-10 18:43:00', '2025-11-10 18:38:00'),
(15, 40, 15, 105.00, 'efectivo', 'pagado', '2025-11-10 18:44:00', '2025-11-10 18:39:00'),
(16, 41, 16, 75.00, 'transferencia', 'pagado', '2025-11-10 18:45:00', '2025-11-10 18:40:00'),
(17, 42, 17, 80.00, 'tarjeta', 'pagado', '2025-11-10 18:46:00', '2025-11-10 18:41:00'),
(18, 43, 18, 70.00, 'efectivo', 'pagado', '2025-11-11 12:30:00', '2025-11-11 12:20:00'),
(19, 44, 19, 60.00, 'transferencia', 'pagado', '2025-11-11 12:31:00', '2025-11-11 12:21:00'),
(20, 45, 20, 95.00, 'tarjeta', 'pagado', '2025-11-11 12:32:00', '2025-11-11 12:22:00'),
(21, 46, 21, 70.00, 'efectivo', 'pagado', '2025-11-11 12:33:00', '2025-11-11 12:23:00'),
(22, 47, 22, 120.00, 'transferencia', 'pagado', '2025-11-11 12:34:00', '2025-11-11 12:24:00'),
(23, 48, 23, 100.00, 'tarjeta', 'pagado', '2025-11-11 12:35:00', '2025-11-11 12:25:00'),
(24, 49, 24, 115.00, 'efectivo', 'pagado', '2025-11-11 12:36:00', '2025-11-11 12:26:00'),
(25, 50, 25, 130.00, 'transferencia', 'pagado', '2025-11-11 12:37:00', '2025-11-11 12:27:00');

-- 12) Facturas (25 filas; 1 a 1 con pagos 1..25)
INSERT INTO facturas (pago_id, numero_factura, fecha_emision) VALUES
(1,  'FAC-2025-0001', '2025-11-10 18:50:00'),
(2,  'FAC-2025-0002', '2025-11-10 18:51:00'),
(3,  'FAC-2025-0003', '2025-11-10 18:52:00'),
(4,  'FAC-2025-0004', '2025-11-10 18:53:00'),
(5,  'FAC-2025-0005', '2025-11-10 18:54:00'),
(6,  'FAC-2025-0006', '2025-11-10 18:55:00'),
(7,  'FAC-2025-0007', '2025-11-10 18:56:00'),
(8,  'FAC-2025-0008', '2025-11-10 18:57:00'),
(9,  'FAC-2025-0009', '2025-11-10 18:58:00'),
(10, 'FAC-2025-0010', '2025-11-10 18:59:00'),
(11, 'FAC-2025-0011', '2025-11-10 19:00:00'),
(12, 'FAC-2025-0012', '2025-11-10 19:01:00'),
(13, 'FAC-2025-0013', '2025-11-10 19:02:00'),
(14, 'FAC-2025-0014', '2025-11-10 19:03:00'),
(15, 'FAC-2025-0015', '2025-11-10 19:04:00'),
(16, 'FAC-2025-0016', '2025-11-10 19:05:00'),
(17, 'FAC-2025-0017', '2025-11-10 19:06:00'),
(18, 'FAC-2025-0018', '2025-11-11 12:40:00'),
(19, 'FAC-2025-0019', '2025-11-11 12:41:00'),
(20, 'FAC-2025-0020', '2025-11-11 12:42:00'),
(21, 'FAC-2025-0021', '2025-11-11 12:43:00'),
(22, 'FAC-2025-0022', '2025-11-11 12:44:00'),
(23, 'FAC-2025-0023', '2025-11-11 12:45:00'),
(24, 'FAC-2025-0024', '2025-11-11 12:46:00'),
(25, 'FAC-2025-0025', '2025-11-11 12:47:00');

COMMIT;