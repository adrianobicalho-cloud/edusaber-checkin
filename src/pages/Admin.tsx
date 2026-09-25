import { Link } from 'react-router-dom';
import { ArrowLeft, Atom } from 'lucide-react';
import AdminStatsComponent from '../components/AdminStats';
import RegistrationTable from '../components/RegistrationTable';
import ExportButton from '../components/ExportButton';
import { useRegistrations } from '../hooks/useRegistrations';

export default function Admin() {
  const { registrations, removeRegistration, clearAll, getStats, exportCSV } = useRegistrations();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-5 animate-float">
        <Atom className="h-24 w-24 text-teal-400" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-5 animate-float-delayed">
        <Atom className="h-20 w-20 text-purple-400" />
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            ÁREA DO ADMINISTRADOR
          </h1>
          <div className="w-[88px]" /> {/* Spacer for centering */}
        </div>

        {/* Stats */}
        <div className="mb-6">
          <AdminStatsComponent stats={stats} />
        </div>

        {/* Actions */}
        <div className="mb-4 flex justify-end">
          <ExportButton
            onExport={exportCSV}
            onClearAll={clearAll}
            hasData={registrations.length > 0}
          />
        </div>

        {/* Table */}
        <RegistrationTable
          registrations={registrations}
          onRemove={removeRegistration}
        />
      </div>
    </div>
  );
}
