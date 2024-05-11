document.getElementById('checkThirdPartyDomainsButton').addEventListener('click', () => handleCheck("checkThirdPartyDomains"));
document.getElementById('checkCookiesButton').addEventListener('click', () => handleCheck("checkCookies"));
document.getElementById('checkStorageButton').addEventListener('click', () => handleCheck("checkStorage"));
document.getElementById('checkCookieSyncButton').addEventListener('click', () => handleCheck("checkCookieSync"));
document.getElementById('checkCanvasFingerprintingButton').addEventListener('click', () => handleCheck("checkCanvasFingerprinting"));
document.getElementById('privacyScoreButton').addEventListener('click', () => handleCheck("calculatePrivacyScore"));

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
        if (tabs.length === 0) {
            console.error("No active tabs found.");
            displayError("No active tab to check.");
            return;
        }

        browser.tabs.sendMessage(tabs[0].id, message)
            .then(response => {
                clearTimeout(timeoutId);
                if (response.errors && response.errors.length > 0) {
                    displayResults(response.result, response.errors);
                } else {
                    displayResults(response.result);
                }
            })
            .catch(err => {
                clearTimeout(timeoutId);
                console.error("Error sending message:", err);
                displayError("Failed to complete the check.");
            });
    });
}

function displayResults(results, errors = []) {
    document.getElementById('loading').style.display = 'none';
    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'flex';
    resultsElement.innerHTML = ''; // Limpa resultados anteriores

    const resultsMsg = document.createElement('div');
    resultsMsg.className = 'card';
    resultsMsg.textContent = results;
    resultsElement.appendChild(resultsMsg);

    errors.forEach(error => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'card error';
        errorMsg.textContent = error;
        resultsElement.appendChild(errorMsg);
    });
}


function displayError(message) {
    document.getElementById('loading').style.display = 'none';
    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'flex';
    resultsElement.innerHTML = `<div class="card error">${message}</div>`; // Mostra a mensagem de erro
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
