// Função para acessar e analisar os cookies
function analyzeCookies() {
    const cookies = document.cookie; // Acessa os cookies diretamente do DOM
    if (cookies.length > 0) {
      console.log("Cookies encontrados:", cookies);
      // Aqui você pode adicionar lógicas para analisar os cookies
    }
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
  
  // Executa as funções quando o conteúdo do script é carregado
  analyzeCookies();
  analyzeLocalStorage();
  
  // Adiciona um listener para mensagens do background script
  window.addEventListener("message", (event) => {
    if (event.source == window && event.data.type && (event.data.type == "FROM_BACKGROUND")) {
      console.log("Mensagem recebida do background:", event.data);
      // Processar mais informações aqui conforme necessário
    }
  });
  
  // Envia uma mensagem para o background script se necessário
  function sendMessageToBackground(message) {
    window.postMessage({ type: "FROM_PAGE", text: message }, "*");
  }

  browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "checkThirdPartyDomains") {
        const thirdPartyDomains = detectThirdPartyDomains();
        browser.runtime.sendMessage({result: thirdPartyDomains.join(", ")});
    }
});

function detectThirdPartyDomains() {
    const host = window.location.hostname;
    const thirdParties = [];
    const requests = performance.getEntriesByType("resource");
    requests.forEach(request => {
        if (!request.name.includes(host)) {
            thirdParties.push(new URL(request.name).hostname);
        }
    });
    return [...new Set(thirdParties)]; // Remove duplicates
}

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "checkThirdPartyDomains") {
      const thirdPartyDomains = detectThirdPartyDomains();
      browser.runtime.sendMessage({result: thirdPartyDomains});
  } else if (message.action === "checkCookies") {
      const cookieCount = document.cookie.split(';').length;
      browser.runtime.sendMessage({result: [`Total de cookies injetados: ${cookieCount}`]});
  }
});

function detectThirdPartyDomains() {
  const host = window.location.hostname;
  const thirdParties = [];
  const requests = performance.getEntriesByType("resource");
  requests.forEach(request => {
      let domain = new URL(request.name).hostname;
      if (!domain.includes(host)) {
          thirdParties.push(domain);
      }
  });
  return [...new Set(thirdParties)]; // Remove duplicates and return an array of unique third-party domains
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkThirdPartyDomains") {
      const thirdPartyDomains = detectThirdPartyDomains();
      browser.runtime.sendMessage({result: thirdPartyDomains});
  } else if (message.action === "checkCookies") {
      const cookieCount = document.cookie.split(';').length;
      browser.runtime.sendMessage({result: [`Total de cookies injetados: ${cookieCount}`]});
  } else if (message.action === "checkStorage") {
      const localStorageData = checkLocalStorage();
      const sessionStorageData = checkSessionStorage();
      browser.runtime.sendMessage({result: [...localStorageData, ...sessionStorageData]});
  }
});

function checkLocalStorage() {
  return Object.keys(localStorage).map(key => `LocalStorage - Key: ${key}, Value: ${localStorage[key]}`);
}

function checkSessionStorage() {
  return Object.keys(sessionStorage).map(key => `SessionStorage - Key: ${key}, Value: ${sessionStorage[key]}`);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkCookieSync") {
      const cookieSyncInfo = detectCookieSynchronization();
      browser.runtime.sendMessage({result: cookieSyncInfo});
  }
});

function detectCookieSynchronization() {
  const cookies = document.cookie.split('; ').map(cookie => cookie.split('=')[0]);
  const uniqueCookies = new Set(cookies);
  const repeatedCookies = cookies.filter(item => {
      return cookies.indexOf(item) !== cookies.lastIndexOf(item);
  });

  return repeatedCookies.length > 0 
      ? [`Sincronismo detectado nos seguintes cookies: ${[...new Set(repeatedCookies)].join(', ')}`]
      : ['Nenhum sincronismo de cookies detectado.'];
}

// Função para detectar injeções de scripts maliciosos
const detectMaliciousInjections = () => {
  const scripts = document.querySelectorAll('script');
  const externalScripts = Array.from(scripts).filter(script => script.src && !script.src.startsWith(window.location.origin));
  return externalScripts.map(script => script.src);
};

// Listener para mensagens do background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "detectInjections") {
      const suspiciousScripts = detectMaliciousInjections();
      if (suspiciousScripts.length > 0) {
          browser.runtime.sendMessage({ result: `Suspeitas de injeção de scripts: ${suspiciousScripts.join(', ')}` });
      } else {
          browser.runtime.sendMessage({ result: 'Nenhuma injeção de script suspeita detectada.' });
      }
  }
});
