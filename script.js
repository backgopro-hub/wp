// 1. Подключаем Telegram WebApp
const tg = window.Telegram.WebApp;

// Настройки из твоего файла index-BLI1ryHl.js
tg.expand(); // Раскрыть на весь экран
tg.setHeaderColor('#010101'); // Установить черный цвет шапки (как в оригинале)
tg.setBackgroundColor('#010101'); // Фон приложения

// 2. Логика защиты из твоего файла misc.js
// Блокирует правую кнопку мыши, F12 и выделение
(function attachRightClickBlocker() {
  function blockContextMenu(opts = {}) {
    const { allowSelectors = [] } = opts

    const isAllowedTarget = (el) =>
      allowSelectors.length > 0 &&
      el instanceof Element &&
      allowSelectors.some((sel) => el.closest(sel))

    const onContextMenu = (e) => {
      if (!isAllowedTarget(e.target)) {
        e.preventDefault()
      }
    }

    // Блокировка F10 и Menu
    const onKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'F10' || e.keyCode === 121)) {
        if (!isAllowedTarget(document.activeElement)) {
          e.preventDefault()
        }
      }
    }

    // Дополнительная блокировка кликов
    const onMouseDown = (e) => {
      if ((e.button === 2 || e.which === 3) && !isAllowedTarget(e.target)) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', onContextMenu, { capture: true })
    document.addEventListener('keydown', onKeyDown, { capture: true })
    document.addEventListener('mousedown', onMouseDown, { capture: true })
  }

  // Запускаем защиту
  blockContextMenu()
})();

// 3. Наша логика для интерфейса (Кнопки, статус, даты)
const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const date = urlParams.get('date');

const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const mainBtn = document.getElementById('main-btn');
const btnLabel = document.getElementById('btn-label');
const btnPrice = document.getElementById('btn-price');

// Если статус "active" - меняем интерфейс на зеленый
if (status === 'active') {
    statusText.innerText = 'активна';
    statusText.style.color = '#00D68F'; // Зеленый цвет Ultima
    // Убираем желтый класс, если он был в HTML
    statusText.classList.remove('text-yellow-400'); 
    
    if (date) {
        dateTextVal.innerText = date;
    }
    
    btnLabel.innerText = 'Продлить подписку';
    // Можно скрыть цену, если нужно:
    // btnPrice.style.display = 'none'; 
}

function openProfile() {
    tg.showAlert("Профиль");
}
