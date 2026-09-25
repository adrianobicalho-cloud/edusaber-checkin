import { cn } from '../lib/utils';

interface CompanionSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const options = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5+', value: 5 },
];

export default function CompanionSelector({ value, onChange }: CompanionSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'relative flex items-center justify-center rounded-xl border-2 py-4 sm:py-5 text-xl sm:text-2xl font-bold transition-all duration-200',
            'hover:scale-105 active:scale-95',
            value === option.value
              ? 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/30'
              : 'border-teal-400/50 bg-white text-gray-700 hover:border-teal-500 hover:shadow-md'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
