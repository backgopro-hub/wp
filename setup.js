const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();
tg.BackButton.onClick(() => {
    window.location.href = 'index.html' + window.location.search;
});

// === ССЫЛКИ ИЗ ТВОЕГО КОДА ===
const LINKS = {
    ios: "https://apps.apple.com/ru/app/v2raytun/id6476628951",
    android_app: "https://play.google.com/store/apps/details?id=com.v2raytun.android&hl=ru",
    android_connect: "v2raytun://import-sub?url=",
    windows: "https://github.com/hiddify/hiddify-next/releases/download/v2.5.7/Hiddify-Windows-Setup-x64.exe",
    manual: "https://telegra.ph/General-Guide"
};

const urlParams = new URLSearchParams(window.location.search);
const vpnKey = urlParams.get('vpn_key') ? decodeURIComponent(urlParams.get('vpn_key')) : '';
const platform = tg.platform || 'unknown';

let deviceName = 'устройстве';

// Определяем устройство при запуске
function initPage() {
    if (['ios', 'ipad', 'iphone'].includes(platform)) deviceName = 'iOS';
    else if (platform === 'android') deviceName = 'Android';
    else if (['tdesktop', 'weba'].includes(platform) && navigator.userAgent.indexOf('Win') !== -1) deviceName = 'Windows';
    else if (platform === 'macos') deviceName = 'macOS';

    // Пишем заголовок
    document.getElementById('setup-title').innerText = `Настройка на ${deviceName}`;
    // Пишем текст на кнопке
    document.getElementById('btn-text').innerText = `Начать настройку на ${deviceName}`;
}

// === ЛОГИКА КЛИКА ===
let isStarted = false;

function startProcess() {
    // Если ключа нет - ругаемся
    if (!vpnKey) {
        tg.showAlert("Сначала купите подписку!");
        return;
    }

    if (isStarted) return; // Защита от двойного клика
    isStarted = true;

    const btn = document.getElementById('main-btn');
    const circle = document.getElementById('progress-circle');
    const title = document.getElementById('setup-title');
    const sub = document.getElementById('setup-subtitle');

    tg.HapticFeedback.impactOccurred('medium');

    // === ШАГ 1: ЗАПОЛНЯЕМ НА 30% ===
    // Длина круга 283. 
    // Чтобы заполнить на 30%, нужно оставить пустым 70%.
    // 283 * 0.7 = 198.
    circle.style.strokeDashoffset = '198'; 

    // Меняем тексты
    title.innerText = "Анализ устройства...";
    sub.innerText = "Пожалуйста, подождите";
    
    // Блокируем кнопку и меняем текст
    btn.disabled = true;
    btn.style.opacity = '0.7';
    document.getElementById('btn-text').innerText = "Выполняется...";

    // ---> ЗДЕСЬ КОД ОСТАНАВЛИВАЕТСЯ И ЖДЕТ <---
    // Скидывай текст, что должно происходить дальше (на 60% и 100%)
}

document.addEventListener('DOMContentLoaded', initPage);

function openManual() { tg.openLink(LINKS.manual); }
function goHome() { window.location.href = 'index.html' + window.location.search; }
