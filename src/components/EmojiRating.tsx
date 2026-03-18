import { useState } from "react";

interface EmojiRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const EMOJIS = [
  { emoji: "😡", label: "Ужасно", color: "bg-red-100 border-red-400 text-red-600" },
  { emoji: "😕", label: "Плохо", color: "bg-orange-100 border-orange-400 text-orange-600" },
  { emoji: "😐", label: "Нормально", color: "bg-yellow-100 border-yellow-400 text-yellow-600" },
  { emoji: "😊", label: "Хорошо", color: "bg-lime-100 border-lime-400 text-lime-600" },
  { emoji: "🤩", label: "Отлично", color: "bg-green-100 border-green-400 text-green-600" },
];

export default function EmojiRating({ value, onChange, label }: EmojiRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-800">
        {label}
      </label>
      <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
        {EMOJIS.map((item, i) => {
          const rating = i + 1;
          const isActive = rating === value;
          const isHovered = rating === hover;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHover(rating)}
              onMouseLeave={() => setHover(0)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? `${item.color} border-2 scale-110 shadow-lg`
                    : isHovered
                    ? `${item.color} border-2 scale-105 shadow-md opacity-80`
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className={`text-xs font-medium ${isActive ? "" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
