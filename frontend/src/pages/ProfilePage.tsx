import { useAuth } from '../contexts/AuthContext';
import { useStatsOverview } from '../hooks/useStats';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { stats } = useStatsOverview();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-4 -mx-4 -mt-4 -mb-20 min-h-screen pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 pt-6 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {initials}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-ink">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
      </div>

      {/* Stats Summary - Single card with dividers */}
      {stats && (
        <div className="bg-white rounded-md border border-gray-2 mx-4 flex divide-x divide-gray-2">
          <div className="flex flex-col items-center flex-1 py-2.5">
            <span className="text-lg font-bold text-ink">{stats.total_words}</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Kelime</span>
          </div>
          <div className="flex flex-col items-center flex-1 py-2.5">
            <span className="text-lg font-bold text-ink">{stats.total_sessions}</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Oturum</span>
          </div>
          <div className="flex flex-col items-center flex-1 py-2.5">
            <span className={`text-lg font-bold ${
              stats.average_accuracy >= 70 ? 'text-success' :
              stats.average_accuracy >= 40 ? 'text-orange-400' : 'text-danger'
            }`}>
              %{stats.average_accuracy}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Doğruluk</span>
          </div>
        </div>
      )}

      {/* Hesap Bilgileri - Full width, no side padding */}
      <div className="bg-white border-t border-b border-gray-2 px-4 py-4">
        <h3 className="text-sm font-bold text-primary-dark mb-3">Hesap Bilgileri</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">İsim</span>
            <span className="text-sm text-ink">{user.first_name} {user.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">E-posta</span>
            <span className="text-sm text-ink">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Üyelik Tarihi</span>
            <span className="text-sm text-ink">{memberSince}</span>
          </div>
        </div>
      </div>

      {/* Varsayılan Diller - Full width */}
      <div className="bg-white border-t border-b border-gray-2 px-4 py-4">
        <h3 className="text-sm font-bold text-primary-dark mb-3">Varsayılan Diller</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Kaynak Dil</span>
            <span className="text-sm text-ink">{user.source_lang.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Hedef Dil</span>
            <span className="text-sm text-ink">{user.target_lang.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="w-full rounded bg-danger/10 border border-danger/30 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/20"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
