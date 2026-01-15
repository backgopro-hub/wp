const tg = window.Telegram.WebApp;
tg.expand();

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const date = urlParams.get('date');

const dateTextVal = document.getElementById('date-text-val');
const statusText = document.getElementById('status-text');
const mainBtn = document.getElementById('main-btn');
const btnLabel = document.getElementById('btn-label');
const btnPrice = document.getElementById('btn-price');

// Логика переключения статуса
if (status === 'active') {
    statusText.innerText = 'активна';
    statusText.style.color = '#00D68F'; // Зеленый цвет
    statusText.className = 'text-green'; // Или класс
    
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
