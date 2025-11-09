import {
  Search,
  Menu,
  User,
  CircleUserRound,
  CircleDollarSign,
  Clipboard,
  CreditCard,
  Calendar,
  FileText,
  Star,
  History
} from "lucide-react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Perfil() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeSection, setActiveSection] = useState("Dashboard");
  const navigate = useNavigate();

  // Verificar si el usuario está logueado y obtener datos
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setUserName("Vineta Pham");
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  // Renderizar contenido según la sección activa
  const renderSectionContent = () => {
    switch(activeSection) {
      case "Dashboard":
        return <DashboardContent userName={userName} />;
      case "Detalles de Cuenta":
        return <AccountDetailsContent />;
      case "Historial Médico":
        return <MedicalHistoryContent />;
      case "Mis Citas":
        return <MyAppointmentsContent />;
      case "Pagos y Facturas":
        return <PaymentsContent />;
      case "Valoraciones":
        return <ReviewsContent />;
      default:
        return <DashboardContent userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
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

      {/* Titulo de la página */}
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-bold text-gray-700">Mi Perfil</h1>
      </div>

      {/* Contenido del perfil */}
      <section className="flex min-h-[70vh]">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto px-4">
          {/* Menu vertical */}
          <ul className="menu border border-[#D3D3D3] rounded-box w-full lg:w-64 mt-0 h-fit">
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Dashboard" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Detalles de Cuenta" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Detalles de Cuenta")}
              >
                Detalles de Cuenta
              </button>
            </li>
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Historial Médico" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Historial Médico")}
              >
                Historial Médico
              </button>
            </li>
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Mis Citas" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Mis Citas")}
              >
                Mis Citas
              </button>
            </li>
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Pagos y Facturas" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Pagos y Facturas")}
              >
                Pagos y Facturas
              </button>
            </li>
            <li className="border-b border-[#D3D3D3]">
              <button
                className={`py-3 text-[#000000] w-full text-left ${activeSection === "Valoraciones" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setActiveSection("Valoraciones")}
              >
                Valoraciones
              </button>
            </li>
            <li>
              <button
                className="py-3 text-[#cc30309c] w-full text-left"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>

          {/* Contenido principal - Se renderiza dinámicamente */}
          <div className="flex-1 mt-0">
            {renderSectionContent()}
          </div>
        </div>
      </section>
    </div>
  );
}

// Componentes para cada sección
const DashboardContent = ({ userName }) => (
  <>
    <div className="mb-4">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          ¡Hola {userName}!
        </h2>
        <p className="text-gray-700 w-full">
          Hoy es un gran día para revisar tu perfil médico. Puedes
          consultar tus últimas citas o revisar tu historial médico. O
          tal vez puedas explorar nuestros servicios especializados y
          agendar tu próxima consulta.
        </p>
      </div>
    </div>

    <div className="py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 [@media(min-width:545px)]:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm mx-auto h-52">
            <div className="card-body flex flex-col items-center justify-center text-center p-6 h-full">
              <CircleUserRound size={40} className="text-black mb-2" />
              <h4 className="card-title text-lg font-semibold text-black mb-1">
                Mi Cuenta
              </h4>
              <p className="text-sm text-gray-700">
                Gestiona tu información personal, contraseña y
                preferencias de cuenta
              </p>
            </div>
          </div>

          <div className="card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm mx-auto h-52">
            <div className="card-body flex flex-col items-center justify-center text-center p-6 h-full">
              <CircleDollarSign size={40} className="text-black mb-2" />
              <h4 className="card-title text-lg font-semibold text-black mb-1">
                Pagos
              </h4>
              <p className="text-sm text-gray-700">
                Administra tus métodos de pago, facturas y historial de
                transacciones
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative h-64 w-full rounded-xl mt-8 overflow-hidden flex items-center justify-end"
          style={{
            backgroundImage:
              "url('src/assets/img/Perfil/Paciente/account-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 text-gray-700 text-right max-w-md pr-5 sm:pr-8 md:pr-12 lg:pr-25 px-3 sm:px-4">
            <h2 className="text-[24px] sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-1 sm:mb-2">
              Cuida tu Salud
            </h2>
            <p className="text-[14px] sm:text-sm md:text-base mb-3 sm:mb-4">
              Chequeo anual con 20% <br></br>de descuento.
            </p>
            <button className="btn bg-gray-700 text-[#ffffff] border-gray-700 hover:bg-gray-800 hover:border-gray-800 rounded-full btn-sm sm:btn-md">
              Agendar cita
            </button>
          </div>
        </div>

        <div
          className="relative w-full rounded-xl mt-8 overflow-hidden flex flex-col [@media(min-width:570px)]:flex-row items-center justify-between gap-6 [@media(min-width:570px)]:gap-10 px-6 sm:px-10 md:px-12 lg:px-16 py-6"
          style={{ backgroundColor: "#204B4E" }}
        >
          <div className="relative z-10 text-white text-left w-full [@media(min-width:570px)]:w-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              Próxima Cita
            </h2>
            <div className="text-xs sm:text-sm opacity-90 leading-relaxed space-y-1 mb-4">
              <p>📅: 12 de Noviembre</p>
              <p>🕑: 10:00 A.M</p>
              <p>👩‍⚕️: Dra. López</p>
            </div>
            <button className="btn bg-white text-gray-700 border-white hover:bg-gray-100 hover:border-gray-100 rounded-full btn-xs sm:btn-sm">
              Ver detalles
            </button>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm text-gray-700 flex items-center justify-center w-full [@media(min-width:570px)]:w-auto">
            <div className="grid grid-flow-col gap-4 sm:gap-5 text-center auto-cols-max">
              <div className="flex flex-col items-center">
                <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                  <span style={{ "--value": 15 }}></span>
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  días
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">:</span>
              <div className="flex flex-col items-center">
                <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                  <span style={{ "--value": 10 }}></span>
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  horas
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">:</span>
              <div className="flex flex-col items-center">
                <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                  <span style={{ "--value": 24 }}></span>
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  min
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">:</span>
              <div className="flex flex-col items-center">
                <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                  <span style={{ "--value": 59 }}></span>
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  seg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const AccountDetailsContent = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">Detalles de Cuenta</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Nombre completo</label>
            <p className="font-medium">Vineta Pham</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-medium">vineta.pham@email.com</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <p className="font-medium">+34 123 456 789</p>
          </div>
        </div>
      </div>
      <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Preferencias</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Idioma preferido</label>
            <p className="font-medium">Español</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Notificaciones</label>
            <p className="font-medium">Activadas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MedicalHistoryContent = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">Historial Médico</h2>
    <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <History size={24} className="text-gray-600 mr-3" />
        <h3 className="text-lg font-semibold">Consultas Recientes</h3>
      </div>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <p className="font-medium">Consulta General - Dra. López</p>
          <p className="text-sm text-gray-600">15 Oct 2024 • Revisión anual</p>
        </div>
        <div className="border-b pb-3">
          <p className="font-medium">Dermatología - Dr. García</p>
          <p className="text-sm text-gray-600">1 Sep 2024 • Control de lunar</p>
        </div>
      </div>
    </div>
  </div>
);

const MyAppointmentsContent = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">Mis Citas</h2>
    <div className="grid grid-cols-1 gap-6">
      <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Calendar size={24} className="text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold">Próximas Citas</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium">Cardiología - Dr. Martínez</p>
            <p className="text-sm text-gray-600">12 Nov 2024 • 10:00 AM</p>
            <button className="btn btn-sm bg-blue-600 text-white mt-2">Ver detalles</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PaymentsContent = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">Pagos y Facturas</h2>
    <div className="grid grid-cols-1 gap-6">
      <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <CircleDollarSign size={24} className="text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold">Facturas Recientes</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="font-medium">Consulta Dra. López</p>
              <p className="text-sm text-gray-600">15 Oct 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium">€85.00</p>
              <p className="text-sm text-green-600">Pagado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsContent = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">Valoraciones</h2>
    <div className="card bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Star size={24} className="text-gray-600 mr-3" />
        <h3 className="text-lg font-semibold">Mis Valoraciones</h3>
      </div>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {"★".repeat(5)}
            </div>
            <span className="ml-2 text-sm text-gray-600">15 Oct 2024</span>
          </div>
          <p className="font-medium mb-1">Dra. López</p>
          <p className="text-sm text-gray-700">Excelente atención, muy profesional y amable.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Perfil;
