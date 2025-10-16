// Importaciones necesarias
// 1. Icons de lucide-react para iconos.
// 2. App.css para estilos globales. Ahi tambien esta 
// 3. react-router-dom para la navegación entre páginas. Link nos permite crear enlaces a otras rutas dentro de la aplicación.
// 4. homepage.jsx para importar imágenes y datos de la página de inicio.

import { Search, Phone, Menu, MapPin, ClipboardList, User, ChevronRight  } from "lucide-react";
import "./App.css";
import { Link } from 'react-router-dom';
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
  smileIcon,
  capsuleIcon,
  waveIcon,
  handMobileSvg,
  doctorTypes,
} from "./homepage";

// Componente Principal App
function App() {
  return (
    // Fondo de pantalla con un degradado, de color verde claro a amarillo, fuente Rubik por defecto en caso de no definir otra fuente
    <div className="min-h-screen bg-[linear-gradient(90deg,_rgba(34,193,195,0.06),_rgba(253,187,45,0.1))] font-['Rubik'] text-[#0A3C3F]">



      {/* Sección del navbar */}

      {/* Padding superior para el navbar, adaptado a diferentes tamaños de pantalla */}
      <div className="pt-4 md:pt-6 lg:pt-8">
        {/* Contenedor principal del navbar, mx-auto para centrarlo, max-w-7xl para limitar el ancho máximo */}
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Navbar con fondo verde oscuro, texto blanco, bordes redondeados y sombra */}
          <div className="navbar bg-[#0A3C3F] text-white rounded-lg shadow-md px-6 lg:px-8 py-3">
            {/* Sección de inicio del navbar */}
            <div className="navbar-start">
              {/* Logo de la aplicación, enlazado a la página de inicio */}
              <Link to="/" className="text-4xl font-bold font-['DM_Sans'] tracking-tight">
                Doctoralia
              </Link>
            </div>

            {/* Sección central del navbar, oculta en pantallas pequeñas */}
            <div className="navbar-center hidden lg:flex">
              {/* Menú horizontal con enlaces a diferentes secciones */}
              <ul className="menu menu-horizontal px-1">
                <li>
                  {/* Inicio, usando Link para navegación interna */}
                  <Link to="/" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Inicio
                  </Link>
                </li>
                <li>
                  {/* Doctores*/}
                  <a href="#" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Doctores
                  </a>
                </li>
                <li>
                  {/* Servicios */}
                  <a href="#" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Servicios
                  </a>
                </li>
                <li>
                  {/* Contacto, usando Link para navegación interna */}
                  <Link to="/contacto" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Final del navbar */}
            <div className="navbar-end">
              {/* Botones de búsqueda y sesión para pantallas grandes, hidden en pantallas pequeñas, flex para que el div se vuelva un flex container, sobreescribiendo el hidden*/}
              <div className="hidden lg:flex items-center space-x-4">
                {/* Botón de búsqueda, texto blanco, cambia a un color más claro al pasar el cursor */}
                <button className="text-white hover:text-[#A9E8E0] p-2">
                  {/* Icono de Lucide-react, icono de lupa, tamaño 22 */}
                  <Search size={22} />
                </button>
                {/* Botón de contacto, con icono de teléfono */}
                <Link
                  to="/login"
                  className="button rounded border border-white text-white px-5 py-2 hover:bg-white hover:text-[#0A3C3F] flex items-center"
                >
                  {/* Icono de usuario de Lucide-react, tamaño 16 */}
                  {/* Margin right de 2 para separar el icono del texto, inline para que el icono y el texto estén en la misma línea */}
                  <User size={16} className="inline mr-2" />
                  Iniciar Sesión
                </Link>
              </div>

              {/* Botón de menú para pantallas pequeñas, dropdown para mostrar opciones */}
              <div className="dropdown dropdown-end lg:hidden">
                {/* Boton que abre el dropdown */}
                <button tabIndex={0} role="button" className="btn btn-ghost hover:bg-transparent text-white p-1">
                  {/* Icono de menú de Lucide-react, tamaño 24 */}
                  <Menu size={24} />
                </button>
                <ul
                  tabIndex={0}
                  // El menu en si y sus elementos dropdown-content es una clase de DaisyUI
                  // z-[50] para que el dropdown se muestre por encima de otros elementos
                  className="menu dropdown-content bg-[#0A3C3F] text-white rounded-box z-[50] mt-3 w-64 p-4 shadow-lg"
                >
                  {/* Lista de enlaces del menú desplegable */}
                  <li><Link to="/" className="hover:text-[#A9E8E0] text-lg py-2">Inicio</Link></li>
                  <li><a href="#" className="hover:text-[#A9E8E0] text-lg py-2">Doctores</a></li>
                  <li><a href="#" className="hover:text-[#A9E8E0] text-lg py-2">Servicios</a></li>
                  <li><Link to="/contacto" className="hover:text-[#A9E8E0] text-lg py-2">Contacto</Link></li>
                  
                  {/* Sección de búsqueda y botón de inicio de sesión en el menú desplegable, añadi un orde al tope para separarlos del resto de los enlaces */}
                  <div className="pt-3 mt-3 border-t border-white">
                    {/* Padding vertical de 1 */}
                    <li className="py-1">
                      <a href="#" className="hover:text-[#A9E8E0] flex items-center text-lg p-2">
                        {/* Icono de búsqueda de Lucide-react, tamaño 20 */}
                        <Search size={20} className="mr-3" /> Buscar
                      </a>
                    </li>

                    {/* Margin top de 2 */}
                    <li className="mt-2">
                      <Link
                        to="/login"
                        className="button rounded border border-white text-white px-5 py-2 text-base hover:bg-white hover:text-[#0A3C3F] flex items-center justify-center w-full"
                      >
                        {/* Icono de usuario de Lucide-react, tamaño 16 */}
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

      {/* Sección Hero */}
      <main className="hero">
        {/* Sección Hero Content, flex-col para pantallas pequeñas, flex-row para pantallas grandes, justify-between para alinear los elementos */}
        <div className="hero-content mx-auto px-4 max-w-7xl flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-16 py-15 lg:py-13 xl:py-12">

          {/* Contenido del Hero texto y botones a la izquierda imágenes a la derecha */}
          {/* Izquierda: Título descripcion y boton, toma 5/12 del ancho en pantallas grandes, 6/12 para imágenes */}
          <div className="lg:w-5/12 text-center lg:text-left relative">
            {/* Contenido del Hero, texto y botones a la izquierda, imágenes a la derecha */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-6xl font-bold font-['DM_Sans'] text-[#0A3C3F] mt-2 mb-6">
              Tu salud nuestra{" "}
              <span className="bg-[#A9E8E0] px-2 pb-1 rounded">misión</span>,
              tu bienestar nuestra prioridad.
            </h1>
            <p className="text-lg text-[#0A3C3F] opacity-80 mb-8">
              Encuentra a tu especialista y agenda tu cita fácilmente.
            </p>
            <a
              href="#"
              className="inline-flex items-center bg-[#A9E8E0] text-[#0A3C3F] font-semibold py-3 px-6 rounded hover:bg-[#0A3C3F] hover:text-white transition-colors duration-300"
            >
            Solicitar una Cita
            <button type="button" className="flex items-center"></button>
            </a>
          </div>

          {/* Derecha: Imágenes de doctores, toma 6/12 del ancho en pantallas grandes */}
          <div className="lg:w-6/12 relative mt-10 lg:mt-0">
            {/* Imágenes de doctores, grid para organizar las imágenes, 2 columnas en pantallas grandes, gap para espacio entre imágenes */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="relative">
                <img
                  src={heroImg3}
                  alt="Doctor Principal"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-4">
                <img
                  src={heroImg2}
                  alt="Doctor Lateral 1"
                  className="rounded-lg shadow-lg w-full"
                />
                <img
                  src={heroImg1}
                  alt="Doctor Lateral 2"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Sección de Búsqueda */}
      <div
        className="pt-16 pb-10 lg:pt-24 lg:pb-16 xl:pt-28 xl:pb-24 bg-white"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Aca va el título de la sección */}
          <div className="mb-8">
            {/* Leading es una clase de Tailwind para controlar el espaciado entre líneas */}
            <h2 className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-5xl font-bold font-['DM_Sans'] text-[#0A3C3F] leading-tight lg:leading-snug">
              Reserva con los{" "}
              {/* Span para resaltar "Doctores" */}
              <span className="bg-[#A9E8E0] px-2 pb-1 rounded">Doctores</span>
              {/* Salto de línea para el subtítulo */}
              <br />
              que cuidan de ti.
            </h2>
          </div>

          <div className="relative">
            {/* Imagen de telefono */}
            <img
              src={handMobileSvg}
              alt="Reserva Móvil"
              /*
              - Absolute para que la imagen se posicione en relación al contenedor padre
              - Right-4 para posicionar la imagen a la derecha
              - Bottom-full para que la imagen esté justo encima del formulario
              - Z-10 para que la imagen esté por encima del formulario
              - Hidden en pantallas pequeñas (md:block) para que solo se muestre en pantallas medianas y grandes
              - Pointer-events-none para que la imagen no sea seleccionable
              - Height de 48 en pantallas pequeñas, 46 en pantallas medianas y 64 en pantallas grandes
              */
              className="absolute right-4 bottom-full z-10 hidden md:block pointer-events-none h-48 md:h-46 lg:h-64"
            />

            {/* Formulario de búsqueda, usando un join, plantilla de DaisyUI para crear un formulario responsivo */}
            <div className="join w-full bg-white rounded-lg border-[3px] border-[#0A3C3F] border-opacity-20 shadow-sm flex flex-col lg:flex-row">

              {/* Elementos del formulario, join-item para cada elemento */}

              {/* Especialidades */}
              {/*
              - Flex grow para que el elemento ocupe todo el espacio disponible
              - min-w-0 para que el elemento no tenga un ancho mínimo
              - Border-b para el borde inferior en pantallas pequeñas, para separar los elementos de abajo
              */}
              <div className="join-item flex items-center p-3 lg:p-4 flex-grow border-b border-[#0A3C3F] border-opacity-10 lg:border-r lg:border-b-0 min-w-0">
                <Search
                  size={20}
                  // Flex-shrink-0 para que el icono no se reduzca en tamaño, incluso si este empuja otros elementos
                  className="text-[#0A3C3F] opacity-70 mr-3 flex-shrink-0"
                />

                {/* El select es un elemento de formulario que permite al usuario seleccionar una opción de uma lista desplegable */}
                <select
                // Clase select de DaisyUI para estilizar el select, el select ghost es para que sea transparente
                // Cursor pointer para que el cursor cambie al pasar por encima del select, de esta manera el usuario sabe que puede interactuar con el elemento
                  className="select select-ghost w-full focus:outline-none text-[#0A3C3F] cursor-pointer min-w-0"
                  // Default value es el valor por defecto del select, en este caso esta vacío
                  defaultValue=""
                >
                {/* Opcion de especialidad, disabled para que no se pueda seleccionar */}
                  <option
                    value=""
                    disabled
                    className="text-[#0A3C3F] opacity-60"
                  >
                    Especialidad
                  </option>
                  {/* Resto de opciones de especialidades */}
                  <option value="Dermatólogo">Dermatólogo</option>
                  <option value="Médico general">Médico general</option>
                  <option value="Pediatra">Pediatra</option>
                  <option value="Cirujano">Cirujano</option>
                  <option value="Neurólogo">Neurólogo</option>
                  <option value="Psiquiatra">Psiquiatra</option>
                  <option value="Oncólogo">Oncólogo</option>
                  <option value="Cardiólogo">Cardiólogo</option>
                  <option value="Cirujano ortopédico">Cirujano ortopédico</option>
                  <option value="Radiólogo">Radiólogo</option>
                  <option value="Anestesiólogo">Anestesiólogo</option>
                  <option value="Endocrinólogo">Endocrinólogo</option>
                  <option value="Gastroenterólogo">Gastroenterólogo</option>
                  <option value="Oftalmólogo">Oftalmólogo</option>
                  <option value="Patólogo">Patólogo</option>
                  <option value="Neumólogo">Neumólogo</option>
                  <option value="Oftalmología">Oftalmología</option>
                  <option value="Odontólogo">Odontólogo</option>
                  <option value="Podólogos">Podólogos</option>
                  <option value="Reumatólogo">Reumatólogo</option>
                  <option value="Otorrinolaringología">Otorrinolaringología</option>
                  <option value="Medicina interna">Medicina interna</option>
                  <option value="Otorrinolaringólogo">Otorrinolaringólogo</option>
                  <option value="Dermatología">Dermatología</option>
                </select>
              </div>


              {/* Ciudad */}
              <div className="join-item flex items-center p-3 lg:p-4 flex-grow border-b border-[#0A3C3F] border-opacity-10 lg:border-r lg:border-b-0 min-w-0">
                <MapPin
                  size={20}
                  className="text-[#0A3C3F] opacity-70 mr-3 flex-shrink-0"
                />
                <select
                  className="select select-ghost w-full focus:outline-none text-[#0A3C3F] cursor-pointer min-w-0"
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                    className="text-[#0A3C3F] opacity-60"
                  >
                    Ciudad
                  </option>
                  <option value="Lima">Lima</option>
                  <option value="Arequipa">Arequipa</option>
                  <option value="Trujillo">Trujillo</option>
                  <option value="Chiclayo">Chiclayo</option>
                  <option value="Huancayo">Huancayo</option>
                  <option value="Piura">Piura</option>
                  <option value="Cusco">Cusco</option>
                  <option value="Chimbote">Chimbote</option>
                  <option value="Iquitos">Iquitos</option>
                </select>
              </div>
              <div className="join-item flex items-center p-3 lg:p-4 flex-grow border-b border-[#0A3C3F] border-opacity-10 lg:border-b-0 min-w-0">
                <ClipboardList
                  size={20}
                  className="text-[#0A3C3F] opacity-70 mr-3 flex-shrink-0"
                />


                {/* Síntomas*/}
                <select
                  className="select select-ghost w-full focus:outline-none text-[#0A3C3F] cursor-pointer min-w-0"
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                    className="text-[#0A3C3F] opacity-60"
                  >
                    Sintomas
                  </option>
                  <option value="Asma">Asma</option>
                  <option value="Sarpullido">Sarpullido</option>
                  <option value="Quemaduras tópicas">Quemaduras tópicas</option>
                  <option value="Fiebres o resfriados">
                    Fiebres o resfriados
                  </option>
                  <option value="Náuseas">Náuseas</option>
                  <option value="Diarrea o malestar gastrointestinal">
                    Diarrea o malestar gastrointestinal
                  </option>
                  <option value="Dolores corporales">Dolores corporales</option>
                  <option value="Dolores de cabeza">Dolores de cabeza</option>
                  <option value="Dolor de oído o sinusitis">
                    Dolor de oído o sinusitis
                  </option>
                  <option value="Tos y dolor de garganta">
                    Tos y dolor de garganta
                  </option>
                  <option value="Golpes, cortes y raspones">
                    Golpes, cortes y raspones
                  </option>
                  <option value="Reacciones alérgicas">
                    Reacciones alérgicas
                  </option>
                  <option value="Problemas urinarios">
                    Problemas urinarios
                  </option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Dolor o irritación ocular">
                    Dolor o irritación ocular
                  </option>
                </select>
              </div>
              {/* Botón de búsqueda */}
              <div className="join-item">
                <button className="btn join-item w-full lg:h-full bg-[#A9E8E0] text-[#0A3C3F] font-semibold py-3 px-6 lg:px-8 rounded-b-md lg:rounded-l-none lg:rounded-r-md hover:bg-[#0A3C3F] hover:text-white flex items-center justify-center text-lg border-none">
                  Buscar Doctores
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Tipos de Doctores */}
      <div className="py-14 sm:py-14 md:py-16 lg:py-16 xl:py-20 bg-[#fdf8eb]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold font-['DM_Sans'] text-[#0A3C3F] mb-3">
              Tomamos tu Salud Seriamente
            </h2>
            <p className="text-lg text-[#0A3C3F] opacity-80 max-w-2xl mx-auto">
              Explora nuestra amplia gama de servicios médicos especializados.
            </p>
          </div>

          {/* Grid de tipos de doctores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {/* Card 1: Dermatólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Dermatólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Tratamiento de Eczema, Pérdida de cabello, Acné, Cáncer de piel y otras afecciones de la piel.
                </p>
              </div>
            </a>

            {/* Card 2: Neurólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Neurólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Diagnóstico y tratamiento de Trastornos neuromusculares, Trastorno por Déficit de Atención (TDA), tumores cerebrales y enfermedades del sistema nervioso.
                </p>
              </div>
            </a>

            {/* Card 3: Radiólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Radiólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Detección de Cánceres o tumores. Identificación de bloqueos en sus arterias o venas mediante imágenes médicas.
                </p>
              </div>
            </a>

            {/* Card 4: Patólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Patólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Análisis de Trastornos de sangrado, problemas de coagulación y anemia. Estudio de tejidos y fluidos corporales.
                </p>
              </div>
            </a>

            {/* Card 5: Neumólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Neumólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Manejo de Asma y Enfermedad Pulmonar Obstructiva Crónica (EPOC), y otras enfermedades respiratorias.
                </p>
              </div>
            </a>

            {/* Card 6: Psiquiatra */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Psiquiatra
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Tratamiento de Depresión, trastorno bipolar y otros trastornos del estado de ánimo. Ayuda con Trastornos alimenticios y de ansiedad.
                </p>
              </div>
            </a>

            {/* Card 7: Cardiólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Cardiólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Prevención y tratamiento de Aterosclerosis, Presión arterial alta, Colesterol alto, Insuficiencia cardíaca y otras enfermedades del corazón.
                </p>
              </div>
            </a>

            {/* Card 8: Ortopedista */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Ortopedista
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Tratamiento de Fracturas, Lesiones de ligamentos de la articulación de la rodilla, Daño en la articulación de la rodilla debido a diferentes causas de artritis y problemas musculoesqueléticos.
                </p>
              </div>
            </a>

            {/* Card 9: Gastroenterólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Gastroenterólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Manejo de Estreñimiento, Enfermedad de Crohn, Diarrea, Vómitos en niños, Gastritis y otras afecciones digestivas.
                </p>
              </div>
            </a>

            {/* Card 10: Oftalmólogo */}
            <a
              href="#"
              className="group card bg-white border border-gray-200/80 rounded-xl transition-all duration-300 ease-in-out hover:bg-[#0A3C3F] hover:border-[#0A3C3F] transform hover:-translate-y-1"
            >
              <div className="card-body items-center text-center px-5 py-6 md:px-6 md:py-8">
                <h4 className="card-title text-lg md:text-xl font-semibold text-[#0A3C3F] mb-1 group-hover:text-white">
                  Oftalmólogo
                </h4>
                <p className="text-xs md:text-sm text-[#0A3C3F] opacity-70 group-hover:text-gray-200 group-hover:opacity-90 overflow-hidden line-clamp-3">
                  Cuidado de la salud ocular, tratamiento de enfermedades como glaucoma, cataratas y corrección de la visión.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>


      {/* Sección de Departamentos Especializados (Pestañas) */}
      <div className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-4 lg:mb-5">
            <h2 className="text-4xl sm:text-5xl font-bold font-['DM_Sans'] text-[#0A3C3F]">
              Descubre Cómo Te Ayudamos
            </h2>
            <p className="py-4 text-lg text-[#0A3C3F] opacity-80 max-w-3xl mx-auto">
              Nuestra plataforma está diseñada para simplificar tu acceso a la
              salud, conectándote con los mejores especialistas de forma rápida
              y segura.
            </p>
          </div>

          {/* Pestañas de departamentos */}
          {/* Usando un elemento tabs de DaisyUI para crear pestañas */}
          <div className="tabs justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#A9E8E0] scrollbar-track-transparent flex flex-wrap gap-2 mb-6">
            {/* Tab: Especialistas */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Especialistas"
              defaultChecked
            />
            {/* Contenido del Tab: Especialistas */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Especialistas */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Especialistas */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Encuentra Especialistas <br />
                      <span className="font-semibold">Cerca de Ti</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Navega por una amplia red de profesionales de la salud y
                      filtra por especialidad, ubicación y seguro médico para
                      hallar al doctor perfecto para tus necesidades.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Amplia Red de Médicos:
                          </strong>{" "}
                          Accede a perfiles detallados de doctores y
                          especialistas.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Filtros Inteligentes:
                          </strong>{" "}
                          Busca por especialidad, seguro, ubicación y más.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Especialistas (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src={Index_Especialistas}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Encontrando especialistas en línea"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Agenda Online */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Agenda Online"
            />
            {/* Contenido del Tab: Agenda Online */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Agenda Online */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Agenda Online */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Agenda Citas Online <br />
                      <span className="font-semibold">Sin Complicaciones</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Olvídate de las llamadas telefónicas. Revisa la
                      disponibilidad en tiempo real y reserva tu cita médica en
                      cualquier momento y desde cualquier lugar.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Disponibilidad 24/7:
                          </strong>{" "}
                          Reserva citas cuando mejor te convenga.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Confirmación Instantánea:
                          </strong>{" "}
                          Recibe notificaciones y recordatorios.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Agenda Online (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src= {Index_AgendaOnline}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Agendando cita médica online"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Gestiona tu Salud */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Gestiona tu Salud"
            />
            {/* Contenido del Tab: Gestiona tu Salud */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Gestiona tu Salud */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Gestiona tu Salud */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Gestiona Tu Salud <br />
                      <span className="font-semibold">De Forma Digital</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Accede a tu historial de citas, recibe recordatorios y
                      prepárate para tus consultas, todo desde la comodidad de
                      nuestra plataforma intuitiva.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Historial Centralizado:
                          </strong>{" "}
                          Todas tus citas y médicos en un solo lugar.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Recordatorios Útiles:
                          </strong>{" "}
                          No olvides ninguna cita importante.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Gestiona tu Salud (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src={Index_GestionaSalud}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Gestión digital de la salud"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Opiniones */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Opiniones"
            />
            {/* Contenido del Tab: Opiniones */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Opiniones */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Opiniones */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Opiniones Reales <br />
                      <span className="font-semibold">
                        Para Decisiones Informadas
                      </span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Lee valoraciones de otros pacientes para tomar decisiones
                      con confianza y elige al especialista que mejor se adapte
                      a ti.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Comunidad Confiable:
                          </strong>{" "}
                          Experiencias compartidas por otros pacientes.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Transparencia Total:
                          </strong>{" "}
                          Calificaciones y comentarios verificados.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Opiniones (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src={Index_Opiniones}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Leyendo opiniones de pacientes"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Teleconsulta */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Teleconsulta"
            />
            {/* Contenido del Tab: Teleconsulta */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Teleconsulta */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Teleconsulta */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Consultas Virtuales <br />
                      <span className="font-semibold">Salud Sin Barreras</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Conéctate con especialistas a través de videollamadas
                      seguras para consultas de seguimiento o primeras
                      valoraciones, ahorrando tiempo y desplazamientos.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Acceso Remoto:
                          </strong>{" "}
                          Atención médica desde donde estés.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Comodidad y Ahorro:
                          </strong>{" "}
                          Reduce tiempos y costos de traslado.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Teleconsulta (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src= {Index_Teleconsulta}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Consulta de telemedicina"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Seguridad */}
            <input
              type="radio"
              name="department_tabs"
              role="tab"
              className="tab cursor-pointer rounded-md px-5 py-2.5 text-sm sm:text-base font-semibold font-['DM_Sans'] transition-all duration-200 ease-in-out focus:outline-none bg-[#D0EFEB] text-[#0A3C3F] hover:bg-[#B8E0D8] checked:bg-[#0A3C3F] checked:text-white"
              aria-label="Seguridad"
            />
            {/* Contenido del Tab: Seguridad */}
            <div
              role="tabpanel"
              className="tab-content bg-white rounded-b-lg rounded-tr-lg p-6 md:p-8 lg:p-10 -mt-px"
            >
              {/* Hero Section del Tab: Seguridad */}
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start w-full">
                  {/* Contenido Izquierdo del Hero - Tab: Seguridad */}
                  <div className="lg:w-5/12">
                    <h3 className="text-3xl lg:text-4xl font-['DM_Sans'] text-gray-700 mb-5 leading-tight">
                      Tu Información <br />
                      <span className="font-semibold">Segura y Protegida</span>
                    </h3>
                    <p className="text-base lg:text-lg text-gray-700 opacity-80 mb-6">
                      Priorizamos la seguridad de tus datos médicos. Nuestra
                      plataforma cumple con los más altos estándares de
                      privacidad y protección de la información.
                    </p>
                    <hr className="my-6 border-t border-gray-200 w-full" />
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Protección de Datos:
                          </strong>{" "}
                          Cumplimiento de normativas de privacidad.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 flex-shrink-0 p-1 bg-[#FEC160] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <p className="text-sm lg:text-base text-gray-700 opacity-90">
                          <strong className="text-[#0A3C3F]">
                            Confidencialidad Garantizada:
                          </strong>{" "}
                          Tu información médica resguardada.
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* Contenido Derecho del Hero - Tab: Seguridad (Imagen) */}
                  <div className="lg:w-7/12 mt-8 lg:mt-0">
                    <img
                      src={Index_Seguridad}
                      className="rounded-lg object-cover w-full aspect-[16/10]"
                      alt="Seguridad de datos médicos online"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Pie de Página */}
      <div className="bg-[#0A3C3F]">
      <footer className="footer sm:footer-horizontal bg-[#0A3C3F] text-white px-10 py-15 max-w-7xl mx-auto">
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
        <nav>
          <h6 className="footer-title text-lg font-['DM_Sans']">
            Servicios
          </h6>
          <a className="link link-hover text-base font-['DM_Sans']">Marca</a>
          <a className="link link-hover text-base font-['DM_Sans']">Diseño</a>
          <a className="link link-hover text-base font-['DM_Sans']">Marketing</a>
          <a className="link link-hover text-base font-['DM_Sans']">Publicidad</a>
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-['DM_Sans']">
            Compañía
          </h6>
          <a className="link link-hover text-base font-['DM_Sans']">Sobre nosotros</a>
          <a className="link link-hover text-base font-['DM_Sans']">Contacto</a>
          <a className="link link-hover text-base font-['DM_Sans']">Empleo</a>
          <a className="link link-hover text-base font-['DM_Sans']">Kit de prensa</a>
        </nav>
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

export default App;
