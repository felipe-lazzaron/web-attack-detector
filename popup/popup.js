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
    const timeoutId = setTimeout(() => {
        displayError("Timeout: The check took too long to respond.");
    }, 10000); // Timeout de 10 segundos

    browser.tabs.query({active: true, currentWindow: true}, tabs => {
        if (tabs.length === 0) {
            clearTimeout(timeoutId);
            displayError("No active tab found.");
            return;
        }
        browser.tabs.sendMessage(tabs[0].id, message)
            .then(response => {
                clearTimeout(timeoutId);
                displayResults(response);
            })
            .catch(err => {
                clearTimeout(timeoutId);
                console.error("Error sending message:", err);
                displayError("Failed to complete the check.");
            });
    });
}


function displayResults(response) {
    document.getElementById('loading').style.display = 'none';
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = ''; // Limpa resultados anteriores
    resultsElement.style.display = 'block';

    const resultDiv = document.createElement('div');
    resultDiv.textContent = response.result; // Assume que 'response.result' já é uma string formatada
    resultsElement.appendChild(resultDiv);
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
