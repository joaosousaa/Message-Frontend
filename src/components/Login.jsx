import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";
import avatar5 from "../assets/avatars/avatar5.png";
import avatar6 from "../assets/avatars/avatar6.png";

export default function Login({ onLogin }) {
    const avatar = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

    const [username, setUsername] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const submitLogin = () => {
        if (!username.trim() || !selectedAvatar) return;
        const id = uuidv4();
        onLogin({ username, avatar: selectedAvatar, id });
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
                    Entre com nome e avatar
                </h2>

                <input
                    type="text"
                    placeholder="Digite seu nome..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-blue-400 rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-700 transition-all"
                />

                <h3 className="font-semibold mb-2 text-blue-700">Escolha um avatar</h3>
                <div className="flex gap-3 mb-6 justify-center">
                    {avatar.map((avatar, i) => (
                        <img
                            key={i}
                            src={avatar}
                            alt={`avatar-${i}`}
                            className={`w-14 h-14 rounded-full cursor-pointer border-2 transition-transform duration-200 ${selectedAvatar === avatar
                                ? "border-blue-600 scale-110"
                                : "border-transparent hover:scale-110"
                                }`}
                            onClick={() => setSelectedAvatar(avatar)}
                        />
                    ))}
                </div>

                <button
                    onClick={submitLogin}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors hover:scale-105"
                >
                    Entrar
                </button>
                <p className="text-sm mt-4 text-blue-900">Compartilhe o mesmo link com outra pessoa para conversar!</p>
            </div>
        </div>
    );
}
