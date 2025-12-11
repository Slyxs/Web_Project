// Componente de Chatbot con DeepSeek AI
import { Search, Menu, CircleUserRound, User, Send, Bot, Loader2 } from "lucide-react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { logoVerde } from "./homepage.jsx";
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  
  // Estados del chat
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Verificar si el usuario está logueado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserName(userData.nombres || "Usuario");
      // Mensaje de bienvenida
      setMessages([
        {
          role: "assistant",
          content: `¡Hola ${userData.nombres || ""}! 👋 Soy tu asistente médico virtual. Puedo ayudarte con información general sobre salud, síntomas comunes, y orientarte sobre cuándo deberías consultar a un especialista. ¿En qué puedo ayudarte hoy?`
        }
      ]);
    }
  }, []);

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tipo");
    localStorage.removeItem("nombres");
    localStorage.removeItem("apellidos");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Función para enviar mensaje al chatbot
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Agregar mensaje del usuario
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Agregar mensaje vacío del asistente para streaming
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      // Leer streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Ignorar errores de parsing de chunks incompletos
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo."
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,_rgba(34,193,195,0.06),_rgba(253,187,45,0.1))] font-['Rubik'] text-[#0A3C3F] flex flex-col">

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
                <li><Link to="/buscar-doctores" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Doctores</Link></li>
                <li><Link to="/chatbot" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans'] bg-white/10 rounded">Asistente IA</Link></li>
                <li><Link to="/contacto" className="hover:text-[#A9E8E0] text-[1.125rem] font-['DM_Sans']">Contacto</Link></li>
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
                  <li><Link to="/buscar-doctores" className="hover:text-[#A9E8E0] text-lg py-2">Doctores</Link></li>
                  <li><Link to="/chatbot" className="hover:text-[#A9E8E0] text-lg py-2">Asistente IA</Link></li>
                  <li><Link to="/contacto" className="hover:text-[#A9E8E0] text-lg py-2">Contacto</Link></li>

                  <div className="pt-3 mt-3 border-t border-white">
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

      {/* CONTENIDO PRINCIPAL DEL CHATBOT */}
      <main className="flex-1 mx-auto px-4 max-w-4xl w-full py-8 flex flex-col">
        {!isLoggedIn ? (
          /* Usuario no logueado - mostrar mensaje para iniciar sesión */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <Bot size={64} className="mx-auto mb-4 text-[#0A3C3F]" />
              <h2 className="text-2xl font-bold font-['DM_Sans'] text-[#0A3C3F] mb-4">
                Asistente Médico Virtual
              </h2>
              <p className="text-[#0A3C3F] opacity-80 mb-6">
                Inicia sesión para acceder a nuestro asistente de inteligencia artificial. 
                Podrás hacer consultas sobre síntomas, obtener información de salud general 
                y recibir orientación sobre cuándo consultar a un especialista.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center bg-[#0A3C3F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#0d4a4d] transition-colors duration-300"
              >
                <User size={20} className="mr-2" />
                Iniciar Sesión
              </Link>
              <p className="mt-4 text-sm text-[#0A3C3F] opacity-60">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-[#0A3C3F] underline hover:text-[#A9E8E0]">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* Usuario logueado - mostrar chat */
          <>
            {/* Header del chat */}
            <div className="bg-[#0A3C3F] rounded-t-2xl px-6 py-4 flex items-center gap-4">
              <div className="bg-[#A9E8E0] p-2 rounded-full">
                <Bot size={28} className="text-[#0A3C3F]" />
              </div>
              <div>
                <h2 className="text-white font-bold font-['DM_Sans'] text-lg">Asistente Médico Virtual</h2>
                <p className="text-[#A9E8E0] text-sm">Powered by DeepSeek AI</p>
              </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#0A3C3F] text-white rounded-br-md"
                        : "bg-[#f0f9f8] text-[#0A3C3F] rounded-bl-md"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot size={16} className="text-[#0A3C3F]" />
                        <span className="text-xs font-semibold text-[#0A3C3F]">Asistente</span>
                      </div>
                    )}
                    <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                      message.role === "user" 
                        ? "prose-invert" 
                        : "prose-headings:text-[#0A3C3F] prose-p:text-[#0A3C3F] prose-strong:text-[#0A3C3F] prose-li:text-[#0A3C3F]"
                    }`}>
                      {message.content === "" && isLoading ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-xs">Pensando...</span>
                        </span>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                            code: ({children}) => <code className="bg-black/10 px-1 rounded text-xs">{children}</code>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 rounded-b-2xl p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu pregunta sobre salud..."
                  className="flex-1 bg-[#f0f9f8] border-none rounded-full px-5 py-3 text-[#0A3C3F] placeholder-[#0A3C3F]/50 focus:outline-none focus:ring-2 focus:ring-[#A9E8E0]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#0A3C3F] text-white p-3 rounded-full hover:bg-[#0d4a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-center text-[#0A3C3F] opacity-50 mt-3">
                ⚠️ Este asistente proporciona información general y no reemplaza una consulta médica profesional.
              </p>
            </form>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A3C3F] text-white py-6 mt-auto">
        <div className="mx-auto px-4 max-w-7xl text-center">
          <p className="text-sm opacity-80">
            © 2024 Doctoralia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Chatbot;
