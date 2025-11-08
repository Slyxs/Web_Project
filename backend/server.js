import express from "express"; // Framework web para Node.js
import cors from "cors"; // Para permitir solicitudes desde el frontend
import bodyParser from "body-parser"; // Para parsear JSON, es decir, transformar el cuerpo de las solicitudes en objetos JS
import mysql from "mysql2"; // MySQL client
import bcrypt from "bcrypt"; // Para encriptar contraseñas
import jwt from "jsonwebtoken"; // Para tokens de autenticación

// ================================
// 🔹 Configuración de conexión MySQL
// ================================
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

// ================================
// 🔹 Configuración del servidor
// ================================
const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = "clave_super_segura_para_jwt"; // ⚠️ cámbiala por una más segura

// ================================
// 🧩 RUTA: Registrar usuario
// ================================
app.post("/api/register", async (req, res) => {
  const { nombres, apellidos, email, password } = req.body;

  if (!nombres || !apellidos || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario como "paciente" por defecto
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

        // Crear registro en la tabla pacientes
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
// 🧩 RUTA: Iniciar sesión
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

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
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
