# Detector de Ataques Web

## Descrição
O "Detector de Ataques Web" é uma extensão do Firefox desenvolvida para aumentar a segurança do usuário enquanto navega na internet. Ela oferece funcionalidades para detectar e alertar sobre potenciais ameaças de segurança, incluindo hijacking, cookies de terceiros, armazenamento de dados de maneira não segura e sincronismo de cookies.

## Funcionalidades
- **Verificar Segurança**: Analisa a página em busca de comportamentos suspeitos e potenciais vulnerabilidades.
- **Detectar Domínios de Terceiros**: Identifica e lista todos os domínios de terceiros carregados na página atual.
- **Verificar Cookies Injetados**: Conta e reporta o número de cookies encontrados durante o carregamento da página.
- **Verificar Armazenamento Local**: Examina o uso de `localStorage` e `sessionStorage` na página.
- **Detectar Sincronismo de Cookies**: Verifica se há sincronismo de cookies entre diferentes domínios, um indicativo comum de rastreamento do usuário.

## Instalação
1. Clone este repositório ou baixe os arquivos da extensão.
2. Abra o Firefox e acesse `about:debugging`.
3. Clique em "This Firefox" (ou "Este Firefox").
4. Clique em "Load Temporary Add-on" e selecione o arquivo `manifest.json` dentro da pasta da extensão baixada.
5. A extensão agora está instalada temporariamente em seu navegador e pode ser testada.

## Uso
Após a instalação, clique no ícone da extensão na barra de ferramentas do Firefox para abrir o popup. Você terá acesso aos botões que ativam cada uma das funcionalidades listadas acima. Clique em qualquer um deles para realizar a verificação correspondente.

## Contribuindo
Contribuições são sempre bem-vindas! Se você tem sugestões para melhorar esta extensão, sinta-se à vontade para abrir um issue ou enviar um pull request.

## Licença
Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes ou visite [MIT License](https://opensource.org/licenses/MIT).

## Contato
- **Desenvolvedor**: Seu Nome
- **Email**: seu.email@example.com
- **GitHub**: [SeuUsername](https://github.com/SeuUsername)
