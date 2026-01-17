const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();
tg.BackButton.onClick(() => {
    // Возвращаемся на главную, сохраняя параметры
    window.location.href = 'index.html' + window.location.search;
});

// === 1. ЧИТАЕМ ДАННЫЕ ИЗ URL ===
// Эти данные прислал Python-бот
const urlParams = new URLSearchParams(window.location.search);

const getParam = (key) => {
    const val = urlParams.get(key);
    return val ? decodeURIComponent(val) : '';
};

const vpnKey = getParam('vpn_key');

// Собираем объект ссылок.
// Берем из URL, но если вдруг там пусто — используем запасные (hardcoded).
const LINKS = {
    ios: getParam('link_ios') || "https://apps.apple.com/ru/app/v2raytun/id6476628951",
    android: getParam('link_android') || "https://play.google.com/store/apps/details?id=com.v2raytun.android",
    windows: getParam('link_windows') || "https://github.com/hiddify/hiddify-next/releases",
    macos: getParam('link_macos') || "https://apps.apple.com/ru/app/v2raytun/id6476628951",
    manual: getParam('link_manual') || "https://telegra.ph/General-Guide"
};

// === 2. ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ===
const platform = tg.platform || 'unknown';
let deviceName = 'устройстве';
let appName = 'Приложение';
let installLink = LINKS.manual; // Ссылка по умолчанию

function initPage() {
    // Логика определения платформы
    if (['ios', 'ipad', 'iphone'].includes(platform)) {
        deviceName = 'iOS';
        appName = 'V2RayTun';
        installLink = LINKS.ios;
    } else if (platform === 'android') {
        deviceName = 'Android';
        appName = 'V2RayTun';
        installLink = LINKS.android;
    } else if (['tdesktop', 'weba'].includes(platform) && navigator.userAgent.indexOf('Win') !== -1) {
        deviceName = 'Windows';
        appName = 'Hiddify';
        installLink = LINKS.windows;
    } else if (platform === 'macos') {
        deviceName = 'macOS';
        appName = 'V2RayTun';
        installLink = LINKS.macos;
    }

    // Обновляем тексты на странице сразу при загрузке
    document.getElementById('setup-title').innerText = `Настройка на ${deviceName}`;
    document.getElementById('btn-start-text').innerText = `Начать настройку на ${deviceName}`;
}

// === 3. ЛОГИКА ПЕРЕХОДА НА ШАГ 1 (33%) ===

// Иконка "Облако" (для шага установки)
const ICON_CLOUD = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v8l-4-4"></path><path d="m12 21 4-4"></path><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"></path></svg>`;

function startProcess() {
    // Проверка наличия ключа
    if (!vpnKey) {
        tg.showAlert("Сначала купите подписку!");
        return;
    }
    
    tg.HapticFeedback.impactOccurred('medium');

    // 1. Анимация круга (33%)
    // Полная длина = 283. Остаток 67% = 190.
    document.getElementById('progress-circle').style.strokeDashoffset = '190'; 

    // 2. Меняем иконку по центру
    document.getElementById('status-icon').innerHTML = ICON_CLOUD;
    
    // 3. Меняем тексты
    document.getElementById('setup-title').innerText = "Приложение";
    document.getElementById('setup-subtitle').innerHTML = `Установите приложение ${appName} <br>и вернитесь к этому экрану`;

    // 4. Переключаем кнопки (Скрываем одну большую, показываем две маленьких)
    document.getElementById('initial-buttons').style.display = 'none';
    document.getElementById('step-buttons-container').style.display = 'flex';
}

// === ДЕЙСТВИЯ КНОПОК ===

// Кнопка "Установить"
function performInstall() {
    tg.HapticFeedback.impactOccurred('light');
    tg.openLink(installLink);
}

// Кнопка "Далее"
function nextStep() {
    tg.HapticFeedback.impactOccurred('light');
    // Здесь будет код для перехода к 66% и 100%
    // Пока просто заглушка, чтобы ты видел, что кнопка работает
    tg.showAlert("Переходим к следующему шагу...");
}

function openManual() { tg.openLink(LINKS.manual); }
function goHome() { window.location.href = 'index.html' + window.location.search; }

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);
