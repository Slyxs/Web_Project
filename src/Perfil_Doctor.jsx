import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Menu,
	Search,
	User,
	CircleUserRound,
	Calendar,
	Stethoscope,
	Wallet,
	FileText,
	Star,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	TrendingUp,
	Users,
	LayoutDashboard,
	UserCog,
	LogOut
} from "lucide-react";
import axios from "axios";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	AreaChart,
	Area
} from "recharts";

// Página de perfil para DOCTORES
// Mantiene el mismo navbar y estética general que `Perfil.jsx`,
// pero con secciones específicas para el rol de doctor.

function PerfilDoctor() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [activeSection, setActiveSection] = useState("Dashboard");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const tipo = localStorage.getItem("tipo");

		if (!token || tipo !== "doctor") {
			setIsLoggedIn(false);
			navigate("/login");
			return;
		}

		setIsLoggedIn(true);

		const storedName = localStorage.getItem("nombres") || "Doctor";
		setUserName(storedName);
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("tipo");
		localStorage.removeItem("nombres");
		localStorage.removeItem("apellidos");
		setIsLoggedIn(false);
		navigate("/login");
	};

	const renderSectionContent = () => {
		switch (activeSection) {
			case "Dashboard":
				return <DashboardDoctorContent userName={userName} />;
			case "Perfil Profesional":
				return <DoctorProfileContent />;
			case "Mis Citas":
				return <DoctorAppointmentsContent />;
			case "Pacientes":
				return <DoctorPatientsContent />;
			case "Ingresos":
				return <DoctorIncomeContent />;
			case "Valoraciones":
				return <DoctorReviewsContent />;
			default:
				return <DashboardDoctorContent userName={userName} />;
		}
	};

	return (
		<div className="min-h-screen bg-white font-['Rubik'] text-[#0A3C3F]">
			{/* NAVBAR - igual que en Perfil.jsx */}
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
									<Link
										to="/buscar-doctores"
										className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
									>
										Doctores
									</Link>
								</li>
								<li>
									<Link
										to="/chatbot"
										className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']"
									>
										Asistente IA
									</Link>
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
										to="/perfil-doctor"
										className="text-white hover:text-[#A9E8E0] p-2"
									>
										<CircleUserRound size={25} />
									</Link>
								</div>
							)}

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
										<Link to="/buscar-doctores" className="hover:text-[#A9E8E0] text-lg py-2">
											Doctores
										</Link>
									</li>
									<li>
										<Link to="/chatbot" className="hover:text-[#A9E8E0] text-lg py-2">
											Asistente IA
										</Link>
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
											<Link
												to="/buscar-doctores"
												className="hover:text-[#A9E8E0] flex items-center text-lg p-2"
											>
												<Search size={20} className="mr-3" /> Buscar
											</Link>
										</li>

										{isLoggedIn ? (
											<>
												<li className="mt-2">
													<Link
														to="/perfil-doctor"
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

			{/* TÍTULO */}
			<div className="text-center mt-12 mb-8">
				<h1 className="text-4xl font-bold text-gray-700">Mi Perfil (Doctor)</h1>
			</div>

			{/* CONTENIDO PRINCIPAL */}
			<section className="flex min-h-[70vh]">
				<div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto px-4">
					{/* MENÚ LATERAL */}
					<ul className="menu bg-white border border-gray-200 rounded-xl w-full lg:w-72 p-2 shadow-sm h-fit">
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Dashboard" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Dashboard")}
							>
								<LayoutDashboard size={20} />
								Dashboard
							</button>
						</li>
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Perfil Profesional" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Perfil Profesional")}
							>
								<UserCog size={20} />
								Perfil Profesional
							</button>
						</li>
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Mis Citas" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Mis Citas")}
							>
								<Calendar size={20} />
								Mis Citas
							</button>
						</li>
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Pacientes" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Pacientes")}
							>
								<Users size={20} />
								Pacientes
							</button>
						</li>
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Ingresos" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Ingresos")}
							>
								<Wallet size={20} />
								Ingresos
							</button>
						</li>
						<li>
							<button
								className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === "Valoraciones" ? "bg-[#0A3C3F] text-white font-medium shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3C3F]"}`}
								onClick={() => setActiveSection("Valoraciones")}
							>
								<Star size={20} />
								Valoraciones
							</button>
						</li>
						<div className="divider my-2"></div>
						<li>
							<button
								className="flex items-center gap-3 py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
								onClick={handleLogout}
							>
								<LogOut size={20} />
								Cerrar Sesión
							</button>
						</li>
					</ul>

					<div className="flex-1 mt-0">{renderSectionContent()}</div>
				</div>
			</section>
		</div>
	);
}

// ==============================
// Dashboard del doctor
// ==============================
const DashboardDoctorContent = ({ userName }) => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Datos simulados para las gráficas (en un caso real vendrían del backend)
	const incomeData = [
		{ name: "Ene", ingresos: 4000 },
		{ name: "Feb", ingresos: 3000 },
		{ name: "Mar", ingresos: 2000 },
		{ name: "Abr", ingresos: 2780 },
		{ name: "May", ingresos: 1890 },
		{ name: "Jun", ingresos: 2390 },
	];

	const appointmentData = [
		{ name: "Completadas", value: 400, color: "#0A3C3F" },
		{ name: "Pendientes", value: 300, color: "#F59E0B" },
		{ name: "Canceladas", value: 100, color: "#EF4444" },
	];

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/dashboard", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setStats(res.data || null);
			} catch (err) {
				setError("No se pudieron cargar las estadísticas.");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	const nombreMostrar =
		userName || localStorage.getItem("nombres") || "Doctor";

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<p className="text-sm text-gray-500 font-medium">Bienvenido de nuevo</p>
					<h2 className="text-3xl font-bold text-[#0A3C3F]">
						Dr(a). {nombreMostrar}
					</h2>
				</div>
				<div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
					<Calendar size={18} className="text-gray-500" />
					<span className="text-sm font-medium text-gray-600">
						{new Date().toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
					</span>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
				</div>
			) : error ? (
				<div className="alert alert-error bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
					<AlertCircle size={20} />
					<span>{error}</span>
				</div>
			) : (
				<>
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="card bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
							<div className="card-body p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="rounded-full bg-[#E9F7F5] p-3">
										<Calendar className="text-[#0A3C3F]" size={24} />
									</div>
									<span className="badge badge-ghost text-xs font-medium text-gray-500">Hoy</span>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Citas Programadas</p>
									<p className="text-3xl font-bold text-[#0A3C3F]">
										{stats?.citasHoy ?? 0}
									</p>
								</div>
							</div>
						</div>

						<div className="card bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
							<div className="card-body p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="rounded-full bg-[#FFF5EB] p-3">
										<Users className="text-[#F59E0B]" size={24} />
									</div>
									<span className="badge badge-ghost text-xs font-medium text-gray-500">Total</span>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Pacientes Activos</p>
									<p className="text-3xl font-bold text-[#0A3C3F]">
										{stats?.totalPacientes ?? 0}
									</p>
								</div>
							</div>
						</div>

						<div className="card bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
							<div className="card-body p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="rounded-full bg-[#E6F1FF] p-3">
										<Wallet className="text-[#3B82F6]" size={24} />
									</div>
									<span className="badge badge-ghost text-xs font-medium text-gray-500">Este Mes</span>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Ingresos Estimados</p>
									<p className="text-3xl font-bold text-[#0A3C3F]">
										S/ {stats?.ingresosMes ?? 0}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Income Chart */}
						<div className="card bg-white shadow-md border border-gray-100">
							<div className="card-body p-6">
								<h3 className="card-title text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
									<TrendingUp size={20} className="text-[#0A3C3F]" />
									Ingresos Semestrales
								</h3>
								<div className="h-[300px] w-full">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={incomeData}>
											<defs>
												<linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#0A3C3F" stopOpacity={0.8}/>
													<stop offset="95%" stopColor="#0A3C3F" stopOpacity={0}/>
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
											<XAxis 
												dataKey="name" 
												axisLine={false} 
												tickLine={false} 
												tick={{fill: '#6B7280', fontSize: 12}}
												dy={10}
											/>
											<YAxis 
												axisLine={false} 
												tickLine={false} 
												tick={{fill: '#6B7280', fontSize: 12}}
												tickFormatter={(value) => `S/ ${value}`}
											/>
											<Tooltip 
												contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
												formatter={(value) => [`S/ ${value}`, "Ingresos"]}
											/>
											<Area 
												type="monotone" 
												dataKey="ingresos" 
												stroke="#0A3C3F" 
												fillOpacity={1} 
												fill="url(#colorIngresos)" 
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>

						{/* Appointments Status Chart */}
						<div className="card bg-white shadow-md border border-gray-100">
							<div className="card-body p-6">
								<h3 className="card-title text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
									<CheckCircle size={20} className="text-[#0A3C3F]" />
									Estado de Citas
								</h3>
								<div className="h-[300px] w-full flex items-center justify-center">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={appointmentData}
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={100}
												paddingAngle={5}
												dataKey="value"
											>
												{appointmentData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip 
												contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
											/>
											<Legend 
												verticalAlign="bottom" 
												height={36}
												iconType="circle"
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

// ==============================
// Perfil profesional del doctor
// ==============================
const DoctorProfileContent = () => {
	const [formData, setFormData] = useState({
		nombres: "",
		apellidos: "",
		email: "",
		telefono: "",
		fecha_nacimiento: "",
		genero: "",
		consultorio_direccion: "",
		departamento_id: "",
		provincia_id: "",
		descripcion: "",
		experiencia: "",
		formacion: "",
		certificaciones: "",
		costo_consulta: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingConsultorio, setIsEditingConsultorio] = useState(false);
	const [isEditingProfesional, setIsEditingProfesional] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/profile", {
					headers: { Authorization: `Bearer ${token}` },
				});

				const u = res.data?.usuario || res.data || {};
				setFormData((prev) => ({
					...prev,
					nombres: u.nombres || "",
					apellidos: u.apellidos || "",
					email: u.email || "",
					telefono: u.telefono || "",
					fecha_nacimiento: u.fecha_nacimiento || "",
					genero: u.genero || "",
					consultorio_direccion: u.consultorio_direccion || "",
					departamento_id: u.departamento_id || "",
					provincia_id: u.provincia_id || "",
					descripcion: u.descripcion || "",
					experiencia: u.experiencia || "",
					formacion: u.formacion || "",
					certificaciones: u.certificaciones || "",
					costo_consulta: u.costo_consulta || "",
				}));
			} catch (err) {
				setError("No se pudo cargar el perfil del doctor.");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		if (e) e.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");

		try {
			const token = localStorage.getItem("token");
			
			// Preparar datos para enviar, convirtiendo strings vacíos a null para campos numéricos
			const dataToSend = {
				...formData,
				departamento_id: formData.departamento_id ? parseInt(formData.departamento_id, 10) : null,
				provincia_id: formData.provincia_id ? parseInt(formData.provincia_id, 10) : null,
				costo_consulta: formData.costo_consulta ? parseFloat(formData.costo_consulta) : null,
			};

			await axios.put("http://localhost:3001/api/doctores/profile", dataToSend, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessage("Perfil actualizado correctamente.");
			setIsEditingPersonal(false);
			setIsEditingConsultorio(false);
			setIsEditingProfesional(false);
		} catch (err) {
			console.error("Error al actualizar perfil:", err);
			setError(err.response?.data?.message || "No se pudo actualizar el perfil.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
			</div>
		);
	}

	const fullName = `${formData.nombres || ''} ${formData.apellidos || ''}`.trim();
	const avatarSrc = "https://img.daisyui.com/images/profile/demo/gordon@192.webp";

	return (
		<div className="space-y-4">
			{/* Mensajes de estado */}
			{message && (
				<div className="alert alert-success bg-green-50 text-green-700 border-green-200">
					<CheckCircle size={20} />
					<span>{message}</span>
				</div>
			)}
			{error && (
				<div className="alert alert-error bg-red-50 text-red-700 border-red-200">
					<AlertCircle size={20} />
					<span>{error}</span>
				</div>
			)}

			{/* Card resumen del doctor */}
			<div className="card bg-base-100 w-full border border-gray-200">
				<div className="card-body py-3 px-4">
					<div className="flex items-start gap-4">
						<div className="indicator">
							<span className="indicator-item indicator-middle badge badge-success"></span>
							<div className="rounded-xl overflow-hidden h-32 w-32 bg-gray-100">
								<img src={avatarSrc} alt="Avatar del doctor" className="object-cover w-full h-full" />
							</div>
						</div>
						<div className="flex-1 ml-2 sm:ml-3 pt-0">
							<h2 className="text-2xl font-bold text-gray-700 leading-tight mt-[-4px] mb-1">
								Dr(a). {fullName}
							</h2>
							<p className="text-sm text-gray-600">{formData.email}</p>
							{formData.costo_consulta && (
								<p className="text-sm text-[#0A3C3F] font-semibold mt-1">
									Consulta: S/ {formData.costo_consulta}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="tabs tabs-lift tabs-sm">
				{/* TAB 1: Datos Personales */}
				<input type="radio" name="doctor_profile_tabs" className="tab" aria-label="Datos Personales" defaultChecked />
				<div className="tab-content bg-base-100 border-base-300 p-6">
					<form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="p-0">
							<h3 className="text-lg font-semibold text-gray-700 mb-3">Información Personal</h3>
							
							<fieldset className="fieldset border-none rounded-md p-1 mb-3">
								<label className="label pt-0 pb-0">
									<span className="label-text text-sm font-medium text-gray-700">Nombres</span>
								</label>
								<input 
									type="text" 
									name="nombres"
									className="input w-full" 
									value={formData.nombres}
									onChange={handleChange}
									disabled={!isEditingPersonal} 
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
									value={formData.apellidos}
									onChange={handleChange}
									disabled={!isEditingPersonal} 
								/>
							</fieldset>

							<fieldset className="fieldset border-none rounded-md p-1 mb-3">
								<label className="label pt-0 pb-0">
									<span className="label-text text-sm font-medium text-gray-700">Género</span>
								</label>
								<select 
									name="genero"
									className="select w-full" 
									value={formData.genero}
									onChange={handleChange}
									disabled={!isEditingPersonal}
								>
									<option value="">Selecciona una opción</option>
									<option value="femenino">Femenino</option>
									<option value="masculino">Masculino</option>
									<option value="otro">Otro</option>
								</select>
							</fieldset>

							<fieldset className="fieldset border-none rounded-md p-1 mb-3">
								<label className="label pt-0 pb-0">
									<span className="label-text text-sm font-medium text-gray-700">Fecha de Nacimiento</span>
								</label>
								<input 
									type="date" 
									name="fecha_nacimiento"
									className="input w-full" 
									value={formData.fecha_nacimiento ? formData.fecha_nacimiento.split('T')[0] : ''}
									onChange={handleChange}
									disabled={!isEditingPersonal} 
								/>
							</fieldset>
						</div>

						<div className="p-0">
							<h3 className="text-lg font-semibold text-gray-700 mb-3">Contacto</h3>
							
							<fieldset className="fieldset border-none rounded-md p-1 mb-3">
								<label className="label pt-0 pb-0">
									<span className="label-text text-sm font-medium text-gray-700">Email</span>
								</label>
								<input 
									type="email" 
									name="email"
									className="input w-full" 
									value={formData.email}
									onChange={handleChange}
									disabled={!isEditingPersonal} 
								/>
							</fieldset>

							<fieldset className="fieldset border-none rounded-md p-1 mb-3">
								<label className="label pt-0 pb-0">
									<span className="label-text text-sm font-medium text-gray-700">Teléfono</span>
								</label>
								<input 
									type="tel" 
									name="telefono"
									className="input w-full" 
									placeholder="Teléfono (9 dígitos)"
									pattern="[0-9]*"
									minLength={9}
									maxLength={9}
									value={formData.telefono}
									onChange={handleChange}
									disabled={!isEditingPersonal} 
								/>
							</fieldset>
						</div>

						{/* Botones de la pestaña Datos Personales */}
						<div className="md:col-span-2 flex justify-end gap-2">
							{!isEditingPersonal ? (
								<button
									type="button"
									onClick={() => setIsEditingPersonal(true)}
									className="btn btn-sm bg-[#0A3C3F] hover:bg-[#0c4d51] text-white"
								>
									Editar
								</button>
							) : (
								<>
									<button
										type="button"
										onClick={() => setIsEditingPersonal(false)}
										className="btn btn-sm btn-ghost text-gray-700"
									>
										Cancelar
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={saving}
										className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
									>
										{saving ? "Guardando..." : "Guardar"}
									</button>
								</>
							)}
						</div>
					</form>
				</div>

				{/* TAB 2: Consultorio */}
				<input type="radio" name="doctor_profile_tabs" className="tab" aria-label="Consultorio" />
				<div className="tab-content bg-base-100 border-base-300 p-6">
					<form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<fieldset className="md:col-span-2 fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Dirección del Consultorio</span>
							</label>
							<input 
								type="text" 
								name="consultorio_direccion"
								className="input w-full" 
								placeholder="Av. Principal 123, Oficina 456"
								value={formData.consultorio_direccion}
								onChange={handleChange}
								disabled={!isEditingConsultorio}
							/>
						</fieldset>

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Departamento</span>
							</label>
							<select 
								name="departamento_id"
								className="select w-full" 
								value={formData.departamento_id}
								onChange={handleChange}
								disabled={!isEditingConsultorio}
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

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Provincia</span>
							</label>
							<select 
								name="provincia_id"
								className="select w-full" 
								value={formData.provincia_id}
								onChange={handleChange}
								disabled={!isEditingConsultorio}
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

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Costo de Consulta (S/)</span>
							</label>
							<input 
								type="number" 
								name="costo_consulta"
								className="input w-full" 
								placeholder="150"
								min="0"
								step="10"
								value={formData.costo_consulta}
								onChange={handleChange}
								disabled={!isEditingConsultorio}
							/>
						</fieldset>

						{/* Botones de la pestaña Consultorio */}
						<div className="md:col-span-2 flex justify-end gap-2">
							{!isEditingConsultorio ? (
								<button
									type="button"
									onClick={() => setIsEditingConsultorio(true)}
									className="btn btn-sm bg-[#0A3C3F] hover:bg-[#0c4d51] text-white"
								>
									Editar
								</button>
							) : (
								<>
									<button
										type="button"
										onClick={() => setIsEditingConsultorio(false)}
										className="btn btn-sm btn-ghost text-gray-700"
									>
										Cancelar
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={saving}
										className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
									>
										{saving ? "Guardando..." : "Guardar"}
									</button>
								</>
							)}
						</div>
					</form>
				</div>

				{/* TAB 3: Perfil Profesional */}
				<input type="radio" name="doctor_profile_tabs" className="tab" aria-label="Perfil Profesional" />
				<div className="tab-content bg-base-100 border-base-300 p-6">
					<form onSubmit={(e) => e.preventDefault()} className="space-y-4">
						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Descripción Profesional</span>
							</label>
							<textarea 
								name="descripcion"
								className="textarea w-full" 
								rows={3}
								placeholder="Breve descripción sobre tu especialidad y enfoque..."
								value={formData.descripcion}
								onChange={handleChange}
								disabled={!isEditingProfesional}
							/>
						</fieldset>

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Experiencia</span>
							</label>
							<textarea 
								name="experiencia"
								className="textarea w-full" 
								rows={3}
								placeholder="Años de experiencia, hospitales, clínicas donde has trabajado..."
								value={formData.experiencia}
								onChange={handleChange}
								disabled={!isEditingProfesional}
							/>
						</fieldset>

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Formación Académica</span>
							</label>
							<textarea 
								name="formacion"
								className="textarea w-full" 
								rows={3}
								placeholder="Universidad, especialidades, maestrías, doctorados..."
								value={formData.formacion}
								onChange={handleChange}
								disabled={!isEditingProfesional}
							/>
						</fieldset>

						<fieldset className="fieldset border-none rounded-md p-1">
							<label className="label pt-0 pb-0">
								<span className="label-text text-sm font-medium text-gray-700">Certificaciones</span>
							</label>
							<textarea 
								name="certificaciones"
								className="textarea w-full" 
								rows={3}
								placeholder="Certificaciones, cursos, diplomados..."
								value={formData.certificaciones}
								onChange={handleChange}
								disabled={!isEditingProfesional}
							/>
						</fieldset>

						{/* Botones de la pestaña Perfil Profesional */}
						<div className="flex justify-end gap-2">
							{!isEditingProfesional ? (
								<button
									type="button"
									onClick={() => setIsEditingProfesional(true)}
									className="btn btn-sm bg-[#0A3C3F] hover:bg-[#0c4d51] text-white"
								>
									Editar
								</button>
							) : (
								<>
									<button
										type="button"
										onClick={() => setIsEditingProfesional(false)}
										className="btn btn-sm btn-ghost text-gray-700"
									>
										Cancelar
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={saving}
										className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
									>
										{saving ? "Guardando..." : "Guardar"}
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

// ==============================
// Citas del doctor
// ==============================
const DoctorAppointmentsContent = () => {
	const [citas, setCitas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchCitas = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/citas", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCitas(res.data || []);
			} catch (err) {
				setError("No se pudieron cargar las citas.");
			} finally {
				setLoading(false);
			}
		};

		fetchCitas();
	}, []);

	const formatFechaHora = (str) => {
		if (!str) return "";
		const d = new Date(str);
		return d.toLocaleString();
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-error bg-red-50 border border-red-200 text-red-700">
				{error}
			</div>
		);
	}

	if (!citas.length) {
		return <p className="text-gray-500">No hay citas registradas.</p>;
	}

	return (
		<div className="card bg-white shadow-md border border-gray-100">
			<div className="card-body p-6">
				<h3 className="card-title text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
					<Calendar size={24} className="text-[#0A3C3F]" />
					Mis Citas
				</h3>
				<div className="space-y-4">
					{citas.map((cita) => (
						<div
							key={cita.id}
							className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
						>
							<div className="flex items-start gap-4">
								<div className="bg-[#E9F7F5] p-3 rounded-full hidden md:block">
									<User size={20} className="text-[#0A3C3F]" />
								</div>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<Clock size={14} className="text-gray-400" />
										<p className="text-sm text-gray-500 font-medium">{formatFechaHora(cita.fecha_hora)}</p>
									</div>
									<p className="font-bold text-gray-800 text-lg">
										{cita.paciente_nombres} {cita.paciente_apellidos}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										<span className="font-medium">Motivo:</span> {cita.motivo}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
										cita.estado === "confirmada"
											? "bg-green-100 text-green-700"
											: cita.estado === "pendiente"
											? "bg-yellow-100 text-yellow-700"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									{cita.estado}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

// ==============================
// Pacientes del doctor
// ==============================
const DoctorPatientsContent = () => {
	const [pacientes, setPacientes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchPacientes = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/pacientes", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPacientes(res.data || []);
			} catch (err) {
				setError("No se pudieron cargar los pacientes.");
			} finally {
				setLoading(false);
			}
		};

		fetchPacientes();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-error bg-red-50 border border-red-200 text-red-700">
				{error}
			</div>
		);
	}

	if (!pacientes.length) {
		return <p className="text-gray-500">Aún no tienes pacientes registrados.</p>;
	}

	return (
		<div className="space-y-3">
			{pacientes.map((p) => (
				<div
					key={p.id}
					className="border border-[#E0E0E0] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
				>
					<div>
						<p className="font-semibold text-gray-800">
							{p.nombres} {p.apellidos}
						</p>
						<p className="text-sm text-gray-500">Email: {p.email}</p>
					</div>
					<div className="text-sm text-gray-500">
						Última cita: {p.ultima_cita ? new Date(p.ultima_cita).toLocaleDateString() : "-"}
					</div>
				</div>
			))}
		</div>
	);
};

// ==============================
// Ingresos del doctor
// ==============================
const DoctorIncomeContent = () => {
	const [ingresos, setIngresos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchIngresos = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/ingresos", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIngresos(res.data.pagos || []);
			} catch (err) {
				setError("No se pudieron cargar los ingresos.");
			} finally {
				setLoading(false);
			}
		};

		fetchIngresos();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-error bg-red-50 border border-red-200 text-red-700">
				{error}
			</div>
		);
	}

	if (!ingresos.length) {
		return <p className="text-gray-500">Aún no tienes ingresos registrados.</p>;
	}

	return (
		<div className="space-y-3">
			{ingresos.map((i) => (
				<div
					key={i.id}
					className="border border-[#E0E0E0] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
				>
					<div>
						<p className="font-semibold text-gray-800">
							Paciente: {i.paciente_nombres} {i.paciente_apellidos}
						</p>
						<p className="text-sm text-gray-500">Tipo: {i.tipo_consulta}</p>
					</div>
					<div className="text-right">
						<p className="font-bold text-[#0A3C3F]">S/ {i.monto}</p>
						<p className="text-xs text-gray-500">
							{i.fecha_pago ? new Date(i.fecha_pago).toLocaleDateString() : "-"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

// ==============================
// Valoraciones recibidas por el doctor
// ==============================
const DoctorReviewsContent = () => {
	const [valoraciones, setValoraciones] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchValoraciones = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("http://localhost:3001/api/doctores/valoraciones", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setValoraciones(res.data.valoraciones || []);
			} catch (err) {
				setError("No se pudieron cargar las valoraciones.");
			} finally {
				setLoading(false);
			}
		};

		fetchValoraciones();
	}, []);

	const renderStars = (score) => {
		const full = Math.round(score || 0);
		return (
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }).map((_, idx) => (
					<Star
						key={idx}
						size={18}
						className={
							idx < full ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
						}
					/>
				))}
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-error bg-red-50 border border-red-200 text-red-700">
				{error}
			</div>
		);
	}

	if (!valoraciones.length) {
		return <p className="text-gray-500">Aún no tienes valoraciones.</p>;
	}

	return (
		<div className="space-y-3">
			{valoraciones.map((v) => (
				<div
					key={v.id}
					className="border border-[#E0E0E0] rounded-xl p-4 flex flex-col gap-2"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-semibold text-gray-800">
								Paciente: {v.paciente_nombres} {v.paciente_apellidos}
							</p>
							<p className="text-xs text-gray-500">
								{v.fecha ? new Date(v.fecha).toLocaleDateString() : "-"}
							</p>
						</div>
						{renderStars(v.puntuacion)}
					</div>
					{v.comentario && (
						<p className="text-sm text-gray-600">"{v.comentario}"</p>
					)}
				</div>
			))}
		</div>
	);
};

export default PerfilDoctor;

