import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportXLSX: () => void;
  onClearAll: () => void;
  hasData: boolean;
}

export default function ExportButton({
  onExportCSV,
  onExportXLSX,
  onClearAll,
  hasData,
}: ExportButtonProps) {
  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar TODOS os registros? Esta ação não pode ser desfeita.')) {
      onClearAll();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      {/* Botão Baixar XLSX */}
      <button
        onClick={onExportXLSX}
        disabled={!hasData}
        title="Baixar planilha formatada para Excel (.xlsx)"
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Baixar XLSX (Excel)</span>
      </button>

      {/* Botão Baixar CSV */}
      <button
        onClick={onExportCSV}
        disabled={!hasData}
        title="Baixar arquivo separado por valores (.csv)"
        className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition-all hover:bg-teal-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Download className="h-4 w-4" />
        <span>Baixar CSV</span>
      </button>

      {/* Botão Limpar */}
      <button
        onClick={handleClear}
        disabled={!hasData}
        title="Limpar todos os registros de presença"
        className="flex items-center gap-2 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
        <span>Limpar Tudo</span>
      </button>
    </div>
  );
}
