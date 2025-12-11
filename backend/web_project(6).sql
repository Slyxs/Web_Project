-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 11, 2025 at 01:14 PM
-- Server version: 12.1.2-MariaDB
-- PHP Version: 8.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `citas`
--

CREATE TABLE `citas` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `duracion_minutos` int(11) DEFAULT 30,
  `tipo_consulta` enum('presencial','virtual','domicilio') DEFAULT 'presencial',
  `estado` enum('pendiente','confirmada','en_curso','cancelada','completada','no_asistio') DEFAULT 'pendiente',
  `motivo` text NOT NULL,
  `sintomas` text DEFAULT NULL,
  `notas_doctor` text DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `citas`
--

INSERT INTO `citas` (`id`, `paciente_id`, `doctor_id`, `fecha_hora`, `duracion_minutos`, `tipo_consulta`, `estado`, `motivo`, `sintomas`, `notas_doctor`, `diagnostico`, `tratamiento`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, '2024-01-15 10:00:00', 30, 'presencial', 'pendiente', 'Control de presión arterial', 'Dolor de cabeza ocasional', NULL, NULL, NULL, '2025-11-07 13:27:57', '2025-11-07 13:27:57'),
(2, 2, 2, '2024-01-16 09:00:00', 30, 'presencial', 'completada', 'Consulta pediátrica rutinaria', 'Fiebre y tos', NULL, NULL, NULL, '2025-11-07 13:27:57', '2025-11-07 13:27:57'),
(3, 3, 3, '2024-01-17 11:00:00', 45, 'virtual', 'confirmada', 'Revisión de manchas en la piel', 'Manchas rojas en brazos', NULL, NULL, NULL, '2025-11-07 13:27:57', '2025-11-07 13:27:57'),
(4, 4, 4, '2024-01-18 10:30:00', 40, 'presencial', 'pendiente', 'Control ginecológico anual', 'Ninguno', NULL, NULL, NULL, '2025-11-07 13:27:57', '2025-11-07 13:27:57'),
(5, 5, 5, '2024-01-19 08:00:00', 60, 'presencial', 'confirmada', 'Dolor en rodilla derecha', 'Dolor al caminar y subir escaleras', NULL, NULL, NULL, '2025-11-07 13:27:57', '2025-11-07 13:27:57'),
(6, 10, 9, '2025-11-28 10:00:00', 30, 'presencial', 'confirmada', 'Control general anual', 'Dolor de cabeza intermitente y cansancio', NULL, NULL, NULL, '2025-12-31 23:38:00', '2025-12-04 11:57:10');

-- --------------------------------------------------------

--
-- Table structure for table `contactos_soporte`
--

