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

function detectDevice() {
    const platform = tg.platform || 'unknown'; 
    const textEl = document.getElementById('device-text');
    
    // Мы убрали иконку из HTML, поэтому искать ее не нужно
    // Если элемента текста нет - выходим
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

const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const date = urlParams.get('date');
const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const btnLabel = document.getElementById('btn-label');

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
