/**
 * Elusion VPN - API Integration
 * Интеграция с API бэкендом
 * 
 * URL бота загружается динамически через /api/settings для безопасности
 */

// API URL будет загружен динамически
let API_BASE_URL = null;
let BOT_URL = null;

/**
 * Инициализирует API - загружает настройки с сервера
 * ВАЖНО: Вызывать перед использованием других функций!
 */
export async function initializeApi() {
    if (API_BASE_URL) {
        return; // Уже инициализирован
    }
    
    try {
        // Получаем настройки с сервера
        // Используем относительный путь, чтобы работало на любом домене
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const settings = await response.json();
        
        // Извлекаем URL бота из настроек
        BOT_URL = settings.webhook_host || settings.bot_url;
        API_BASE_URL = `${BOT_URL}/api`;
        
        console.log('[API] Initialized with bot URL:', BOT_URL);
        
        // Сохраняем настройки глобально для доступа из других модулей
        window.apiSettings = settings;
        
        return settings;
        
    } catch (error) {
        console.error('[API] Failed to initialize:', error);
        // Fallback на относительный путь
        API_BASE_URL = '/api';
        console.warn('[API] Using relative path as fallback');
    }
}

/**
 * Получает данные подписки по key_name
 * @param {string} keyName - Email или имя ключа
 * @returns {Promise<Object>} Данные подписки
 */
export async function getSubscription(keyName) {
    // Проверяем инициализацию
    if (!API_BASE_URL) {
        await initializeApi();
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/sub?key_name=${encodeURIComponent(keyName)}`);
        
        if (response.status === 404) {
            throw new Error('Подписка не найдена');
        }
        
        if (response.status === 429) {
            throw new Error('Слишком много запросов. Попробуйте через 5 минут');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Возвращаем данные
        return {
            key: data.key,
            expiry: data.expiry,
            link: data.link,
            email: data.email,
            is_crypto_link: data.is_crypto_link,
            remnawave_link: data.remnawave_link
        };
        
    } catch (error) {
        console.error('[API] Error getting subscription:', error);
        throw error;
    }
}

/**
 * Получает URL для QR кода
 * @param {string} keyName - Email или имя ключа
 * @returns {string} URL QR кода
 */
export function getQRCodeUrl(keyName) {
    const baseUrl = API_BASE_URL || '/api';
    return `${baseUrl}/qr?key_name=${encodeURIComponent(keyName)}`;
}

/**
 * Получает настройки приложения
 * @returns {Promise<Object>} Настройки
 */
export async function getSettings() {
    try {
        const baseUrl = API_BASE_URL || '/api';
        const response = await fetch(`${baseUrl}/settings`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('[API] Error getting settings:', error);
        throw error;
    }
}

/**
 * Получает тексты интерфейса
 * @param {string} language - Язык (ru/en)
 * @returns {Promise<Object>} Тексты
 */
export async function getTexts(language = 'ru') {
    if (!API_BASE_URL) {
        await initializeApi();
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/texts?language=${language}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.texts;
        
    } catch (error) {
        console.error('[API] Error getting texts:', error);
        throw error;
    }
}

/**
 * Отправляет подписку на TV устройство
 * @param {string} code - Код с TV
 * @param {string} subscriptionLink - Ссылка подписки
 * @returns {Promise<Object>} Результат
 */
export async function sendToTV(code, subscriptionLink) {
    if (!API_BASE_URL) {
        await initializeApi();
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                data: subscriptionLink
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Ошибка отправки');
        }
        
        return result;
        
    } catch (error) {
        console.error('[API] Error sending to TV:', error);
        throw error;
    }
}

/**
 * Проверяет здоровье API
 * @returns {Promise<Object>} Статус
 */
export async function checkHealth() {
    try {
        const baseUrl = API_BASE_URL || '/api';
        const response = await fetch(`${baseUrl}/health`);
        return await response.json();
    } catch (error) {
        console.error('[API] Health check failed:', error);
        return { status: 'error', error: error.message };
    }
}

// Экспортируем для использования в других файлах
export const ApiIntegration = {
    initializeApi,
    getSubscription,
    getQRCodeUrl,
    getSettings,
    getTexts,
    sendToTV,
    checkHealth
};
