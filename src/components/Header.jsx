
export default function Header({ onLogoutClick, username, avatar }) {
    return (
        <header className="mb-10 flex items-center justify-between bg-blue-600 backdrop-blur-md rounded-2xl p-2">
            <div className="flex items-center gap-3">
                <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/40" />
                <h2 className="text-md md:text-lg font-semibold text-white">
                    Olá, {username}!
                </h2>
            </div>

            <button
                onClick={onLogoutClick}
                className="bg-red-600 hover:bg-red-700 text-sm text-white font-medium px-2 py-1 rounded-lg shadow transition cursor-pointer"
            >
                Sair
            </button>
        </header>
    );
}
