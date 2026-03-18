import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  label: string;
  sublabel?: string;
}

export default function StarRating({
  value,
  onChange,
  max = 5,
  label,
  sublabel,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-800">
        {label}
      </label>
      {sublabel && (
        <p className="text-sm text-gray-500 -mt-1">{sublabel}</p>
      )}
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform duration-150 hover:scale-125 focus:outline-none cursor-pointer"
          >
            <svg
              className={`w-10 h-10 transition-colors duration-150 ${
                star <= (hover || value)
                  ? "text-yellow-400 drop-shadow-md"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-gray-500">
          Ваша оценка: <span className="font-bold text-yellow-500">{value}</span> из {max}
        </p>
      )}
    </div>
  );
}
