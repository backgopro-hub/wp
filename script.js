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
            // === ВОТ ТУТ БЫЛА ПРОБЛЕМА ===
            // 1. Заменяем спецсимволы URL
            let base64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
            
            // 2. ДОБАВЛЯЕМ ОБРАТНО PADDING (=), который мы убрали в Python
            // Без этого atob() падает с ошибкой и приложение не грузится
            while (base64.length % 4) {
                base64 += '=';
            }
            
            // 3. Декодируем
            const jsonString = decodeURIComponent(escape(atob(base64)));
            raw = JSON.parse(jsonString);
            
            console.log("Данные успешно получены:", raw);
        } catch (e) {
            console.error("Критическая ошибка декодирования:", e);
            tg.showAlert("Ошибка чтения данных: " + e.message);
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

    // 3. Возвращаем распакованный объект (из коротких ключей Python в нормальные)
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

// Загружаем данные
const appData = getAppData();

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

    // Статус
    const statusText = document.getElementById('status-text');
    const dateText = document.getElementById('date-text-val');
    const btnLabel = document.getElementById('btn-label');

    if (statusText) {
        if (appData.status === 'active') {
            statusText.innerText = 'Активна';
            statusText.style.color = '#00D68F'; // Зеленый
            if (btnLabel) btnLabel.innerText = 'Продлить подписку';
        } else if (appData.status === 'expired') {
            statusText.innerText = 'Истекла';
            statusText.style.color = '#facc15'; // Желтый
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
        } else {
            statusText.innerText = 'Не найдена';
            statusText.style.color = '#9ca3af'; // Серый
            if (btnLabel) btnLabel.innerText = 'Купить подписку';
        }
    }
    
    if (dateText && appData.date) {
        dateText.innerText = appData.date;
    }
}

// === ПЕРЕХОДЫ (Кнопки) ===

function openSetup() {
    // Собираем ссылку для перехода на setup.html
    const params = new URLSearchParams();
    
    // Передаем ключ, если есть
    if (appData.vpn_key) params.append('vpn_key', appData.vpn_key);
    
    // Передаем все ссылки
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
    // Собираем параметры для страницы профиля
    const params = new URLSearchParams();
    
    // Передаем ссылку на подписку
    if (appData.vpn_key) {
        // Формируем ссылку на подписку (можно изменить формат)
        const subscriptionLink = `https://ultm.app/${appData.vpn_key}`;
        params.append('subscription_link', subscriptionLink);
    }
    
    // Передаем другие данные если нужно
    if (appData.userId) params.append('user_id', appData.userId);
    
    window.location.href = 'profile.html?' + params.toString();
}

function openOrder() {
    // Переход на страницу покупки подписки
    window.location.href = 'order.html' + window.location.search;
}

// Запускаем логику, когда страница прогрузилась
document.addEventListener('DOMContentLoaded', updateUI);
