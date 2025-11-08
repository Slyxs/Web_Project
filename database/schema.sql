-- SQL para crear la base de datos y tablas principales de la web de doctores en línea
-- Codificación: utf8mb4

CREATE DATABASE IF NOT EXISTS web_project
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE web_project;

-- Tabla de departamentos del Perú
CREATE TABLE IF NOT EXISTS departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  INDEX idx_nombre (nombre),
  INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- Tabla de provincias del Perú
CREATE TABLE IF NOT EXISTS provincias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departamento_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provincia (departamento_id, nombre),
  INDEX idx_nombre (nombre),
  INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- Tabla principal de usuarios (AHORA incluye información personal básica)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  tipo ENUM('paciente', 'doctor', 'admin') NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_login DATETIME NULL,
  activo BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_tipo (tipo),
  INDEX idx_activo (activo),
  INDEX idx_nombre_completo (nombres, apellidos)
) ENGINE=InnoDB;

-- Tabla de pacientes (información personal y médica)
CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  genero ENUM('masculino', 'femenino', 'otro'),
  foto_perfil VARCHAR(255),
  
  -- Información de dirección (Perú)
  direccion TEXT,
  departamento_id INT,
  provincia_id INT,
  
  -- Información médica
  tipo_sangre ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  alergias TEXT,
  condiciones_medicas TEXT,
  medicamentos_actuales TEXT,
  contacto_emergencia_nombre VARCHAR(100),
  contacto_emergencia_telefono VARCHAR(20),
  seguro_medico VARCHAR(100),
  numero_poliza_seguro VARCHAR(100),
  
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL,
  FOREIGN KEY (provincia_id) REFERENCES provincias(id) ON DELETE SET NULL,
  
  INDEX idx_telefono (telefono),
  INDEX idx_tipo_sangre (tipo_sangre),
  INDEX idx_departamento (departamento_id),
  INDEX idx_provincia (provincia_id)
) ENGINE=InnoDB;

-- Tabla de doctores
CREATE TABLE IF NOT EXISTS doctores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  genero ENUM('masculino', 'femenino', 'otro'),
  foto_perfil VARCHAR(255),
  
  -- Información de dirección del consultorio (Perú)
  consultorio_direccion TEXT,
  departamento_id INT,
  provincia_id INT,
  
  -- Información profesional
  descripcion TEXT,
  numero_licencia VARCHAR(50) UNIQUE NOT NULL,
  experiencia TEXT,
  formacion TEXT,
  certificaciones TEXT,
  costo_consulta DECIMAL(10,2) DEFAULT 0.00,
  activo BOOLEAN DEFAULT TRUE,
  
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL,
  FOREIGN KEY (provincia_id) REFERENCES provincias(id) ON DELETE SET NULL,
  
  INDEX idx_licencia (numero_licencia),
  INDEX idx_activo (activo),
  INDEX idx_departamento (departamento_id),
  INDEX idx_provincia (provincia_id)
) ENGINE=InnoDB;

-- El resto de las tablas permanecen igual...

-- Tabla de especialidades médicas
CREATE TABLE IF NOT EXISTS especialidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  INDEX idx_nombre (nombre),
  INDEX idx_activa (activa)
) ENGINE=InnoDB;

-- Relación doctores-especialidades (muchos a muchos)
CREATE TABLE IF NOT EXISTS doctor_especialidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  especialidad_id INT NOT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  FOREIGN KEY (especialidad_id) REFERENCES especialidades(id) ON DELETE CASCADE,
  UNIQUE KEY unique_doctor_especialidad (doctor_id, especialidad_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_especialidad (especialidad_id),
  INDEX idx_principal (es_principal)
) ENGINE=InnoDB;

