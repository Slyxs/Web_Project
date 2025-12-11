import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
	Menu,
	Search,
	User,
	CircleUserRound,
	MapPin,
	Star,
	Stethoscope,
	Filter,
	X,
	Phone,
	Clock,
	ChevronRight,
	UserCheck,
	Building2,
	BadgeCheck,
	Calendar,
} from "lucide-react";
import axios from "axios";

function BuscarDoctores() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userType, setUserType] = useState("");
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// Estados para filtros
	const [especialidades, setEspecialidades] = useState([]);
	const [departamentos, setDepartamentos] = useState([]);
	const [provincias, setProvincias] = useState([]);
	
	// Estados de búsqueda
	const [filtros, setFiltros] = useState({
		especialidad_id: searchParams.get("especialidad") || "",
		departamento_id: searchParams.get("departamento") || "",
		provincia_id: searchParams.get("provincia") || "",
		nombre: searchParams.get("nombre") || "",
		genero: searchParams.get("genero") || "",
	});

	// Estados de resultados
	const [doctores, setDoctores] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [error, setError] = useState(null);

	// Estado para doctor seleccionado (modal)
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [doctorDetail, setDoctorDetail] = useState(null);
	const [loadingDetail, setLoadingDetail] = useState(false);

	// Verificar autenticación
	useEffect(() => {
		const token = localStorage.getItem("token");
		const tipo = localStorage.getItem("tipo");

		if (token) {
			setIsLoggedIn(true);
			setUserType(tipo || "");
		}
	}, []);

	// Cargar especialidades y departamentos al montar
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [espRes, depRes] = await Promise.all([
					axios.get("http://localhost:3001/api/especialidades"),
					axios.get("http://localhost:3001/api/departamentos"),
				]);
				setEspecialidades(espRes.data || []);
				setDepartamentos(depRes.data || []);
			} catch (err) {
				console.error("Error al cargar datos iniciales:", err);
				setError("No se pudo conectar con el servidor. Por favor, intenta más tarde.");
			}
		};
		fetchData();
	}, []);

	// Cargar doctores por defecto al montar (mostrar algunos doctores inicialmente)
	useEffect(() => {
		const loadDefaultDoctors = async () => {
			// Solo cargar si no hay parámetros de búsqueda en la URL
			if (!searchParams.toString()) {
				setLoading(true);
				try {
					const res = await axios.get("http://localhost:3001/api/buscar-doctores");
					setDoctores(res.data || []);
					setSearched(true);
					setError(null);
				} catch (err) {
					console.error("Error al cargar doctores por defecto:", err);
					setError("No se pudo conectar con el servidor. Por favor, intenta más tarde.");
					setDoctores([]);
				} finally {
					setLoading(false);
				}
			}
		};
		loadDefaultDoctors();
	}, []);

	// Cargar provincias cuando cambia el departamento
	useEffect(() => {
		const fetchProvincias = async () => {
			if (filtros.departamento_id) {
				try {
					const res = await axios.get(
						`http://localhost:3001/api/departamentos/${filtros.departamento_id}/provincias`
					);
					setProvincias(res.data || []);
				} catch (err) {
					console.error("Error al cargar provincias:", err);
					setProvincias([]);
				}
			} else {
				setProvincias([]);
				setFiltros((prev) => ({ ...prev, provincia_id: "" }));
			}
		};
		fetchProvincias();
	}, [filtros.departamento_id]);

	// Búsqueda automática al cargar si hay parámetros en URL
	useEffect(() => {
		if (searchParams.toString()) {
			handleSearch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("tipo");
		localStorage.removeItem("nombres");
		localStorage.removeItem("apellidos");
		setIsLoggedIn(false);
		navigate("/login");
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFiltros((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = async (e) => {
		if (e) e.preventDefault();
		setLoading(true);
		setSearched(true);
		setError(null);

		try {
			// Construir query params
			const params = new URLSearchParams();
			if (filtros.especialidad_id) params.append("especialidad_id", filtros.especialidad_id);
			if (filtros.departamento_id) params.append("departamento_id", filtros.departamento_id);
			if (filtros.provincia_id) params.append("provincia_id", filtros.provincia_id);
			if (filtros.nombre) params.append("nombre", filtros.nombre);
			if (filtros.genero) params.append("genero", filtros.genero);

			// Actualizar URL
			setSearchParams(params);

			const res = await axios.get(`http://localhost:3001/api/buscar-doctores?${params.toString()}`);
			setDoctores(res.data || []);
		} catch (err) {
			console.error("Error al buscar doctores:", err);
			setDoctores([]);
			setError("No se pudo realizar la búsqueda. Verifica tu conexión e intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	const clearFilters = () => {
		setFiltros({
			especialidad_id: "",
			departamento_id: "",
			provincia_id: "",
			nombre: "",
			genero: "",
		});
		setSearchParams(new URLSearchParams());
		setError(null);
		// Recargar todos los doctores sin filtros
		handleSearch();
	};

	const openDoctorDetail = async (doctorId) => {
		setSelectedDoctor(doctorId);
		setLoadingDetail(true);
		try {
			const res = await axios.get(`http://localhost:3001/api/doctores/${doctorId}/detalle`);
			setDoctorDetail(res.data);
		} catch (err) {
			console.error("Error al cargar detalle del doctor:", err);
			setDoctorDetail(null);
			// Cerrar el modal si hay error
			alert("No se pudo cargar la información del doctor. Por favor, intenta nuevamente.");
			setSelectedDoctor(null);
		} finally {
			setLoadingDetail(false);
		}
	};

	const closeDoctorDetail = () => {
		setSelectedDoctor(null);
		setDoctorDetail(null);
	};

	const renderStars = (rating) => {
		const numRating = parseFloat(rating) || 0;
		const fullStars = Math.floor(numRating);
		const hasHalf = numRating - fullStars >= 0.5;
		return (
			<div className="flex items-center gap-0.5">
				{Array.from({ length: 5 }).map((_, idx) => (
					<Star
						key={idx}
						size={16}
						className={
							idx < fullStars
								? "text-yellow-400 fill-yellow-400"
								: idx === fullStars && hasHalf
								? "text-yellow-400 fill-yellow-400 opacity-50"
								: "text-gray-300"
						}
					/>
				))}
				<span className="ml-1 text-sm font-medium text-gray-600">
					{numRating.toFixed(1)}
				</span>
			</div>
		);
	};

	const getProfileLink = () => {
		if (!isLoggedIn) return "/login";
		return userType === "doctor" ? "/perfil-doctor" : "/perfil";
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
									<Link
										to="/buscar-doctores"
										className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans'] text-[#A9E8E0]"
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
									<Link
										to={getProfileLink()}
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
										<Link to="/buscar-doctores" className="hover:text-[#A9E8E0] text-lg py-2 text-[#A9E8E0]">
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
										{isLoggedIn ? (
											<>
												<li className="mt-2">
													<Link
														to={getProfileLink()}
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

			{/* HERO / TÍTULO */}
			<div className="bg-gradient-to-br from-[#0A3C3F] to-[#0d4f53] text-white py-12 mt-8">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold font-['DM_Sans'] mb-4">
							Encuentra tu Doctor Ideal
						</h1>
						<p className="text-lg md:text-xl text-[#A9E8E0] max-w-2xl mx-auto">
							Busca entre nuestros profesionales de salud verificados y agenda tu cita de forma rápida y segura
						</p>
					</div>
				</div>
			</div>

			{/* CONTENIDO PRINCIPAL */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* PANEL DE FILTROS */}
					<div className="lg:w-80 flex-shrink-0">
						<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
									<Filter size={20} className="text-[#0A3C3F]" />
									Filtros de Búsqueda
								</h2>
								{(filtros.especialidad_id || filtros.departamento_id || filtros.nombre || filtros.genero) && (
									<button
										onClick={clearFilters}
										className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
									>
										<X size={14} />
										Limpiar
									</button>
								)}
							</div>

							<form onSubmit={handleSearch} className="space-y-5">
								{/* Búsqueda por nombre */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Buscar por nombre
									</label>
									<div className="relative">
										<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											name="nombre"
											value={filtros.nombre}
											onChange={handleFilterChange}
											placeholder="Nombre del doctor..."
											className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white"
										/>
									</div>
								</div>

								{/* Especialidad */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										<Stethoscope size={16} className="inline mr-1" />
										Especialidad
									</label>
									<select
										name="especialidad_id"
										value={filtros.especialidad_id}
										onChange={handleFilterChange}
										className="select select-bordered w-full bg-gray-50 focus:bg-white"
									>
										<option value="">Todas las especialidades</option>
										{especialidades.map((esp) => (
											<option key={esp.id} value={esp.id}>
												{esp.nombre}
											</option>
										))}
									</select>
								</div>

								{/* Departamento */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										<MapPin size={16} className="inline mr-1" />
										Departamento
									</label>
									<select
										name="departamento_id"
										value={filtros.departamento_id}
										onChange={handleFilterChange}
										className="select select-bordered w-full bg-gray-50 focus:bg-white"
									>
										<option value="">Todos los departamentos</option>
										{departamentos.map((dep) => (
											<option key={dep.id} value={dep.id}>
												{dep.nombre}
											</option>
										))}
									</select>
								</div>

								{/* Provincia */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										<Building2 size={16} className="inline mr-1" />
										Provincia
									</label>
									<select
										name="provincia_id"
										value={filtros.provincia_id}
										onChange={handleFilterChange}
										disabled={!filtros.departamento_id}
										className="select select-bordered w-full bg-gray-50 focus:bg-white disabled:opacity-50"
									>
										<option value="">
											{filtros.departamento_id ? "Todas las provincias" : "Selecciona departamento"}
										</option>
										{provincias.map((prov) => (
											<option key={prov.id} value={prov.id}>
												{prov.nombre}
											</option>
										))}
									</select>
								</div>

								{/* Género */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										<UserCheck size={16} className="inline mr-1" />
										Género del doctor
									</label>
									<select
										name="genero"
										value={filtros.genero}
										onChange={handleFilterChange}
										className="select select-bordered w-full bg-gray-50 focus:bg-white"
									>
										<option value="">Todos</option>
										<option value="masculino">Masculino</option>
										<option value="femenino">Femenino</option>
									</select>
								</div>

								{/* Botón de búsqueda */}
								<button
									type="submit"
									disabled={loading}
									className="btn w-full bg-[#0A3C3F] hover:bg-[#0d4f53] text-white border-none"
								>
									{loading ? (
										<span className="loading loading-spinner loading-sm"></span>
									) : (
										<>
											<Search size={18} />
											Buscar Doctores
										</>
									)}
								</button>
							</form>
						</div>
					</div>

					{/* RESULTADOS */}
					<div className="flex-1">
						{/* Header de resultados */}
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									{error ? "Error" : searched ? `${doctores.length} Doctor${doctores.length !== 1 ? "es" : ""} encontrado${doctores.length !== 1 ? "s" : ""}` : "Doctores Disponibles"}
								</h2>
								{!searched && !error && (
									<p className="text-gray-500 mt-1">
										Utiliza los filtros para refinar tu búsqueda
									</p>
								)}
							</div>
						</div>

						{/* Mensaje de error */}
						{error ? (
							<div className="bg-red-50 rounded-xl shadow-md border border-red-200 p-12 text-center">
								<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<X size={40} className="text-red-500" />
								</div>
								<h3 className="text-xl font-semibold text-red-800 mb-2">
									Error de conexión
								</h3>
								<p className="text-red-600 max-w-md mx-auto mb-4">
									{error}
								</p>
								<button
									onClick={() => {
										setError(null);
										handleSearch();
									}}
									className="btn bg-red-500 hover:bg-red-600 text-white border-none"
								>
									Reintentar
								</button>
							</div>
						) : loading ? (
							<div className="flex justify-center items-center h-64">
								<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
							</div>
						) : doctores.length === 0 ? (
							<div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
								<div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
									<Stethoscope size={40} className="text-yellow-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									No se encontraron doctores
								</h3>
								<p className="text-gray-500 max-w-md mx-auto">
									Intenta con otros filtros de búsqueda o amplía tus criterios
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{doctores.map((doctor) => (
									<div
										key={doctor.doctor_id}
										className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
									>
										<div className="flex flex-col md:flex-row gap-6">
											{/* Avatar */}
											<div className="flex-shrink-0">
												<div className="w-28 h-28 rounded-xl bg-gradient-to-br from-[#0A3C3F] to-[#0d5a5f] flex items-center justify-center text-white text-3xl font-bold">
													{doctor.nombres?.charAt(0)}{doctor.apellidos?.charAt(0)}
												</div>
											</div>

											{/* Info principal */}
											<div className="flex-1">
												<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
													<div>
														<h3 className="text-xl font-bold text-gray-800">
															Dr(a). {doctor.nombres} {doctor.apellidos}
														</h3>
														<p className="text-[#0A3C3F] font-medium flex items-center gap-1 mt-1">
															<Stethoscope size={16} />
															{doctor.especialidad_nombre || "Especialidad no especificada"}
														</p>
													</div>
													<div className="flex items-center gap-4">
														{renderStars(doctor.valoracion_promedio)}
														<span className="text-sm text-gray-500">
															({doctor.total_valoraciones} opiniones)
														</span>
													</div>
												</div>

												{/* Descripción */}
												{doctor.descripcion && (
													<p className="text-gray-600 mt-3 line-clamp-2">
														{doctor.descripcion}
													</p>
												)}

												{/* Detalles */}
												<div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
													{doctor.departamento_nombre && (
														<span className="flex items-center gap-1">
															<MapPin size={14} />
															{doctor.provincia_nombre ? `${doctor.provincia_nombre}, ` : ""}{doctor.departamento_nombre}
														</span>
													)}
													{doctor.total_consultas > 0 && (
														<span className="flex items-center gap-1">
															<BadgeCheck size={14} className="text-green-500" />
															{doctor.total_consultas} consultas realizadas
														</span>
													)}
													{doctor.costo_consulta > 0 && (
														<span className="flex items-center gap-1 font-semibold text-[#0A3C3F]">
															S/ {doctor.costo_consulta} por consulta
														</span>
													)}
												</div>

												{/* Acciones */}
												<div className="flex flex-wrap gap-3 mt-5">
													<button
														onClick={() => openDoctorDetail(doctor.doctor_id)}
														className="btn btn-sm bg-[#0A3C3F] hover:bg-[#0d4f53] text-white border-none"
													>
														Ver perfil completo
														<ChevronRight size={16} />
													</button>
													{isLoggedIn && userType === "paciente" && (
														<button className="btn btn-sm btn-outline border-[#0A3C3F] text-[#0A3C3F] hover:bg-[#0A3C3F] hover:text-white">
															<Calendar size={16} />
															Agendar cita
														</button>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* MODAL DE DETALLE DEL DOCTOR */}
			{selectedDoctor && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
					<div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
						{/* Header del modal */}
						<div className="sticky top-0 bg-gradient-to-br from-[#0A3C3F] to-[#0d5a5f] text-white p-6 rounded-t-2xl">
							<button
								onClick={closeDoctorDetail}
								className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
							>
								<X size={24} />
							</button>
							{loadingDetail ? (
								<div className="h-24 flex items-center justify-center">
									<span className="loading loading-spinner loading-lg text-white"></span>
								</div>
							) : doctorDetail ? (
								<div className="flex items-center gap-6">
									<div className="w-24 h-24 rounded-xl bg-white/20 flex items-center justify-center text-3xl font-bold">
										{doctorDetail.nombres?.charAt(0)}{doctorDetail.apellidos?.charAt(0)}
									</div>
									<div>
										<h2 className="text-2xl font-bold">
											Dr(a). {doctorDetail.nombres} {doctorDetail.apellidos}
										</h2>
										<p className="text-[#A9E8E0] font-medium mt-1">
											{doctorDetail.especialidades?.find(e => e.es_principal)?.nombre || "Especialista"}
										</p>
										<div className="flex items-center gap-4 mt-2">
											{renderStars(doctorDetail.valoracion_promedio)}
											<span className="text-sm text-white/80">
												({doctorDetail.total_valoraciones} opiniones)
											</span>
										</div>
									</div>
								</div>
							) : null}
						</div>

						{/* Contenido del modal */}
						{loadingDetail ? (
							<div className="p-8 text-center">
								<span className="loading loading-spinner loading-lg text-[#0A3C3F]"></span>
							</div>
						) : doctorDetail ? (
							<div className="p-6 space-y-6">
								{/* Información de contacto y ubicación */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{doctorDetail.consultorio_direccion && (
										<div className="bg-gray-50 rounded-xl p-4">
											<h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
												<MapPin size={18} className="text-[#0A3C3F]" />
												Ubicación
											</h4>
											<p className="text-gray-600">{doctorDetail.consultorio_direccion}</p>
											{(doctorDetail.provincia_nombre || doctorDetail.departamento_nombre) && (
												<p className="text-sm text-gray-500 mt-1">
													{doctorDetail.provincia_nombre && `${doctorDetail.provincia_nombre}, `}
													{doctorDetail.departamento_nombre}
												</p>
											)}
										</div>
									)}
									{doctorDetail.costo_consulta > 0 && (
										<div className="bg-[#E9F7F5] rounded-xl p-4">
											<h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
												<BadgeCheck size={18} className="text-[#0A3C3F]" />
												Costo de Consulta
											</h4>
											<p className="text-2xl font-bold text-[#0A3C3F]">
												S/ {doctorDetail.costo_consulta}
											</p>
										</div>
									)}
								</div>

								{/* Descripción */}
								{doctorDetail.descripcion && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-2">Sobre el doctor</h4>
										<p className="text-gray-600">{doctorDetail.descripcion}</p>
									</div>
								)}

								{/* Especialidades */}
								{doctorDetail.especialidades?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-3">Especialidades</h4>
										<div className="flex flex-wrap gap-2">
											{doctorDetail.especialidades.map((esp) => (
												<span
													key={esp.id}
													className={`px-3 py-1.5 rounded-full text-sm font-medium ${
														esp.es_principal
															? "bg-[#0A3C3F] text-white"
															: "bg-gray-100 text-gray-700"
													}`}
												>
													{esp.nombre}
													{esp.es_principal && " (Principal)"}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Formación y experiencia */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{doctorDetail.formacion && (
										<div>
											<h4 className="font-semibold text-gray-800 mb-2">Formación Académica</h4>
											<p className="text-gray-600 text-sm">{doctorDetail.formacion}</p>
										</div>
									)}
									{doctorDetail.experiencia && (
										<div>
											<h4 className="font-semibold text-gray-800 mb-2">Experiencia</h4>
											<p className="text-gray-600 text-sm">{doctorDetail.experiencia}</p>
										</div>
									)}
								</div>

								{/* Certificaciones */}
								{doctorDetail.certificaciones && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-2">Certificaciones</h4>
										<p className="text-gray-600 text-sm">{doctorDetail.certificaciones}</p>
									</div>
								)}

								{/* Disponibilidad */}
								{doctorDetail.disponibilidad?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
											<Clock size={18} className="text-[#0A3C3F]" />
											Horarios de Atención
										</h4>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											{doctorDetail.disponibilidad.map((disp, idx) => (
												<div
													key={idx}
													className="bg-gray-50 rounded-lg p-3 text-center"
												>
													<p className="font-medium text-gray-800 capitalize">
														{disp.dia_semana}
													</p>
													<p className="text-sm text-gray-500">
														{disp.hora_inicio?.slice(0, 5)} - {disp.hora_fin?.slice(0, 5)}
													</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Valoraciones recientes */}
								{doctorDetail.valoraciones?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
											<Star size={18} className="text-yellow-400" />
											Opiniones Recientes
										</h4>
										<div className="space-y-3">
											{doctorDetail.valoraciones.map((val, idx) => (
												<div
													key={idx}
													className="border border-gray-100 rounded-xl p-4"
												>
													<div className="flex items-center justify-between mb-2">
														<span className="font-medium text-gray-800">
															{val.paciente_nombres}
														</span>
														{renderStars(val.puntuacion)}
													</div>
													{val.comentario && (
														<p className="text-gray-600 text-sm">"{val.comentario}"</p>
													)}
													<p className="text-xs text-gray-400 mt-2">
														{val.fecha ? new Date(val.fecha).toLocaleDateString("es-ES") : ""}
													</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Botón de agendar */}
								{isLoggedIn && userType === "paciente" && (
									<div className="pt-4 border-t border-gray-200">
										<button className="btn w-full bg-[#0A3C3F] hover:bg-[#0d4f53] text-white border-none">
											<Calendar size={18} />
											Agendar Cita con este Doctor
										</button>
									</div>
								)}
							</div>
						) : (
							<div className="p-8 text-center text-gray-500">
								No se pudo cargar la información del doctor
							</div>
						)}
					</div>
				</div>
			)}

			{/* FOOTER */}
			<footer className="bg-[#0A3C3F] text-white py-8 mt-12">
				<div className="max-w-6xl mx-auto px-4 text-center">
					<p className="text-[#A9E8E0] font-['DM_Sans'] text-lg font-bold mb-2">
						Doctoralia
					</p>
					<p className="text-sm text-white/70">
						© {new Date().getFullYear()} Todos los derechos reservados
					</p>
				</div>
			</footer>
		</div>
	);
}

export default BuscarDoctores;
