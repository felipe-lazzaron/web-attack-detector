document.getElementById('checkSecurityButton').addEventListener('click', () => handleCheck("checkSecurity"));
document.getElementById('checkThirdPartyDomainsButton').addEventListener('click', () => handleCheck("checkThirdPartyDomains"));
document.getElementById('checkCookiesButton').addEventListener('click', () => handleCheck("checkCookies"));
document.getElementById('checkStorageButton').addEventListener('click', () => handleCheck("checkStorage"));
document.getElementById('checkCookieSyncButton').addEventListener('click', () => handleCheck("checkCookieSync"));

function handleCheck(action) {
    displayLoading();
    sendMessageToContentScript({ action: action });
}

function displayLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').innerHTML = ''; // Clear previous results
    document.getElementById('results').style.display = 'none';
}

function sendMessageToContentScript(message) {
    browser.tabs.query({active: true, currentWindow: true}, tabs => {
        browser.tabs.sendMessage(tabs[0].id, message);
    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    document.getElementById('loading').style.display = 'none';
    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'flex';

    if (message.result && message.result.length > 0) {
        message.result.forEach(info => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = info;
            resultsElement.appendChild(card);
        });
    } else {
        resultsElement.innerHTML = '<div class="card">Nenhuma informação encontrada.</div>';
    }
});

document.getElementById('detectInjectionsButton').addEventListener('click', () => {
    sendMessageToContentScript({ action: "detectInjections" });
});