-- Tabla de disponibilidad de doctores (MEJORADA - permite múltiples días)
CREATE TABLE IF NOT EXISTS disponibilidad_doctor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  dia_semana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_disponibilidad (doctor_id, dia_semana, hora_inicio, hora_fin),
  INDEX idx_doctor_dia (doctor_id, dia_semana),
  INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  duracion_minutos INT DEFAULT 30,
  tipo_consulta ENUM('presencial', 'virtual', 'domicilio') DEFAULT 'presencial',
  estado ENUM('pendiente', 'confirmada', 'en_curso', 'cancelada', 'completada', 'no_asistio') DEFAULT 'pendiente',
  motivo TEXT NOT NULL,
  sintomas TEXT,
  notas_doctor TEXT,
  diagnostico TEXT,
  tratamiento TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  INDEX idx_paciente (paciente_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_fecha (fecha_hora),
  INDEX idx_estado (estado),
  INDEX idx_tipo_consulta (tipo_consulta)
) ENGINE=InnoDB;

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NOT NULL,
  remitente_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo ENUM('texto', 'archivo', 'imagen') DEFAULT 'texto',
  archivo_url VARCHAR(255),
  leido BOOLEAN DEFAULT FALSE,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (remitente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_cita (cita_id),
  INDEX idx_remitente (remitente_id),
  INDEX idx_fecha (fecha),
  INDEX idx_leido (leido)
) ENGINE=InnoDB;

-- Tabla de valoraciones
CREATE TABLE IF NOT EXISTS valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  paciente_id INT NOT NULL,
  cita_id INT,
  puntuacion TINYINT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
  comentario TEXT,
  recomendaria BOOLEAN,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  aprobada BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_valoracion (cita_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_paciente (paciente_id),
  INDEX idx_puntuacion (puntuacion),
  INDEX idx_aprobada (aprobada)
) ENGINE=InnoDB;

-- Tabla de historial médico del paciente
CREATE TABLE IF NOT EXISTS historial_medico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT,
  cita_id INT,
  tipo ENUM('consulta', 'diagnostico', 'tratamiento', 'procedimiento', 'vacuna', 'alergia', 'medicamento') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  archivos TEXT,
  fecha_evento DATETIME NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE SET NULL,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  INDEX idx_paciente (paciente_id),
  INDEX idx_tipo (tipo),
  INDEX idx_fecha_evento (fecha_evento)
) ENGINE=InnoDB;

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NOT NULL,
  paciente_id INT NOT NULL,
  doctor_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal') DEFAULT 'efectivo',
  estado ENUM('pendiente','pagado','fallido','reembolsado','cancelado') DEFAULT 'pendiente',
  referencia_pago VARCHAR(100),
  fecha_pago DATETIME,
  fecha_vencimiento DATETIME,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
  INDEX idx_cita (cita_id),
  INDEX idx_estado (estado),
  INDEX idx_referencia (referencia_pago)
) ENGINE=InnoDB;

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pago_id INT NOT NULL UNIQUE,
  numero_factura VARCHAR(50) NOT NULL UNIQUE,
  concepto TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  xml_factura TEXT,
  pdf_factura VARCHAR(255),
  FOREIGN KEY (pago_id) REFERENCES pagos(id) ON DELETE CASCADE,
  INDEX idx_numero (numero_factura),
  INDEX idx_fecha_emision (fecha_emision)
) ENGINE=InnoDB;

-- Tabla de documentos médicos
CREATE TABLE IF NOT EXISTS documentos_medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT,
  cita_id INT,
  tipo_documento ENUM('receta', 'estudio', 'imagen', 'laboratorio', 'otros') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  archivo_url VARCHAR(255) NOT NULL,
  fecha_documento DATE NOT NULL,
  fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE SET NULL,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  INDEX idx_paciente (paciente_id),
  INDEX idx_tipo (tipo_documento),
  INDEX idx_fecha (fecha_documento)
) ENGINE=InnoDB;

-- NUEVA TABLA: Contactos y mensajes de soporte
CREATE TABLE IF NOT EXISTS contactos_soporte (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_usuario ENUM(
    'doctor_cliente',
    'doctor_no_cliente', 
    'usuario_doctoralia',
    'medio_comunicacion',
    'admin_clinica'
  ) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'pendiente',
  respuesta_admin TEXT,
  fecha_contacto DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta DATETIME NULL,
  INDEX idx_tipo_usuario (tipo_usuario),
  INDEX idx_email (email),
  INDEX idx_estado (estado),
  INDEX idx_fecha_contacto (fecha_contacto)
) ENGINE=InnoDB;

