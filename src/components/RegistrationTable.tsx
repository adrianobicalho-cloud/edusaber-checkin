import { useState } from 'react';
import { Trash2, Search } from 'lucide-react';
import { Registration } from '../types';
import { formatDateTime } from '../lib/utils';

interface RegistrationTableProps {
  registrations: Registration[];
  onRemove: (id: string) => void;
}

export default function RegistrationTable({ registrations, onRemove }: RegistrationTableProps) {
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = registrations.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onRemove(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Horário</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Nome</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Acomp.</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Total</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  {search ? 'Nenhum resultado encontrado.' : 'Nenhum registro ainda.'}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono">{registrations.length - registrations.indexOf(r)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDateTime(r.timestamp)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.fullName}</td>
                  <td className="px-4 py-3 text-center text-gray-600">+{r.companions}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                      {r.totalPeople}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className={`inline-flex items-center justify-center rounded-lg p-1.5 transition-colors ${
                        confirmDelete === r.id
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'
                      }`}
                      title={confirmDelete === r.id ? 'Clique novamente para confirmar' : 'Excluir registro'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
        {filtered.length} de {registrations.length} registro(s)
      </div>
    </div>
  );
}
