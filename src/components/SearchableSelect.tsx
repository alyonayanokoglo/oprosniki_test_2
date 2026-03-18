import { useState, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-gray-800">
        {label}
      </label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setSearch("");
          }}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${
              isOpen
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200 hover:border-gray-300"
            }
            ${value ? "text-gray-800" : "text-gray-400"}
            bg-white
          `}
        >
          <div className="flex items-center justify-between">
            <span>{value || placeholder}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-400 text-sm"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Ничего не найдено
                </div>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors cursor-pointer ${
                      option === value
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
