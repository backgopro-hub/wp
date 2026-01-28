// Файл: api.js

// ⚠️ ЗАМЕНИ НА ССЫЛКУ НА ТВОЕГО БОТА (не на WebApp, а на сервер, где работает бот)
// Если пока локально, то http://127.0.0.1:8000/api/proxy
const BOT_PROXY_URL = "https://bot.netelusion.com//api/proxy"; 

/**
 * Функция для запросов к API через прокси-модуль бота
 */
export async function requestApi(endpoint, method = "GET", data = null) {
    const tg = window.Telegram.WebApp;
    
    // Формируем запрос к нашему боту
    const body = {
        endpoint: endpoint, // "/servers", "/keys" и т.д.
        method: method,
        data: data,
        initData: tg.initData // Подпись для безопасности
    };

    try {
        const response = await fetch(BOT_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        tg.showAlert(`Ошибка связи: ${error.message}`);
        throw error;
    }
}
