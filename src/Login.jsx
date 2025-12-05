// Importaciones
import { Search, Phone, Menu } from "lucide-react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { logoVerde } from "./homepage.jsx";
import { useState } from "react";
import axios from "axios";

// Definición del Componente Login
function Login() {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });

      // Guardar el token y los datos del usuario
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // También guardamos campos útiles por separado para otras pantallas
      if (user) {
        if (user.tipo) localStorage.setItem("tipo", user.tipo);
        if (user.nombres) localStorage.setItem("nombres", user.nombres);
        if (user.apellidos) localStorage.setItem("apellidos", user.apellidos);
      }

      setMensaje("✅ Inicio de sesión exitoso");

      // Redirigir según el tipo de usuario
      const tipo = user?.tipo;
      setTimeout(() => {
        if (tipo === "doctor") {
          navigate("/perfil-doctor");
        } else if (tipo === "paciente") {
          navigate("/perfil");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        setMensaje(error.response.data.message || "Error al iniciar sesión");
      } else {
        setMensaje("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor Más Externo
    <div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
      {/* Diseño de la Sección Principal */}
      <section className="flex flex-col lg:flex-row items-stretch min-h-screen w-full">
        {/* Panel Decorativo Izquierdo */}
        <div className="hidden lg:flex lg:w-7/12 bg-[#e0f2f1] p-0 items-center justify-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/040/993/528/large_2x/ai-generated-portrait-of-a-male-medical-worker-with-a-stethoscope-ai-generated-photo.jpg"
            alt="Imagen Decorativa"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Panel Derecho del Formulario */}
        <div className="w-full lg:w-5/12 bg-white px-6 sm:px-8 md:px-10 lg:px-12 py-10 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img src={logoVerde} alt="Doctoralia Logo" className="h-10" />
              </Link>
            </div>

            {/* Título */}
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-[#0A3C3F] mb-6">
              Iniciar Sesión
            </h1>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="mt-6">
              {/* Campo Email */}
              <fieldset className="fieldset mt-2">
                <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                  E-mail
                </legend>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                  required
                />
              </fieldset>

              {/* Campo Contraseña */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                  Contraseña
                </legend>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength="6"
                  className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                  required
                />
              </fieldset>

              {/* Enlace de Olvidar Contraseña */}
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-sm font-semibold text-[#0A3C3F] hover:text-[#083032] focus:text-[#083032]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full block bg-[#0A3C3F] hover:bg-[#083032] focus:bg-[#083032] text-white font-semibold rounded-lg px-4 py-3 mt-6 transition-colors duration-300"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            {/* Mensaje de estado */}
            {mensaje && (
              <p
                className={`text-center mt-4 ${
                  mensaje.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {mensaje}
              </p>
            )}

            {/* Divisor */}
            <hr className="my-6 border-gray-300 w-full" />

            {/* Enlace de registro */}
            <p className="mt-8 text-sm text-gray-600 text-center">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-[#0A3C3F] hover:text-[#083032] font-semibold"
              >
                Regístrate
              </Link>
            </p>

            <p className="text-xs text-gray-500 mt-12 text-center">
              &copy; 2025 Doctoralia - Todos los derechos reservados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
