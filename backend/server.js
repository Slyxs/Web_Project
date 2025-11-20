// Dependencias principales del servidor HTTP
// - express: framework para crear API REST
// - cors: habilita CORS para permitir llamadas desde el frontend (diferente puerto/origen)
// - body-parser: parsea JSON del cuerpo de las peticiones, el termino "parsear" se refiere a convertir datos en un formato utilizable
// - mysql2: cliente para conectarse a MySQL
// - bcrypt: encriptación/validación de contraseñas
// - jsonwebtoken: generación y verificación de tokens JWT para autenticación
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Configuración de la conexión a la base de datos MySQL
// NOTA: en producción, usa variables de entorno para host, user, password y database.
// Consejo: en producción considera usar mysql2.createPool para manejar mejor
// múltiples conexiones y reconexiones automáticas.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zephyr",
  database: "web_project",
});

// Establecer la conexión con MySQL al iniciar el servidor
// Establece la conexión una vez al iniciar.
connection.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL con éxito");
});

// Inicialización de la aplicación Express
const app = express();
app.use(cors()); // Permite que el frontend (Vite/React) consuma esta API
// Nota: por defecto cors() es permisivo. En producción puedes
// restringir orígenes con: cors({ origin: ["https://tu-dominio.com"] })
app.use(bodyParser.json()); // Acepta y parsea JSON en el body de las requests
// Alternativa moderna: app.use(express.json()) sin body-parser en Express >= 4.16

// Clave para firmar/verificar JWT
const JWT_SECRET = "clave_super_segura_para_jwt";

