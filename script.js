const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#010101');
tg.setBackgroundColor('#010101');

// 1. ЗАЩИТА
(function() {
  function blockContextMenu() {
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.which === 3) e.preventDefault();
    }, { capture: true });
  }
  blockContextMenu();
})();

let links = {
    ios: '', android: '', windows: '', macos: '', default: '', support: ''
};
let currentPlatform = 'unknown';

// 2. АВТООПРЕДЕЛЕНИЕ УСТРОЙСТВА
function detectDevice() {
    const platform = tg.platform || 'unknown'; 
    currentPlatform = platform;
    const textEl = document.getElementById('device-text');
    if (!textEl) return;

    if (['ios', 'macos', 'ipad', 'iphone'].includes(platform)) {
        textEl.innerText = (platform === 'macos') ? 'macOS' : 'iOS';
    } else if (platform === 'android') {
        textEl.innerText = 'Android';
    } else if (platform === 'tdesktop' || platform === 'weba') {
        textEl.innerText = 'Windows';
    } else {
        textEl.innerText = 'Device';
    }
}

// 3. ОТКРЫТИЕ ССЫЛОК
function openSetup() {
    let targetLink = links.default;
    if (['ios', 'ipad', 'iphone'].includes(currentPlatform)) targetLink = links.ios;
    else if (currentPlatform === 'android') targetLink = links.android;
    else if (['tdesktop', 'weba'].includes(currentPlatform)) {
        if (navigator.userAgent.indexOf('Win') !== -1) targetLink = links.windows;
        else if (navigator.userAgent.indexOf('Mac') !== -1) targetLink = links.macos;
        else targetLink = links.windows;
    } else if (currentPlatform === 'macos') targetLink = links.macos;

    if (targetLink) tg.openLink(targetLink);
    else tg.showAlert("Инструкция не найдена для этого устройства");
}

function openSupport() {
    if (links.support) tg.openLink(links.support);
    else tg.showAlert("Контакты поддержки не настроены");
}

// 4. ЛОГИКА URL
const urlParams = new URLSearchParams(window.location.search);
const appTitle = urlParams.get('title'); // Из settings.py
links.support = urlParams.get('support');
links.ios = urlParams.get('ios');
links.android = urlParams.get('android');
links.windows = urlParams.get('windows');
links.macos = urlParams.get('macos');
links.default = urlParams.get('default');

const status = urlParams.get('status');
const date = urlParams.get('date');

const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const btnLabel = document.getElementById('btn-label');
const headerTitleEl = document.getElementById('header-title'); // Маленький заголовок

// Если есть title в ссылке - меняем маленькую надпись
if (appTitle) {
    document.title = appTitle;
    if (headerTitleEl) headerTitleEl.innerText = appTitle;
}

if (status === 'active') {
    statusText.innerText = 'активна';
    statusText.style.color = '#00D68F';
    statusText.classList.remove('text-yellow-400');
    statusText.classList.add('text-green');
    if (date) dateTextVal.innerText = date;
    btnLabel.innerText = 'Продлить подписку';
}

document.addEventListener('DOMContentLoaded', detectDevice);
function openProfile() { tg.showAlert("Профиль"); }
