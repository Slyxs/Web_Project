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
// 🧩 RUTAS DE PERFIL DE DOCTOR
// ================================

// ================================
// 🧩 RUTA: Obtener perfil completo del doctor
// ================================
// Obtiene el perfil del doctor autenticado.
// Combina datos básicos (usuarios) con info profesional (doctores) y especialidades.
app.get("/api/doctores/profile", (req, res) => {
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
      u.id, u.email, u.nombres, u.apellidos, u.tipo,
      d.id as doctor_id, d.telefono, d.fecha_nacimiento, d.genero, d.foto_perfil,
      d.consultorio_direccion, d.departamento_id, d.provincia_id,
      d.descripcion, d.numero_licencia, d.experiencia, d.formacion,
      d.certificaciones, d.costo_consulta, d.activo,
      dep.nombre as departamento_nombre,
      prov.nombre as provincia_nombre
    FROM usuarios u
    LEFT JOIN doctores d ON u.id = d.usuario_id
    LEFT JOIN departamentos dep ON d.departamento_id = dep.id
    LEFT JOIN provincias prov ON d.provincia_id = prov.id
    WHERE u.id = ? AND u.tipo = 'doctor'
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener perfil del doctor:", err);
      return res.status(500).json({ message: "Error al obtener perfil" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    // Obtener especialidades del doctor
    const doctorId = rows[0].doctor_id;
    const sqlEspecialidades = `
      SELECT e.id, e.nombre, de.es_principal
      FROM doctor_especialidad de
      JOIN especialidades e ON de.especialidad_id = e.id
      WHERE de.doctor_id = ?
      ORDER BY de.es_principal DESC
    `;

    connection.query(sqlEspecialidades, [doctorId], (err2, especialidades) => {
      if (err2) {
        console.error("❌ Error al obtener especialidades:", err2);
        return res.status(500).json({ message: "Error al obtener especialidades" });
      }

      res.status(200).json({
        ...rows[0],
        especialidades: especialidades || []
      });
    });
  });
});