CREATE TABLE `contactos_soporte` (
  `id` int(11) NOT NULL,
  `tipo_usuario` enum('doctor_cliente','doctor_no_cliente','usuario_doctoralia','medio_comunicacion','admin_clinica') NOT NULL,
  `email` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('pendiente','en_proceso','resuelto','cerrado') DEFAULT 'pendiente',
  `respuesta_admin` text DEFAULT NULL,
  `fecha_contacto` datetime DEFAULT current_timestamp(),
  `fecha_respuesta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contactos_soporte`
--

INSERT INTO `contactos_soporte` (`id`, `tipo_usuario`, `email`, `mensaje`, `estado`, `respuesta_admin`, `fecha_contacto`, `fecha_respuesta`) VALUES
(1, 'doctor_cliente', 'dr.fernandez@email.com', 'Hola, tengo problemas para acceder a mi calendario de citas. ¿Me pueden ayudar?', 'pendiente', NULL, '2024-01-20 09:15:00', NULL),
(2, 'doctor_no_cliente', 'nuevodoctor@clinica.com', 'Estoy interesado en registrarme en su plataforma. ¿Podrían enviarme información?', 'en_proceso', NULL, '2024-01-20 10:30:00', NULL),
(3, 'usuario_doctoralia', 'usuario123@email.com', 'No puedo encontrar a mi doctor en la plataforma. ¿Está disponible?', 'pendiente', NULL, '2024-01-20 11:45:00', NULL),
(4, 'medio_comunicacion', 'prensa@periodico.com', 'Soy periodista y me gustaría hacer una nota sobre su plataforma.', 'resuelto', NULL, '2024-01-19 14:20:00', NULL),
(5, 'admin_clinica', 'admin@hospital.com', 'Necesito ayuda para configurar múltiples doctores en nuestra clínica.', 'pendiente', NULL, '2024-01-20 16:00:00', NULL),
(6, 'usuario_doctoralia', 'usuarioejemplo@email.com', 'Hola,esta es una prueba', 'pendiente', NULL, '2025-11-07 16:09:35', NULL),
(7, 'usuario_doctoralia', 'emaildeprueba@email.com', 'Hola, esta es una prueba, la segunda prueba!', 'pendiente', NULL, '2025-11-07 16:17:56', NULL),
(8, 'usuario_doctoralia', 'emaildeprueba2@email.com', 'Prueba?', 'pendiente', NULL, '2025-11-07 23:24:01', NULL),
(9, 'usuario_doctoralia', 'emaildeprueba@email.com', 'Prueba', 'pendiente', NULL, '2025-11-07 23:29:34', NULL),
(10, 'usuario_doctoralia', 'waos@gmail.com', 'Test', 'pendiente', NULL, '2025-11-08 16:16:07', NULL),
(11, 'medio_comunicacion', 'emaildeprueba@email.com', 'hola', 'pendiente', NULL, '2025-11-20 11:15:17', NULL),
(12, 'medio_comunicacion', 'emaildeprueba@email.com', 'Buen dia', 'pendiente', NULL, '2025-11-20 12:01:47', NULL),
(13, 'medio_comunicacion', 'emaildeprueba@email.com', 'testeo', 'pendiente', NULL, '2025-11-20 12:35:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departamentos`
--

CREATE TABLE `departamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departamentos`
--

INSERT INTO `departamentos` (`id`, `nombre`, `activo`) VALUES
(1, 'Lima', 1),
(2, 'Arequipa', 1),
(3, 'Cusco', 1),
(4, 'La Libertad', 1),
(5, 'Piura', 1),
(6, 'Lambayeque', 1),
(7, 'Junín', 1),
(8, 'Puno', 1),
(9, 'Ancash', 1),
(10, 'Ica', 1);

-- --------------------------------------------------------

--
-- Table structure for table `disponibilidad_doctor`
--

CREATE TABLE `disponibilidad_doctor` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `disponibilidad_doctor`
--

INSERT INTO `disponibilidad_doctor` (`id`, `doctor_id`, `dia_semana`, `hora_inicio`, `hora_fin`, `activo`) VALUES
(1, 1, 'lunes', '09:00:00', '14:00:00', 1),
(2, 1, 'miercoles', '09:00:00', '14:00:00', 1),
(3, 1, 'viernes', '09:00:00', '13:00:00', 1),
(4, 2, 'martes', '08:00:00', '13:00:00', 1),
(5, 2, 'jueves', '08:00:00', '13:00:00', 1),
(6, 2, 'sabado', '09:00:00', '12:00:00', 1),
(7, 3, 'lunes', '10:00:00', '15:00:00', 1),
(8, 3, 'martes', '10:00:00', '15:00:00', 1),
(9, 3, 'jueves', '10:00:00', '15:00:00', 1),
(10, 4, 'miercoles', '08:00:00', '12:00:00', 1),
(11, 4, 'viernes', '08:00:00', '12:00:00', 1),
(12, 5, 'lunes', '07:00:00', '12:00:00', 1),
(13, 5, 'martes', '07:00:00', '12:00:00', 1),
(14, 5, 'jueves', '07:00:00', '12:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `doctores`
--

CREATE TABLE `doctores` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('masculino','femenino','otro') DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `consultorio_direccion` text DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `provincia_id` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `numero_licencia` varchar(50) NOT NULL,
  `experiencia` text DEFAULT NULL,
  `formacion` text DEFAULT NULL,
  `certificaciones` text DEFAULT NULL,
  `costo_consulta` decimal(10,2) DEFAULT 0.00,
  `activo` tinyint(1) DEFAULT 0,
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctores`
--

INSERT INTO `doctores` (`id`, `usuario_id`, `telefono`, `fecha_nacimiento`, `genero`, `foto_perfil`, `consultorio_direccion`, `departamento_id`, `provincia_id`, `descripcion`, `numero_licencia`, `experiencia`, `formacion`, `certificaciones`, `costo_consulta`, `activo`, `fecha_actualizacion`) VALUES
(1, 2, '555-1001', '1975-03-20', 'masculino', NULL, 'Av. Javier Prado 1235, San Isidro', 1, 1, 'Cardiólogo con 15 años de experiencia en enfermedades cardiovasculares', 'LIC-CARD-001', '15 años en Hospital Central', 'UNMSM - Especialidad en Cardiología', 'Certificado en Ecocardiografía', 800.00, 1, '2025-11-07 13:27:57'),
(2, 3, '555-1002', '1982-07-12', 'femenino', NULL, 'Calle Schell 345, Miraflores', 1, 1, 'Pediatra especializada en atención infantil y vacunación', 'LIC-PED-002', '10 años en consulta privada', 'UPCH - Especialidad en Pediatría', 'Certificado en Vacunación', 600.00, 1, '2025-11-07 13:27:57'),
(3, 4, '555-1003', '1978-11-05', 'masculino', NULL, 'Av. Goyeneche 567, Arequipa', 2, 6, 'Dermatólogo experto en enfermedades de la piel', 'LIC-DER-003', '12 años en Clínica Arequipa', 'UNSA - Especialidad en Dermatología', 'Certificado en Dermatoscopía', 700.00, 1, '2025-11-07 13:27:57'),
(4, 5, '555-1004', '1985-02-28', 'femenino', NULL, 'Jr. Puno 234, Cusco', 3, 9, 'Ginecóloga con enfoque en salud femenina integral', 'LIC-GIN-004', '8 años en Centro Médico', 'UCSP - Especialidad en Ginecología', 'Certificado en Ultrasonido', 750.00, 1, '2025-11-07 13:27:57'),
(5, 6, '555-1005', '1970-09-15', 'masculino', NULL, 'Av. España 890, Trujillo', 4, 14, 'Ortopedista traumatólogo especializado en deportes', 'LIC-ORT-005', '20 años en Hospital Regional', 'UNT - Especialidad en Ortopedia', 'Certificado en Artroscopía', 900.00, 1, '2025-11-07 13:27:57'),
(6, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'eso tilin', 'EL-T1L1N', NULL, 'Soldadura de madera en la USC', NULL, 0.00, 0, '2025-11-08 01:20:12'),
(7, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '3L-P3P3', NULL, NULL, NULL, 0.00, 0, '2025-11-08 01:43:01'),
(8, 21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'asdasd', 'asd', NULL, 'asdsad', NULL, 0.00, 0, '2025-11-08 21:37:11'),
(9, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'eksdrk-2312', NULL, NULL, NULL, 0.00, 0, '2025-12-04 11:24:20');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_especialidad`
--

CREATE TABLE `doctor_especialidad` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_especialidad`
--

INSERT INTO `doctor_especialidad` (`id`, `doctor_id`, `especialidad_id`, `es_principal`, `fecha_registro`) VALUES
(1, 1, 1, 1, '2025-11-07 13:27:57'),
(2, 2, 2, 1, '2025-11-07 13:27:57'),
(3, 3, 3, 1, '2025-11-07 13:27:57'),
(4, 4, 4, 1, '2025-11-07 13:27:57'),
(5, 5, 5, 1, '2025-11-07 13:27:57'),
(6, 6, 4, 1, '2025-11-08 01:20:12'),
(7, 7, 4, 1, '2025-11-08 01:43:01'),
(8, 8, 1, 1, '2025-11-08 21:37:11'),
(9, 9, 4, 1, '2025-12-04 11:24:20');

-- --------------------------------------------------------

--
-- Table structure for table `documentos_medicos`
--

CREATE TABLE `documentos_medicos` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `tipo_documento` enum('receta','estudio','imagen','laboratorio','otros') NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `fecha_documento` date NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documentos_medicos`
--

INSERT INTO `documentos_medicos` (`id`, `paciente_id`, `doctor_id`, `cita_id`, `tipo_documento`, `titulo`, `descripcion`, `archivo_url`, `fecha_documento`, `fecha_subida`) VALUES
(1, 1, 1, 1, 'receta', 'Receta Losartan 50mg', 'Medicamento para control de presión arterial', '/documentos/receta_001.pdf', '2024-01-15', '2025-11-07 13:27:57'),
(2, 2, 2, 2, 'receta', 'Receta antitérmico y antitusivo', 'Medicamentos para fiebre y tos', '/documentos/receta_002.pdf', '2024-01-16', '2025-11-07 13:27:57'),
(3, 3, 3, 3, 'receta', 'Receta crema hidrocortisona', 'Crema para dermatitis por contacto', '/documentos/receta_003.pdf', '2024-01-17', '2025-11-07 13:27:57'),
(4, 4, 4, NULL, 'estudio', 'Resultados Papanicolaou', 'Estudio de citología cervical normal', '/documentos/pap_004.pdf', '2024-01-10', '2025-11-07 13:27:57'),
(5, 5, 5, 5, 'imagen', 'Radiografía rodilla derecha', 'Radiografía que muestra esguince grado 1', '/documentos/radio_005.jpg', '2024-01-19', '2025-11-07 13:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`, `descripcion`, `activa`) VALUES
(1, 'Cardiología', 'Especialidad médica que se ocupa de las enfermedades del corazón y sistema circulatorio', 1),
(2, 'Pediatría', 'Especialidad médica que se ocupa de la salud infantil', 1),
(3, 'Dermatología', 'Especialidad médica que se ocupa de las enfermedades de la piel', 1),
(4, 'Ginecología', 'Especialidad médica que se ocupa de la salud del sistema reproductor femenino', 1),
(5, 'Ortopedia', 'Especialidad médica que se ocupa de las enfermedades del sistema musculoesquelético', 1);

-- --------------------------------------------------------

--
-- Table structure for table `facturas`
--

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `pago_id` int(11) NOT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `concepto` text NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `iva` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `fecha_emision` datetime DEFAULT current_timestamp(),
  `xml_factura` text DEFAULT NULL,
  `pdf_factura` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facturas`
--

INSERT INTO `facturas` (`id`, `pago_id`, `numero_factura`, `concepto`, `subtotal`, `iva`, `total`, `fecha_emision`, `xml_factura`, `pdf_factura`) VALUES
(1, 1, 'FACT-001', 'Consulta de Cardiología - Control de hipertensión', 800.00, 128.00, 928.00, '2025-11-07 13:27:57', NULL, NULL),
(2, 2, 'FACT-002', 'Consulta de Pediatría - Infección respiratoria', 600.00, 96.00, 696.00, '2025-11-07 13:27:57', NULL, NULL),
(3, 3, 'FACT-003', 'Consulta de Dermatología - Dermatitis contacto', 700.00, 112.00, 812.00, '2025-11-07 13:27:57', NULL, NULL),
(4, 5, 'FACT-005', 'Consulta de Ortopedia - Esguince rodilla', 900.00, 144.00, 1044.00, '2025-11-07 13:27:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `tipo` enum('consulta','diagnostico','tratamiento','procedimiento','vacuna','alergia','medicamento') NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `archivos` text DEFAULT NULL,
  `fecha_evento` datetime NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `historial_medico`
--

INSERT INTO `historial_medico` (`id`, `paciente_id`, `doctor_id`, `cita_id`, `tipo`, `titulo`, `descripcion`, `archivos`, `fecha_evento`, `fecha_registro`) VALUES
(1, 1, 1, 1, 'consulta', 'Control de hipertensión', 'Paciente con presión arterial controlada, se ajusta dosis de Losartan', NULL, '2024-01-15 10:00:00', '2025-11-07 13:27:57'),
(2, 2, 2, 2, 'diagnostico', 'Infección respiratoria', 'Diagnóstico de infección viral, se prescribe tratamiento sintomático', NULL, '2024-01-16 09:00:00', '2025-11-07 13:27:57'),
(3, 3, 3, 3, 'tratamiento', 'Dermatitis contacto', 'Se prescribe crema de hidrocortisona para alergia cutánea', NULL, '2024-01-17 11:00:00', '2025-11-07 13:27:57'),
(4, 4, 4, NULL, 'vacuna', 'Vacuna VPH', 'Aplicación de segunda dosis de vacuna contra VPH', NULL, '2024-01-10 14:00:00', '2025-11-07 13:27:57'),
(5, 8, 1, 6, 'diagnostico', 'Esguince rodilla', 'Esguince grado 1, se recomienda reposo y terapia física', NULL, '2024-01-19 08:00:00', '2025-11-07 13:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `mensajes`
--

CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `cita_id` int(11) NOT NULL,
  `remitente_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('texto','archivo','imagen') DEFAULT 'texto',
  `archivo_url` varchar(255) DEFAULT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mensajes`
--

INSERT INTO `mensajes` (`id`, `cita_id`, `remitente_id`, `mensaje`, `tipo`, `archivo_url`, `leido`, `fecha`) VALUES
(1, 1, 2, 'Buenos días, ¿cómo se ha sentido después del ajuste de medicamento?', 'texto', NULL, 1, '2025-11-07 13:27:57'),
(2, 1, 7, 'Mucho mejor doctor, los dolores de cabeza han disminuido', 'texto', NULL, 1, '2025-11-07 13:27:57'),
(3, 2, 3, 'Hola, ¿cómo está la fiebre del niño?', 'texto', NULL, 1, '2025-11-07 13:27:57'),
(4, 2, 8, 'Bajó con el medicamento, pero sigue con tos', 'texto', NULL, 1, '2025-11-07 13:27:57'),
(5, 3, 4, 'Le envío la receta para la crema que mencionamos', 'texto', NULL, 0, '2025-11-07 13:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('masculino','femenino','otro') DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `provincia_id` int(11) DEFAULT NULL,
  `tipo_sangre` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `condiciones_medicas` text DEFAULT NULL,
  `medicamentos_actuales` text DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(100) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(20) DEFAULT NULL,
  `seguro_medico` varchar(100) DEFAULT NULL,
  `numero_poliza_seguro` varchar(100) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pacientes`
--

INSERT INTO `pacientes` (`id`, `usuario_id`, `telefono`, `fecha_nacimiento`, `genero`, `foto_perfil`, `direccion`, `departamento_id`, `provincia_id`, `tipo_sangre`, `alergias`, `condiciones_medicas`, `medicamentos_actuales`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `seguro_medico`, `numero_poliza_seguro`, `fecha_actualizacion`) VALUES
(1, 7, '555-2001', '1990-04-10', 'femenino', NULL, 'Av. Arequipa 1234', 1, 1, 'O+', 'Penicilina, Mariscos', 'Hipertensión leve', 'Losartan 50mg', 'Pedro González', '555-3001', 'SIS', NULL, '2025-11-07 13:27:57'),
(2, 8, '555-2002', '1985-12-25', 'masculino', NULL, 'Jr. Trujillo 456', 4, 14, 'A-', 'Polvo, Ácaros', 'Asma', 'Salbutamol inhalador', 'María Pérez', '555-3002', 'Rimac', NULL, '2025-11-07 13:27:57'),
(3, 9, '555-2003', '1992-08-03', 'femenino', NULL, 'Calle Lima 789', 2, 6, 'B+', 'Nueces', 'Diabetes Tipo 2', 'Metformina 500mg', 'Roberto Ramírez', '555-3003', 'Pacifico', NULL, '2025-11-07 13:27:57'),
(4, 10, '555-2004', '1988-06-18', 'masculino', NULL, 'Av. Grau 321', 6, 16, 'AB+', 'Ninguna', 'Ninguna', 'Ninguno', 'Elena Díaz', '555-3004', 'La Positiva', NULL, '2025-11-07 13:27:57'),
(5, 11, '555-2005', '1995-11-30', 'femenino', NULL, 'Psje. Cusco 654', 3, 9, 'O-', 'Aspirina', 'Migraña crónica', 'Sumatriptán 50mg', 'Luis Castillo', '555-3005', 'Mapfre', NULL, '2025-11-07 13:27:57'),
(6, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-07 15:52:35'),
(7, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-07 18:19:13'),
(8, 22, '999999999', NULL, 'masculino', NULL, 'Calle Madre de Dios 298', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-20 11:22:33'),
(9, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 16:42:22'),
(10, 24, '999999999', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-20 12:14:42');

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `cita_id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','tarjeta_credito','tarjeta_debito','transferencia','paypal') DEFAULT 'efectivo',
  `estado` enum('pendiente','pagado','fallido','reembolsado','cancelado') DEFAULT 'pendiente',
  `referencia_pago` varchar(100) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pagos`
--

INSERT INTO `pagos` (`id`, `cita_id`, `paciente_id`, `doctor_id`, `monto`, `metodo_pago`, `estado`, `referencia_pago`, `fecha_pago`, `fecha_vencimiento`, `fecha_creacion`) VALUES
(1, 1, 1, 1, 800.00, 'tarjeta_credito', 'pagado', 'PAY-001', '2024-01-15 10:30:00', NULL, '2025-11-07 13:27:57'),
(2, 2, 2, 2, 600.00, 'efectivo', 'pagado', 'PAY-002', '2024-01-16 09:30:00', NULL, '2025-11-07 13:27:57'),
(3, 3, 3, 3, 700.00, 'transferencia', 'pagado', 'PAY-003', '2024-01-17 11:30:00', NULL, '2025-11-07 13:27:57'),
(4, 4, 4, 4, 750.00, 'tarjeta_debito', 'pendiente', NULL, NULL, NULL, '2025-11-07 13:27:57'),
(5, 6, 10, 9, 900.00, 'paypal', 'pendiente', 'PAY-005', '2024-01-19 08:30:00', NULL, '2025-11-07 13:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `provincias`
--

CREATE TABLE `provincias` (
  `id` int(11) NOT NULL,
  `departamento_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `provincias`
--

INSERT INTO `provincias` (`id`, `departamento_id`, `nombre`, `activo`) VALUES
(1, 1, 'Lima', 1),
(2, 1, 'Callao', 1),
(3, 1, 'Huaura', 1),
(4, 1, 'Cañete', 1),
(5, 1, 'Huaral', 1),
(6, 2, 'Arequipa', 1),
(7, 2, 'Camaná', 1),
(8, 2, 'Islay', 1),
(9, 2, 'Castilla', 1),
(10, 3, 'Cusco', 1),
(11, 3, 'Quispicanchi', 1),
(12, 3, 'Calca', 1),
(13, 3, 'Urubamba', 1),
(14, 4, 'Trujillo', 1),
(15, 4, 'Chepén', 1),
(16, 4, 'Pacasmayo', 1),
(17, 4, 'Ascope', 1),
(18, 5, 'Piura', 1),
(19, 5, 'Sullana', 1),
(20, 5, 'Paita', 1),
(21, 5, 'Talara', 1),
(22, 6, 'Chiclayo', 1),
(23, 6, 'Lambayeque', 1),
(24, 6, 'Ferreñafe', 1),
(25, 7, 'Huancayo', 1),
(26, 7, 'Concepción', 1),
(27, 7, 'Jauja', 1),
(28, 7, 'Chanchamayo', 1),
(29, 8, 'Puno', 1),
(30, 8, 'Juliaca', 1),
(31, 8, 'Azángaro', 1),
(32, 8, 'Chucuito', 1),
(33, 9, 'Huaraz', 1),
(34, 9, 'Santa', 1),
(35, 9, 'Casma', 1),
(36, 9, 'Yungay', 1),
(37, 10, 'Ica', 1),
(38, 10, 'Chincha', 1),
(39, 10, 'Nazca', 1),
(40, 10, 'Pisco', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo` enum('paciente','doctor','admin') NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `ultimo_login` datetime DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `suspendido` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `nombres`, `apellidos`, `tipo`, `fecha_registro`, `ultimo_login`, `activo`, `suspendido`) VALUES
(1, 'admin@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Administrador', 'admin', '2025-11-07 13:27:57', NULL, 1, 0),
(2, 'dr.garcia@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Roberto', 'García', 'doctor', '2025-11-07 13:27:57', NULL, 1, 0),
(3, 'dra.martinez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'Martínez', 'doctor', '2025-11-07 13:27:57', NULL, 1, 0),
(4, 'dr.rodriguez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Javier', 'Rodríguez', 'doctor', '2025-11-07 13:27:57', NULL, 1, 0),
(5, 'dra.lopez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Laura', 'López', 'doctor', '2025-11-07 13:27:57', NULL, 1, 0),
(6, 'dr.hernandez@clinica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miguel', 'Hernández', 'doctor', '2025-11-07 13:27:57', NULL, 1, 0),
(7, 'paciente1@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'González', 'paciente', '2025-11-07 13:27:57', NULL, 1, 0),
(8, 'paciente2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Pérez', 'paciente', '2025-11-07 13:27:57', NULL, 1, 0),
(9, 'paciente3@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofía', 'Ramírez', 'paciente', '2025-11-07 13:27:57', NULL, 1, 0),
(10, 'paciente4@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Díaz', 'paciente', '2025-11-07 13:27:57', NULL, 1, 0),
(11, 'paciente5@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mariana', 'Castillo', 'paciente', '2025-11-07 13:27:57', NULL, 1, 0),
(12, 'testeo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Testeo', 'Testeoo', 'paciente', '2025-11-07 13:30:03', NULL, 1, 0),
(15, 'testeo2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Testeo2', 'Testeoo2', 'paciente', '2025-11-07 15:00:08', NULL, 1, 0),
(16, 'IDKTEST@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'IDKTEST', 'IDKTEST2', 'paciente', '2025-11-07 15:06:32', NULL, 1, 0),
(17, 'ayuda@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ayudaaa', 'ayuda2', 'paciente', '2025-11-07 15:52:35', NULL, 1, 0),
(18, 'abctest@email.com', '$2b$10$MpDwWTowxmnn6wRAO3YEKOIry1BXh6Y3lNv/ndi3SA2oHhCf9qOk6', 'a', 'b', 'paciente', '2025-11-07 18:19:13', NULL, 1, 0),
(19, 'esotilin@tilines.com', '$2b$10$4YeAGLRj1Tr2UpqyYKtp1e1T3LrqFmK6fWcA82RSMPFnngU/A621S', 'Eso', 'Tilin', 'doctor', '2025-11-08 01:20:12', NULL, 1, 1),
(20, 'elpepe@email.com', '$2b$10$mdNicZReJG1mTdRw0t72guTD1P/dsK8T2Ou8qaYpTC.DYX.BevEda', 'El', 'Pepe', 'doctor', '2025-11-08 01:43:01', NULL, 1, 0),
(21, 'elpepeasd@email.com', '$2b$10$ZMkM0982g73PLeeUKRcjH.r1LtT07EGVN/.d4ryoxqhh9h6QL4VcG', 'sdasd', 'asdsa', 'doctor', '2025-11-08 21:37:11', NULL, 1, 0),
(22, 'miusuariotest@test.com', '$2b$10$mPFWmIs3I0jYLHXIWWOPuOt9GjVYBasqX9CmsqqGuKB3D3qytYSM.', 'Juan', 'Perez', 'paciente', '2025-11-08 21:48:03', NULL, 1, 0),
(23, 'bonnie.green@company.com', '$2b$10$KO4MmBukg9WUuYQXgpVjUObZ36zzegP585ln5TM4xsjCZ47HZfgQ6', 'Diego Alejandro', 'Mauricio', 'paciente', '2025-11-14 16:42:22', NULL, 1, 0),
(24, 'miusuariotest2@test.com', '$2b$10$mdV9oC1CPr7.Kfo/sjy0ZecfdNTFXpa6U5j9u5npKhzrOZYqwhj..', 'Pedro', 'Juarez', 'paciente', '2025-11-20 12:13:41', NULL, 1, 0),
(25, 'miusuariodoctor@test.com', '$2b$10$VQ7uueQ/dn/mrFS/oWm9e.VtIA7VqnDrnSUgi1PHZbpoywKTe1/eK', 'Diego', 'Trujillo Mauricio', 'doctor', '2025-12-04 11:24:20', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `valoraciones`
--

CREATE TABLE `valoraciones` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `puntuacion` tinyint(4) NOT NULL CHECK (`puntuacion` >= 1 and `puntuacion` <= 5),
  `comentario` text DEFAULT NULL,
  `recomendaria` tinyint(1) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `aprobada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `valoraciones`
--

INSERT INTO `valoraciones` (`id`, `doctor_id`, `paciente_id`, `cita_id`, `puntuacion`, `comentario`, `recomendaria`, `fecha`, `aprobada`) VALUES
(2, 2, 2, 2, 4, 'Muy buena doctora, paciente con los niños', 1, '2025-11-07 13:27:57', 1),
(3, 3, 3, 3, 5, 'Resolvió mi problema rápidamente, muy recomendable', 1, '2025-11-07 13:27:57', 1),
(4, 4, 4, 4, 4, 'Atenta y profesional, explica todo muy bien', 1, '2025-11-07 13:27:57', 1),
(5, 5, 8, 6, 5, 'No estoy contento con el servicio', 1, '2025-11-07 13:27:57', 1),
(9, 9, 10, 5, 5, 'Excelente atención, muy profesional y claro en sus explicaciones', 1, '2025-11-07 13:27:57', 1);

-- --------------------------------------------------------

--
-- Table structure for table `verificaciones_doctor`
--

CREATE TABLE `verificaciones_doctor` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `comentarios_admin` text DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `verificaciones_doctor`
--

INSERT INTO `verificaciones_doctor` (`id`, `doctor_id`, `fecha_solicitud`, `estado`, `comentarios_admin`, `fecha_revision`) VALUES
(1, 1, '2025-10-01 10:00:00', 'aprobado', 'Licencia médica validada en CMP.', '2025-10-02 09:30:00'),
(2, 2, '2025-10-03 14:00:00', 'aprobado', 'Verificación completada exitosamente.', '2025-10-04 11:15:00'),
(3, 3, '2025-10-05 09:00:00', 'aprobado', 'Datos coinciden con registro profesional.', '2025-10-06 10:45:00'),
(4, 4, '2025-10-07 08:30:00', 'aprobado', 'Licencia confirmada.', '2025-10-08 13:10:00'),
(5, 5, '2025-10-09 12:00:00', 'pendiente', NULL, NULL),
(6, 6, '2025-11-08 01:20:12', 'pendiente', NULL, NULL),
(7, 7, '2025-11-08 01:43:01', 'pendiente', NULL, NULL),
(8, 8, '2025-11-08 21:37:11', 'pendiente', NULL, NULL),
(9, 9, '2025-12-04 11:24:20', 'aprobado', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_paciente` (`paciente_id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_fecha` (`fecha_hora`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_tipo_consulta` (`tipo_consulta`);

--
-- Indexes for table `contactos_soporte`
--
ALTER TABLE `contactos_soporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo_usuario` (`tipo_usuario`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_contacto` (`fecha_contacto`);

--
-- Indexes for table `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indexes for table `disponibilidad_doctor`
--
ALTER TABLE `disponibilidad_doctor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_disponibilidad` (`doctor_id`,`dia_semana`,`hora_inicio`,`hora_fin`),
  ADD KEY `idx_doctor_dia` (`doctor_id`,`dia_semana`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indexes for table `doctores`
--
ALTER TABLE `doctores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `numero_licencia` (`numero_licencia`),
  ADD KEY `idx_licencia` (`numero_licencia`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_departamento` (`departamento_id`),
  ADD KEY `idx_provincia` (`provincia_id`);

--
-- Indexes for table `doctor_especialidad`
--
ALTER TABLE `doctor_especialidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_doctor_especialidad` (`doctor_id`,`especialidad_id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_especialidad` (`especialidad_id`),
  ADD KEY `idx_principal` (`es_principal`);

--
-- Indexes for table `documentos_medicos`
--
ALTER TABLE `documentos_medicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `cita_id` (`cita_id`),
  ADD KEY `idx_paciente` (`paciente_id`),
  ADD KEY `idx_tipo` (`tipo_documento`),
  ADD KEY `idx_fecha` (`fecha_documento`);

--
-- Indexes for table `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_activa` (`activa`);

--
-- Indexes for table `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pago_id` (`pago_id`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `idx_numero` (`numero_factura`),
  ADD KEY `idx_fecha_emision` (`fecha_emision`);

--
-- Indexes for table `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `cita_id` (`cita_id`),
  ADD KEY `idx_paciente` (`paciente_id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_fecha_evento` (`fecha_evento`);

--
-- Indexes for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cita` (`cita_id`),
  ADD KEY `idx_remitente` (`remitente_id`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_leido` (`leido`);

--
-- Indexes for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_telefono` (`telefono`),
  ADD KEY `idx_tipo_sangre` (`tipo_sangre`),
  ADD KEY `idx_departamento` (`departamento_id`),
  ADD KEY `idx_provincia` (`provincia_id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `idx_cita` (`cita_id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_referencia` (`referencia_pago`);

--
-- Indexes for table `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_provincia` (`departamento_id`,`nombre`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_nombre_completo` (`nombres`,`apellidos`),
  ADD KEY `idx_suspendido` (`suspendido`);

--
-- Indexes for table `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_valoracion` (`cita_id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_paciente` (`paciente_id`),
  ADD KEY `idx_puntuacion` (`puntuacion`),
  ADD KEY `idx_aprobada` (`aprobada`);

--
-- Indexes for table `verificaciones_doctor`
--
ALTER TABLE `verificaciones_doctor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_doctor_estado` (`doctor_id`,`estado`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `citas`
--
ALTER TABLE `citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contactos_soporte`
--
ALTER TABLE `contactos_soporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `disponibilidad_doctor`
--
ALTER TABLE `disponibilidad_doctor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `doctores`
--
ALTER TABLE `doctores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `doctor_especialidad`
--
ALTER TABLE `doctor_especialidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `documentos_medicos`
--
ALTER TABLE `documentos_medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `verificaciones_doctor`
--
ALTER TABLE `verificaciones_doctor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `disponibilidad_doctor`
--
ALTER TABLE `disponibilidad_doctor`
  ADD CONSTRAINT `disponibilidad_doctor_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doctores`
--
ALTER TABLE `doctores`
  ADD CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctores_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `doctores_ibfk_3` FOREIGN KEY (`provincia_id`) REFERENCES `provincias` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `doctor_especialidad`
--
ALTER TABLE `doctor_especialidad`
  ADD CONSTRAINT `doctor_especialidad_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctor_especialidad_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documentos_medicos`
--
ALTER TABLE `documentos_medicos`
  ADD CONSTRAINT `documentos_medicos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `documentos_medicos_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `documentos_medicos_ibfk_3` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `historial_medico_ibfk_3` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pacientes_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pacientes_ibfk_3` FOREIGN KEY (`provincia_id`) REFERENCES `provincias` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `provincias`
--
ALTER TABLE `provincias`
  ADD CONSTRAINT `provincias_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_ibfk_2` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_ibfk_3` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `verificaciones_doctor`
--
ALTER TABLE `verificaciones_doctor`
  ADD CONSTRAINT `verificaciones_doctor_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
