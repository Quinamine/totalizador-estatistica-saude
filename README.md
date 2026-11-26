# TES - Totalizador de Estatística de Saúde

Plataforma web modular desenhada para centralizar ferramentas de cálculo e totalização de resumos estatísticos (mensais e trimestrais), estruturadas a partir das fichas oficiais do Sistema Nacional de Saúde de Moçambique.

## 🚀 Arquitetura e Diferenciais Técnicos

- **App Shell e Carregamento Dinâmico:** Funciona como um hospedeiro que carrega módulos de forma dinâmica por rota (`?page=`), isolando a lógica e o estado de cada ficha para evitar interferências entre módulos.
- **Funcionamento Offline e Persistência Local:** Concebido para operar no navegador com persistência local de dados (`localStorage`), apoiando o trabalho em contextos com conectividade limitada ou intermitente.
- **Design Adaptativo e Impressão:** Interface pensada para uso móvel e desktop, com suporte a layouts de impressão configurados para as fichas.
- **CSS Moderno e Modular:** Estilização baseada em tokens e arquitetura SASS modular, com uso de `OKLCH` e *fallback* para navegadores legados.

## 🛠️ Stack Tecnológica

- **Marcação e Estrutura:** HTML5 semântico.
- **Lógica:** Vanilla JavaScript (ES6 Modules).
- **Estilização:** SASS modular.
- **Controle de Versão:** Git com padrão de Conventional Commits.

