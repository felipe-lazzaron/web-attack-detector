// Funções auxiliares para analisar cookies e armazenamento
function analyzeCookies() {
  const cookies = document.cookie.split("; ");
  return cookies.map((cookie) => {
    const [name, value] = cookie.split("=");
    return { name, value };
  });
}

// Função para acessar e analisar o armazenamento local
function analyzeLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`Local Storage item: ${key} = ${value}`);
    // Aqui você pode adicionar lógicas para analisar os dados do armazenamento local
  }
}

analyzeLocalStorage();

function detectThirdPartyDomains() {
  const host = window.location.hostname;
  const thirdParties = new Set();
  performance.getEntriesByType("resource").forEach((request) => {
    const domain = new URL(request.name).hostname;
    if (domain !== host) {
      thirdParties.add(domain);
    }
  });
  return Array.from(thirdParties);
}

function detectMaliciousInjections() {
  return Array.from(document.querySelectorAll("script"))
    .filter(
      (script) => script.src && !script.src.startsWith(window.location.origin)
    )
    .map((script) => script.src);
}

function getCookiesDetails() {
  const allCookies = document.cookie.split("; ");
  const cookieDetails = {
    total: allCookies.length,
    firstParty: [],
    thirdParty: [],
    sessionCookies: [],
    persistentCookies: [],
  };

  allCookies.forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0].trim();
    const value = parts[1] ? parts[1].trim() : "";
    const cookieDomain = getCookieDomain(name);

    // Assume que cookies sem 'expires' e 'max-age' são de sessão
    if (cookie.includes("expires") || cookie.includes("max-age")) {
      cookieDetails.persistentCookies.push(name);
    } else {
      cookieDetails.sessionCookies.push(name);
    }

    // Determinar se é de primeira ou terceira parte
    if (cookieDomain === window.location.hostname) {
      cookieDetails.firstParty.push(name);
    } else {
      cookieDetails.thirdParty.push(name);
    }
  });

  return cookieDetails;
}

function getCookieDomain(cookieName) {
  // Simplificação para exemplo; requer lógica real baseada em domínios de cookie
  return window.location.hostname; // Simulação de que todos cookies são de primeira parte
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkCookies") {
    const cookiesInfo = getCookiesDetails();
    sendResponse({
      result: [
        `Total de cookies: ${cookiesInfo.total}`,
        `Cookies de primeira parte: ${cookiesInfo.firstParty.length}`,
        `Cookies de terceira parte: ${cookiesInfo.thirdParty.length}`,
        `Cookies de sessão: ${cookiesInfo.sessionCookies.length}`,
        `Cookies persistentes: ${cookiesInfo.persistentCookies.length}`,
      ],
    });
  } else if (message.action === "checkStorage") {
    const localStorageData = checkLocalStorage();
    const sessionStorageData = checkSessionStorage();
    sendResponse({
      result: [...localStorageData, ...sessionStorageData],
    });
}

});

function checkLocalStorage() {
  return Object.keys(localStorage).map(
    (key) => `LocalStorage - Key: ${key}, Value: ${localStorage[key]}`
  );
}

function checkSessionStorage() {
  return Object.keys(sessionStorage).map(
    (key) => `SessionStorage - Key: ${key}, Value: ${sessionStorage[key]}`
  );
}

function calculatePrivacyScore() {
  let score = 10;
  const details = [];

  const thirdPartyCookies = analyzeCookies().filter((cookie) =>
    cookie.name.includes("_ga")
  );
  if (thirdPartyCookies.length > 0) {
    score -= 2;
    details.push(`${thirdPartyCookies.length} third-party cookies detected.`);
  }

  if (window.location.protocol !== "https:") {
    score -= 2;
    details.push("Non-HTTPS site detected.");
  }

  return { score, details: details.join(", ") };
}

// Listener para mensagens do background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.action) {
      case "checkThirdPartyDomains":
        sendResponse({ result: detectThirdPartyDomains() });
        break;
      case "checkCookies":
        sendResponse({ result: analyzeCookies() });
        break;
      case "detectInjections":
        sendResponse({ result: detectMaliciousInjections() });
        break;
      case "calculatePrivacyScore":
        const { score, details } = calculatePrivacyScore();
        sendResponse({
          result: `Privacy score of the page: ${score}, Details: ${details}`,
        });
        break;
      default:
        sendResponse({ error: "Unknown action" });
    }
  } catch (error) {
    console.error("Error during message handling:", error);
    sendResponse({
      error: "Failed to process the request due to an internal error.",
    });
  }
  return true; // Assures asynchronous response handling
});
