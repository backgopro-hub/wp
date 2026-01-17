const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();
tg.BackButton.onClick(() => {
    window.location.href = 'index.html' + window.location.search;
});

// Ссылки
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
let setupAction = null;

// Иконка "Вилка" (появится в конце)
const ICON_PLUG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 5 3-3"></path><path d="m2 22 3-3"></path><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"></path><path d="M7.5 13.5 10 11"></path><path d="M10.5 16.5 13 14"></path><path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"></path></svg>`;

function prepareLogic() {
    setupAction = () => tg.openLink(LINKS.manual);

    if (['ios', 'ipad', 'iphone'].includes(platform)) {
        deviceName = 'iOS';
        setupAction = () => {
            navigator.clipboard.writeText(vpnKey);
            tg.showPopup({
                title: 'Настройка iOS',
                message: 'Ключ скопирован! Скачайте приложение и вставьте ключ.',
                buttons: [{id: 'ok', type: 'default', text: 'Скачать App'}]
            }, (id) => { if(id) tg.openLink(LINKS.ios); });
        };
    } else if (platform === 'android') {
        deviceName = 'Android';
        setupAction = () => { tg.openLink(LINKS.android_connect + encodeURIComponent(vpnKey)); };
    } else if (['tdesktop', 'weba'].includes(platform) && navigator.userAgent.indexOf('Win') !== -1) {
        deviceName = 'Windows';
        setupAction = () => { 
            navigator.clipboard.writeText(vpnKey); 
            tg.showAlert("Ключ скопирован!"); 
            tg.openLink(LINKS.windows);
        };
    }
}

// === ЛОГИКА АНИМАЦИИ (ШАГИ) ===
function runProgress() {
    const circle = document.getElementById('progress-circle');
    const title = document.getElementById('setup-title');
    const sub = document.getElementById('setup-subtitle');
    const iconContainer = document.getElementById('status-icon');

    // ШАГ 1: Старт (0%)
    setTimeout(() => {
        circle.style.strokeDashoffset = '70'; // 30% заполнено
        title.innerText = "Определение устройства...";
    }, 300);

    // ШАГ 2: Середина (60%)
    setTimeout(() => {
        prepareLogic(); // Определяем устройство
        circle.style.strokeDashoffset = '30'; // 70% заполнено
        title.innerText = `Настройка для ${deviceName}`;
    }, 1200);

    // ШАГ 3: Финал (100%)
    setTimeout(() => {
        circle.style.strokeDashoffset = '0'; // 100% заполнено
        title.innerText = "Устройство готово";
        sub.innerText = "Нажмите кнопку ниже для подключения";
        
        // Меняем иконку на вилку
        iconContainer.innerHTML = ICON_PLUG;
        iconContainer.style.color = '#00D68F'; // Зеленая иконка
        
        // Обновляем текст кнопки
        document.getElementById('btn-start-text').innerText = `Подключить (${deviceName})`;
        
        // Показываем кнопки
        document.getElementById('buttons-container').style.opacity = '1';
        tg.HapticFeedback.notificationOccurred('success');
    }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
    runProgress();
});

function startSetup() {
    tg.HapticFeedback.impactOccurred('medium');
    if (!vpnKey) {
        tg.showAlert("Сначала купите подписку!");
        setTimeout(() => { window.location.href = 'index.html' + window.location.search; }, 1000);
        return;
    }
    if (setupAction) setupAction();
}

function openManual() { tg.openLink(LINKS.manual); }
function goHome() { window.location.href = 'index.html' + window.location.search; }
