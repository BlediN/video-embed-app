const REQUIRED_PIN = '1212';
const PIN_STORAGE_KEY = 'video_app_pin_ok';
const pinGate = document.getElementById('pinGate');
const pinInput = document.getElementById('pinInput');
const pinSubmit = document.getElementById('pinSubmit');
const pinError = document.getElementById('pinError');
const iframes = Array.from(document.querySelectorAll('iframe'));
const panelContent = document.getElementById('panelContent');
const togglePanel = document.getElementById('togglePanel');
let audioEnabled = true;

function safeStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        return;
    }
}

function setMuteParam(urlString, muteValue) {
    try {
        const url = new URL(urlString);
        url.searchParams.set('mute', String(muteValue));
        url.searchParams.set('autoplay', '1');
        return url.toString();
    } catch (error) {
        const muteParam = 'mute=' + String(muteValue);
        const autoplayParam = 'autoplay=1';
        let nextUrl = urlString;
        if (nextUrl.indexOf('?') === -1) {
            nextUrl += '?' + muteParam + '&' + autoplayParam;
        } else {
            if (!/([?&])mute=/.test(nextUrl)) {
                nextUrl += '&' + muteParam;
            }
            if (!/([?&])autoplay=/.test(nextUrl)) {
                nextUrl += '&' + autoplayParam;
            }
        }
        return nextUrl;
    }
}

function loadIframes() {
    iframes.forEach((iframe, index) => {
        const delay = index * 350;
        setTimeout(() => {
            const targetSrc = iframe.getAttribute('data-src');
            if (!targetSrc) {
                return;
            }
            const shouldMute = index === 0 ? (audioEnabled ? 0 : 1) : 1;
            const nextSrc = setMuteParam(targetSrc, shouldMute);
            iframe.setAttribute('data-src', nextSrc);
            if (iframe.src !== nextSrc) {
                iframe.src = nextSrc;
            }
        }, delay);
    });
}

function unlockIfValidPin() {
    const enteredPin = pinInput.value.trim();
    if (enteredPin === REQUIRED_PIN) {
        safeStorageSet(PIN_STORAGE_KEY, 'true');
        pinGate.style.display = 'none';
        pinInput.value = '';
        pinError.textContent = '';
        loadIframes();
    } else {
        pinError.textContent = 'Incorrect PIN';
    }
}

if (safeStorageGet(PIN_STORAGE_KEY) === 'true') {
    pinGate.style.display = 'none';
    loadIframes();
} else {
    pinInput.focus();
}

pinSubmit.addEventListener('click', unlockIfValidPin);
pinInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        unlockIfValidPin();
    }
});

iframes.forEach((iframe) => {
    const wrapper = iframe.closest('.video-wrapper');
    if (!wrapper) {
        return;
    }
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'open-btn';
    openButton.textContent = 'Open';
    openButton.addEventListener('click', () => {
        const targetSrc = iframe.getAttribute('data-src') || iframe.src;
        if (targetSrc && targetSrc !== 'about:blank') {
            window.open(targetSrc, '_blank', 'noopener');
        }
    });
    wrapper.appendChild(openButton);
});

function reloadIframe(iframe, index) {
    const baseSrc = iframe.getAttribute('data-src') || iframe.src;
    if (!baseSrc || baseSrc === 'about:blank') {
        return;
    }
    const shouldMute = index === 0 ? (audioEnabled ? 0 : 1) : 1;
    const nextSrc = setMuteParam(baseSrc, shouldMute);
    try {
        const url = new URL(nextSrc);
        url.searchParams.set('refresh', Date.now());
        iframe.src = url.toString();
        iframe.setAttribute('data-src', url.toString());
    } catch (error) {
        const suffix = (nextSrc.indexOf('?') === -1 ? '?' : '&') + 'refresh=' + Date.now();
        iframe.src = nextSrc + suffix;
        iframe.setAttribute('data-src', iframe.src);
    }
}

document.getElementById('reloadAllBtn').addEventListener('click', () => {
    iframes.forEach((iframe, index) => reloadIframe(iframe, index));
});

function updateEmbedForIndex(index, nextUrl) {
    const iframe = document.getElementById('iframe-' + index);
    if (!iframe || !nextUrl) {
        return;
    }
    const sanitizedUrl = nextUrl.trim();
    if (!sanitizedUrl) {
        return;
    }
    iframe.setAttribute('data-src', sanitizedUrl);
    reloadIframe(iframe, index - 1);
}

togglePanel.addEventListener('click', () => {
    const isOpen = panelContent.classList.toggle('is-open');
    panelContent.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});

panelContent.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-target]');
    if (!button) {
        return;
    }
    const targetIndex = Number(button.getAttribute('data-target'));
    const input = document.getElementById('embedInput' + targetIndex);
    if (!input) {
        return;
    }
    updateEmbedForIndex(targetIndex, input.value);
});
