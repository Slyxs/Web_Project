import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zephyr",
  database: "web_project",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL con éxito");
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = "clave_super_segura_para_jwt";

// ================================
// 🧩 RUTA: Registrar usuario (paciente)
// ================================
app.post("/api/register", async (req, res) => {
  const { nombres, apellidos, email, password } = req.body;

  if (!nombres || !apellidos || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (email, password, nombres, apellidos, tipo)
      VALUES (?, ?, ?, ?, 'paciente')
    `;

    connection.query(
      query,
      [email, hashedPassword, nombres, apellidos],
      (err, result) => {
        if (err) {
          console.error("❌ Error al insertar:", err);
          return res.status(500).json({ message: "Error al registrar usuario" });
        }

        const nuevoUsuarioId = result.insertId;
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
    // Verificar si el email ya existe
    const checkEmailQuery = "SELECT id FROM usuarios WHERE email = ?";
    connection.query(checkEmailQuery, [email], async (emailErr, emailResults) => {
      if (emailErr) {
        console.error("❌ Error al verificar email:", emailErr);
        return res.status(500).json({ message: "Error al verificar email" });
      }

      if (emailResults.length > 0) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Verificar si el número de licencia ya existe
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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario como "doctor"
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

            // Insertar en tabla doctores
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

                // Insertar especialidad principal
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

                    // Insertar en verificaciones_doctor
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
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Faltan credenciales" });

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

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Contraseña incorrecta" });

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
  if (decoded.tipo !== "admin" && decoded.id !== usuarioId) {
    return res.status(403).json({ message: "No autorizado" });
  }

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
// 🧩 RUTA: Enviar mensaje de contacto
// ================================
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
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`)
);
