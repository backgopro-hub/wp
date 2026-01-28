// Файл: api.js

// Ссылка на твоего бота (ОБЯЗАТЕЛЬНО полная, так как сайт на GitHub)
export const BOT_PROXY_URL = "https://bot.netelusion.com/proxy";

/**
 * Функция отправляет БОТУ команду (action), а бот сам решает, какой URL дергать.
 * @param {string} action - Имя действия (например, "get_profile")
 * @param {object} params - Любые доп. данные (например, { key_id: 123 })
 */
export async function requestApi(action, params = {}) {
    const tg = window.Telegram.WebApp;
    
    // Пытаемся достать ID пользователя. 
    // Если тестируешь в браузере (не в ТГ), id будет undefined.
    const userId = tg.initDataUnsafe?.user?.id;

    // Формируем "Пакет намерения"
    const body = {
        action: action,       // Команда
        tg_id: userId,        // Кто просит
        ...params             // Остальные параметры
    };

    console.log(`[API] Отправка команды: ${action}`, body);

    try {
        const response = await fetch(BOT_PROXY_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        // Обработка ошибок сети или сервера
        if (!response.ok) {
            let errorText = response.statusText;
            try {
                const errJson = await response.json();
                errorText = errJson.error || errorText;
            } catch (e) {}
            
            throw new Error(`Ошибка сервера (${response.status}): ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        // Показывать ли алерт юзеру - решай сам
        // tg.showAlert(`Ошибка: ${error.message}`); 
        throw error;
    }
}
