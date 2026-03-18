// =====================================================
//  Google Apps Script — вставьте этот код в Apps Script
// =====================================================
//
//  ИНСТРУКЦИЯ:
//
//  1. Откройте Google Таблицы → создайте новую таблицу
//  2. Меню «Расширения» → «Apps Script»
//  3. Удалите всё содержимое и вставьте этот код
//  4. Нажмите 💾 Сохранить
//  5. Нажмите «Развернуть» → «Новое развёртывание»
//  6. Тип: «Веб-приложение»
//     - Описание: Опрос
//     - Выполнять как: Я (ваш email)
//     - Доступ: Все (Anyone)
//  7. Нажмите «Развернуть» → скопируйте URL
//  8. Вставьте URL в файл src/components/SurveyForm.tsx
//     в строку: const GOOGLE_SCRIPT_URL = "ВАШ_URL_СЮДА";
//
// =====================================================

// Настройка заголовков при первом запуске
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Дата и время",
    "Город",
    "Формат мероприятия",
    "Оценка мероприятия (1-5)",
    "Полезность материала (1-5)",
    "Что запомнилось/понравилось",
    "Мероприятие одним словом",
    "Что улучшить / совет",
    "Рекомендация (NPS 1-10)",
    "Оценка специалиста (1-5)"
  ];

  // Записываем заголовки в первую строку
  for (var i = 0; i < headers.length; i++) {
    sheet.getRange(1, i + 1).setValue(headers[i]);
  }

  // Стилизуем заголовки
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4F46E5");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setHorizontalAlignment("center");

  // Автоширина колонок
  for (var j = 1; j <= headers.length; j++) {
    sheet.autoResizeColumn(j);
  }

  // Замораживаем первую строку
  sheet.setFrozenRows(1);
}

// Обработка POST-запроса с формы
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Парсим данные из запроса
    var data = JSON.parse(e.postData.contents);

    // Форматируем дату
    var timestamp = data.timestamp
      ? new Date(data.timestamp)
      : new Date();
    var formattedDate = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      "dd.MM.yyyy HH:mm:ss"
    );

    // Добавляем строку с данными
    sheet.appendRow([
      formattedDate,
      data.city || "",
      data.format || "",
      data.ratingEvent || "",
      data.ratingContent || "",
      data.memorable || "",
      data.oneWord || "",
      data.improvement || "",
      data.nps || "",
      data.ratingSpecialist || ""
    ]);

    // Возвращаем успех
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Обработка GET-запроса (для тестирования)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "Скрипт работает! Используйте POST для отправки данных."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
