import { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { logoVerde } from "./homepage.jsx";

function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    numero_licencia: "",
    especialidad_principal: "",
    descripcion: "",
    formacion: "",
  });
  const [userType, setUserType] = useState("paciente");
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        type === "doctor"
          ? "http://localhost:3001/api/register-doctor"
          : "http://localhost:3001/api/register";

      const payload =
        type === "doctor"
          ? {
              nombres: formData.nombres,
              apellidos: formData.apellidos,
              email: formData.email,
              password: formData.password,
              numero_licencia: formData.numero_licencia,
              especialidad_principal: formData.especialidad_principal,
              descripcion: formData.descripcion,
              formacion: formData.formacion,
            }
          : {
              nombres: formData.nombres,
              apellidos: formData.apellidos,
              email: formData.email,
              password: formData.password,
            };

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
          numero_licencia: "",
          especialidad_principal: "",
          descripcion: "",
          formacion: "",
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
    <div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
      <section className="flex flex-col lg:flex-row items-stretch min-h-screen w-full">
        <div className="w-full lg:w-5/12 bg-white px-6 sm:px-8 md:px-10 lg:px-12 py-10 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img src={logoVerde} alt="Doctoralia Logo" className="h-10" />
              </Link>
            </div>

            <h1 className="text-xl md:text-2xl font-bold leading-tight text-[#0A3C3F] mb-6">
              Crear Cuenta
            </h1>

            {/* Tabs DaisyUI */}
            <div className="tabs tabs-border mb-6">
              <input
                type="radio"
                name="register_tabs"
                className="tab"
                aria-label="Soy Paciente"
                checked={userType === "paciente"}
                onChange={() => setUserType("paciente")}
              />
              <div className="tab-content border-base-300 bg-base-100 p-6">
                <form onSubmit={(e) => handleSubmit(e, "paciente")}>
                  <fieldset className="fieldset">
                    <legend>Nombres</legend>
                    <input
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Apellidos</legend>
                    <input
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Email</legend>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Contraseña</legend>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-[#0A3C3F] text-white font-semibold rounded-lg py-3 hover:bg-[#083032]"
                  >
                    {loading ? "Registrando..." : "Crear Cuenta"}
                  </button>
                </form>
              </div>

              <input
                type="radio"
                name="register_tabs"
                className="tab"
                aria-label="Soy Doctor"
                checked={userType === "doctor"}
                onChange={() => setUserType("doctor")}
              />
              <div className="tab-content border-base-300 bg-base-100 p-6">
                <form onSubmit={(e) => handleSubmit(e, "doctor")}>
                  <fieldset className="fieldset">
                    <legend>Nombres</legend>
                    <input
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Apellidos</legend>
                    <input
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Email</legend>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Contraseña</legend>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Número de Licencia Médica</legend>
                    <input
                      name="numero_licencia"
                      value={formData.numero_licencia}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Especialidad Principal</legend>
                    <select
                      name="especialidad_principal"
                      value={formData.especialidad_principal}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-[#d4f3ef]"
                    >
                      <option value="">Selecciona una especialidad</option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Descripción Profesional</legend>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 rounded-lg bg-[#d4f3ef] resize-none"
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-4">
                    <legend>Formación Académica</legend>
                    <textarea
                      name="formacion"
                      value={formData.formacion}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 rounded-lg bg-[#d4f3ef] resize-none"
                    />
                  </fieldset>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-[#0A3C3F] text-white font-semibold rounded-lg py-3 hover:bg-[#083032]"
                  >
                    {loading ? "Registrando..." : "Crear Cuenta"}
                  </button>
                </form>
              </div>
            </div>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-8 text-sm text-gray-600 text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-[#0A3C3F] hover:text-[#083032] font-semibold"
              >
                Inicia Sesión
              </Link>
            </p>

            <p className="text-xs text-gray-500 mt-12 text-center">
              © 2025 Doctoralia - Todos los derechos reservados.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-7/12 items-center justify-center">
          <img
            src="https://img.freepik.com/free-photo/front-view-male-nurse-hospital_23-2150796810.jpg"
            alt="Imagen Decorativa"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default Register;
