import { Download, Trash2 } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => void;
  onClearAll: () => void;
  hasData: boolean;
}

export default function ExportButton({ onExport, onClearAll, hasData }: ExportButtonProps) {
  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar TODOS os registros? Esta ação não pode ser desfeita.')) {
      onClearAll();
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onExport}
        disabled={!hasData}
        className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Download className="h-4 w-4" />
        Exportar CSV
      </button>
      <button
        onClick={handleClear}
        disabled={!hasData}
        className="flex items-center gap-2 rounded-xl border-2 border-red-300 px-5 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="h-4 w-4" />
        Limpar Tudo
      </button>
    </div>
  );
}
