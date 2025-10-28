import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Login from "./Login";
import Header from "./Header";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.disconnect();
  }, []);
  const [userId, setUserId] = useState(null);
  const handleLogin = ({ username, avatar, id }) => {
    setUsername(username);
    setAvatar(avatar);
    setUserId(id);
    setIsLogged(true);
    socket.emit("user_connected", { username, avatar, id });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      id: userId, user: username, avatar, text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  if (!isLogged) return <Login onLogin={handleLogin} />;

  const handleLogout = () => {
    setShowModal(false);
    setIsLogged(false);
    setMessages([]);
  };


  return (
    <div className="md:h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-700 p-6">

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Deseja realmente sair?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              As mensagens serão apagadas ao sair desta página.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="bg-white/90 md:max-w-xs backdrop-blur-md rounded-2xl shadow-lg p-4 h-full flex flex-col justify-between">
          <Header
            username={username}
            avatar={avatar}
            onLogoutClick={() => setShowModal(true)}
          />

          <div className="overflow-y-auto flex-1 min-h-[200px] max-h-[200px] md:max-h-full">
            <h3 className="font-semibold mb-3 text-blue-900 text-lg">Usuários online</h3>
            {onlineUsers.filter(user => user.id !== userId).length > 0 ? (
              onlineUsers
                .filter(user => user.id !== userId)
                .map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center mb-2 gap-2 bg-green-200/65 p-2 rounded-lg hover:bg-green-300 transition-all "
                    title="Este usuário pode receber mensagens"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-gray-700 font-medium">{user.username}</span>
                  </div>
                ))
            ) : (
              <p className="text-green-500">Nenhum outro usuário online</p>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center">
            O outro participante só verá as mensagens quando estiver online.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white/90 overflow-y-auto backdrop-blur-md rounded-2xl shadow-lg p-4 flex-1 flex flex-col">

            <h2 className="text-lg font-semibold  text-blue-900">Mensagens</h2>
            <p className="text-sm text-gray-600 mb-3">
              As mensagens não são salvas e serão apagadas ao atualizar ou fechar a página.
            </p>

            <div className="flex-1 overflow-y-auto border border-blue-700 rounded-lg p-3 mb-3 space-y-2 min-h-[400px] max-h-[400px] md:max-h-full">
              {messages.map((m, i) => {
                const isOwnMessage = m.id === userId;
                return (
                  <div
                    key={i}
                    className={`flex items-end mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    {!isOwnMessage && m.avatar && (
                      <img src={m.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
                    )}
                    <div
                      className={`rounded-xl p-2 max-w-xs break-words ${isOwnMessage
                        ? "bg-blue-600 text-white text-right"
                        : "bg-gray-300 text-gray-700 text-left"
                        }`}
                    >
                      <span className="block">
                        {!isOwnMessage && <strong className="text-blue-600">{m.user}:</strong>} {m.text}
                      </span>
                      <span className={`text-xs block ${isOwnMessage ? "text-gray-200" : "text-gray-500"} text-right mt-1`}>
                        {m.time}
                      </span>
                    </div>
                    {isOwnMessage && m.avatar && (
                      <img src={m.avatar} alt="avatar" className="w-8 h-8 rounded-full ml-2" />
                    )}
                  </div>
                );
              })}
            </div>


            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-xl px-4 py-2 outline-none border border-blue-700 focus:ring-2 focus:ring-blue-700 placeholder-blue-700"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all cursor-pointer"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
