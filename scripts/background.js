// Inicializa variáveis e constantes
let prevCookieDomains = []; // Armazena domínios de cookies previamente detectados
const trustedDomains = ['google.com', 'preparo.com.br', 'insper.edu.br']; // Lista de domínios confiáveis

// Listener para monitorar todas as requisições HTTP e HTTPS
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const domain = url.hostname;
    if (!trustedDomains.includes(domain)) {
      console.log(`Conexão não confiável detectada: ${domain}`);
    }
  },
  { urls: ["<all_urls>"] }
);

// Listener para observar e analisar mudanças nos cookies
browser.cookies.onChanged.addListener((changeInfo) => {
  if (!changeInfo.removed && changeInfo.cookie) {
    const cookieDomain = changeInfo.cookie.domain;
    console.log(`Cookie modificado: ${cookieDomain}`, changeInfo);

    if (prevCookieDomains.includes(cookieDomain)) {
      console.log(`Sincronismo de cookie detectado: ${cookieDomain}`);
    } else {
      prevCookieDomains.push(cookieDomain);
    }
  }
});

// Listener para mensagens do popup
browser.alarms.create("myAlarm", { delayInMinutes: 1, periodInMinutes: 1 });

browser.alarms.onAlarm.addListener(alarm => {
  console.log(`Alarm ${alarm.name} triggered`);
});

//para fazer o popup aparecer, é necessário enviar uma mensagem para o background
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "check") {
    console.log("Verificação solicitada pelo popup");
    sendResponse({ result: "10 ameaças detectadas" });
  }
});

// Alarmes para ações programadas
browser.alarms.create("checkWebHealth", { delayInMinutes: 1, periodInMinutes: 5 });
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkWebHealth") {
    console.log("Realizando verificação periódica de segurança e privacidade");
  }
});

// Funções de armazenamento local
function saveData() {
  browser.storage.local.set({ key: "value" }).then(() => {
    console.log("Dados salvos no armazenamento local.");
  });
}

function loadData() {
  browser.storage.local.get("key").then((result) => {
    console.log("Dados recuperados:", result.key);
  });
}

saveData();
loadData();

// Comunicação com scripts de conteúdo
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "log") {
    console.log("Mensagem recebida:", message.content);
  }
  sendResponse({ response: "Mensagem recebida" });
});