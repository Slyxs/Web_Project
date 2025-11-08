import { Search, Phone, Menu, User, CircleUserRound } from "lucide-react"; 
import "./App.css"; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useEffect, useState } from "react";

function Perfil() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,_rgba(34,193,195,0.06),_rgba(253,187,45,0.1))] font-['Rubik'] text-[#0A3C3F]">
      {/* NAVBAR */}
      <div className="pt-4 md:pt-6 lg:pt-8">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="navbar bg-[#0A3C3F] text-white rounded-lg shadow-md px-6 lg:px-8 py-3">
            <div className="navbar-start">
              <Link
                to="/"
                className="text-4xl font-bold font-['DM_Sans'] tracking-tight"
              >
                Doctoralia
              </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
                  >
                    Doctores
                  </a>
                </li>
                <li>
                  <a
                    href="/appcopy"
                    className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div className="navbar-end">
              {/* --- SI NO ESTÁ LOGEADO (versión 1) --- */}
              {!isLoggedIn ? (
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
              ) : (
                /* --- SI ESTÁ LOGEADO (versión 2) --- */
                <div className="hidden lg:flex items-center space-x-4">
                  <button className="text-white hover:text-[#A9E8E0] p-2">
                    <Search size={22} />
                  </button>
                  <Link
                    to="/perfil"
                    className="text-white hover:text-[#A9E8E0] p-2"
                  >
                    <CircleUserRound size={25} />
                  </Link>
                </div>
              )}

              {/* Dropdown móvil */}
              <div className="dropdown dropdown-end lg:hidden">
                <button
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost hover:bg-transparent text-white p-1"
                >
                  <Menu size={24} />
                </button>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-[#0A3C3F] text-white rounded-box z-[50] mt-3 w-64 p-4 shadow-lg"
                >
                  <li>
                    <Link to="/" className="hover:text-[#A9E8E0] text-lg py-2">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#A9E8E0] text-lg py-2">
                      Doctores
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#A9E8E0] text-lg py-2">
                      Servicios
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/contacto"
                      className="hover:text-[#A9E8E0] text-lg py-2"
                    >
                      Contacto
                    </Link>
                  </li>

                  <div className="pt-3 mt-3 border-t border-white">
                    <li className="py-1">
                      <a
                        href="#"
                        className="hover:text-[#A9E8E0] flex items-center text-lg p-2"
                      >
                        <Search size={20} className="mr-3" /> Buscar
                      </a>
                    </li>

                    {/* Mostrar opciones según sesión */}
                    {isLoggedIn ? (
                      <>
                        <li className="mt-2">
                          <Link
                            to="/perfil"
                            className="button rounded border border-white text-white px-5 py-2 text-base hover:bg-white hover:text-[#0A3C3F] flex items-center justify-center w-full"
                          >
                            Mi Perfil
                          </Link>
                        </li>
                        <li className="mt-2">
                          <button
                            onClick={handleLogout}
                            className="button rounded border border-white text-white px-5 py-2 text-base hover:bg-white hover:text-[#0A3C3F] flex items-center justify-center w-full"
                          >
                            Cerrar Sesión
                          </button>
                        </li>
                      </>
                    ) : (
                      <li className="mt-2">
                        <Link
                          to="/login"
                          className="button rounded border border-white text-white px-5 py-2 text-base hover:bg-white hover:text-[#0A3C3F] flex items-center justify-center w-full"
                        >
                          Iniciar Sesión
                        </Link>
                      </li>
                    )}
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Titulo de la página, sin fondo, en el centro en el eje x */}
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-bold">Mi Perfil</h1>
      </div>

      {/* Contenido del perfil, hero con menu a la izquierda y detalles a la derecha */}
      <section className="hero min-h-[70vh] flex items-center">
        <div className="hero-content flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-7xl mx-auto px-4 py-8 lg:py-16">
          {/* Menu vertical - izquierda */}


          <ul className="menu bg-base-200 rounded-box w-56">
  <li>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Item 2
    </a>
  </li>
  <li>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Item 1
    </a>
  </li>
  <li>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Item 3
    </a>
  </li>
</ul>

          {/* Grid con 2 cards arriba y 2 imagenes promocionales abajo - derecha */}
          <div className="flex-1 relative mt-8 lg:mt-0">

          </div>
        </div>
      </section>


    </div>
  );
}

export default Perfil;