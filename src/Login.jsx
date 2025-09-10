// Importaciones
import { Search, Phone, Menu } from "lucide-react";
import "./App.css";
import { Link } from "react-router-dom";

// Definición del Componente Login
function Login() {
  return (
    // Contenedor Más Externo
    <div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
      {/* Diseño de la Sección Principal */}
      <section className="flex flex-col lg:flex-row items-stretch min-h-screen w-full">
        {/* Panel Decorativo Izquierdo */}
        <div className="hidden lg:flex lg:w-7/12 bg-[#e0f2f1] p-12 items-center justify-center">
          {/* Imagen Decorativa */}
          <img
            src="https://files.catbox.moe/l2rwem.png"
            alt="Imagen Decorativa"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Panel Derecho del Formulario */}
        <div className="w-full lg:w-5/12 bg-white px-6 sm:px-8 md:px-10 lg:px-12 py-10 flex items-center justify-center overflow-y-auto">
          {/* Contenedor Interno del Formulario */}
          <div className="w-full max-w-md">
            {/* Imagen del Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img
                  src="https://files.catbox.moe/6fsyw2.png"
                  alt="Doctoralia Logo"
                  className="h-10"
                />
              </Link>
            </div>
            {/* Encabezado */}
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-[#0A3C3F] mb-6">
              Iniciar Sesión
            </h1>

            {/* Formulario de Inicio de Sesión */}
            <form className="mt-6" action="#" method="POST">
              {/* Grupo de Campos Email */}
              <fieldset className="fieldset mt-2">
                <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">E-mail</legend>
                <input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                  required
                />
              </fieldset>

              {/* Grupo de Campos Contraseña */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Contraseña</legend>
                <input
                  type="password"
                  placeholder="••••••••"
                  minLength="6"
                  className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                  required
                />
              </fieldset>

              {/* Enlace Olvidaste tu Contraseña */}
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-sm font-semibold text-[#0A3C3F] hover:text-[#083032] focus:text-[#083032]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                className="w-full block bg-[#0A3C3F] hover:bg-[#083032] focus:bg-[#083032] text-white font-semibold rounded-lg px-4 py-3 mt-6 transition-colors duration-300"
              >
                Ingresar
              </button>
            </form>

            {/* Divisor */}
            <hr className="my-6 border-gray-300 w-full" />

            {/* Enlace de Registro */}
            <p className="mt-8 text-sm text-gray-600 text-center">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register" // Changed from href="#" to Link to="/register"
                className="text-[#0A3C3F] hover:text-[#083032] font-semibold"
              >
                Regístrate
              </Link>
            </p>

            {/* Pie de Página de Copyright */}
            <p className="text-xs text-gray-500 mt-12 text-center">
              &copy; 2025 Doctoralia - Todos los derechos reservados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Exportar Componente Login
export default Login;
