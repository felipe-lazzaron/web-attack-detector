// Listener para monitorar todas as requisições HTTP e HTTPS
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      console.log(`Carregando: ${details.url}`);
      // Aqui, você pode adicionar lógicas para analisar URLs suspeitas
    },
    { urls: ["<all_urls>"] }, // Este filtro especifica que queremos observar todas as URLs
    ["blocking"] // Opcional: Use "blocking" se você precisar modificar a requisição
  );
  
  // Listener para observar quando cookies são modificados
  browser.cookies.onChanged.addListener(changeInfo => {
      console.log(`Cookie alterado:`, changeInfo); // Loga as mudanças nos cookies
      // Aqui você pode adicionar lógicas para verificar cookies indesejados ou inseguros
  });
  
  // Uso de alarmes para ações programadas (por exemplo, verificação periódica)
  browser.alarms.create("checkWebHealth", { delayInMinutes: 1, periodInMinutes: 5 });
  browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "checkWebHealth") {
      console.log("Realizando verificação periódica de segurança e privacidade");
      // Inclua aqui as lógicas de verificação ou atualização de segurança
    }
  });
  
  // Exemplo de armazenamento e recuperação de dados usando o armazenamento local
  browser.storage.local.set({ key: "value" }).then(() => {
    console.log("Dados salvos no armazenamento local.");
  });
  
  browser.storage.local.get("key").then(result => {
    console.log("Dados recuperados:", result.key);
  });
  
  // Função para lidar com mensagens vindas de scripts de conteúdo ou da popup
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "log") {
      console.log("Mensagem recebida do script de conteúdo:", message.content);
    }
    sendResponse({ response: "Mensagem recebida" });
  });
  