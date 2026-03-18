interface NpsScaleProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function getColor(n: number, isActive: boolean): string {
  if (!isActive) return "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200";
  if (n <= 3) return "bg-red-500 text-white border-red-500 shadow-md";
  if (n <= 5) return "bg-orange-400 text-white border-orange-400 shadow-md";
  if (n <= 7) return "bg-yellow-400 text-white border-yellow-400 shadow-md";
  if (n <= 8) return "bg-lime-400 text-white border-lime-400 shadow-md";
  return "bg-green-500 text-white border-green-500 shadow-md";
}

export default function NpsScale({ value, onChange, label }: NpsScaleProps) {
  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-800">
        {label}
      </label>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-11 h-11 rounded-xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer hover:scale-110 ${getColor(
              n,
              n <= value
            )}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>Точно нет</span>
        <span>Обязательно!</span>
      </div>
    </div>
  );
}
