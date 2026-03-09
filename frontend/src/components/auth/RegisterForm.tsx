import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password, firstName, lastName);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Kayıt olurken bir hata oluştu.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded border border-gray-3 bg-white px-4 py-2.5 text-ink placeholder-gray-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-1 px-4">
      <div className="w-full max-w-md rounded bg-white p-8 shadow-xl border border-gray-2">
        <h2 className="mb-6 text-center text-2xl font-bold text-ink">
          Kayıt Ol
        </h2>

        {error && (
          <div className="mb-4 rounded bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger-soft">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-ink">
                İsim
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="İsim"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-ink">
                Soyisim
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Soyisim"
                className={inputClass}
              />
            </div>
          </div>

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
              className={inputClass}
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
              placeholder="En az 6 karakter"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="mb-1 block text-sm font-medium text-ink">
              Şifre Tekrarı
            </label>
            <input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-4">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="font-medium text-primary-soft hover:text-primary">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
