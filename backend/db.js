// -----------------------------------------------------------------------------
// Configuración y conexión a MySQL usando la librería `mysql2` (ESM)
// -----------------------------------------------------------------------------
// Este módulo crea una conexión única (no es un pool) a la base de datos
// MySQL y la exporta para reutilizarla en otras partes del backend.
//
// Flujo general:
// 1) Importar el cliente `mysql2`.
// 2) Crear la conexión con las credenciales y el nombre de la base de datos.
// 3) Intentar conectar al iniciar la aplicación y registrar el resultado.
// 4) Exportar la conexión para su uso en consultas SQL.
import mysql from "mysql2";

// Crear una conexión directa a la base de datos.
// - host: servidor donde corre MySQL (generalmente "localhost" en desarrollo)
// - user: usuario de MySQL con permisos sobre la base de datos
// - password: contraseña del usuario
// - database: nombre de la base de datos a la que se conectará la app
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zephyr",
  database: "web_project",
});

// Intentar establecer la conexión al iniciar. Si falla, se muestra el error en
// consola; si tiene éxito, se informa con un mensaje de confirmación.
connection.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL con éxito");
});

// Exportar la conexión para que otros módulos puedan ejecutar consultas.
export default connection;
