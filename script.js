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
    const iconEl = document.getElementById('device-icon');
    if (!textEl || !iconEl) return;

    if (['ios', 'macos', 'ipad', 'iphone'].includes(platform)) {
        textEl.innerText = (platform === 'macos') ? 'macOS' : 'iOS';
        iconEl.innerHTML = `<path d="M18.71 19.5c-.31.49-.62.96-1.02 1.41-.69.75-1.4 1.5-2.45 1.51-1.02.01-1.38-.63-2.67-.63-1.25 0-1.72.63-2.73.65-1.03.02-1.92-.89-2.72-1.98C5.55 17.8 4.6 13.9 6.2 11.2c.8-1.35 2.19-2.2 3.66-2.22 1.13-.02 2.08.76 2.76.76.66 0 1.95-.88 3.32-.77.56.03 2.17.22 3.12 1.57-.08.05-1.89 1.08-1.87 3.31.01 2.62 2.34 3.51 2.41 3.54-.02.09-.36 1.22-1.89 3.11zM15.5 8.78c.59-.72.96-1.68.86-2.65-.92.04-1.97.6-2.57 1.32-.54.63-1 1.63-.87 2.61.99.07 1.99-.55 2.58-1.28z"></path>`;
        iconEl.setAttribute('viewBox', '0 0 24 24');
        iconEl.setAttribute('fill', 'currentColor');
    } else if (platform === 'android') {
        textEl.innerText = 'Android';
        iconEl.innerHTML = `<path d="M17.523 15.341l.493-2.864a.676.676 0 0 0-.173-.55.672.672 0 0 0-.54-.183l-2.92.292a.673.673 0 0 0-.573.493l-.493 2.864a.676.676 0 0 0 .173.55.672.672 0 0 0 .54.183l2.92-.292a.673.673 0 0 0 .573-.493zM5.98 12.336l-1.38 1.38a1.27 1.27 0 0 0 0 1.796l1.38 1.38a1.27 1.27 0 0 0 1.796 0l1.38-1.38a1.27 1.27 0 0 0 0-1.796l-1.38-1.38a1.27 1.27 0 0 0-1.796 0zm9.852 4.484l-1.38-1.38a1.27 1.27 0 0 0-1.796 0l-1.38 1.38a1.27 1.27 0 0 0 0 1.796l1.38 1.38a1.27 1.27 0 0 0 1.796 0l1.38-1.38a1.27 1.27 0 0 0 0-1.796z"></path><path d="M7 10.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"></path>`;
        iconEl.setAttribute('viewBox', '0 0 24 24');
        iconEl.setAttribute('fill', 'currentColor');
    } else if (platform === 'tdesktop' || platform === 'weba') {
        textEl.innerText = 'Windows';
        iconEl.innerHTML = `<path d="M0 2.5v10.5l8.5 1.5v-12L0 2.5zm8.5 13.5v12l-8.5-1.5V14.5h8.5zm1.5-12v12l12-1.5V0L10 1.5zm0 13.5v12l12 1.5v-15l-12 1.5z"></path>`;
        iconEl.setAttribute('viewBox', '0 0 22 28');
        iconEl.setAttribute('fill', 'currentColor');
    } else {
        textEl.innerText = 'Device';
        iconEl.innerHTML = `<rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect><line x1="2" x2="22" y1="20" y2="20"></line>`;
        iconEl.setAttribute('viewBox', '0 0 24 24');
        iconEl.setAttribute('fill', 'none');
        iconEl.setAttribute('stroke', 'currentColor');
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
