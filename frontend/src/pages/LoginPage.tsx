import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            <span className="text-indigo-400">Vocab</span>Vault
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Kişisel Kelime Kütüphanen
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
