-- Crea una cita futura para el usuario con id=22 (tabla usuarios)
-- usando al doctor cuyo usuario_id=2 (doctor id se resuelve automáticamente)
-- Lista para importar en phpMyAdmin

START TRANSACTION;

-- Parámetros
SET @usuario_id := 22;           -- ID en tabla 'usuarios' del paciente
SET @doctor_usuario_id := 2;     -- ID en tabla 'usuarios' del doctor
SET @fecha_cita := '2025-11-12 10:00:00';  -- Fecha/Hora futura de la cita (UTC)
SET @duracion := 30;
SET @tipo_consulta := 'presencial';
SET @estado := 'confirmada';
SET @motivo := 'Control general anual';
SET @sintomas := 'Dolor de cabeza intermitente y cansancio';

-- Asegurar que exista el registro de paciente para el usuario 22
-- (solo inserta si existe el usuario y no existe aún el paciente)
INSERT INTO pacientes (usuario_id)
SELECT @usuario_id
WHERE EXISTS (SELECT 1 FROM usuarios WHERE id = @usuario_id)
  AND NOT EXISTS (SELECT 1 FROM pacientes WHERE usuario_id = @usuario_id);

-- Resolver IDs reales
SET @paciente_id := (SELECT id FROM pacientes WHERE usuario_id = @usuario_id LIMIT 1);
SET @doctor_id := (SELECT id FROM doctores WHERE usuario_id = @doctor_usuario_id LIMIT 1);

-- Insertar la cita (solo si ambos IDs existen)
INSERT INTO citas (
  paciente_id, doctor_id, fecha_hora, duracion_minutos,
  tipo_consulta, estado, motivo, sintomas
)
SELECT
  @paciente_id, @doctor_id, @fecha_cita, @duracion,
  @tipo_consulta, @estado, @motivo, @sintomas
WHERE @paciente_id IS NOT NULL AND @doctor_id IS NOT NULL;

COMMIT;

-- (Opcional) Ver la cita recién creada con datos del doctor
SELECT
  c.id AS cita_id,
  c.paciente_id,
  c.doctor_id,
  c.fecha_hora,
  c.duracion_minutos,
  c.tipo_consulta,
  c.estado,
  c.motivo,
  c.sintomas,
  du.nombres AS doctor_nombres,
  du.apellidos AS doctor_apellidos
FROM citas c
JOIN doctores d ON c.doctor_id = d.id
JOIN usuarios du ON d.usuario_id = du.id
WHERE c.paciente_id = @paciente_id
ORDER BY c.id DESC
LIMIT 1;