-- Inserción de datos de ejemplo (MODIFICADA para usar los nuevos campos)
START TRANSACTION;

-- Insertar departamentos del Perú
INSERT INTO departamentos (nombre) VALUES
('Lima'),
('Arequipa'),
('Cusco'),
('La Libertad'),
('Piura'),
('Lambayeque'),
('Junín'),
('Puno'),
('Ancash'),
('Ica');

-- Insertar provincias del Perú
INSERT INTO provincias (departamento_id, nombre) VALUES
-- Lima
(1, 'Lima'), (1, 'Callao'), (1, 'Huaura'), (1, 'Cañete'), (1, 'Huaral'),
-- Arequipa
(2, 'Arequipa'), (2, 'Camaná'), (2, 'Islay'), (2, 'Castilla'),
-- Cusco
(3, 'Cusco'), (3, 'Quispicanchi'), (3, 'Calca'), (3, 'Urubamba'),
-- La Libertad
(4, 'Trujillo'), (4, 'Chepén'), (4, 'Pacasmayo'), (4, 'Ascope'),
-- Piura
(5, 'Piura'), (5, 'Sullana'), (5, 'Paita'), (5, 'Talara'),
-- Lambayeque
(6, 'Chiclayo'), (6, 'Lambayeque'), (6, 'Ferreñafe'),
-- Junín
(7, 'Huancayo'), (7, 'Concepción'), (7, 'Jauja'), (7, 'Chanchamayo'),
-- Puno
(8, 'Puno'), (8, 'Juliaca'), (8, 'Azángaro'), (8, 'Chucuito'),
-- Ancash
(9, 'Huaraz'), (9, 'Santa'), (9, 'Casma'), (9, 'Yungay'),
-- Ica
(10, 'Ica'), (10, 'Chincha'), (10, 'Nazca'), (10, 'Pisco');

-- Insertar usuarios (AHORA con nombres y apellidos)
INSERT INTO usuarios (email, password, nombres, apellidos, tipo, activo) VALUES
-- Admin
('admin@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Administrador', 'admin', TRUE),

