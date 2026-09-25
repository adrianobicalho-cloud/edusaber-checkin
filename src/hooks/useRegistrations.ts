import { useState, useEffect, useCallback } from 'react';
import { Registration, AdminStats } from '../types';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'edusaber-registrations';

function loadRegistrations(): Registration[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRegistrations(registrations: Registration[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>(loadRegistrations);

  useEffect(() => {
    saveRegistrations(registrations);
  }, [registrations]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setRegistrations(loadRegistrations());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addRegistration = useCallback((fullName: string, companions: number): Registration => {
    const registration: Registration = {
      id: generateId(),
      fullName: fullName.trim(),
      companions,
      totalPeople: companions + 1,
      timestamp: new Date().toISOString(),
    };
    setRegistrations(prev => [registration, ...prev]);
    return registration;
  }, []);

  const removeRegistration = useCallback((id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRegistrations([]);
  }, []);

  const getStats = useCallback((): AdminStats => {
    const totalRegistrations = registrations.length;
    const totalCompanions = registrations.reduce((sum, r) => sum + r.companions, 0);
    const totalAttendees = registrations.reduce((sum, r) => sum + r.totalPeople, 0);
    const averageGroupSize = totalRegistrations > 0 ? totalAttendees / totalRegistrations : 0;
    return { totalRegistrations, totalCompanions, totalAttendees, averageGroupSize };
  }, [registrations]);

  const exportCSV = useCallback(() => {
    const BOM = '\uFEFF';
    const header = 'Nº,Horário,Nome,Acompanhantes,Total do Grupo';
    const rows = registrations
      .slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((r, i) => {
        const date = new Date(r.timestamp);
        const time = date.toLocaleString('pt-BR');
        return `${i + 1},"${time}","${r.fullName}",${r.companions},${r.totalPeople}`;
      });
    const csv = BOM + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presenca-edusaber-2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [registrations]);

  return {
    registrations,
    addRegistration,
    removeRegistration,
    clearAll,
    getStats,
    exportCSV,
  };
}
