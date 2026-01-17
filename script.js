const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#010101');
tg.setBackgroundColor('#010101');

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

// === НОВАЯ ФУНКЦИЯ ПЕРЕХОДА ===
function openSetup() {
    // Вместо открытия внешней ссылки, мы переходим на наш файл setup.html
    // window.location.search переносит все параметры (vpn_key, id и т.д.) на новую страницу
    window.location.href = 'setup.html' + window.location.search;
}

function openSupport() {
    if (links.support) tg.openLink(links.support);
    else tg.showAlert("Контакты поддержки не настроены");
}

// === ЧТЕНИЕ ПАРАМЕТРОВ ===
const urlParams = new URLSearchParams(window.location.search);

// Декодируем значения (на случай %20)
const getParam = (key) => {
    const val = urlParams.get(key);
    return val ? decodeURIComponent(val) : '';
};

const appTitle = getParam('title');
links.support = getParam('support');
links.ios = getParam('ios');
links.android = getParam('android');
links.windows = getParam('windows');
links.macos = getParam('macos');
links.default = getParam('default');

const status = getParam('status');
const date = getParam('date');

const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const btnLabel = document.getElementById('btn-label');
const headerTitleEl = document.getElementById('header-title');

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
} else if (status === 'expired') {
    statusText.innerText = 'подписка истекла';
    statusText.style.color = '#facc15';
    statusText.classList.add('text-yellow-400');
    statusText.classList.remove('text-green');
    if (date) dateTextVal.innerText = date;
    btnLabel.innerText = 'Купить подписку';
} else {
    statusText.innerText = 'не найдена';
    statusText.style.color = '#9ca3af';
    statusText.classList.remove('text-green', 'text-yellow-400');
    dateTextVal.innerText = '—';
    btnLabel.innerText = 'Купить подписку';
}

document.addEventListener('DOMContentLoaded', detectDevice);
function openProfile() { tg.showAlert("Профиль"); }