// ================================
// 🧩 RUTA: Actualizar perfil del doctor
// ================================
// Actualiza datos en usuarios y en doctores.
// NOTA: Valida por JWT el usuario actual, no permite editar otros perfiles.
app.put("/api/doctores/profile", async (req, res) => {
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
    consultorio_direccion, departamento_id, provincia_id,
    descripcion, experiencia, formacion, certificaciones, costo_consulta
  } = req.body;

  // Función helper para convertir valores vacíos a null
  const emptyToNull = (val) => (val === "" || val === undefined ? null : val);

  try {
    // 1) Actualizar datos básicos en tabla usuarios
    const updateUsuarioQuery = `
      UPDATE usuarios 
      SET nombres = ?, apellidos = ?, email = ?
      WHERE id = ? AND tipo = 'doctor'
    `;
    
    connection.query(
      updateUsuarioQuery,
      [nombres, apellidos, email, decoded.id],
      (err) => {
        if (err) {
          console.error("❌ Error al actualizar usuario:", err);
          return res.status(500).json({ message: "Error al actualizar datos de usuario" });
        }

        // 2) Actualizar datos profesionales en tabla doctores
        const updateDoctorQuery = `
          UPDATE doctores SET 
            telefono = ?, fecha_nacimiento = ?, genero = ?,
            consultorio_direccion = ?, departamento_id = ?, provincia_id = ?,
            descripcion = ?, experiencia = ?, formacion = ?,
            certificaciones = ?, costo_consulta = ?
          WHERE usuario_id = ?
        `;
        
        connection.query(
          updateDoctorQuery,
          [
            emptyToNull(telefono), 
            emptyToNull(fecha_nacimiento), 
            emptyToNull(genero),
            emptyToNull(consultorio_direccion), 
            emptyToNull(departamento_id), 
            emptyToNull(provincia_id),
            emptyToNull(descripcion), 
            emptyToNull(experiencia), 
            emptyToNull(formacion),
            emptyToNull(certificaciones), 
            emptyToNull(costo_consulta), 
            decoded.id
          ],
          (err2) => {
            if (err2) {
              console.error("❌ Error al actualizar doctor:", err2);
              return res.status(500).json({ message: "Error al actualizar datos profesionales" });
            }
            res.status(200).json({ message: "✅ Perfil actualizado con éxito" });
          }
        );
      }
    );
  } catch (error) {
    console.error("❌ Error en actualización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// ================================
// 🧩 RUTA: Citas del doctor
// ================================
// Listado de citas del doctor autenticado, con info del paciente.
app.get("/api/doctores/citas", (req, res) => {
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
      c.duracion_minutos,
      c.tipo_consulta,
      c.estado,
      c.motivo,
      c.sintomas,
      c.notas_doctor,
      c.diagnostico,
      c.tratamiento,
      up.nombres as paciente_nombres,
      up.apellidos as paciente_apellidos,
      p.telefono as paciente_telefono
    FROM citas c
    JOIN doctores d ON c.doctor_id = d.id
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN usuarios up ON p.usuario_id = up.id
    WHERE d.usuario_id = ?
    ORDER BY c.fecha_hora DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener citas del doctor:", err);
      return res.status(500).json({ message: "Error al obtener citas" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Próxima cita del doctor
// ================================
// Próxima cita del doctor autenticado con datos del paciente.
app.get("/api/doctores/proxima-cita", (req, res) => {
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
      c.id AS cita_id,
      c.fecha_hora,
      c.duracion_minutos,
      c.tipo_consulta,
      c.estado,
      c.motivo,
      c.sintomas,
      p.id AS paciente_id,
      up.nombres AS paciente_nombres,
      up.apellidos AS paciente_apellidos,
      p.telefono AS paciente_telefono
    FROM citas c
    JOIN doctores d ON c.doctor_id = d.id
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN usuarios up ON p.usuario_id = up.id
    WHERE d.usuario_id = ?
      AND c.fecha_hora > NOW()
      AND c.estado IN ('pendiente','confirmada','en_curso')
    ORDER BY c.fecha_hora ASC
    LIMIT 1
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
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
        fecha_hora: r.fecha_hora,
        duracion_minutos: r.duracion_minutos,
        tipo_consulta: r.tipo_consulta,
        estado: r.estado,
        motivo: r.motivo,
        sintomas: r.sintomas
      },
      paciente: {
        id: r.paciente_id,
        nombres: r.paciente_nombres,
        apellidos: r.paciente_apellidos,
        telefono: r.paciente_telefono
      }
    });
  });
});

// ================================
// 🧩 RUTA: Actualizar notas/diagnóstico de una cita
// ================================
// Permite al doctor actualizar notas, diagnóstico y tratamiento de una cita.
app.put("/api/doctores/citas/:citaId", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const citaId = parseInt(req.params.citaId, 10);
  const { notas_doctor, diagnostico, tratamiento, estado } = req.body;

  // Verificar que la cita pertenece al doctor autenticado
  const checkQuery = `
    SELECT c.id FROM citas c
    JOIN doctores d ON c.doctor_id = d.id
    WHERE c.id = ? AND d.usuario_id = ?
  `;

  connection.query(checkQuery, [citaId, decoded.id], (err, results) => {
    if (err) {
      console.error("❌ Error al verificar cita:", err);
      return res.status(500).json({ message: "Error al verificar cita" });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: "No autorizado o cita no encontrada" });
    }

    const updateQuery = `
      UPDATE citas SET 
        notas_doctor = ?, diagnostico = ?, tratamiento = ?, estado = ?
      WHERE id = ?
    `;

    connection.query(
      updateQuery,
      [notas_doctor, diagnostico, tratamiento, estado, citaId],
      (err2) => {
        if (err2) {
          console.error("❌ Error al actualizar cita:", err2);
          return res.status(500).json({ message: "Error al actualizar cita" });
        }
        res.status(200).json({ message: "✅ Cita actualizada con éxito" });
      }
    );
  });
});

