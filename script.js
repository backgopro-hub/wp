const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// === ВАЖНО: Делаем шапку черной, чтобы слилась с фоном ===
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

// Запрет контекстного меню (защита от копирования)
(function() {
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });
    // Блокируем выделение текста (для ощущения приложения)
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
})();

// === ГЛАВНАЯ ФУНКЦИЯ: ПОЛУЧЕНИЕ ДАННЫХ ===
function getAppData() {
    let data = {};

    // 1. Пробуем получить данные из start_param (Нативный Mini App)
    // Это тот самый длинный код, который мы генерировали в Python
    const startParam = tg.initDataUnsafe?.start_param;
    
    if (startParam) {
        try {
            // Декодируем Base64 строку в JSON
            // Заменяем символы URL-safe Base64 на стандартные
            const base64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
            // Декодируем (atob) и чиним русские буквы (decodeURIComponent)
            const jsonString = decodeURIComponent(escape(atob(base64)));
            data = JSON.parse(jsonString);
            console.log("Данные из Mini App:", data);
        } catch (e) {
            console.error("Ошибка распаковки параметров:", e);
        }
    } 
    
    // 2. Если пусто, пробуем URL параметры (Старый способ / Тесты в браузере)
    if (Object.keys(data).length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        // Собираем объект из URL параметров
        data = {
            ios: urlParams.get('ios'),
            android: urlParams.get('android'),
            windows: urlParams.get('windows'),
            macos: urlParams.get('macos'),
            support: urlParams.get('support'),
            status: urlParams.get('status'),
            date: urlParams.get('date'),
            title: urlParams.get('title'),
            vpn_key: urlParams.get('vpn_key') // Не забудь про ключ!
        };
    }
    
    return data;
}

// Загружаем данные
const appData = getAppData();

// === ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ===
let links = {
    ios: appData.ios || '',
    android: appData.android || '',
    windows: appData.windows || '',
    macos: appData.macos || '',
    support: appData.support || ''
};

// === ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ===
function detectDevice() {
    const platform = tg.platform || 'unknown'; 
    const textEl = document.getElementById('device-text');
    if (!textEl) return;

    if (['ios', 'macos', 'ipad', 'iphone'].includes(platform)) {
        textEl.innerText = (platform === 'macos') ? 'macOS' : 'iOS';
    } else if (platform === 'android') {
        textEl.innerText = 'Android';
    } else if (['tdesktop', 'weba'].includes(platform) && navigator.userAgent.indexOf('Win') !== -1) {
        textEl.innerText = 'Windows';
    } else {
        textEl.innerText = 'Device';
    }
}

// === ПЕРЕХОД К НАСТРОЙКАМ ===
function openSetup() {
    // ВАЖНО: Так как window.location.search может быть пустым (в режиме Mini App),
    // мы должны сами собрать параметры для передачи на следующую страницу.
    const params = new URLSearchParams();
    
    // Перебираем все полученные данные и добавляем в ссылку
    for (const [key, value] of Object.entries(appData)) {
        if(value) params.append(key, value);
    }
    
    // Переходим
    window.location.href = 'setup.html?' + params.toString();
}

// === ОТКРЫТИЕ ПОДДЕРЖКИ ===
function openSupport() {
    if (links.support) tg.openLink(links.support);
    else tg.showAlert("Контакты поддержки не настроены");
}

// === ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===
const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const btnLabel = document.getElementById('btn-label');
const headerTitleEl = document.getElementById('header-title');

// Заголовок
if (appData.title) {
    document.title = appData.title;
    if (headerTitleEl) headerTitleEl.innerText = appData.title;
}

// Статус подписки
const status = appData.status;
const date = appData.date;

if (status === 'active') {
    statusText.innerText = 'Активна';
    statusText.style.color = '#00D68F';
    statusText.classList.remove('text-yellow-400');
    statusText.classList.add('text-green');
    if (date) dateTextVal.innerText = date;
    
    // Если есть кнопка "Продлить" (иногда её скрывают, если автопродление)
    if(btnLabel) btnLabel.innerText = 'Продлить подписку';
    
} else if (status === 'expired') {
    statusText.innerText = 'Истекла';
    statusText.style.color = '#facc15';
    statusText.classList.add('text-yellow-400');
    statusText.classList.remove('text-green');
    if (date) dateTextVal.innerText = date;
    
    if(btnLabel) btnLabel.innerText = 'Купить подписку';
    
} else {
    // Если статус не пришел или unknown
    statusText.innerText = 'Не найдена';
    statusText.style.color = '#9ca3af';
    statusText.classList.remove('text-green', 'text-yellow-400');
    dateTextVal.innerText = '—';
    
    if(btnLabel) btnLabel.innerText = 'Купить подписку';
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    detectDevice();
});

// Профиль (пока заглушка)
function openProfile() { tg.showAlert("Профиль пользователя"); }
