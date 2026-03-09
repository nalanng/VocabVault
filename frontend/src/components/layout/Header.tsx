import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-slate-800 px-4 py-3 shadow-lg shadow-slate-900/50">
      {/* App name */}
      <h1 className="text-xl font-bold tracking-tight text-white">
        <span className="text-indigo-400">Vocab</span>Vault
      </h1>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </header>
  );
}