// ================================
// 🧩 RUTA: Registrar usuario (paciente)
// ================================
// Registro de usuario de tipo "paciente".
// Request body: { nombres, apellidos, email, password }
// Respuestas:
//  - 200 OK: registro exitoso (crea usuario y su fila en pacientes)
//  - 400 Bad Request: faltan campos
//  - 500 Internal Server Error: error inesperado en DB/servidor
// Registro de pacientes: crea un usuario (tipo "paciente") y su fila en pacientes.
// (debería respaldarse con índice UNIQUE en DB para email y manejar error 1062).
app.post("/api/register", async (req, res) => {
  const { nombres, apellidos, email, password } = req.body;

  if (!nombres || !apellidos || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
  // 1) Hash de la contraseña (bcrypt con factor 10). Nunca se guarda texto plano.
  const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (email, password, nombres, apellidos, tipo)
      VALUES (?, ?, ?, ?, 'paciente')
    `;

    // Insertar el usuario en tabla usuarios con tipo "paciente"
    // 2) Inserta en usuarios usando placeholders (?) para evitar SQL injection
    connection.query(
      query,
      [email, hashedPassword, nombres, apellidos],
      (err, result) => {
        if (err) {
          console.error("❌ Error al insertar:", err);
          return res.status(500).json({ message: "Error al registrar usuario" });
        }

        const nuevoUsuarioId = result.insertId;
        // Crear la fila asociada en tabla pacientes (datos médicos se completan luego)
  // 3) Crea su registro básico en pacientes (datos médicos vendrán luego)
  const queryPaciente = "INSERT INTO pacientes (usuario_id) VALUES (?)";

        connection.query(queryPaciente, [nuevoUsuarioId], (err2) => {
          if (err2) {
            console.error("⚠️ Error al crear registro de paciente:", err2);
            return res.status(500).json({
              message: "Usuario creado, pero no se pudo registrar en pacientes",
            });
          }

          res.status(200).json({ message: "✅ Usuario registrado con éxito" });
        });
      }
    );
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// ================================
// 🧩 RUTA: Registrar doctor
// ================================
// Registro de usuario de tipo "doctor".
// Request body: { nombres, apellidos, email, password, numero_licencia, especialidad_principal, descripcion?, formacion? }
// Flujo: valida duplicados (email/licencia) -> encripta password -> inserta usuario -> inserta doctor -> asocia especialidad principal -> crea registro de verificación 'pendiente'
// Respuestas:
//  - 200 OK: registro exitoso, pendiente de verificación
//  - 400: email o número de licencia duplicados, o faltan campos
//  - 500: error en cualquiera de los pasos de inserción
// Registro de doctores: flujo en 5 pasos
// 1) Validar entrada
// 2) Chequear duplicados (email en usuarios, licencia en doctores)
// 3) Hash de contraseña
// 4) Insertar en usuarios con tipo "doctor" y luego en doctores
// 5) Asociar especialidad principal y crear registro de verificación 'pendiente'
// Nota: sería ideal envolver en una transacción para consistencia.
app.post("/api/register-doctor", async (req, res) => {
  const {
    nombres,
    apellidos,
    email,
    password,
    numero_licencia,
    especialidad_principal,
    descripcion,
    formacion
  } = req.body;

  if (!nombres || !apellidos || !email || !password || !numero_licencia || !especialidad_principal) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
  // Verificar si el email ya existe (único por tabla usuarios)
  // Verifica si el email ya existe (debería existir UNIQUE en DB)
  const checkEmailQuery = "SELECT id FROM usuarios WHERE email = ?";
    connection.query(checkEmailQuery, [email], async (emailErr, emailResults) => {
      if (emailErr) {
        console.error("❌ Error al verificar email:", emailErr);
        return res.status(500).json({ message: "Error al verificar email" });
      }

      if (emailResults.length > 0) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

  // Verificar si el número de licencia ya existe (único por tabla doctores)
  // Verifica duplicado de número de licencia (único por doctor)
  const checkLicenseQuery = "SELECT id FROM doctores WHERE numero_licencia = ?";
      connection.query(checkLicenseQuery, [numero_licencia], async (licenseErr, licenseResults) => {
        if (licenseErr) {
          console.error("❌ Error al verificar licencia:", licenseErr);
          return res.status(500).json({ message: "Error al verificar número de licencia" });
        }

        if (licenseResults.length > 0) {
          return res.status(400).json({ message: "El número de licencia ya está registrado" });
        }

  // Encriptar contraseña
  // Hash de contraseña del doctor
  const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario como "doctor"
        // Inserta el usuario con rol/ tipo 'doctor'
        const insertUserQuery = `
          INSERT INTO usuarios (email, password, nombres, apellidos, tipo)
          VALUES (?, ?, ?, ?, 'doctor')
        `;

        connection.query(
          insertUserQuery,
          [email, hashedPassword, nombres, apellidos],
          (userErr, userResult) => {
            if (userErr) {
              console.error("❌ Error al insertar usuario:", userErr);
              return res.status(500).json({ message: "Error al registrar usuario" });
            }

            const nuevoUsuarioId = userResult.insertId;

            // Insertar en tabla doctores (perfil profesional)
            // Inserta el perfil profesional del doctor
            const insertDoctorQuery = `
              INSERT INTO doctores (usuario_id, numero_licencia, descripcion, formacion)
              VALUES (?, ?, ?, ?)
            `;

            connection.query(
              insertDoctorQuery,
              [nuevoUsuarioId, numero_licencia, descripcion || null, formacion || null],
              (doctorErr, doctorResult) => {
                if (doctorErr) {
                  console.error("❌ Error al insertar doctor:", doctorErr);
                  return res.status(500).json({ message: "Error al registrar información del doctor" });
                }

                const nuevoDoctorId = doctorResult.insertId;

                // Insertar especialidad principal (relación N:M con marca de principal)
                // Asocia especialidad principal (tabla puente N:M) marcando es_principal=1
                const insertSpecialtyQuery = `
                  INSERT INTO doctor_especialidad (doctor_id, especialidad_id, es_principal)
                  VALUES (?, ?, 1)
                `;

                connection.query(
                  insertSpecialtyQuery,
                  [nuevoDoctorId, especialidad_principal],
                  (specialtyErr) => {
                    if (specialtyErr) {
                      console.error("❌ Error al insertar especialidad:", specialtyErr);
                      return res.status(500).json({ message: "Error al registrar especialidad" });
                    }

                    // Insertar en verificaciones_doctor: estado de verificación de credenciales
                    // Crea registro de verificación de credenciales del doctor
                    const insertVerificationQuery = `
                      INSERT INTO verificaciones_doctor (doctor_id, estado)
                      VALUES (?, 'pendiente')
                    `;

                    connection.query(
                      insertVerificationQuery,
                      [nuevoDoctorId],
                      (verificationErr) => {
                        if (verificationErr) {
                          console.error("❌ Error al insertar verificación:", verificationErr);
                          return res.status(500).json({ message: "Error al crear registro de verificación" });
                        }

                        res.status(200).json({ message: "✅ Doctor registrado con éxito. Pendiente de verificación." });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.error("❌ Error en registro de doctor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// ================================
// 🧩 RUTA: Obtener especialidades
// ================================
// Listado de especialidades para sugerir o asociar en formularios.
// Respuesta: array de { id, nombre }
// Listado de especialidades (público). Útil para autocompletar en formularios.
app.get("/api/especialidades", (req, res) => {
  const query = "SELECT id, nombre FROM especialidades ORDER BY nombre";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener especialidades:", err);
      return res.status(500).json({ message: "Error al obtener especialidades" });
    }

    res.json(results);
  });
});

// ================================
// 🧩 RUTA: Iniciar sesión (CORREGIDA)
// ================================
// Login de usuarios (paciente/doctor/admin).
// Request body: { email, password }
// Flujo: valida credenciales -> revisa si la cuenta está suspendida -> genera JWT con 2h de expiración.
// Respuestas: 200 OK con token y datos mínimos del usuario; 401 para credenciales inválidas o suspendido; 500 para errores de DB.
// Login de cualquier tipo de usuario. Devuelve JWT si credenciales son válidas.
// Notas:
// - Valida si la cuenta está suspendida (columna usuarios.suspendido = 1)
// - El token incluye: id, email, tipo; expira en 2h.
// - El frontend debe enviar Authorization: "Bearer <token>" en rutas protegidas.
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Faltan credenciales" });

  // Busca al usuario por email (debería haber índice para performance)
  const query = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error al buscar usuario:", err);
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }

    if (results.length === 0)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const user = results[0];

    // ✅ VERIFICACIÓN DE SUSPENSIÓN (nueva columna)
    if (user.suspendido === 1) {
      return res.status(401).json({ message: "Cuenta suspendida. Contacte al administrador." });
    }

  // Comparar password en texto plano con el hash almacenado
  // Compara password en texto plano vs hash (bcrypt)
  const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // Firmar JWT con datos mínimos para identificar al usuario en el frontend
    // Firma del token JWT con expiración de 2 horas
    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "✅ Login exitoso",
      token,
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        tipo: user.tipo,
      },
    });
  });
});


// ================================
// 🧩 RUTA: Próxima cita de un paciente (por usuario_id) con JWT
// ================================
// Próxima cita de un paciente (consulta segura con JWT).
// Seguridad: solo el propio usuario (decoded.id) o un admin pueden consultar.
// Path param: :usuarioId (id de la tabla usuarios)
// Próxima cita de un paciente por usuarioId.
// Seguridad: requiere JWT y autorización (el mismo usuario o admin).
// Regla: primera cita futura con estado en ('pendiente','confirmada','en_curso').
app.get("/api/pacientes/:usuarioId/proxima-cita", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const usuarioId = parseInt(req.params.usuarioId, 10);
  if (!Number.isInteger(usuarioId)) {
    return res.status(400).json({ message: "usuarioId inválido" });
  }

  // Solo el propio usuario o un admin puede consultar la próxima cita del paciente
  // Autorización: sólo el dueño del perfil o un admin
  if (decoded.tipo !== "admin" && decoded.id !== usuarioId) {
    return res.status(403).json({ message: "No autorizado" });
  }

  // Consulta: busca la primera cita futura con estado válido
  const sql = `
    SELECT
      c.id AS cita_id,
      c.fecha_hora,
      c.duracion_minutos,
      c.tipo_consulta,
      c.estado,
      c.motivo,
      d.id AS doctor_id,
      u.nombres AS doctor_nombres,
      u.apellidos AS doctor_apellidos
    FROM citas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN doctores d ON c.doctor_id = d.id
    JOIN usuarios u ON d.usuario_id = u.id
    WHERE p.usuario_id = ?
      AND c.fecha_hora > NOW()
      AND c.estado IN ('pendiente','confirmada','en_curso')
    ORDER BY c.fecha_hora ASC
    LIMIT 1
  `;

  connection.query(sql, [usuarioId], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener próxima cita:", err);
      return res.status(500).json({ message: "Error al obtener próxima cita" });
    }

    if (rows.length === 0) {
      return res.status(200).json({ proximaCita: null });
    }

    const r = rows[0];
    res.status(200).json({
      proximaCita: {
        id: r.cita_id,
        fecha_hora: r.fecha_hora, // formato MySQL DATETIME
        duracion_minutos: r.duracion_minutos,
        tipo_consulta: r.tipo_consulta,
        estado: r.estado,
        motivo: r.motivo
      },
      doctor: {
        id: r.doctor_id,
        nombres: r.doctor_nombres,
        apellidos: r.doctor_apellidos
      }
    });
  });
});

// ================================
// 🧩 RUTA: Obtener perfil completo del paciente
// ================================
// Obtener perfil completo del paciente autenticado.
// Incluye datos de usuarios + detalle médico en pacientes.
// Obtiene el perfil de un paciente autenticado (por JWT).
// Combina datos básicos (usuarios) con info médica (pacientes) vía LEFT JOIN.
app.get("/api/pacientes/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  // LEFT JOIN porque puede haber usuarios sin fila en pacientes aún (recién registrados)
  const sql = `
    SELECT 
      u.id, u.email, u.nombres, u.apellidos, u.tipo,
      p.telefono, p.fecha_nacimiento, p.genero, p.foto_perfil, p.direccion,
      p.departamento_id, p.provincia_id, p.tipo_sangre, p.alergias,
      p.condiciones_medicas, p.medicamentos_actuales,
      p.contacto_emergencia_nombre, p.contacto_emergencia_telefono,
      p.seguro_medico, p.numero_poliza_seguro
    FROM usuarios u
    LEFT JOIN pacientes p ON u.id = p.usuario_id
    WHERE u.id = ? AND u.tipo = 'paciente'
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener perfil:", err);
      return res.status(500).json({ message: "Error al obtener perfil" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.status(200).json(rows[0]);
  });
});

// ================================
// 🧩 RUTA: Actualizar perfil del paciente
// ================================
// Actualizar perfil del paciente autenticado.
// Actualiza datos en usuarios y en pacientes (crea si no existe).
// NOTA: Valida por JWT el usuario actual, no permite editar otros perfiles.
// Actualiza el perfil del paciente autenticado.
// 1) Actualiza nombres/apellidos/email en usuarios
// 2) Si existe fila en pacientes -> UPDATE; si no, intenta INSERT
// Nota Importante: hay un posible bug en el INSERT de pacientes (ver abajo).
// Recomendación: usar "INSERT INTO pacientes SET ?" con el objeto completo.
app.put("/api/pacientes/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const {
    nombres, apellidos, email, telefono, fecha_nacimiento, genero,
    direccion, departamento_id, provincia_id, tipo_sangre, alergias,
    condiciones_medicas, medicamentos_actuales, contacto_emergencia_nombre,
    contacto_emergencia_telefono, seguro_medico, numero_poliza_seguro
  } = req.body;

  try {
    // 1) Actualizar datos básicos en tabla usuarios
    const updateUsuarioQuery = `
      UPDATE usuarios 
      SET nombres = ?, apellidos = ?, email = ?
      WHERE id = ?
    `;
    
    connection.query(
      updateUsuarioQuery,
      [nombres, apellidos, email, decoded.id],
      (err) => {
        if (err) {
          console.error("❌ Error al actualizar usuario:", err);
          return res.status(500).json({ message: "Error al actualizar datos de usuario" });
        }

  // 2) Verificar si existe registro en pacientes para este usuario
  const checkPacienteQuery = "SELECT id FROM pacientes WHERE usuario_id = ?";
        
        connection.query(checkPacienteQuery, [decoded.id], (err, results) => {
          if (err) {
            console.error("❌ Error al verificar paciente:", err);
            return res.status(500).json({ message: "Error al verificar paciente" });
          }

          // Campos médicos/extra del perfil del paciente
          // Campos médicos adicionales del perfil del paciente
          const pacienteData = {
            telefono, fecha_nacimiento, genero, direccion, departamento_id,
            provincia_id, tipo_sangre, alergias, condiciones_medicas,
            medicamentos_actuales, contacto_emergencia_nombre,
            contacto_emergencia_telefono, seguro_medico, numero_poliza_seguro
          };

          if (results.length > 0) {
            // 3a) Actualizar paciente existente
            const updatePacienteQuery = `
              UPDATE pacientes SET ? WHERE usuario_id = ?
            `;
            connection.query(updatePacienteQuery, [pacienteData, decoded.id], (err) => {
              if (err) {
                console.error("❌ Error al actualizar paciente:", err);
                return res.status(500).json({ message: "Error al actualizar datos médicos" });
              }
              res.status(200).json({ message: "✅ Perfil actualizado con éxito" });
            });
          } else {
            // 3b) Insertar nuevo registro de paciente (cuando aún no existe)
            // ATENCIÓN: La forma "INSERT INTO pacientes (usuario_id, ?) VALUES (?, ?)" no es válida en MySQL.
            // Sugerencia: construir dinámicamente columnas/values o insertar con "SET ?".
            // Ejemplo seguro (no implementado aquí para no cambiar comportamiento):
            //   const insertPacienteQuery = 'INSERT INTO pacientes SET ?';
            //   connection.query(insertPacienteQuery, [{ usuario_id: decoded.id, ...pacienteData }], cb)
            // Posible bug SQL: la sintaxis (usuario_id, ?) VALUES (?, ?) no es válida.
            // Alternativa robusta (sugerida):
            //    const insertPacienteQuery = 'INSERT INTO pacientes SET ?';
            //    connection.query(insertPacienteQuery, [{ usuario_id: decoded.id, ...pacienteData }], cb)
            const insertPacienteQuery = `
              INSERT INTO pacientes (usuario_id, ?) VALUES (?, ?)
            `; // Mantiene el código actual para no cambiar comportamiento.
            connection.query(insertPacienteQuery, [pacienteData, decoded.id], (err) => {
              if (err) {
                console.error("❌ Error al insertar paciente:", err);
                return res.status(500).json({ message: "Error al crear datos médicos" });
              }
              res.status(200).json({ message: "✅ Perfil creado y actualizado con éxito" });
            });
          }
        });
      }
    );
  } catch (error) {
    console.error("❌ Error en actualización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// ================================
// 🧩 RUTA: Historial médico del paciente
// ================================
// Historial médico del paciente autenticado.
// Retorna eventos clínicos ordenados por fecha (descendente).
// Historial médico del paciente autenticado.
// Devuelve eventos clínicos ordenados por fecha (DESC), con datos del doctor si existe.
app.get("/api/pacientes/historial", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT 
      hm.id,
      hm.tipo,
      hm.titulo,
      hm.descripcion,
      hm.fecha_evento,
      u.nombres as doctor_nombres,
      u.apellidos as doctor_apellidos
    FROM historial_medico hm
    JOIN pacientes p ON hm.paciente_id = p.id
    LEFT JOIN doctores d ON hm.doctor_id = d.id
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    WHERE p.usuario_id = ?
    ORDER BY hm.fecha_evento DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener historial:", err);
      return res.status(500).json({ message: "Error al obtener historial médico" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Citas del paciente
// ================================
// Listado de citas del paciente autenticado, con info del doctor y su especialidad principal.
// Citas del paciente autenticado.
// Incluye nombre del doctor y su especialidad principal (de.es_principal = 1).
app.get("/api/pacientes/citas", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT 
      c.id,
      c.fecha_hora,
      c.estado,
      c.motivo,
      c.tipo_consulta,
      u.nombres as doctor_nombres,
      u.apellidos as doctor_apellidos,
      e.nombre as especialidad
    FROM citas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN doctores d ON c.doctor_id = d.id
    JOIN usuarios u ON d.usuario_id = u.id
    JOIN doctor_especialidad de ON d.id = de.doctor_id AND de.es_principal = 1
    JOIN especialidades e ON de.especialidad_id = e.id
    WHERE p.usuario_id = ?
    ORDER BY c.fecha_hora DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener citas:", err);
      return res.status(500).json({ message: "Error al obtener citas" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Pagos y facturas del paciente
// ================================
// Pagos y facturas del paciente autenticado.
// Incluye unión con doctor/especialidad y posible factura asociada.
// Pagos del paciente autenticado junto a factura (si existe) y especialidad del doctor.
app.get("/api/pacientes/pagos", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT 
      p.id,
      p.monto,
      p.metodo_pago,
      p.estado,
      p.fecha_pago,
      f.numero_factura,
      f.fecha_emision,
      u.nombres as doctor_nombres,
      u.apellidos as doctor_apellidos,
      e.nombre as especialidad
    FROM pagos p
    JOIN pacientes pa ON p.paciente_id = pa.id
    JOIN doctores d ON p.doctor_id = d.id
    JOIN usuarios u ON d.usuario_id = u.id
    JOIN doctor_especialidad de ON d.id = de.doctor_id AND de.es_principal = 1
    JOIN especialidades e ON de.especialidad_id = e.id
    LEFT JOIN facturas f ON p.id = f.pago_id
    WHERE pa.usuario_id = ?
    ORDER BY p.fecha_creacion DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener pagos:", err);
      return res.status(500).json({ message: "Error al obtener pagos" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Valoraciones del paciente
// ================================
// Valoraciones hechas por el paciente autenticado sobre doctores.
// Valoraciones hechas por el paciente a sus doctores.
app.get("/api/pacientes/valoraciones", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT 
      v.id,
      v.puntuacion,
      v.comentario,
      v.fecha,
      u.nombres as doctor_nombres,
      u.apellidos as doctor_apellidos
    FROM valoraciones v
    JOIN pacientes p ON v.paciente_id = p.id
    JOIN doctores d ON v.doctor_id = d.id
    JOIN usuarios u ON d.usuario_id = u.id
    WHERE p.usuario_id = ?
    ORDER BY v.fecha DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener valoraciones:", err);
      return res.status(500).json({ message: "Error al obtener valoraciones" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Enviar mensaje de contacto
// ================================
// Endpoint de contacto/soporte para recibir mensajes desde el formulario.
// Request body: { tipo_usuario, email, mensaje }
// Guarda mensajes desde el formulario de contacto/soporte.
// No requiere autenticación pero valida campos requeridos.
app.post("/api/contacto", (req, res) => {
  const { tipo_usuario, email, mensaje } = req.body;

  if (!tipo_usuario || !email || !mensaje) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO contactos_soporte (tipo_usuario, email, mensaje)
    VALUES (?, ?, ?)
  `;

  connection.query(query, [tipo_usuario, email, mensaje], (err) => {
    if (err) {
      console.error("❌ Error al guardar mensaje de contacto:", err);
      return res.status(500).json({ message: "Error al enviar mensaje" });
    }
    res.status(200).json({ message: "✅ Mensaje enviado con éxito" });
  });
});

// ================================
// 🧩 RUTA: Validar sesión (opcional)
// ================================
// Verifica si un token JWT es válido y retorna su payload.
// Endpoint utilitario: valida un JWT y devuelve su payload si es válido.
// Útil para mantener sesiones en el frontend (p. ej., rehidratar usuario al recargar).
app.get("/api/verify-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Token inválido o expirado" });
  }
});

// ================================
// 🚀 Iniciar servidor
// ================================
// Inicio del servidor HTTP
// Puerto de escucha del backend. Puedes variar por env (process.env.PORT)
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`)
);
