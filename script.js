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

// === ГЛАВНАЯ ФУНКЦИЯ РАСПАКОВКИ ===
function getAppData() {
    let raw = {};
    const startParam = tg.initDataUnsafe?.start_param;
    
    // 1. Если открыли как Mini App (есть start_param)
    if (startParam) {
        try {
            let base64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const jsonString = decodeURIComponent(escape(atob(base64)));
            raw = JSON.parse(jsonString);
            console.log("Start param data:", raw);
        } catch (e) {
            console.error("Decode error:", e);
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

// === ЗАГРУЗКА ДАННЫХ ИЗ API (ОБНОВЛЕНО) ===
async function loadSubscriptionData() {
    try {
        const userId = tg.initDataUnsafe?.user?.id;
        
        // Если тестируем в браузере без ТГ, userId может не быть
        // Можно временно раскомментировать для теста:
        // const userId = 123456789; 

        if (!userId) {
            console.warn("No userId available");
            return;
        }
        
        console.log("Запрашиваем ключи для:", userId);

        // ✅ ИСПРАВЛЕНИЕ: Шлем Action "get_keys", а не URL
        // Бот сам знает, что это значит /users/{id}/keys
        const response = await requestApi('get_keys');
        
        console.log("API keys response:", response);
        
        // Логика обработки ответа (ищет ключи в массиве или объекте)
        let keyData = null;
        
        if (Array.isArray(response) && response.length > 0) {
            keyData = response[0];
        } else if (response.keys && Array.isArray(response.keys)) {
             keyData = response.keys[0];
        } else if (response.result && Array.isArray(response.result)) {
             // Иногда API возвращает { result: [...] }
             keyData = response.result[0];
        }

        if (keyData) {
            // Форматируем для UI
            const uiData = {
                status: (keyData.status === 'active' || keyData.is_active) ? 'active' : 'expired',
                date: keyData.expire_at ? new Date(keyData.expire_at).toLocaleDateString() : 'Бессрочно',
                vpn_key: keyData.access_url || keyData.link || keyData.key
            };
            updateSubscriptionUI(uiData);
        } else {
            console.log("Активные подписки не найдены");
        }
        
    } catch (error) {
        console.error("Error loading keys:", error);
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
        } else {
            statusText.innerText = 'Истекла';
            statusText.style.color = '#facc15';
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
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

    // Применяем данные из start_param
    if(appData.status) {
        updateSubscriptionUI({
            status: appData.status,
            date: appData.date,
            vpn_key: appData.vpn_key
        });
    }
}

// === ПЕРЕХОДЫ (КНОПКИ) ===
function openSetup() {
    const params = new URLSearchParams();
    const keyToUse = window.currentVpnKey || appData.vpn_key;
    if (keyToUse) params.append('vpn_key', keyToUse);
    
    if (appData.links) {
        if (appData.links.ios) params.append('link_ios', appData.links.ios);
        if (appData.links.android) params.append('link_android', appData.links.android);
        if (appData.links.windows) params.append('link_windows', appData.links.windows);
        if (appData.links.macos) params.append('link_macos', appData.links.macos);
        if (appData.links.manual) params.append('link_manual', appData.links.manual);
    }
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
    // В профиль тоже можно переходить без параметров, если там есть свой загрузчик
    // Но оставим передачу данных на всякий случай
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
    loadSubscriptionData();
});

// ЭКСПОРТ
window.openSetup = openSetup;
window.openSupport = openSupport;
window.openProfile = openProfile;
window.openOrder = openOrder;
