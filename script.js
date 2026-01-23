const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

// Защита
(function() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
})();

// === ГЛАВНАЯ ФУНКЦИЯ: РАСПАКОВКА ДАННЫХ ===
function getAppData() {
    let raw = {};
    const startParam = tg.initDataUnsafe?.start_param;
    
    // 1. Попытка достать из Mini App (start_param)
    if (startParam) {
        try {
            // Возвращаем padding "=" если мы его обрезали в Python
            let base64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) { base64 += '='; }
            
            const jsonString = decodeURIComponent(escape(atob(base64)));
            raw = JSON.parse(jsonString);
            console.log("MiniApp Data:", raw);
        } catch (e) {
            console.error("Decode error:", e);
        }
    }
    
    // 2. Fallback для тестов в браузере (URL params)
    if (Object.keys(raw).length === 0) {
        const p = new URLSearchParams(window.location.search);
        // Если открыли по старинке, читаем длинные ключи
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

    // 3. ПРЕВРАЩАЕМ КОРОТКИЕ КЛЮЧИ (из Python) В ПОНЯТНЫЕ ПЕРЕМЕННЫЕ
    return {
        title: raw.t,
        userId: raw.u,
        status: raw.s,
        date: raw.d,
        vpn_key: raw.k, // Ключ VPN
        links: {
            ios: raw.li,
            android: raw.la,
            windows: raw.lw,
            macos: raw.lm,
            manual: raw.h,  // help
            support: raw.sup
        }
    };
}

// Загружаем данные один раз
const appData = getAppData();

// === ЛОГИКА ИНТЕРФЕЙСА ===
function updateUI() {
    // 1. Заголовок
    if (appData.title) {
        document.title = appData.title;
        const headerEl = document.getElementById('header-title');
        if (headerEl) headerEl.innerText = appData.title;
    }

    // 2. Определение устройства (для надписи на кнопке)
    const platform = tg.platform || 'unknown';
    const deviceText = document.getElementById('device-text');
    if (deviceText) {
        if (['ios', 'macos', 'ipad', 'iphone'].includes(platform)) deviceText.innerText = 'iOS/macOS';
        else if (platform === 'android') deviceText.innerText = 'Android';
        else if (platform === 'tdesktop' || platform === 'weba') deviceText.innerText = 'Windows';
        else deviceText.innerText = 'Device';
    }

    // 3. Статус подписки
    const statusText = document.getElementById('status-text');
    const dateText = document.getElementById('date-text-val');
    const btnLabel = document.getElementById('btn-label');

    if (statusText) {
        if (appData.status === 'active') {
            statusText.innerText = 'Активна';
            statusText.style.color = '#00D68F';
            if (btnLabel) btnLabel.innerText = 'Продлить подписку';
        } else if (appData.status === 'expired') {
            statusText.innerText = 'Истекла';
            statusText.style.color = '#facc15';
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
        } else {
            statusText.innerText = 'Не найдена';
            statusText.style.color = '#9ca3af';
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
        }
    }
    
    if (dateText && appData.date) {
        dateText.innerText = appData.date;
    }
}

// === ПЕРЕХОДЫ ===

function openSetup() {
    // Собираем ссылку для setup.html
    // Нам нужно передать туда параметры, чтобы setup.html их увидел
    const params = new URLSearchParams();
    
    if (appData.vpn_key) params.append('vpn_key', appData.vpn_key);
    
    // Передаем ссылки дальше
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
    tg.showAlert("Ваш ID: " + (appData.userId || "Неизвестен"));
}

// Запуск
document.addEventListener('DOMContentLoaded', updateUI);
