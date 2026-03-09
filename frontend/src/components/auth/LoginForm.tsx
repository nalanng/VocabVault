import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { install } = usePWAInstall();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded bg-white p-8 shadow-xl border border-gray-2">
        <h2 className="mb-6 text-center text-2xl font-bold text-ink">
          Giriş Yap
        </h2>

        {error && (
          <div className="mb-4 rounded bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger-soft">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full rounded border border-gray-3 bg-white px-4 py-2.5 text-ink placeholder-gray-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-gray-3 bg-white px-4 py-2.5 text-ink placeholder-gray-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-4">
          Hesabın yok mu?{' '}
          <Link to="/register" className="font-medium text-primary-soft hover:text-primary-soft">
            Kayıt ol
          </Link>
        </p>
      </div>

      <button
        onClick={install}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Uygulamayı Yükle
      </button>
    </div>
  );
}
