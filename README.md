# TES - Totalizador de Estatística de Saúde

Este projeto consiste numa plataforma modular desenhada para centralizar **28 ferramentas independentes de cálculo e totalização de resumos mensais e trimestrais**, cujas lógicas e estruturas são baseadas nas fichas oficiais do Sistema Nacional de Saúde de Moçambique.

## 🚀 Diferenciais Técnicos

- **Arquitetura Shell & Core:** O portal funciona como um hospedeiro que gere o carregamento dinâmico de módulos autónomos, garantindo que a lógica de uma ficha (ex: Malária) não interfira noutra (ex: HIV).

- **Design Adaptativo Dinâmico:** Interface optimizada para uso no mobile com barra de acções inferior, e uso no desktop com barra de ferramentas superior.

- **Precisão de Dados:** Ajuda a evitar falhas de cálculo dos totais.

- **CSS Moderno:** Estilização baseada em tokens com suporte a `OKLCH` e fallback para navegadores legados.

## 🛠️ Stack Tecnológica

- **Linguagem:** HTML5 e Vanilla JavaScript (ES6+).
- **Estilização:** SASS (Arquitetura Modular).
- **Cores:** Sistema de cores OKLCH com Progressive Enhancement.
- **Workflow:** Git com padrão de Conventional Commits.

## 📈 Status do Projeto

Este repositório está em desenvolvimento activo. 
- [ ] **Fase 1:** Implementação do App Shell (Header, Navegação e Action Bar).
- [ ] **Fase 2:** Desenvolvimento da lógica de injecção de módulos.
- [ ] **Fase 3:** Implementação individual dos 28 totalizadores.

Atualmente a implementar a **Issue #1**: Estrutura global (App Shell), Header e Action Bar.