-- Doctores
('dr.garcia@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Roberto', 'García', 'doctor', TRUE),
('dra.martinez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'Martínez', 'doctor', TRUE),
('dr.rodriguez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Javier', 'Rodríguez', 'doctor', TRUE),
('dra.lopez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Laura', 'López', 'doctor', TRUE),
('dr.hernandez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miguel', 'Hernández', 'doctor', TRUE),

-- Pacientes
('paciente1@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'González', 'paciente', TRUE),
('paciente2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Pérez', 'paciente', TRUE),
('paciente3@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofía', 'Ramírez', 'paciente', TRUE),
('paciente4@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Díaz', 'paciente', TRUE),
('paciente5@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mariana', 'Castillo', 'paciente', TRUE);

-- Insertar datos de pacientes (SIN nombres y apellidos)
INSERT INTO pacientes (usuario_id, telefono, fecha_nacimiento, genero, direccion, departamento_id, provincia_id, tipo_sangre, alergias, condiciones_medicas, medicamentos_actuales, contacto_emergencia_nombre, contacto_emergencia_telefono, seguro_medico) VALUES
(7, '555-2001', '1990-04-10', 'femenino', 'Av. Arequipa 1234', 1, 1, 'O+', 'Penicilina, Mariscos', 'Hipertensión leve', 'Losartan 50mg', 'Pedro González', '555-3001', 'SIS'),
(8, '555-2002', '1985-12-25', 'masculino', 'Jr. Trujillo 456', 4, 14, 'A-', 'Polvo, Ácaros', 'Asma', 'Salbutamol inhalador', 'María Pérez', '555-3002', 'Rimac'),
(9, '555-2003', '1992-08-03', 'femenino', 'Calle Lima 789', 2, 6, 'B+', 'Nueces', 'Diabetes Tipo 2', 'Metformina 500mg', 'Roberto Ramírez', '555-3003', 'Pacifico'),
(10, '555-2004', '1988-06-18', 'masculino', 'Av. Grau 321', 6, 16, 'AB+', 'Ninguna', 'Ninguna', 'Ninguno', 'Elena Díaz', '555-3004', 'La Positiva'),
(11, '555-2005', '1995-11-30', 'femenino', 'Psje. Cusco 654', 3, 9, 'O-', 'Aspirina', 'Migraña crónica', 'Sumatriptán 50mg', 'Luis Castillo', '555-3005', 'Mapfre');

-- Insertar datos de doctores (SIN nombres y apellidos)
INSERT INTO doctores (usuario_id, telefono, fecha_nacimiento, genero, consultorio_direccion, departamento_id, provincia_id, descripcion, numero_licencia, experiencia, formacion, certificaciones, costo_consulta) VALUES
(2, '555-1001', '1975-03-20', 'masculino', 'Av. Javier Prado 1235, San Isidro', 1, 1, 'Cardiólogo con 15 años de experiencia en enfermedades cardiovasculares', 'LIC-CARD-001', '15 años en Hospital Central', 'UNMSM - Especialidad en Cardiología', 'Certificado en Ecocardiografía', 800.00),
(3, '555-1002', '1982-07-12', 'femenino', 'Calle Schell 345, Miraflores', 1, 1, 'Pediatra especializada en atención infantil y vacunación', 'LIC-PED-002', '10 años en consulta privada', 'UPCH - Especialidad en Pediatría', 'Certificado en Vacunación', 600.00),
(4, '555-1003', '1978-11-05', 'masculino', 'Av. Goyeneche 567, Arequipa', 2, 6, 'Dermatólogo experto en enfermedades de la piel', 'LIC-DER-003', '12 años en Clínica Arequipa', 'UNSA - Especialidad en Dermatología', 'Certificado en Dermatoscopía', 700.00),
(5, '555-1004', '1985-02-28', 'femenino', 'Jr. Puno 234, Cusco', 3, 9, 'Ginecóloga con enfoque en salud femenina integral', 'LIC-GIN-004', '8 años en Centro Médico', 'UCSP - Especialidad en Ginecología', 'Certificado en Ultrasonido', 750.00),
(6, '555-1005', '1970-09-15', 'masculino', 'Av. España 890, Trujillo', 4, 14, 'Ortopedista traumatólogo especializado en deportes', 'LIC-ORT-005', '20 años en Hospital Regional', 'UNT - Especialidad en Ortopedia', 'Certificado en Artroscopía', 900.00);

-- El resto de las inserciones permanecen igual...

-- Insertar especialidades
INSERT INTO especialidades (nombre, descripcion) VALUES
('Cardiología', 'Especialidad médica que se ocupa de las enfermedades del corazón y sistema circulatorio'),
('Pediatría', 'Especialidad médica que se ocupa de la salud infantil'),
('Dermatología', 'Especialidad médica que se ocupa de las enfermedades de la piel'),
('Ginecología', 'Especialidad médica que se ocupa de la salud del sistema reproductor femenino'),
('Ortopedia', 'Especialidad médica que se ocupa de las enfermedades del sistema musculoesquelético');

-- Insertar relación doctor-especialidad
INSERT INTO doctor_especialidad (doctor_id, especialidad_id, es_principal) VALUES
(1, 1, TRUE),  -- Dr. García - Cardiología
(2, 2, TRUE),  -- Dra. Martínez - Pediatría
(3, 3, TRUE),  -- Dr. Rodríguez - Dermatología
(4, 4, TRUE),  -- Dra. López - Ginecología
(5, 5, TRUE);  -- Dr. Hernández - Ortopedia

-- Insertar disponibilidad de doctores
INSERT INTO disponibilidad_doctor (doctor_id, dia_semana, hora_inicio, hora_fin) VALUES
-- Dr. García (Cardiólogo)
(1, 'lunes', '09:00:00', '14:00:00'),
(1, 'miercoles', '09:00:00', '14:00:00'),
(1, 'viernes', '09:00:00', '13:00:00'),

-- Dra. Martínez (Pediatra)
(2, 'martes', '08:00:00', '13:00:00'),
(2, 'jueves', '08:00:00', '13:00:00'),
(2, 'sabado', '09:00:00', '12:00:00'),

-- Dr. Rodríguez (Dermatólogo)
(3, 'lunes', '10:00:00', '15:00:00'),
(3, 'martes', '10:00:00', '15:00:00'),
(3, 'jueves', '10:00:00', '15:00:00'),

-- Dra. López (Ginecóloga)
(4, 'miercoles', '08:00:00', '12:00:00'),
(4, 'viernes', '08:00:00', '12:00:00'),

-- Dr. Hernández (Ortopedista)
(5, 'lunes', '07:00:00', '12:00:00'),
(5, 'martes', '07:00:00', '12:00:00'),
(5, 'jueves', '07:00:00', '12:00:00');

-- Insertar citas
INSERT INTO citas (paciente_id, doctor_id, fecha_hora, duracion_minutos, tipo_consulta, estado, motivo, sintomas) VALUES
(1, 1, '2024-01-15 10:00:00', 30, 'presencial', 'completada', 'Control de presión arterial', 'Dolor de cabeza ocasional'),
(2, 2, '2024-01-16 09:00:00', 30, 'presencial', 'completada', 'Consulta pediátrica rutinaria', 'Fiebre y tos'),
(3, 3, '2024-01-17 11:00:00', 45, 'virtual', 'confirmada', 'Revisión de manchas en la piel', 'Manchas rojas en brazos'),
(4, 4, '2024-01-18 10:30:00', 40, 'presencial', 'pendiente', 'Control ginecológico anual', 'Ninguno'),
(5, 5, '2024-01-19 08:00:00', 60, 'presencial', 'confirmada', 'Dolor en rodilla derecha', 'Dolor al caminar y subir escaleras');

-- Insertar mensajes
INSERT INTO mensajes (cita_id, remitente_id, mensaje, tipo, leido) VALUES
(1, 2, 'Buenos días, ¿cómo se ha sentido después del ajuste de medicamento?', 'texto', TRUE),
(1, 7, 'Mucho mejor doctor, los dolores de cabeza han disminuido', 'texto', TRUE),
(2, 3, 'Hola, ¿cómo está la fiebre del niño?', 'texto', TRUE),
(2, 8, 'Bajó con el medicamento, pero sigue con tos', 'texto', TRUE),
(3, 4, 'Le envío la receta para la crema que mencionamos', 'texto', FALSE);

-- Insertar valoraciones
INSERT INTO valoraciones (doctor_id, paciente_id, cita_id, puntuacion, comentario, recomendaria, aprobada) VALUES
(1, 1, 1, 5, 'Excelente atención, muy profesional y claro en sus explicaciones', TRUE, TRUE),
(2, 2, 2, 4, 'Muy buena doctora, paciente con los niños', TRUE, TRUE),
(3, 3, 3, 5, 'Resolvió mi problema rápidamente, muy recomendable', TRUE, TRUE),
(4, 4, 4, 4, 'Atenta y profesional, explica todo muy bien', TRUE, TRUE),
(5, 5, 5, 5, 'Gran especialista, solucionó mi problema de rodilla', TRUE, TRUE);

-- Insertar historial médico
INSERT INTO historial_medico (paciente_id, doctor_id, cita_id, tipo, titulo, descripcion, fecha_evento) VALUES
(1, 1, 1, 'consulta', 'Control de hipertensión', 'Paciente con presión arterial controlada, se ajusta dosis de Losartan', '2024-01-15 10:00:00'),
(2, 2, 2, 'diagnostico', 'Infección respiratoria', 'Diagnóstico de infección viral, se prescribe tratamiento sintomático', '2024-01-16 09:00:00'),
(3, 3, 3, 'tratamiento', 'Dermatitis contacto', 'Se prescribe crema de hidrocortisona para alergia cutánea', '2024-01-17 11:00:00'),
(4, 4, NULL, 'vacuna', 'Vacuna VPH', 'Aplicación de segunda dosis de vacuna contra VPH', '2024-01-10 14:00:00'),
(5, 5, 5, 'diagnostico', 'Esguince rodilla', 'Esguince grado 1, se recomienda reposo y terapia física', '2024-01-19 08:00:00');

-- Insertar pagos
INSERT INTO pagos (cita_id, paciente_id, doctor_id, monto, metodo_pago, estado, referencia_pago, fecha_pago) VALUES
(1, 1, 1, 800.00, 'tarjeta_credito', 'pagado', 'PAY-001', '2024-01-15 10:30:00'),
(2, 2, 2, 600.00, 'efectivo', 'pagado', 'PAY-002', '2024-01-16 09:30:00'),
(3, 3, 3, 700.00, 'transferencia', 'pagado', 'PAY-003', '2024-01-17 11:30:00'),
(4, 4, 4, 750.00, 'tarjeta_debito', 'pendiente', NULL, NULL),
(5, 5, 5, 900.00, 'paypal', 'pagado', 'PAY-005', '2024-01-19 08:30:00');

-- Insertar facturas
INSERT INTO facturas (pago_id, numero_factura, concepto, subtotal, iva, total) VALUES
(1, 'FACT-001', 'Consulta de Cardiología - Control de hipertensión', 800.00, 128.00, 928.00),
(2, 'FACT-002', 'Consulta de Pediatría - Infección respiratoria', 600.00, 96.00, 696.00),
(3, 'FACT-003', 'Consulta de Dermatología - Dermatitis contacto', 700.00, 112.00, 812.00),
(5, 'FACT-005', 'Consulta de Ortopedia - Esguince rodilla', 900.00, 144.00, 1044.00);

-- Insertar documentos médicos
INSERT INTO documentos_medicos (paciente_id, doctor_id, cita_id, tipo_documento, titulo, descripcion, archivo_url, fecha_documento) VALUES
(1, 1, 1, 'receta', 'Receta Losartan 50mg', 'Medicamento para control de presión arterial', '/documentos/receta_001.pdf', '2024-01-15'),
(2, 2, 2, 'receta', 'Receta antitérmico y antitusivo', 'Medicamentos para fiebre y tos', '/documentos/receta_002.pdf', '2024-01-16'),
(3, 3, 3, 'receta', 'Receta crema hidrocortisona', 'Crema para dermatitis por contacto', '/documentos/receta_003.pdf', '2024-01-17'),
(4, 4, NULL, 'estudio', 'Resultados Papanicolaou', 'Estudio de citología cervical normal', '/documentos/pap_004.pdf', '2024-01-10'),
(5, 5, 5, 'imagen', 'Radiografía rodilla derecha', 'Radiografía que muestra esguince grado 1', '/documentos/radio_005.jpg', '2024-01-19');

-- Insertar ejemplos de contactos de soporte
INSERT INTO contactos_soporte (tipo_usuario, email, mensaje, estado, fecha_contacto) VALUES
('doctor_cliente', 'dr.fernandez@email.com', 'Hola, tengo problemas para acceder a mi calendario de citas. ¿Me pueden ayudar?', 'pendiente', '2024-01-20 09:15:00'),
('doctor_no_cliente', 'nuevodoctor@clinica.com', 'Estoy interesado en registrarme en su plataforma. ¿Podrían enviarme información?', 'en_proceso', '2024-01-20 10:30:00'),
('usuario_doctoralia', 'usuario123@email.com', 'No puedo encontrar a mi doctor en la plataforma. ¿Está disponible?', 'pendiente', '2024-01-20 11:45:00'),
('medio_comunicacion', 'prensa@periodico.com', 'Soy periodista y me gustaría hacer una nota sobre su plataforma.', 'resuelto', '2024-01-19 14:20:00'),
('admin_clinica', 'admin@hospital.com', 'Necesito ayuda para configurar múltiples doctores en nuestra clínica.', 'pendiente', '2024-01-20 16:00:00');

COMMIT;