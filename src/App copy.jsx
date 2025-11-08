// Importaciones necesarias
import { Search, Phone, Menu, MapPin, ClipboardList, User, CircleUserRound } from "lucide-react";
import "./App.css";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {
  heroImg1,
  heroImg2,
  heroImg3,
  Index_Especialistas,
  Index_AgendaOnline,
  Index_GestionaSalud,
  Index_Opiniones,
  Index_Teleconsulta,
  Index_Seguridad,
  handMobileSvg,
} from "./homepage";

function AppCOPY() {
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
              <Link to="/" className="text-4xl font-bold font-['DM_Sans'] tracking-tight">
                Doctoralia
              </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li><Link to="/" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Inicio</Link></li>
                <li><a href="#" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Doctores</a></li>
                <li><a href="/appcopy" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Servicios</a></li>
                <li><Link to="/contacto" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Contacto</Link></li>
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
                  <Link to="/perfil" className="text-white hover:text-[#A9E8E0] p-2">
                    <CircleUserRound size={25} />
                  </Link>
                </div>
              )}

              {/* Dropdown móvil */}
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

                  <div className="pt-3 mt-3 border-t border-white">
                    <li className="py-1">
                      <a href="#" className="hover:text-[#A9E8E0] flex items-center text-lg p-2">
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

      {/* EL RESTO DE TU PÁGINA SIGUE IGUAL */}
      {/* ... toda tu estructura original sin modificar ... */}
    </div>
  );
}

export default AppCOPY;
