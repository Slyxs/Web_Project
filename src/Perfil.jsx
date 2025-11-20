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
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

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
const DashboardContent = ({ userName }) => {
  const [greetingName, setGreetingName] = useState(userName || "");
  const [loadingAppt, setLoadingAppt] = useState(true);
  const [errorAppt, setErrorAppt] = useState("");
  const [nextAppt, setNextAppt] = useState(null); // { proximaCita, doctor }
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Leer nombre real desde localStorage si está disponible
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.nombres || u?.apellidos) {
          setGreetingName(`${u.nombres || ""} ${u.apellidos || ""}`.trim());
        }
      }
    } catch {
      // si falla el parse, dejamos el prop o vacío
    }
  }, [userName]);

  // Obtener próxima cita
  useEffect(() => {
    const fetchNextAppointment = async () => {
      setLoadingAppt(true);
      setErrorAppt("");
      try {
        const rawUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!rawUser || !token) {
          setLoadingAppt(false);
          return;
        }
        const u = JSON.parse(rawUser);
        const usuarioId = u?.id;
        if (!usuarioId) {
          setLoadingAppt(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:3001/api/pacientes/${usuarioId}/proxima-cita`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.proximaCita) {
          setNextAppt(res.data);
        } else {
          setNextAppt(null);
        }
      } catch (err) {
        console.error(err);
        setErrorAppt("No se pudo cargar tu próxima cita.");
      } finally {
        setLoadingAppt(false);
      }
    };

    fetchNextAppointment();
  }, []);

  // Actualizar countdown cada segundo cuando hay una cita
  useEffect(() => {
    if (!nextAppt?.proximaCita?.fecha_hora) return;

    // Aseguramos un parse consistente de DATETIME MySQL -> Date
    const mysqlToJsDate = (dt) => {
      // dt esperado: "YYYY-MM-DD HH:mm:ss"
      if (typeof dt === "string" && dt.includes(" ")) {
        return new Date(dt.replace(" ", "T"));
      }
      return new Date(dt);
    };

    const targetDate = mysqlToJsDate(nextAppt.proximaCita.fecha_hora);

    const tick = () => {
      const now = new Date();
      let diff = targetDate - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    tick(); // inicial
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextAppt]);

  // Helpers de formato
  const formatFecha = (datetimeStr) => {
    if (!datetimeStr) return "";
    const d = new Date(datetimeStr.replace(" ", "T"));
    // Ej: "martes, 12 de noviembre de 2025"
    return d.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Devuelve hora en formato 12 horas con sufijo AM/PM en mayúsculas
  const formatHora = (datetimeStr) => {
    if (!datetimeStr) return ""; // Si no hay string, devuelve vacío
    const d = new Date(datetimeStr.replace(" ", "T")); // Convierte "YYYY-MM-DD HH:mm:ss" a Date
    let hours = d.getHours(); // Horas en 24h (0-23)
    const minutes = String(d.getMinutes()).padStart(2, "0"); // Minutos con 2 dígitos
    const suffix = hours >= 12 ? "PM" : "AM"; // Sufijo AM/PM
    hours = hours % 12 || 12; // Convierte a 12h (0->12)
    return `${hours}:${minutes} ${suffix}`; // Ej: "10:05 AM"
  };

  const doctorNombre = nextAppt?.doctor
    ? `${nextAppt.doctor.nombres} ${nextAppt.doctor.apellidos}`.trim()
    : "";

  const hayCita = Boolean(nextAppt?.proximaCita);

  return (
    <>
      <div className="mb-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            ¡Hola {greetingName || "Usuario"}!
          </h2>
          <p className="text-gray-700 w-full">
            Hoy es un gran día para revisar tu perfil médico. Puedes consultar
            tus últimas citas o revisar tu historial médico. O tal vez puedas
            explorar nuestros servicios especializados y agendar tu próxima
            consulta.
          </p>
        </div>
      </div>

      <div className="py-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 [@media(min-width:545px)]:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm mx-auto h-52">
              <div className="card-body flex flex-col items-center justify-center text-center p-6 h-full">
                <CircleUserRound size={40} className="text-gray-700 mb-0" />
                <h4 className="card-title text-lg font-semibold text-gray-700 mb-1">
                  Mi Cuenta
                </h4>
                <p className="text-sm text-gray-700">
                  Gestiona tu información personal, contraseña y preferencias de
                  cuenta
                </p>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm mx-auto h-52">
              <div className="card-body flex flex-col items-center justify-center text-center p-6 h-full">
                <CircleDollarSign size={40} className="text-gray-700 mb-0" />
                <h4 className="card-title text-lg font-semibold text-gray-700 mb-1">
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
                Chequeo anual con 20% <br />
                de descuento.
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

              {loadingAppt ? (
                <div className="text-sm opacity-90">Cargando...</div>
              ) : errorAppt ? (
                <div className="text-sm opacity-90">{errorAppt}</div>
              ) : hayCita ? (
                <div className="text-xs sm:text-sm opacity-90 leading-relaxed space-y-1 mb-4">
                  <p>📅: {formatFecha(nextAppt.proximaCita.fecha_hora)}</p>
                  <p>🕑: {formatHora(nextAppt.proximaCita.fecha_hora)}</p>
                  <p>👩‍⚕️: {doctorNombre}</p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm opacity-90 leading-relaxed space-y-1 mb-4">
                  <p>No tienes citas próximas programadas.</p>
                </div>
              )}

              <button className="btn bg-white text-gray-700 border-white hover:bg-gray-100 hover:border-gray-100 rounded-full btn-xs sm:btn-sm">
                Ver detalles
              </button>
            </div>

            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm text-gray-700 flex items-center justify-center w-full [@media(min-width:570px)]:w-auto">
              {hayCita ? (
                <div className="grid grid-flow-col gap-4 sm:gap-5 text-center auto-cols-max">
                  <div className="flex flex-col items-center">
                    <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                      <span style={{ "--value": countdown.days }}></span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide">
                      días
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                      <span style={{ "--value": countdown.hours }}></span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide">
                      horas
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                      <span style={{ "--value": countdown.minutes }}></span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide">
                      min
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-700 flex items-center justify-center">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="countdown font-mono text-3xl sm:text-4xl leading-none mb-1">
                      <span style={{ "--value": countdown.seconds }}></span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide">
                      seg
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm sm:text-base text-center px-2">
                  Sin próximas citas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


const AccountDetailsContent = () => {
  const [userData, setUserData] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingHealth, setSavingHealth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const token = localStorage.getItem("token");
  const originalDataRef = useRef(null);

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/pacientes/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
        originalDataRef.current = res.data;
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setErrorMessage("No se pudo cargar la información del perfil");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar sección Cuenta y Contacto
  const handleSaveAccount = async () => {
    try {
      setSavingAccount(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const accountData = {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        email: userData.email,
        telefono: userData.telefono,
        direccion: userData.direccion,
        departamento_id: userData.departamento_id,
        provincia_id: userData.provincia_id,
        genero: userData.genero
      };
      
      await axios.put("http://localhost:3001/api/pacientes/profile", accountData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage("✅ Datos de cuenta actualizados correctamente");
      setIsEditingAccount(false);
      originalDataRef.current = { ...originalDataRef.current, ...accountData };
    } catch (err) {
      console.error("Error al guardar cuenta:", err);
      setErrorMessage("❌ Error al actualizar los datos de cuenta");
    } finally {
      setSavingAccount(false);
    }
  };

  // Guardar sección Salud y Emergencia
  const handleSaveHealth = async () => {
    try {
      setSavingHealth(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const healthData = {
        fecha_nacimiento: userData.fecha_nacimiento,
        tipo_sangre: userData.tipo_sangre,
        alergias: userData.alergias,
        condiciones_medicas: userData.condiciones_medicas,
        medicamentos_actuales: userData.medicamentos_actuales,
        contacto_emergencia_nombre: userData.contacto_emergencia_nombre,
        contacto_emergencia_telefono: userData.contacto_emergencia_telefono,
        seguro_medico: userData.seguro_medico,
        numero_poliza_seguro: userData.numero_poliza_seguro
      };
      
      await axios.put("http://localhost:3001/api/pacientes/profile", healthData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage("✅ Datos médicos actualizados correctamente");
      setIsEditingHealth(false);
      originalDataRef.current = { ...originalDataRef.current, ...healthData };
    } catch (err) {
      console.error("Error al guardar salud:", err);
      setErrorMessage("❌ Error al actualizar los datos médicos");
    } finally {
      setSavingHealth(false);
    }
  };

  const handleCancel = (section) => {
    setUserData(originalDataRef.current);
    setErrorMessage("");
    setSuccessMessage("");
    
    if (section === 'account') {
      setIsEditingAccount(false);
    } else if (section === 'health') {
      setIsEditingHealth(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-gray-700"></div>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-red-500">Error al cargar el perfil</div>;
  }

  const fullName = `${userData.nombres || ''} ${userData.apellidos || ''}`.trim();
  const avatarSrc = userData.foto_perfil || "https://img.daisyui.com/images/profile/demo/gordon@192.webp";

  return (
    <div className="space-y-4">
      {/* Mensajes de estado */}
      {successMessage && (
        <div className="alert alert-success bg-green-50 text-green-700 border-green-200">
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-error bg-red-50 text-red-700 border-red-200">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Card resumen */}
      <div className="card bg-base-100 w-full border border-gray-200">
        <div className="card-body py-3 px-4">
          <div className="flex items-start gap-4">
            <div className="indicator">
              <span className="indicator-item indicator-middle badge badge-success"></span>
              <div className="rounded-xl overflow-hidden h-32 w-32 bg-gray-100">
                <img src={avatarSrc} alt="Avatar del usuario" className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="flex-1 ml-2 sm:ml-3 pt-0">
              <h2 className="text-2xl font-bold text-gray-700 leading-tight mt-[-4px] mb-1">{fullName}</h2>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-lift tabs-sm">
        {/* TAB 1: Cuenta y Contacto */}
        <input type="radio" name="account_tabs" className="tab" aria-label="Cuenta y Contacto" defaultChecked />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-0">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Cuenta y perfil</h3>
              
              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Nombres</span>
                </label>
                <input 
                  type="text" 
                  name="nombres"
                  className="input w-full" 
                  value={userData.nombres || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount} 
                />
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Apellidos</span>
                </label>
                <input 
                  type="text" 
                  name="apellidos"
                  className="input w-full" 
                  value={userData.apellidos || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount} 
                />
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Género</span>
                </label>
                <select 
                  name="genero"
                  className="select w-full" 
                  value={userData.genero || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Email</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  className="input w-full" 
                  value={userData.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount} 
                />
              </fieldset>
            </div>

            <div className="p-0">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Contacto y ubicación</h3>
              
              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Teléfono</span>
                </label>
                <label className="input validator w-full">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <g fill="none">
                      <path d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z" fill="currentColor"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z" fill="currentColor"></path>
                    </g>
                  </svg>
                  <input
                    type="tel"
                    name="telefono"
                    className="tabular-nums w-full"
                    placeholder="Teléfono (9 dígitos)"
                    pattern="[0-9]*"
                    minLength={9}
                    maxLength={9}
                    title="Debe tener 9 dígitos"
                    value={userData.telefono || ''}
                    onChange={handleInputChange}
                    disabled={!isEditingAccount}
                  />
                </label>
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Dirección</span>
                </label>
                <input 
                  type="text" 
                  name="direccion"
                  className="input w-full" 
                  value={userData.direccion || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount} 
                />
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Departamento</span>
                </label>
                <select 
                  name="departamento_id"
                  className="select w-full" 
                  value={userData.departamento_id || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="1">Lima</option>
                  <option value="2">Arequipa</option>
                  <option value="3">Cusco</option>
                  <option value="4">La Libertad</option>
                  <option value="5">Piura</option>
                  <option value="6">Lambayeque</option>
                  <option value="7">Junín</option>
                  <option value="8">Puno</option>
                  <option value="9">Ancash</option>
                  <option value="10">Ica</option>
                </select>
              </fieldset>

              <fieldset className="fieldset border-none rounded-md p-1 mb-3">
                <label className="label pt-0 pb-0">
                  <span className="label-text text-sm font-medium text-gray-700">Provincia</span>
                </label>
                <select 
                  name="provincia_id"
                  className="select w-full" 
                  value={userData.provincia_id || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingAccount}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="1">Lima</option>
                  <option value="2">Callao</option>
                  <option value="6">Arequipa</option>
                  <option value="10">Cusco</option>
                  <option value="14">Trujillo</option>
                  <option value="18">Piura</option>
                  <option value="22">Chiclayo</option>
                  <option value="29">Puno</option>
                  <option value="33">Huaraz</option>
                  <option value="37">Ica</option>
                </select>
              </fieldset>
            </div>

            {/* Botones de la pestaña Cuenta */}
            <div className="md:col-span-2 flex justify-end gap-2">
              {!isEditingAccount ? (
                <button
                  type="button"
                  onClick={() => setIsEditingAccount(true)}
                  className="btn btn-sm bg-gray-700 hover:bg-gray-800 text-white"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleCancel('account')}
                    className="btn btn-sm btn-ghost text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAccount}
                    disabled={savingAccount}
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    {savingAccount ? "Guardando..." : "Guardar"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* TAB 2: Salud y Emergencia */}
        <input type="radio" name="account_tabs" className="tab" aria-label="Salud y Emergencia" />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Fecha de nacimiento</span>
              </label>
              <input 
                type="date" 
                name="fecha_nacimiento"
                className="input w-full" 
                value={userData.fecha_nacimiento ? userData.fecha_nacimiento.split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Tipo de sangre</span>
              </label>
              <select 
                name="tipo_sangre"
                className="select w-full" 
                value={userData.tipo_sangre || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              >
                <option value="">Selecciona una opción</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </fieldset>

            <fieldset className="md:col-span-1 fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Alergias</span>
              </label>
              <textarea 
                name="alergias"
                className="textarea w-full" 
                placeholder="Especifica alergias..."
                value={userData.alergias || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="md:col-span-1 fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Condiciones médicas</span>
              </label>
              <textarea 
                name="condiciones_medicas"
                className="textarea w-full" 
                placeholder="Condiciones médicas..."
                value={userData.condiciones_medicas || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="md:col-span-2 fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Medicamentos actuales</span>
              </label>
              <textarea 
                name="medicamentos_actuales"
                className="textarea w-full" 
                placeholder="Medicaciones actuales..."
                value={userData.medicamentos_actuales || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Nombre contacto de emergencia</span>
              </label>
              <input 
                type="text" 
                name="contacto_emergencia_nombre"
                className="input w-full" 
                value={userData.contacto_emergencia_nombre || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Teléfono contacto de emergencia</span>
              </label>
              <label className="input validator w-full">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <g fill="none">
                    <path d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z" fill="currentColor"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z" fill="currentColor"></path>
                  </g>
                </svg>
                <input
                  type="tel"
                  name="contacto_emergencia_telefono"
                  className="tabular-nums w-full"
                  placeholder="Teléfono (9 dígitos)"
                  pattern="[0-9]*"
                  minLength={9}
                  maxLength={9}
                  title="Debe tener 9 dígitos"
                  value={userData.contacto_emergencia_telefono || ''}
                  onChange={handleInputChange}
                  disabled={!isEditingHealth}
                />
              </label>
            </fieldset>

            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Seguro médico</span>
              </label>
              <input 
                type="text" 
                name="seguro_medico"
                className="input w-full" 
                value={userData.seguro_medico || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            <fieldset className="fieldset border-none rounded-md p-1">
              <label className="label pt-0 pb-0">
                <span className="label-text text-sm font-medium text-gray-700">Póliza</span>
              </label>
              <input 
                type="text" 
                name="numero_poliza_seguro"
                className="input w-full" 
                value={userData.numero_poliza_seguro || ''}
                onChange={handleInputChange}
                disabled={!isEditingHealth}
              />
            </fieldset>

            {/* Botones de la pestaña Salud (INDEPENDIENTES) */}
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              {!isEditingHealth ? (
                <button
                  type="button"
                  onClick={() => setIsEditingHealth(true)}
                  className="btn btn-sm bg-gray-700 hover:bg-gray-800 text-white"
                >
                  Editar Detalles Médicos
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleCancel('health')}
                    className="btn btn-sm btn-ghost text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHealth}
                    disabled={savingHealth}
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    {savingHealth ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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
