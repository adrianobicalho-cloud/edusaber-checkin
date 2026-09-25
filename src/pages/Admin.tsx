import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Atom, Lock, KeyRound, LogOut, Eye, EyeOff } from 'lucide-react';
import AdminStatsComponent from '../components/AdminStats';
import RegistrationTable from '../components/RegistrationTable';
import ExportButton from '../components/ExportButton';
import { useRegistrations } from '../hooks/useRegistrations';

const ADMIN_PASSWORD = 'Educativa2026';
const AUTH_STORAGE_KEY = 'edusaber_admin_auth';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    registrations,
    removeRegistration,
    clearAll,
    getStats,
    exportCSV,
    exportXLSX,
  } = useRegistrations();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setPassword('');
    setError(false);
  };

  const stats = getStats();

  // Tela de Autenticação / Senha do Administrador
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-20 left-10 opacity-10 animate-float">
          <Atom className="h-24 w-24 text-teal-400" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-float-delayed">
          <Atom className="h-32 w-32 text-purple-400" />
        </div>

        <div className="w-full max-w-md animate-scale-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/logo-feira.jpg"
                alt="Logo Feira EduSaber 2026"
                className="h-24 w-24 object-contain rounded-full shadow-lg bg-white p-1 ring-4 ring-teal-500/20"
              />
            </div>

            {/* Título */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">
                ACESSO RESTRITO
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Informe a senha para acessar o painel do administrador
              </p>
            </div>

            {/* Formulário de Senha */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Senha do Administrador
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Digite a senha de acesso"
                    autoFocus
                    className={`w-full rounded-xl border-2 bg-white pl-10 pr-10 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all text-sm sm:text-base ${
                      error
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs font-medium text-red-500 animate-shake">
                    Senha incorreta. Por favor, tente novamente.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!password.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:shadow-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entrar no Painel
              </button>
            </form>

            {/* Voltar para Check-in */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar para Lista de Presença
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard do Administrador autenticado
  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-8 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 right-10 opacity-5 animate-float pointer-events-none">
        <Atom className="h-24 w-24 text-teal-400" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-5 animate-float-delayed pointer-events-none">
        <Atom className="h-20 w-20 text-purple-400" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Barra Superior */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Link>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              PAINEL DO ADMINISTRADOR
            </h1>
            <p className="text-xs text-teal-300 font-medium">
              Feira Científica e Cultural EduSaber 2026
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Encerrar sessão de administrador"
            className="flex items-center gap-1.5 rounded-xl bg-red-500/20 px-3.5 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/30 hover:text-white border border-red-500/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>

        {/* Estatísticas e Indicadores */}
        <div className="mb-6">
          <AdminStatsComponent stats={stats} />
        </div>

        {/* Barra de Ações (Download XLSX / CSV e Limpar) */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <div className="text-xs sm:text-sm text-gray-300 font-medium">
            <span>Total de registros: </span>
            <strong className="text-teal-400">{registrations.length}</strong>
          </div>

          <ExportButton
            onExportCSV={exportCSV}
            onExportXLSX={exportXLSX}
            onClearAll={clearAll}
            hasData={registrations.length > 0}
          />
        </div>

        {/* Tabela de Presenças Registradas */}
        <RegistrationTable
          registrations={registrations}
          onRemove={removeRegistration}
        />
      </div>
    </div>
  );
}
