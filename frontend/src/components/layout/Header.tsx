import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-2 px-4 py-3">
      <h1 className="text-xl font-bold tracking-tight text-ink">
        <span className="text-primary">Vocab</span>Vault
      </h1>

      <Link
        to="/profile"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white transition-opacity hover:opacity-80"
      >
        {initials}
      </Link>
    </header>
  );
}