// ================================
// 🧩 RUTA: Disponibilidad del doctor
// ================================
// Obtiene los horarios de disponibilidad del doctor autenticado.
app.get("/api/doctores/disponibilidad", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT dd.id, dd.dia_semana, dd.hora_inicio, dd.hora_fin, dd.activo
    FROM disponibilidad_doctor dd
    JOIN doctores d ON dd.doctor_id = d.id
    WHERE d.usuario_id = ?
    ORDER BY FIELD(dd.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener disponibilidad:", err);
      return res.status(500).json({ message: "Error al obtener disponibilidad" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Actualizar/Crear disponibilidad del doctor
// ================================
// Crea o actualiza la disponibilidad de un día específico.
app.put("/api/doctores/disponibilidad", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const { dia_semana, hora_inicio, hora_fin, activo } = req.body;

  if (!dia_semana || !hora_inicio || !hora_fin) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Obtener doctor_id desde usuario_id
  const getDoctorId = "SELECT id FROM doctores WHERE usuario_id = ?";
  
  connection.query(getDoctorId, [decoded.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: "Error al obtener doctor" });
    }

    const doctorId = results[0].id;

    // Verificar si ya existe disponibilidad para ese día
    const checkQuery = `
      SELECT id FROM disponibilidad_doctor 
      WHERE doctor_id = ? AND dia_semana = ?
    `;

    connection.query(checkQuery, [doctorId, dia_semana], (err2, existing) => {
      if (err2) {
        return res.status(500).json({ message: "Error al verificar disponibilidad" });
      }

      if (existing.length > 0) {
        // Actualizar existente
        const updateQuery = `
          UPDATE disponibilidad_doctor 
          SET hora_inicio = ?, hora_fin = ?, activo = ?
          WHERE doctor_id = ? AND dia_semana = ?
        `;
        connection.query(
          updateQuery,
          [hora_inicio, hora_fin, activo !== undefined ? activo : 1, doctorId, dia_semana],
          (err3) => {
            if (err3) {
              return res.status(500).json({ message: "Error al actualizar disponibilidad" });
            }
            res.status(200).json({ message: "✅ Disponibilidad actualizada" });
          }
        );
      } else {
        // Crear nuevo
        const insertQuery = `
          INSERT INTO disponibilidad_doctor (doctor_id, dia_semana, hora_inicio, hora_fin, activo)
          VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(
          insertQuery,
          [doctorId, dia_semana, hora_inicio, hora_fin, activo !== undefined ? activo : 1],
          (err3) => {
            if (err3) {
              return res.status(500).json({ message: "Error al crear disponibilidad" });
            }
            res.status(200).json({ message: "✅ Disponibilidad creada" });
          }
        );
      }
    });
  });
});

// ================================
// 🧩 RUTA: Eliminar disponibilidad del doctor
// ================================
app.delete("/api/doctores/disponibilidad/:disponibilidadId", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const disponibilidadId = parseInt(req.params.disponibilidadId, 10);

  // Verificar que la disponibilidad pertenece al doctor autenticado
  const checkQuery = `
    SELECT dd.id FROM disponibilidad_doctor dd
    JOIN doctores d ON dd.doctor_id = d.id
    WHERE dd.id = ? AND d.usuario_id = ?
  `;

  connection.query(checkQuery, [disponibilidadId, decoded.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al verificar disponibilidad" });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const deleteQuery = "DELETE FROM disponibilidad_doctor WHERE id = ?";
    connection.query(deleteQuery, [disponibilidadId], (err2) => {
      if (err2) {
        return res.status(500).json({ message: "Error al eliminar disponibilidad" });
      }
      res.status(200).json({ message: "✅ Disponibilidad eliminada" });
    });
  });
});

// ================================
// 🧩 RUTA: Pacientes del doctor
// ================================
// Lista todos los pacientes que han tenido citas con el doctor.
app.get("/api/doctores/pacientes", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const sql = `
    SELECT DISTINCT
      p.id as paciente_id,
      up.nombres,
      up.apellidos,
      up.email,
      p.telefono,
      p.fecha_nacimiento,
      p.genero,
      p.tipo_sangre,
      p.alergias,
      p.condiciones_medicas,
      (SELECT COUNT(*) FROM citas WHERE paciente_id = p.id AND doctor_id = d.id) as total_citas,
      (SELECT MAX(fecha_hora) FROM citas WHERE paciente_id = p.id AND doctor_id = d.id) as ultima_cita
    FROM citas c
    JOIN doctores d ON c.doctor_id = d.id
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN usuarios up ON p.usuario_id = up.id
    WHERE d.usuario_id = ?
    ORDER BY ultima_cita DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener pacientes:", err);
      return res.status(500).json({ message: "Error al obtener pacientes" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Historial médico de un paciente (visto por el doctor)
// ================================
// El doctor puede ver el historial de un paciente con el que ha tenido citas.
app.get("/api/doctores/pacientes/:pacienteId/historial", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const pacienteId = parseInt(req.params.pacienteId, 10);

  // Verificar que el doctor ha tenido citas con este paciente
  const checkQuery = `
    SELECT c.id FROM citas c
    JOIN doctores d ON c.doctor_id = d.id
    WHERE c.paciente_id = ? AND d.usuario_id = ?
    LIMIT 1
  `;

  connection.query(checkQuery, [pacienteId, decoded.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al verificar relación" });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: "No autorizado para ver este historial" });
    }

    const sql = `
      SELECT 
        hm.id,
        hm.tipo,
        hm.titulo,
        hm.descripcion,
        hm.fecha_evento,
        ud.nombres as doctor_nombres,
        ud.apellidos as doctor_apellidos
      FROM historial_medico hm
      LEFT JOIN doctores d ON hm.doctor_id = d.id
      LEFT JOIN usuarios ud ON d.usuario_id = ud.id
      WHERE hm.paciente_id = ?
      ORDER BY hm.fecha_evento DESC
    `;

    connection.query(sql, [pacienteId], (err2, rows) => {
      if (err2) {
        console.error("❌ Error al obtener historial:", err2);
        return res.status(500).json({ message: "Error al obtener historial" });
      }
      res.status(200).json(rows);
    });
  });
});

// ================================
// 🧩 RUTA: Valoraciones recibidas por el doctor
// ================================
// Muestra las valoraciones que los pacientes han dejado al doctor.
app.get("/api/doctores/valoraciones", (req, res) => {
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
      up.nombres as paciente_nombres,
      up.apellidos as paciente_apellidos
    FROM valoraciones v
    JOIN doctores d ON v.doctor_id = d.id
    JOIN pacientes p ON v.paciente_id = p.id
    JOIN usuarios up ON p.usuario_id = up.id
    WHERE d.usuario_id = ?
    ORDER BY v.fecha DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener valoraciones:", err);
      return res.status(500).json({ message: "Error al obtener valoraciones" });
    }

    // Calcular estadísticas
    const totalValoraciones = rows.length;
    const promedioValoracion = totalValoraciones > 0 
      ? rows.reduce((sum, v) => sum + v.puntuacion, 0) / totalValoraciones 
      : 0;

    res.status(200).json({
      valoraciones: rows,
      estadisticas: {
        total: totalValoraciones,
        promedio: Math.round(promedioValoracion * 10) / 10
      }
    });
  });
});

// ================================
// 🧩 RUTA: Pagos/ingresos del doctor
// ================================
// Muestra los pagos recibidos por el doctor (ingresos).
app.get("/api/doctores/ingresos", (req, res) => {
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
      pg.id,
      pg.monto,
      pg.metodo_pago,
      pg.estado,
      pg.fecha_pago,
      pg.fecha_creacion,
      f.numero_factura,
      up.nombres as paciente_nombres,
      up.apellidos as paciente_apellidos,
      c.fecha_hora as fecha_cita,
      c.tipo_consulta
    FROM pagos pg
    JOIN doctores d ON pg.doctor_id = d.id
    JOIN pacientes p ON pg.paciente_id = p.id
    JOIN usuarios up ON p.usuario_id = up.id
    LEFT JOIN citas c ON pg.cita_id = c.id
    LEFT JOIN facturas f ON pg.id = f.pago_id
    WHERE d.usuario_id = ?
    ORDER BY pg.fecha_creacion DESC
  `;

  connection.query(sql, [decoded.id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener ingresos:", err);
      return res.status(500).json({ message: "Error al obtener ingresos" });
    }

    // Calcular estadísticas de ingresos
    const ingresosTotales = rows
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + parseFloat(p.monto), 0);
    
    const ingresosPendientes = rows
      .filter(p => p.estado === 'pendiente')
      .reduce((sum, p) => sum + parseFloat(p.monto), 0);

    res.status(200).json({
      pagos: rows,
      estadisticas: {
        total_pagado: ingresosTotales,
        total_pendiente: ingresosPendientes,
        cantidad_pagos: rows.length
      }
    });
  });
});

// ================================
// 🧩 RUTA: Estadísticas del dashboard del doctor
// ================================
// Proporciona datos resumidos para el dashboard del doctor.
app.get("/api/doctores/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  // Obtener doctor_id
  const getDoctorId = "SELECT id FROM doctores WHERE usuario_id = ?";
  
  connection.query(getDoctorId, [decoded.id], (err, doctorResults) => {
    if (err || doctorResults.length === 0) {
      return res.status(500).json({ message: "Error al obtener doctor" });
    }

    const doctorId = doctorResults[0].id;

    // Consultas para estadísticas
    const queries = {
      citasHoy: `
        SELECT COUNT(*) as count FROM citas 
        WHERE doctor_id = ? AND DATE(fecha_hora) = CURDATE()
      `,
      citasSemana: `
        SELECT COUNT(*) as count FROM citas 
        WHERE doctor_id = ? AND YEARWEEK(fecha_hora, 1) = YEARWEEK(CURDATE(), 1)
      `,
      citasPendientes: `
        SELECT COUNT(*) as count FROM citas 
        WHERE doctor_id = ? AND estado IN ('pendiente', 'confirmada') AND fecha_hora > NOW()
      `,
      totalPacientes: `
        SELECT COUNT(DISTINCT paciente_id) as count FROM citas WHERE doctor_id = ?
      `,
      ingresosMes: `
        SELECT COALESCE(SUM(monto), 0) as total FROM pagos 
        WHERE doctor_id = ? AND estado = 'pagado' 
        AND MONTH(fecha_pago) = MONTH(CURDATE()) AND YEAR(fecha_pago) = YEAR(CURDATE())
      `,
      valoracionPromedio: `
        SELECT COALESCE(AVG(puntuacion), 0) as promedio, COUNT(*) as total 
        FROM valoraciones WHERE doctor_id = ?
      `
    };

    const stats = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, sql]) => {
      connection.query(sql, [doctorId], (err, results) => {
        if (!err && results.length > 0) {
          if (key === 'valoracionPromedio') {
            stats[key] = {
              promedio: Math.round(results[0].promedio * 10) / 10,
              total: results[0].total
            };
          } else if (key === 'ingresosMes') {
            stats[key] = parseFloat(results[0].total);
          } else {
            stats[key] = results[0].count;
          }
        }
        
        completedQueries++;
        if (completedQueries === totalQueries) {
          res.status(200).json(stats);
        }
      });
    });
  });
});

// ================================
// 🧩 RUTA: Agregar entrada al historial médico (por doctor)
// ================================
// Permite al doctor agregar una entrada al historial médico de un paciente.
app.post("/api/doctores/historial", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const { paciente_id, cita_id, tipo, titulo, descripcion, fecha_evento } = req.body;

  if (!paciente_id || !tipo || !titulo) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Obtener doctor_id y verificar que el paciente ha tenido citas con este doctor
  const getDoctorId = "SELECT id FROM doctores WHERE usuario_id = ?";
  
  connection.query(getDoctorId, [decoded.id], (err, doctorResults) => {
    if (err || doctorResults.length === 0) {
      return res.status(500).json({ message: "Error al obtener doctor" });
    }

    const doctorId = doctorResults[0].id;

    // Verificar relación doctor-paciente
    const checkQuery = `
      SELECT id FROM citas WHERE doctor_id = ? AND paciente_id = ? LIMIT 1
    `;

    connection.query(checkQuery, [doctorId, paciente_id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: "Error al verificar relación" });
      }

      if (results.length === 0) {
        return res.status(403).json({ message: "No autorizado para agregar historial a este paciente" });
      }

      const insertQuery = `
        INSERT INTO historial_medico (paciente_id, doctor_id, cita_id, tipo, titulo, descripcion, fecha_evento)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        insertQuery,
        [paciente_id, doctorId, cita_id || null, tipo, titulo, descripcion || null, fecha_evento || new Date()],
        (err3) => {
          if (err3) {
            console.error("❌ Error al insertar historial:", err3);
            return res.status(500).json({ message: "Error al crear entrada de historial" });
          }
          res.status(200).json({ message: "✅ Entrada de historial creada con éxito" });
        }
      );
    });
  });
});

