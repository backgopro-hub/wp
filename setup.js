const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();
tg.BackButton.onClick(() => {
    // Возврат на главную с сохранением параметров URL
    window.location.href = 'index.html' + window.location.search;
});

// ССЫЛКИ НА ПРИЛОЖЕНИЯ
const LINKS = {
    ios: "https://apps.apple.com/ru/app/v2raytun/id6476628951",
    android_app: "https://play.google.com/store/apps/details?id=com.v2raytun.android&hl=ru",
    android_connect: "v2raytun://import-sub?url=",
    windows: "https://github.com/hiddify/hiddify-next/releases/download/v2.5.7/Hiddify-Windows-Setup-x64.exe",
    macos: "https://apps.apple.com/ru/app/v2raytun/id6476628951",
    manual: "https://telegra.ph/General-Guide"
};

// Получаем ключ VPN из URL (который передал бот)
const urlParams = new URLSearchParams(window.location.search);
const vpnKey = urlParams.get('vpn_key') ? decodeURIComponent(urlParams.get('vpn_key')) : '';

let setupAction = null;

function detectDevice() {
    const platform = tg.platform || 'unknown'; 
    let deviceName = 'устройстве';
    
    // По умолчанию действие - инструкция
    setupAction = () => tg.openLink(LINKS.manual);

    if (!vpnKey) {
        document.getElementById('setup-title').innerText = "Нет подписки";
        document.getElementById('btn-start-text').innerText = "Купить подписку";
        setupAction = () => { window.location.href = 'index.html' + window.location.search; };
    } else {
        // Логика под разные устройства
        if (['ios', 'ipad', 'iphone'].includes(platform)) {
            deviceName = 'iOS';
            setupAction = () => {
                // Копируем ключ и предлагаем скачать
                navigator.clipboard.writeText(vpnKey);
                tg.showPopup({
                    title: 'iOS Настройка',
                    message: 'Ключ скопирован! Скачайте V2RayTun и вставьте ключ.',
                    buttons: [{id: 'ok', type: 'default', text: 'Скачать App'}]
                }, (id) => { if(id) tg.openLink(LINKS.ios); });
            };
        } else if (platform === 'android') {
            deviceName = 'Android';
            setupAction = () => {
                // Прямой импорт
                tg.openLink(LINKS.android_connect + encodeURIComponent(vpnKey));
            };
        } else if (['tdesktop', 'weba'].includes(platform) && navigator.userAgent.indexOf('Win') !== -1) {
            deviceName = 'Windows';
            setupAction = () => {
                navigator.clipboard.writeText(vpnKey);
                tg.showAlert("Ключ скопирован! Вставьте его в приложение.");
                tg.openLink(LINKS.windows);
            };
        } else {
            deviceName = 'Device';
            setupAction = () => {
                navigator.clipboard.writeText(vpnKey);
                tg.showAlert("Ключ скопирован в буфер обмена");
            };
        }
        
        document.getElementById('setup-title').innerText = `Настройка на ${deviceName}`;
        document.getElementById('btn-start-text').innerText = `Подключить (${deviceName})`;
    }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    detectDevice();
    // Анимация прогресса (заполняем круг)
    setTimeout(() => {
        document.getElementById('progress-circle').style.strokeDashoffset = '0'; 
    }, 100);
});

function startSetup() {
    tg.HapticFeedback.notificationOccurred('success');
    if (setupAction) setupAction();
}

function openManual() {
    tg.openLink(LINKS.manual);
}
