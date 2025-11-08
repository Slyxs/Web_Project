// Importaciones
import { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { logoVerde } from "./homepage.jsx";

// Definición del Componente Register
function Register() {
  // Estado para campos del formulario
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    userType: "paciente",
    // Campos específicos para doctor
    numero_licencia: "",
    especialidad_principal: "",
    descripcion: "",
    formacion: ""
  });

  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/especialidades");
        const data = await res.json();
        setEspecialidades(data);
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
      }
    };
    fetchEspecialidades();
  }, []);

  // Manejar cambios de campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambio de tab
  const handleTabChange = (userType) => {
    setFormData({
      ...formData,
      userType: userType
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = formData.userType === "doctor"
        ? "http://localhost:3001/api/register-doctor"
        : "http://localhost:3001/api/register";

      const payload = formData.userType === "doctor"
        ? {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            password: formData.password,
            numero_licencia: formData.numero_licencia,
            especialidad_principal: formData.especialidad_principal,
            descripcion: formData.descripcion,
            formacion: formData.formacion
          }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setFormData({
          nombres: "",
          apellidos: "",
          email: "",
          password: "",
          userType: "paciente",
          numero_licencia: "",
          especialidad_principal: "",
          descripcion: "",
          formacion: ""
        });
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar. Verifica la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor Más Externo
    <div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
      {/* Diseño de la Sección Principal */}
      <section className="flex flex-col lg:flex-row items-stretch min-h-screen w-full">
        {/* Panel Izquierdo del Formulario */}
        <div className="w-full lg:w-5/12 bg-white px-6 sm:px-8 md:px-10 lg:px-12 py-10 flex items-center justify-center overflow-y-auto">
          {/* Contenedor Interno del Formulario */}
          <div className="w-full max-w-md">
            {/* Imagen del Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img
                  src={logoVerde}
                  alt="Doctoralia Logo"
                  className="h-10"
                />
              </Link>
            </div>

            {/* Encabezado */}
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-[#0A3C3F] mb-6">
              Crear Cuenta
            </h1>

            {/* Formulario de Registro */}
            <form className="mt-6" onSubmit={handleSubmit} aria-busy={loading}>

              {/* Tabs para selección de tipo de usuario */}
              <div className="tabs tabs-box mb-6">
                <input
                  type="radio"
                  name="user_tabs"
                  className="tab"
                  aria-label="Paciente"
                  checked={formData.userType === "paciente"}
                  onChange={() => handleTabChange("paciente")}
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  {/* Formulario Paciente */}
                  <div className="space-y-4">
                    {/* Grupo de Campos Nombres */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Nombres</legend>
                      <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        placeholder="John"
                        autoComplete="given-name"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Apellidos */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Apellidos</legend>
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Doe"
                        autoComplete="family-name"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Email */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">E-mail</legend>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nombre@ejemplo.com"
                        autoComplete="email"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Contraseña */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Contraseña</legend>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        minLength={6}
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>
                  </div>
                </div>

                <input
                  type="radio"
                  name="user_tabs"
                  className="tab"
                  aria-label="Doctor"
                  checked={formData.userType === "doctor"}
                  onChange={() => handleTabChange("doctor")}
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  {/* Formulario Doctor */}
                  <div className="space-y-4">
                    {/* Grupo de Campos Nombres */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Nombres</legend>
                      <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        placeholder="John"
                        autoComplete="given-name"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Apellidos */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Apellidos</legend>
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Doe"
                        autoComplete="family-name"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Email */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">E-mail</legend>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nombre@ejemplo.com"
                        autoComplete="email"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Grupo de Campos Contraseña */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">Contraseña</legend>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        minLength={6}
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Número de Licencia */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                        Número de Licencia Médica
                      </legend>
                      <input
                        type="text"
                        name="numero_licencia"
                        value={formData.numero_licencia}
                        onChange={handleChange}
                        placeholder="Ej: LM-123456"
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      />
                    </fieldset>

                    {/* Especialidad Principal */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                        Especialidad Principal
                      </legend>
                      <select
                        name="especialidad_principal"
                        value={formData.especialidad_principal}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F]"
                        required
                      >
                        <option value="">Selecciona una especialidad</option>
                        {especialidades.map((especialidad) => (
                          <option key={especialidad.id} value={especialidad.id}>
                            {especialidad.nombre}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    {/* Descripción */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                        Descripción Profesional
                      </legend>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Breve descripción de tu experiencia y especialidades..."
                        disabled={loading}
                        rows="3"
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F] resize-none"
                      />
                    </fieldset>

                    {/* Formación */}
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-[#0A3C3F] text-base font-medium">
                        Formación Académica
                      </legend>
                      <textarea
                        name="formacion"
                        value={formData.formacion}
                        onChange={handleChange}
                        placeholder="Títulos universitarios, especializaciones, cursos..."
                        disabled={loading}
                        rows="3"
                        className="w-full p-3 rounded-lg bg-[#d4f3ef] focus:outline-none focus:ring-1 focus:ring-[#0A3C3F] text-[#0A3C3F] resize-none"
                      />
                    </fieldset>
                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full block bg-[#0A3C3F] hover:bg-[#083032] focus:bg-[#083032] text-white font-semibold rounded-lg px-4 py-3 mt-6 transition-colors duration-300"
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </form>

            {/* Divisor */}
            <hr className="my-6 border-gray-300 w-full" />

            {/* Enlace de Inicio de Sesión */}
            <p className="mt-8 text-sm text-gray-600 text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-[#0A3C3F] hover:text-[#083032] font-semibold"
              >
                Inicia Sesión
              </Link>
            </p>

            {/* Pie de Página de Copyright */}
            <p className="text-xs text-gray-500 mt-12 text-center">
              © 2025 Doctoralia - Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Panel Decorativo Derecho */}
        <div className="hidden lg:flex lg:w-7/12 items-center justify-center">
          {/* Imagen Decorativa */}
          <img
            src="https://img.freepik.com/free-photo/front-view-male-nurse-hospital_23-2150796810.jpg?t=st=1760576822~exp=1760580422~hmac=4bfac4f06bdcd3e0beb11e20cf39c02de68250329982ff47ff0b7e42403e9955&w=1060"
            alt="Imagen Decorativa"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}

// Exportar Componente Register
export default Register;
