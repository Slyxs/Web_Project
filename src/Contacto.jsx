import { Search, Phone, Menu, User } from "lucide-react"; 
import "./App.css"; 
import { Link } from 'react-router-dom'; 

function Contacto() {
  return (
    // Contenedor principal de la página de Contacto
    // Fondo con degradado y fuente principal Rubik
    <div className="min-h-screen bg-[linear-gradient(90deg,_rgba(34,193,195,0.06),_rgba(253,187,45,0.1))] font-['Rubik'] text-[#0A3C3F]">
      
      {/* Sección del Navbar */}
      <div className="pt-4 md:pt-6 lg:pt-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Estructura del Navbar */}
          <div className="navbar bg-[#0A3C3F] text-white rounded-lg shadow-md px-6 lg:px-8 py-3">
            {/* Inicio del Navbar: Logo */}
            <div className="navbar-start">
              <Link to="/" className="text-4xl font-bold font-['DM_Sans'] tracking-tight">
                Doctoralia
              </Link>
            </div>

            {/* Centro del Navbar: Enlaces de navegación (visible en pantallas grandes) */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link to="/" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Inicio
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Doctores
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Servicios
                  </a>
                </li>
                <li>
                  <Link to="/contacto" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Final del Navbar: Botones de búsqueda e inicio de sesión / Menú desplegable móvil */}
            <div className="navbar-end">
              {/* Elementos para pantallas grandes */}
              <div className="hidden lg:flex items-center space-x-4">
                <button className="text-white hover:text-[#A9E8E0] p-2">
                  <Search size={22} />
                </button>
                <Link
                  to="/login"
                  className="button rounded border border-white text-white px-5 py-2 hover:bg-white hover:text-[#0A3C3F] flex items-center"
                >
                  <User size={16} className="inline mr-2" />
                  Iniciar Sesión
                </Link>
              </div>

              {/* Menú desplegable para pantallas pequeñas */}
              <div className="dropdown dropdown-end lg:hidden">
                <button tabIndex={0} role="button" className="btn btn-ghost hover:bg-transparent text-white p-1">
                  <Menu size={24} />
                </button>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-[#0A3C3F] text-white rounded-box z-[50] mt-3 w-64 p-4 shadow-lg"
                >
                  <li><Link to="/" className="hover:text-[#A9E8E0] text-lg py-2">Inicio</Link></li>
                  <li><a href="#" className="hover:text-[#A9E8E0] text-lg py-2">Doctores</a></li>
                  <li><a href="#" className="hover:text-[#A9E8E0] text-lg py-2">Servicios</a></li>
                  <li><Link to="/contacto" className="hover:text-[#A9E8E0] text-lg py-2">Contacto</Link></li>
                  
                  {/* Separador y elementos adicionales en el menú desplegable */}
                  <div className="pt-3 mt-3 border-t border-white">
                    <li className="py-1">
                      <a href="#" className="hover:text-[#A9E8E0] flex items-center text-lg p-2">
                        <Search size={20} className="mr-3" /> Buscar
                      </a>
                    </li>
                    <li className="mt-2">
                      <Link
                        to="/login"
                        className="button rounded border border-white text-white px-5 py-2 text-base hover:bg-white hover:text-[#0A3C3F] flex items-center justify-center w-full"
                      >
                        <User size={16} className="inline mr-2" />
                        Iniciar Sesión
                      </Link>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección Hero y formulario para contacto */}
      {/* Contenedor del Hero con padding responsivo */}
      <div className="hero max-w-6xl mx-auto pt-8 md:pt-12 lg:pt-11 pb-12 md:pb-16 lg:pb-20"> 
                {/* Contenido del Hero, diseño flexiblespara diferentes pantallas */}
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-center lg:items-start w-full"> 
                  {/* Lado izquierdo del Hero: Imagen */}
                  <div className="lg:w-6/12 mt-8 lg:mt-0"> 
                    <img
                      src="https://files.catbox.moe/l2rwem.png"
                      className="rounded-lg object-cover w-full"
                      alt="Seguridad de datos médicos online"
                    />
                  </div>
                  {/* Lado derecho del Hero: Título, descripción y formulario */}
                  <div className="lg:w-6/12"> 
                    <h3 className="pt-8 text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Ponte en Contacto <br/>
                      <span className="font-semibold">Estamos Listos Para Ayudarte</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      ¿Tienes preguntas o necesitas asistencia? Nuestro equipo está disponible para ayudarte. Completa el formulario o utiliza nuestros canales de contacto directo.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />

                    {/* Formulario de contacto */}
                    <form className="mt-6">
                      {/* Selector de tipo de usuario */}
                      <select
                        className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F] bg-[#d4f3ef] mb-2"
                        required
                      >
                        <option disabled selected value="">Cuéntanos más sobre ti</option>
                        <option>Soy un doctor y un cliente</option>
                        <option>Soy un doctor y no un cliente</option>
                        <option>Soy un usuario de Doctoralia</option>
                        <option>Soy de un medio de comunicación</option>
                        <option>Soy un administrador de clinica</option>
                      </select>
                      {/* Campo de correo electrónico */}
                      <input
                        className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F] bg-[#d4f3ef] mt-4 mb-4" 
                        type="email"
                        required
                        placeholder="Correo electrónico"
                      />
                      {/* Área de texto para el mensaje */}
                      <textarea
                        className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F] bg-[#d4f3ef] mt-4 mb-4"
                        placeholder="Escribe tu mensaje aqui..."
                        required
                      ></textarea>
                      {/* Botón de enviar mensaje */}
                      <button
                        className="w-full px-6 py-2.5 bg-[#0A3C3F] text-white font-medium rounded-lg hover:bg-[#083032] transition-colors duration-300"
                        type="submit"
                      >
                        Enviar Mensaje
                      </button>
                    </form>
                  </div>
                </div>
              </div>
      
      
      {/* Sección del Footer */}
      <div className="bg-[#0A3C3F]">
        {/* Contenido del Footer */}
        <footer className="footer sm:footer-horizontal bg-[#0A3C3F] text-white px-10 py-15 max-w-7xl mx-auto">
          {/* Sección "Aside" del Footer: Logo y descripción */}
          <aside>
            <img
              src="https://files.catbox.moe/9bs8p9.png"
              alt="Logo Doctoralia"
              width="70"
              height="70"
            />
            <p className="text-lg font-['DM_Sans']">
              Doctoralia Internet SL
              <br />
              Proveyendo soluciones medicas desde 2007
            </p>
          </aside>
          {/* Navegación del Footer: Servicios */}
          <nav>
            <h6 className="footer-title text-lg font-['DM_Sans']">
              Servicios
            </h6>
            <a className="link link-hover text-base font-['DM_Sans']">Marca</a>
            <a className="link link-hover text-base font-['DM_Sans']">Diseño</a>
            <a className="link link-hover text-base font-['DM_Sans']">Marketing</a>
            <a className="link link-hover text-base font-['DM_Sans']">Publicidad</a>
          </nav>
          {/* Navegación del Footer: Compañía */}
          <nav>
            <h6 className="footer-title text-lg font-['DM_Sans']">
              Compañía
            </h6>
            <a className="link link-hover text-base font-['DM_Sans']">Sobre nosotros</a>
            <a className="link link-hover text-base font-['DM_Sans']">Contacto</a>
            <a className="link link-hover text-base font-['DM_Sans']">Empleo</a>
            <a className="link link-hover text-base font-['DM_Sans']">Kit de prensa</a>
          </nav>
          {/* Navegación del Footer: Legal */}
          <nav>
            <h6 className="footer-title text-lg font-['DM_Sans']">
              Legal
            </h6>
            <a className="link link-hover text-base font-['DM_Sans']">Términos de uso</a>
            <a className="link link-hover text-base font-['DM_Sans']">Política de privacidad</a>
            <a className="link link-hover text-base font-['DM_Sans']">Política de cookies</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}

export default Contacto;
