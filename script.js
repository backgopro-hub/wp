const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

const urlParams = new URLSearchParams(window.location.search);

const appTitle = urlParams.get('title');
const linkSupport = urlParams.get('support');
if (appTitle) document.querySelector('.app-title').textContent = appTitle;

const tgUser = tg.initDataUnsafe.user;
const userName = tgUser ? tgUser.first_name : 'Guest';
const userId = urlParams.get('user_id') || (tgUser ? tgUser.id : '000000');
const vpnKey = urlParams.get('vpn_key'); 
const startScreen = urlParams.get('screen');

const linkIos = urlParams.get('ios');
const linkAndroid = urlParams.get('android');
const linkWin = urlParams.get('windows');

document.getElementById('user-name-el').textContent = userName;
document.getElementById('user-id-el').textContent = `ID: ${userId}`;

let platformName = 'Device';
if (tg.platform === 'ios') platformName = 'iOS';
else if (tg.platform === 'android') platformName = 'Android';
else if (tg.platform === 'tdesktop' || tg.platform === 'weba') platformName = 'Windows';
document.getElementById('platform-lbl').textContent = platformName;

if (vpnKey) {
    document.getElementById('vpn-key-section').style.display = 'block';
    document.getElementById('vpn-key-val').textContent = vpnKey;
    document.getElementById('status-badge').classList.add('online');
    document.getElementById('status-text').textContent = 'Active';
}

const screenMain = document.getElementById('screen-main');
const screenProfile = document.getElementById('screen-profile');

function switchScreen(screenName) {
    haptic();
    screenMain.classList.remove('active');
    screenProfile.classList.remove('active');

    if (screenName === 'profile') {
        screenProfile.classList.add('active');
        tg.BackButton.show();
    } else {
        screenMain.classList.add('active');
        tg.BackButton.hide();
    }
}

tg.BackButton.onClick(() => switchScreen('main'));

if (startScreen === 'profile') {
    screenMain.classList.remove('active');
    screenProfile.classList.add('active');
    tg.BackButton.show();
}

function handleAction(action) {
    haptic();
    if (action === 'buy') {
        tg.sendData("action_buy");
    } 
    else if (action === 'support') {
        if (linkSupport) tg.openTelegramLink(linkSupport);
        else tg.sendData("action_support");
    } 
    else if (action === 'install') {
        if (tg.platform === 'ios' && linkIos) tg.openLink(linkIos);
        else if (tg.platform === 'android' && linkAndroid) tg.openLink(linkAndroid);
        else tg.openLink(linkWin || 'https://google.com');
    }
}

function copyKey() {
    const text = document.getElementById('vpn-key-val').textContent;
    navigator.clipboard.writeText(text).then(() => {
        tg.HapticFeedback.notificationOccurred('success');
        const box = document.querySelector('.copy-box');
        box.style.borderColor = '#00e096';
        setTimeout(() => box.style.borderColor = 'rgba(255,255,255,0.12)', 300);
    });
}

function haptic() {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}
