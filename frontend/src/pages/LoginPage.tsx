import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-ink tracking-tight">
            <span className="text-primary-soft">Vocab</span>Vault
          </h1>
          <p className="mt-2 text-gray-4 text-sm">
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
