const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#010101');
tg.setBackgroundColor('#010101');

// Защита (из твоего файла misc.js)
(function() {
  function blockContextMenu() {
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.which === 3) e.preventDefault();
    }, { capture: true });
  }
  blockContextMenu();
})();

// Логика
const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const date = urlParams.get('date');

const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const mainBtn = document.getElementById('main-btn');
const btnLabel = document.getElementById('btn-label');

if (status === 'active') {
    statusText.innerText = 'активна';
    statusText.classList.remove('text-yellow-400');
    statusText.classList.add('text-[#00D68F]');
    
    if (date) dateTextVal.innerText = date;
    btnLabel.innerText = 'Продлить подписку';
}

function openProfile() {
    tg.showAlert("Профиль");
}
