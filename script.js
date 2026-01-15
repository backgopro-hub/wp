const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#010101');
tg.setBackgroundColor('#010101');

// --- 1. ЗАЩИТА ---
(function() {
  function blockContextMenu() {
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.which === 3) e.preventDefault();
    }, { capture: true });
  }
  blockContextMenu();
})();

// --- 2. ЛОГИКА ИНТЕРФЕЙСА ---
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

function openProfile() {
    tg.showAlert("Профиль");
}

// --- 3. АВТООПРЕДЕЛЕНИЕ УСТРОЙСТВА ---
function detectDevice() {
    const platform = tg.platform; // ios, android, tdesktop, weba, etc.
    
    const badgeText = document.querySelector('.device-badge span');
    const badgeIconContainer = document.querySelector('.device-badge svg'); // Само SVG заменим или его путь

    // Иконки (SVG Path)
    const iconApple = '<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="currentColor"/><path d="M13.5 7c-.5.5-1.5.5-2 0-.5-.5-1-1.5-1-2 0-.5.5-1.5 1.5-1.5.5 0 1.5.5 1.5 1.5 0 1-.5 1.5 0 2zM12 18c-2.5 0-4-1.5-4-3 0-1 1-2 2-2s1.5 1 2 2c.5-1 2-2 3-2 1.5 0 2.5 2 1.5 3.5-.5 1-2.5 1.5-4.5 1.5z" fill="currentColor"/>'; 
    // (Для простоты используем логотип Apple, Android и Windows как SVG path)
    
    // Apple Path
    const applePath = `<path d="M17.265 14.77c-.158.083-.342.138-.569.138-.857 0-1.528-.77-1.528-1.637 0-.916.712-1.648 1.638-1.648.17 0 .323.029.467.08-.24-1.049-1.077-1.78-2.226-1.78-.65 0-1.196.22-1.666.418-.383.161-.715.301-1.06.301-.35 0-.693-.144-1.09-.306-.49-.2-.99-.404-1.58-.404-1.95 0-3.327 1.63-3.327 3.58 0 1.62.99 3.55 2.15 3.55.42 0 .73-.12 1.05-.24.39-.15.82-.32 1.35-.32.53 0 .96.17 1.36.32.31.12.62.24 1.03.24 1.15 0 2.21-1.75 2.21-1.75s-.07-.03-.13-.07c-.01 0-.02-.02-.03-.02-.02-.01-.03-.02-.04-.02zM13.925 9.87c.46 0 .89-.17 1.21-.49.33-.31.52-.75.52-1.21 0-.03 0-.06-.01-.09-.45.02-.91.2-1.26.54-.3.3-.5.71-.53 1.17.02.03.05.06.07.08z" fill="currentColor"/>`;

    // Android Path
    const androidPath = `<path d="M17.523 15.341l.493-2.864a.676.676 0 0 0-.173-.55.672.672 0 0 0-.54-.183l-2.92.292a.673.673 0 0 0-.573.493l-.493 2.864a.676.676 0 0 0 .173.55.672.672 0 0 0 .54.183l2.92-.292a.673.673 0 0 0 .573-.493zM5.98 12.336l-1.38 1.38a1.27 1.27 0 0 0 0 1.796l1.38 1.38a1.27 1.27 0 0 0 1.796 0l1.38-1.38a1.27 1.27 0 0 0 0-1.796l-1.38-1.38a1.27 1.27 0 0 0-1.796 0zm9.852 4.484l-1.38-1.38a1.27 1.27 0 0 0-1.796 0l-1.38 1.38a1.27 1.27 0 0 0 0 1.796l1.38 1.38a1.27 1.27 0 0 0 1.796 0l1.38-1.38a1.27 1.27 0 0 0 0-1.796z" fill="currentColor"/><path d="M7 10.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" fill="currentColor"/>`;
    // (Заменил на простого робота для примера, так как точный SVG длинный. Но ниже ставлю красивый путь)
    const androidSimple = `<path d="M16.6 6.4L18 4.2c.1-.2.1-.5-.1-.6-.2-.1-.5-.1-.6.1l-1.4 2.3C14.5 5.5 12.9 5 11 5s-3.5.5-4.9 1L4.7 3.7c-.1-.2-.4-.2-.6-.1-.2.1-.2.4-.1.6l1.4 2.2C2.8 7.9 1 10.3 1 13h20c0-2.7-1.8-5.1-4.4-6.6zM7 9.5c-.8 0-1.5-.7-1.5-1.5S6.2 6.5 7 6.5s1.5.7 1.5 1.5S7.8 9.5 7 9.5zm8 0c-.8 0-1.5-.7-1.5-1.5S14.2 6.5 15 6.5s1.5.7 1.5 1.5S15.8 9.5 15 9.5zM1 14v4c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3v-4H1z" fill="currentColor"/>`;

    // Windows Path
    const windowsPath = `<path d="M0 2.5v10.5l8.5 1.5v-12L0 2.5zm8.5 13.5v12l-8.5-1.5V14.5h8.5zm1.5-12v12l12-1.5V0L10 1.5zm0 13.5v12l12 1.5v-15l-12 1.5z" fill="currentColor"/>`;

    // Default Laptop (macOS style but generic)
    const laptopPath = `<rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect><line x1="2" x2="22" y1="20" y2="20"></line>`;

    
    // ЛОГИКА ВЫБОРА
    if (platform === 'ios' || platform === 'macos') {
        badgeText.innerText = platform === 'ios' ? 'iOS' : 'macOS';
        badgeIconContainer.innerHTML = applePath;
        // Чуть увеличим иконку Apple, она обычно мелкая
        badgeIconContainer.setAttribute('viewBox', '0 0 24 24'); 
        
    } else if (platform === 'android') {
        badgeText.innerText = 'Android';
        badgeIconContainer.innerHTML = androidSimple;
        badgeIconContainer.setAttribute('viewBox', '0 0 22 22');

    } else if (platform === 'tdesktop' || platform === 'weba' || platform === 'web') {
        // На десктопе проверяем UserAgent
        if (navigator.userAgent.indexOf('Win') !== -1) {
            badgeText.innerText = 'Windows';
            badgeIconContainer.innerHTML = windowsPath;
            badgeIconContainer.setAttribute('viewBox', '0 0 22 28');
        } else if (navigator.userAgent.indexOf('Mac') !== -1) {
            badgeText.innerText = 'macOS';
            badgeIconContainer.innerHTML = applePath;
            badgeIconContainer.setAttribute('viewBox', '0 0 24 24');
        } else {
            badgeText.innerText = 'Desktop';
            badgeIconContainer.innerHTML = laptopPath; // Обычный ноут
        }
    } else {
        // Если не определили
        badgeText.innerText = 'Устройство';
        badgeIconContainer.innerHTML = laptopPath; 
    }
}

// Запускаем определение
detectDevice();
