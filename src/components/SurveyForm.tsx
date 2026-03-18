import { useState } from "react";
import SearchableSelect from "./SearchableSelect";
import StarRating from "./StarRating";
import EmojiRating from "./EmojiRating";
import NpsScale from "./NpsScale";
import { CITIES, EVENT_FORMATS } from "../data/cities";

// ⬇️ ВСТАВЬТЕ СЮДА URL ВАШЕГО GOOGLE APPS SCRIPT (после деплоя)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyw_sfibP4LhM6M4fUjuFtgkudtxX6tSAYEBJCWhKucXb1zJ_rZ68j9rQ-t5P85pJo-uA/exec";

interface FormData {
  city: string;
  format: string;
  ratingEvent: number;
  ratingContent: number;
  memorable: string;
  oneWord: string;
  improvement: string;
  nps: number;
  ratingSpecialist: number;
}

const INITIAL: FormData = {
  city: "",
  format: "",
  ratingEvent: 0,
  ratingContent: 0,
  memorable: "",
  oneWord: "",
  improvement: "",
  nps: 0,
  ratingSpecialist: 0,
};

type Status = "idle" | "sending" | "success" | "error";

export default function SurveyForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const totalSteps = 3;

  function validate(): string[] {
    const errs: string[] = [];
    if (step === 0) {
      if (!form.city) errs.push("Выберите город");
      if (!form.format) errs.push("Выберите формат мероприятия");
    }
    if (step === 1) {
      if (form.ratingEvent === 0) errs.push("Оцените мероприятие");
      if (form.ratingContent === 0) errs.push("Оцените материал/интерактив");
    }
    if (step === 2) {
      if (form.nps === 0) errs.push("Укажите, порекомендовали бы вы мероприятие");
      if (form.ratingSpecialist === 0) errs.push("Оцените специалиста");
    }
    return errs;
  }

  function nextStep() {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function prevStep() {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStatus("sending");

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: form.city,
          format: form.format,
          ratingEvent: form.ratingEvent,
          ratingContent: form.ratingContent,
          memorable: form.memorable,
          oneWord: form.oneWord,
          improvement: form.improvement,
          nps: form.nps,
          ratingSpecialist: form.ratingSpecialist,
          timestamp: new Date().toISOString(),
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload || payload.status !== "success") {
        throw new Error(
          payload?.message ||
            `Ошибка запроса: ${res.status} ${res.statusText}`.trim()
        );
      }
      setStatus("success");
      setForm(INITIAL);
      setStep(0);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Ошибка отправки"]);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800">Спасибо!</h2>
          <p className="text-gray-500 text-lg">
            Ваш отзыв успешно отправлен. Мы ценим ваше мнение!
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Пройти ещё раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Оцени мероприятие
          </h1>
          <p className="text-gray-500 mt-2">
            Помоги нам стать лучше — заполни короткий опрос
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "bg-indigo-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${
                      i < step ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Основное</span>
            <span>Оценки</span>
            <span>Отзыв</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-6 md:p-10">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              {errors.map((e, i) => (
                <p key={i} className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {e}
                </p>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">
                ❌ Ошибка отправки. Проверьте URL скрипта и попробуйте ещё раз.
              </p>
            </div>
          )}

          {/* Step 0: City & Format */}
          {step === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📍</span>
                <h2 className="text-xl font-bold text-gray-700">
                  Расскажите о мероприятии
                </h2>
              </div>

              <SearchableSelect
                label="1. Город"
                options={CITIES}
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                placeholder="Выберите город..."
              />

              <SearchableSelect
                label="2. Формат мероприятия"
                options={EVENT_FORMATS}
                value={form.format}
                onChange={(v) => setForm({ ...form, format: v })}
                placeholder="Выберите формат..."
              />
            </div>
          )}

          {/* Step 1: Ratings */}
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-xl font-bold text-gray-700">
                  Оцените мероприятие
                </h2>
              </div>

              <StarRating
                label="3. Насколько вам понравилось мероприятие?"
                value={form.ratingEvent}
                onChange={(v) => setForm({ ...form, ratingEvent: v })}
              />

              <StarRating
                label="4. Насколько полезным/интересным был материал/интерактив/площадка?"
                value={form.ratingContent}
                onChange={(v) => setForm({ ...form, ratingContent: v })}
              />
            </div>
          )}

          {/* Step 2: Text + NPS + Emoji */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💬</span>
                <h2 className="text-xl font-bold text-gray-700">
                  Поделитесь впечатлениями
                </h2>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-800">
                  5. Что запомнилось/понравилось тебе больше всего?
                </label>
                <textarea
                  value={form.memorable}
                  onChange={(e) =>
                    setForm({ ...form, memorable: e.target.value })
                  }
                  placeholder="Напишите свой ответ..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-800">
                  6. Опиши мероприятие одним словом
                </label>
                <input
                  type="text"
                  value={form.oneWord}
                  onChange={(e) =>
                    setForm({ ...form, oneWord: e.target.value })
                  }
                  placeholder="Одно слово..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-800">
                  7. Чего не хватило / что можно улучшить / твой совет организаторам
                </label>
                <textarea
                  value={form.improvement}
                  onChange={(e) =>
                    setForm({ ...form, improvement: e.target.value })
                  }
                  placeholder="Напишите свои пожелания..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                />
              </div>

              <NpsScale
                label="8. Порекомендовал бы это мероприятие другим студентам?"
                value={form.nps}
                onChange={(v) => setForm({ ...form, nps: v })}
              />

              <EmojiRating
                label="9. Как бы ты оценил нашего специалиста?"
                value={form.ratingSpecialist}
                onChange={(v) => setForm({ ...form, ratingSpecialist: v })}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ← Назад
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer"
              >
                Далее →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  "Отправить ✨"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Ваши ответы анонимны и помогут нам улучшить мероприятия 💜
        </p>
      </div>
    </div>
  );
}