// ================================
// 🧩 RUTAS PÚBLICAS DE BÚSQUEDA DE DOCTORES
// ================================

// ================================
// 🧩 RUTA: Buscar doctores (público)
// ================================
// Búsqueda de doctores con filtros opcionales.
// Query params: especialidad_id, departamento_id, provincia_id, nombre, genero
// Respuesta: array de doctores con sus especialidades y valoración promedio.
app.get("/api/buscar-doctores", (req, res) => {
  const { especialidad_id, departamento_id, provincia_id, nombre, genero } = req.query;

  let sql = `
    SELECT DISTINCT
      d.id as doctor_id,
      u.id as usuario_id,
      u.nombres,
      u.apellidos,
      d.telefono,
      d.genero,
      d.foto_perfil,
      d.consultorio_direccion,
      d.descripcion,
      d.experiencia,
      d.formacion,
      d.certificaciones,
      d.costo_consulta,
      dep.id as departamento_id,
      dep.nombre as departamento_nombre,
      prov.id as provincia_id,
      prov.nombre as provincia_nombre,
      e.id as especialidad_id,
      e.nombre as especialidad_nombre,
      (SELECT COALESCE(AVG(v.puntuacion), 0) FROM valoraciones v WHERE v.doctor_id = d.id) as valoracion_promedio,
      (SELECT COUNT(*) FROM valoraciones v WHERE v.doctor_id = d.id) as total_valoraciones,
      (SELECT COUNT(*) FROM citas c WHERE c.doctor_id = d.id AND c.estado = 'completada') as total_consultas
    FROM doctores d
    JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN departamentos dep ON d.departamento_id = dep.id
    LEFT JOIN provincias prov ON d.provincia_id = prov.id
    LEFT JOIN doctor_especialidad de ON d.id = de.doctor_id AND de.es_principal = 1
    LEFT JOIN especialidades e ON de.especialidad_id = e.id
    WHERE d.activo = 1 AND u.activo = 1
  `;

  const params = [];

  // Filtro por especialidad
  if (especialidad_id) {
    sql += ` AND de.especialidad_id = ?`;
    params.push(especialidad_id);
  }

  // Filtro por departamento
  if (departamento_id) {
    sql += ` AND d.departamento_id = ?`;
    params.push(departamento_id);
  }

  // Filtro por provincia
  if (provincia_id) {
    sql += ` AND d.provincia_id = ?`;
    params.push(provincia_id);
  }

  // Filtro por nombre (búsqueda parcial en nombres o apellidos)
  if (nombre) {
    sql += ` AND (u.nombres LIKE ? OR u.apellidos LIKE ? OR CONCAT(u.nombres, ' ', u.apellidos) LIKE ?)`;
    const searchTerm = `%${nombre}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Filtro por género
  if (genero) {
    sql += ` AND d.genero = ?`;
    params.push(genero);
  }

  sql += ` ORDER BY valoracion_promedio DESC, u.nombres ASC`;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("❌ Error al buscar doctores:", err);
      return res.status(500).json({ message: "Error al buscar doctores" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Obtener detalle de un doctor (público)
// ================================
// Obtiene información completa de un doctor por su ID.
// Path param: :doctorId
app.get("/api/doctores/:doctorId/detalle", (req, res) => {
  const doctorId = parseInt(req.params.doctorId, 10);

  if (!Number.isInteger(doctorId)) {
    return res.status(400).json({ message: "ID de doctor inválido" });
  }

  const sql = `
    SELECT 
      d.id as doctor_id,
      u.id as usuario_id,
      u.nombres,
      u.apellidos,
      u.email,
      d.telefono,
      d.genero,
      d.foto_perfil,
      d.consultorio_direccion,
      d.descripcion,
      d.experiencia,
      d.formacion,
      d.certificaciones,
      d.costo_consulta,
      dep.nombre as departamento_nombre,
      prov.nombre as provincia_nombre,
      (SELECT COALESCE(AVG(v.puntuacion), 0) FROM valoraciones v WHERE v.doctor_id = d.id) as valoracion_promedio,
      (SELECT COUNT(*) FROM valoraciones v WHERE v.doctor_id = d.id) as total_valoraciones
    FROM doctores d
    JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN departamentos dep ON d.departamento_id = dep.id
    LEFT JOIN provincias prov ON d.provincia_id = prov.id
    WHERE d.id = ? AND d.activo = 1
  `;

  connection.query(sql, [doctorId], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener doctor:", err);
      return res.status(500).json({ message: "Error al obtener doctor" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor no encontrado" });
    }

    // Obtener especialidades del doctor
    const sqlEspecialidades = `
      SELECT e.id, e.nombre, de.es_principal
      FROM doctor_especialidad de
      JOIN especialidades e ON de.especialidad_id = e.id
      WHERE de.doctor_id = ?
      ORDER BY de.es_principal DESC
    `;

    connection.query(sqlEspecialidades, [doctorId], (err2, especialidades) => {
      if (err2) {
        console.error("❌ Error al obtener especialidades:", err2);
        return res.status(500).json({ message: "Error al obtener especialidades" });
      }

      // Obtener disponibilidad del doctor
      const sqlDisponibilidad = `
        SELECT dia_semana, hora_inicio, hora_fin
        FROM disponibilidad_doctor
        WHERE doctor_id = ? AND activo = 1
        ORDER BY FIELD(dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')
      `;

      connection.query(sqlDisponibilidad, [doctorId], (err3, disponibilidad) => {
        if (err3) {
          console.error("❌ Error al obtener disponibilidad:", err3);
          return res.status(500).json({ message: "Error al obtener disponibilidad" });
        }

        // Obtener últimas valoraciones
        const sqlValoraciones = `
          SELECT 
            v.puntuacion,
            v.comentario,
            v.fecha,
            up.nombres as paciente_nombres
          FROM valoraciones v
          JOIN pacientes p ON v.paciente_id = p.id
          JOIN usuarios up ON p.usuario_id = up.id
          WHERE v.doctor_id = ?
          ORDER BY v.fecha DESC
          LIMIT 5
        `;

        connection.query(sqlValoraciones, [doctorId], (err4, valoraciones) => {
          if (err4) {
            console.error("❌ Error al obtener valoraciones:", err4);
            return res.status(500).json({ message: "Error al obtener valoraciones" });
          }

          res.status(200).json({
            ...rows[0],
            especialidades: especialidades || [],
            disponibilidad: disponibilidad || [],
            valoraciones: valoraciones || []
          });
        });
      });
    });
  });
});

// ================================
// 🧩 RUTA: Obtener departamentos (público)
// ================================
app.get("/api/departamentos", (req, res) => {
  const sql = "SELECT id, nombre FROM departamentos WHERE activo = 1 ORDER BY nombre";

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener departamentos:", err);
      return res.status(500).json({ message: "Error al obtener departamentos" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Obtener provincias por departamento (público)
// ================================
app.get("/api/departamentos/:departamentoId/provincias", (req, res) => {
  const departamentoId = parseInt(req.params.departamentoId, 10);

  if (!Number.isInteger(departamentoId)) {
    return res.status(400).json({ message: "ID de departamento inválido" });
  }

  const sql = "SELECT id, nombre FROM provincias WHERE departamento_id = ? AND activo = 1 ORDER BY nombre";

  connection.query(sql, [departamentoId], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener provincias:", err);
      return res.status(500).json({ message: "Error al obtener provincias" });
    }
    res.status(200).json(rows);
  });
});

// ================================
// 🧩 RUTA: Chatbot con DeepSeek AI (Streaming)
// ================================
// Endpoint para el chatbot de IA usando DeepSeek API en modo streaming.
// Request body: { messages: [{ role: "user"|"assistant", content: string }] }
// Requiere autenticación JWT.
// Respuesta: Stream de eventos SSE con el contenido generado.
app.post("/api/chatbot", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Se requiere un array de mensajes" });
  }

  // Configurar headers para streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // System prompt detallado para el asistente de Doctoralia
    const systemPrompt = {
      role: "system",
      content: `Eres "Doctoralia AI", el asistente virtual EXCLUSIVO de la plataforma Doctoralia Perú. Tu ÚNICO propósito es ayudar a los usuarios con temas relacionados a:
1. La plataforma Doctoralia y cómo usarla
2. Información general de salud y orientación médica básica
3. Guiar a los usuarios para que agenden citas con doctores

=== INFORMACIÓN DE LA PLATAFORMA DOCTORALIA ===

**¿Qué es Doctoralia?**
Doctoralia es una plataforma de salud que conecta pacientes con médicos especialistas. Permite buscar doctores, ver sus perfiles, leer valoraciones de otros pacientes y agendar citas médicas de forma fácil y segura.

**CÓMO BUSCAR DOCTORES:**
1. En el menú principal, haz clic en "Doctores"
2. Usa los filtros disponibles para encontrar al especialista ideal:
   - Por especialidad (Cardiología, Pediatría, Dermatología, Ginecología, Ortopedia, etc.)
   - Por ubicación (departamento y provincia)
   - Por nombre del doctor
   - Por género del médico
3. Cada doctor muestra: foto, nombre, especialidad, ubicación, valoración promedio, costo de consulta y número de consultas realizadas
4. Haz clic en "Ver perfil" para más detalles del doctor

**PERFIL DEL DOCTOR - ¿QUÉ PUEDES VER?**
- Información personal: nombre, especialidad, foto
- Descripción profesional y experiencia
- Formación académica y certificaciones
- Dirección del consultorio
- Costo de la consulta
- Valoraciones y opiniones de otros pacientes
- Disponibilidad horaria

**CÓMO AGENDAR UNA CITA:**
1. Busca un doctor usando los filtros
2. Entra al perfil del doctor que te interese
3. Revisa su disponibilidad y horarios
4. Selecciona fecha y hora disponible
5. Completa el motivo de consulta y síntomas (opcional)
6. Confirma tu cita
7. Recibirás confirmación y podrás ver tu cita en tu perfil

**TU PERFIL DE PACIENTE:**
Para acceder a tu perfil, haz clic en el ícono de usuario en la esquina superior derecha o ve a "Mi Perfil". Ahí puedes:
- Ver y editar tu información personal (nombre, email, teléfono)
- Actualizar tu información médica:
  * Tipo de sangre
  * Alergias conocidas
  * Condiciones médicas existentes
  * Medicamentos actuales
- Agregar contacto de emergencia
- Información de seguro médico
- Ver tu PRÓXIMA CITA programada
- Acceder a tu HISTORIAL MÉDICO
- Ver todas tus CITAS (pasadas y futuras)
- Revisar tus PAGOS y facturas
- Ver las VALORACIONES que has dejado a doctores

**TIPOS DE CONSULTA:**
- Presencial: acudes físicamente al consultorio del doctor
- Virtual/Teleconsulta: consulta por videollamada desde tu casa

**ESTADOS DE CITAS:**
- Pendiente: cita solicitada, esperando confirmación
- Confirmada: el doctor confirmó la cita
- En curso: la consulta está sucediendo
- Completada: consulta finalizada
- Cancelada: cita fue cancelada

**PAGOS:**
- Se pueden realizar pagos por: tarjeta de crédito, tarjeta de débito, transferencia, efectivo o PayPal
- Después del pago se genera una factura con número único
- Puedes ver el historial de pagos en tu perfil

**VALORACIONES:**
Después de una consulta completada, puedes valorar al doctor:
- Puntuación de 1 a 5 estrellas
- Comentario sobre tu experiencia
- Ayudas a otros pacientes a elegir mejor

**ESPECIALIDADES DISPONIBLES:**
- Cardiología (corazón y sistema circulatorio)
- Pediatría (salud infantil)
- Dermatología (enfermedades de la piel)
- Ginecología (salud reproductiva femenina)
- Ortopedia (sistema musculoesquelético, huesos, articulaciones)

**UBICACIONES:**
Doctores disponibles en múltiples departamentos del Perú:
Lima, Arequipa, Cusco, La Libertad (Trujillo), Piura, Lambayeque (Chiclayo), Junín (Huancayo), Puno, Ancash, Ica

**CONTACTO Y SOPORTE:**
Para contactar a soporte de Doctoralia:
1. Ve a "Contacto" en el menú
2. Selecciona tu tipo de usuario
3. Ingresa tu email
4. Escribe tu mensaje o consulta
5. El equipo de soporte responderá a tu email

=== REGLAS ESTRICTAS QUE DEBES SEGUIR ===

❌ NUNCA hagas lo siguiente:
- NO diagnostiques enfermedades específicas
- NO recetes medicamentos ni des dosificaciones
- NO ayudes con temas que NO sean de salud o de la plataforma Doctoralia
- NO hables de otras plataformas de salud o competidores
- NO proporciones información de otras páginas web
- NO ayudes con tareas, programación, matemáticas u otros temas no relacionados
- NO inventes información sobre la plataforma

✅ SIEMPRE haz lo siguiente:
- Responde SOLO sobre Doctoralia y temas de salud general
- Si preguntan algo no relacionado, responde amablemente: "Lo siento, solo puedo ayudarte con temas relacionados a la plataforma Doctoralia y orientación de salud general. ¿Hay algo sobre cómo buscar doctores, agendar citas o usar la plataforma en lo que pueda ayudarte?"
- Si describen síntomas, sugiere qué tipo de especialista consultar y guíalos a usar la búsqueda de doctores
- Para síntomas graves (dolor de pecho, dificultad para respirar, sangrado severo, etc.), recomienda ir a urgencias INMEDIATAMENTE
- Sé amable, empático y profesional
- Responde en español
- Si no estás seguro de algo sobre la plataforma, sugiere contactar a soporte

=== EJEMPLOS DE RESPUESTAS ===

Usuario: "Me duele la cabeza frecuentemente"
Respuesta: "Los dolores de cabeza frecuentes pueden tener varias causas. Te recomiendo consultar con un especialista. En Doctoralia puedes buscar un Neurólogo o Médico General. Ve a 'Doctores' en el menú, filtra por la especialidad que prefieras y tu ubicación, y agenda una cita con el profesional que mejor se adapte a tus necesidades. ¿Te gustaría que te explique cómo usar los filtros de búsqueda?"

Usuario: "¿Cómo hago para cambiar mi email?"
Respuesta: "Para cambiar tu email en Doctoralia: 1) Haz clic en el ícono de usuario arriba a la derecha, 2) Ve a 'Mi Perfil', 3) En la sección de información personal podrás editar tu email, teléfono y otros datos, 4) Guarda los cambios. ¿Necesitas ayuda con algo más de tu perfil?"

Usuario: "Ayúdame con mi tarea de matemáticas"
Respuesta: "Lo siento, solo puedo ayudarte con temas relacionados a la plataforma Doctoralia y orientación de salud general. ¿Hay algo sobre cómo buscar doctores, agendar citas o usar la plataforma en lo que pueda ayudarte?"`
    };

    // Llamada a DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY || "sk-a874fe896ed84f96aed0c2be1a87091b"}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [systemPrompt, ...messages],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Error de DeepSeek API:", errorData);
      res.write(`data: ${JSON.stringify({ error: "Error al conectar con el servicio de IA" })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    // Procesar streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write("data: [DONE]\n\n");
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Ignorar errores de parsing de chunks incompletos
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.write(`data: ${JSON.stringify({ error: "Error interno del servidor" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
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
