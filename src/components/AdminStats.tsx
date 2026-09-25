import { Users, UserPlus, BarChart3 } from 'lucide-react';
import { AdminStats as AdminStatsType } from '../types';

interface AdminStatsProps {
  stats: AdminStatsType;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      label: 'Total de Registros',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'from-teal-400 to-teal-600',
    },
    {
      label: 'Total de Visitantes',
      value: stats.totalAttendees,
      icon: UserPlus,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Média por Grupo',
      value: stats.averageGroupSize.toFixed(1),
      icon: BarChart3,
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass-card rounded-2xl p-5 animate-slide-up"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
