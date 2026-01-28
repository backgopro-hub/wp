// 1. ИМПОРТ ФУНКЦИИ API (ОБЯЗАТЕЛЬНО ПЕРВАЯ СТРОКА)
import { requestApi } from './api.js';

const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

// Защита от ПКМ
(function() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
})();

// === ГЛАВНАЯ ФУНКЦИЯ РАСПАКОВКИ (Оставляем твою логику) ===
function getAppData() {
    let raw = {};
    const startParam = tg.initDataUnsafe?.start_param;
    
    // 1. Если открыли как Mini App (есть start_param)
    if (startParam) {
        try {
            // Заменяем спецсимволы URL
            let base64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
            
            // Добавляем padding
            while (base64.length % 4) {
                base64 += '=';
            }
            
            // Декодируем
            const jsonString = decodeURIComponent(escape(atob(base64)));
            raw = JSON.parse(jsonString);
            
            console.log("Данные успешно получены из start_param:", raw);
        } catch (e) {
            console.error("Ошибка декодирования:", e);
        }
    }
    
    // 2. Если открыли просто по ссылке (резерв)
    if (Object.keys(raw).length === 0) {
        const p = new URLSearchParams(window.location.search);
        return {
            title: p.get('title'),
            userId: p.get('user_id'),
            status: p.get('status'),
            date: p.get('date'),
            vpn_key: p.get('vpn_key'),
            links: {
                ios: p.get('link_ios'),
                android: p.get('link_android'),
                windows: p.get('link_windows'),
                macos: p.get('link_macos'),
                manual: p.get('link_manual'),
                support: p.get('support')
            }
        };
    }

    // 3. Возвращаем распакованный объект
    return {
        title: raw.t,
        userId: raw.u,
        status: raw.s,
        date: raw.d,
        vpn_key: raw.k,
        links: {
            ios: raw.li,
            android: raw.la,
            windows: raw.lw,
            macos: raw.lm,
            manual: raw.h,
            support: raw.sup
        }
    };
}

// Загружаем начальные данные
const appData = getAppData();

// === ЗАГРУЗКА ДАННЫХ ИЗ API (ИСПРАВЛЕНО) ===
async function loadSubscriptionData() {
    try {
        const userId = tg.initDataUnsafe?.user?.id;
        
        if (!userId) {
            console.warn("No userId available");
            return;
        }
        
        // ЗАМЕНА: Используем requestApi вместо прямого fetch
        // Запрашиваем ключи пользователя через твоего бота
        const response = await requestApi(`/keys/all/${userId}`, 'GET');
        
        console.log("API response:", response);
        
        // Логика обработки ответа (адаптируй под ответ Netelusion)
        // Обычно приходит массив или объект с ключами
        let keyData = null;
        
        if (Array.isArray(response) && response.length > 0) {
            keyData = response[0];
        } else if (response.keys && Array.isArray(response.keys)) {
             keyData = response.keys[0];
        }

        if (keyData) {
            // Преобразуем данные API в формат для UI
            const uiData = {
                status: keyData.status === 'active' || keyData.is_active ? 'active' : 'expired',
                date: keyData.expire_at ? new Date(keyData.expire_at).toLocaleDateString() : 'Бессрочно',
                vpn_key: keyData.access_url || keyData.link
            };
            updateSubscriptionUI(uiData);
        } else {
            console.log("Активные подписки не найдены");
        }
        
    } catch (error) {
        console.error("Error loading via API:", error);
    }
}

function updateSubscriptionUI(data) {
    const statusText = document.getElementById('status-text');
    const dateText = document.getElementById('date-text-val');
    const btnLabel = document.getElementById('btn-label');

    // Обновляем статус
    if (statusText) {
        if (data.status === 'active') {
            statusText.innerText = 'Активна';
            statusText.style.color = '#00D68F';
            if (btnLabel) btnLabel.innerText = 'Продлить подписку';
        } else if (data.status === 'expired') {
            statusText.innerText = 'Истекла';
            statusText.style.color = '#facc15';
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
        } else {
            statusText.innerText = 'Не найдена';
            statusText.style.color = '#9ca3af';
        }
    }
    
    // Обновляем дату
    if (dateText && data.date) {
        dateText.innerText = data.date;
    }
    
    // Обновляем глобальный ключ для кнопок
    if (data.vpn_key) {
        appData.vpn_key = data.vpn_key;
        window.currentVpnKey = data.vpn_key;
    }
}

// === ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===
function updateUI() {
    // Заголовок
    if (appData.title) {
        document.title = appData.title;
        const headerEl = document.getElementById('header-title');
        if (headerEl) headerEl.innerText = appData.title;
    }

    // Устройство
    const deviceText = document.getElementById('device-text');
    if (deviceText) {
        const platform = tg.platform || 'unknown';
        if (['ios', 'macos', 'ipad', 'iphone'].includes(platform)) deviceText.innerText = 'iOS/macOS';
        else if (platform === 'android') deviceText.innerText = 'Android';
        else if (['tdesktop', 'weba'].includes(platform)) deviceText.innerText = 'Windows';
        else deviceText.innerText = 'Device';
    }

    // Применяем данные из start_param (пока API грузится)
    const uiData = {
        status: appData.status,
        date: appData.date,
        vpn_key: appData.vpn_key
    };
    
    // Если статус передан, обновляем UI
    if(appData.status) updateSubscriptionUI(uiData);
}

// === ПЕРЕХОДЫ (КНОПКИ) ===

function openSetup() {
    const params = new URLSearchParams();
    
    // Берем ключ либо из API, либо из start_param
    const keyToUse = window.currentVpnKey || appData.vpn_key;
    if (keyToUse) params.append('vpn_key', keyToUse);
    
    if (appData.links) {
        if (appData.links.ios) params.append('link_ios', appData.links.ios);
        if (appData.links.android) params.append('link_android', appData.links.android);
        if (appData.links.windows) params.append('link_windows', appData.links.windows);
        if (appData.links.macos) params.append('link_macos', appData.links.macos);
        if (appData.links.manual) params.append('link_manual', appData.links.manual);
    }

    // ВАЖНО: Используем правильное имя файла
    window.location.href = 'setup.html?' + params.toString();
}

function openSupport() {
    if (appData.links && appData.links.support) {
        tg.openLink(appData.links.support);
    } else {
        tg.showAlert("Контакты поддержки не найдены");
    }
}

function openProfile() {
    const params = new URLSearchParams();
    const keyToUse = window.currentVpnKey || appData.vpn_key;
    
    if (keyToUse) params.append('vpn_key', keyToUse);
    if (appData.userId) params.append('user_id', appData.userId);
    
    window.location.href = 'profile.html?' + params.toString();
}

function openOrder() {
    window.location.href = 'order.html' + window.location.search;
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    updateUI(); 
    loadSubscriptionData(); // Загружаем свежие данные через API бота
});

// =========================================================
// ВАЖНО: ЭКСПОРТ ФУНКЦИЙ (ЧТОБЫ РАБОТАЛИ КНОПКИ В HTML)
// =========================================================
window.openSetup = openSetup;
window.openSupport = openSupport;
window.openProfile = openProfile;
window.openOrder = openOrder;
