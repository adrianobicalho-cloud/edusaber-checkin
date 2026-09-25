import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Atom } from 'lucide-react';
import CompanionSelector from '../components/CompanionSelector';
import SuccessModal from '../components/SuccessModal';
import { useRegistrations } from '../hooks/useRegistrations';

export default function CheckIn() {
  const [fullName, setFullName] = useState('');
  const [companions, setCompanions] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastRegistration, setLastRegistration] = useState<{ name: string; total: number } | null>(null);
  const { addRegistration } = useRegistrations();

  const canSubmit = fullName.trim().length >= 2 && companions !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const reg = addRegistration(fullName, companions!);
    setLastRegistration({ name: reg.fullName, total: reg.totalPeople });
    setShowSuccess(true);
    // Auto-reset form after showing success
    setTimeout(() => {
      setFullName('');
      setCompanions(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-10 animate-float">
        <Atom className="h-24 w-24 text-teal-400" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 animate-float-delayed">
        <Atom className="h-32 w-32 text-purple-400" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-5 animate-float">
        <Atom className="h-16 w-16 text-blue-400" />
      </div>

      {/* Decorative dots */}
      <div className="absolute top-16 right-20 h-2 w-2 rounded-full bg-teal-400/30 animate-pulse" />
      <div className="absolute bottom-32 left-20 h-3 w-3 rounded-full bg-purple-400/20 animate-pulse" />
      <div className="absolute top-1/2 left-16 h-1.5 w-1.5 rounded-full bg-blue-400/25 animate-pulse" />

      {/* Main Card */}
      <div className="w-full max-w-md animate-scale-in">
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo-feira.jpg"
              alt="Logo Feira EduSaber 2026"
              className="h-28 w-28 sm:h-32 sm:w-32 object-contain rounded-full shadow-lg bg-white p-1 ring-4 ring-teal-500/20"
            />
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl sm:text-3xl font-black text-gray-800 leading-tight mb-2">
            LISTA DE PRESENÇA
            <br />
            <span className="text-teal-600">FEIRA EDUSABER 2026</span>
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6 leading-relaxed">
            Seja bem-vindo(a)! Registre sua presença e a de seus acompanhantes para fazermos parte juntos desta jornada de ciência e cultura.
          </p>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              NOME COMPLETO
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-base"
              autoComplete="off"
            />
          </div>

          {/* Companion Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-3 text-center">
              QUANTAS PESSOAS TE ACOMPANHAM?
            </label>
            <CompanionSelector value={companions} onChange={setCompanions} />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Não conte você mesmo(a).
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 py-4 text-lg font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:shadow-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:from-teal-500 disabled:hover:to-teal-600"
          >
            REGISTRAR PRESENÇA
          </button>
        </div>
      </div>

      {/* Admin Link */}
      <Link
        to="/admin"
        className="mt-6 text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
      >
        Área do administrador
      </Link>

      {/* Success Modal */}
      {lastRegistration && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          totalPeople={lastRegistration.total}
          name={lastRegistration.name}
        />
      )}
    </div>
  );
}
