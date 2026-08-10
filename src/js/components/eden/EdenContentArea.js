import { EdenSpinner } from "./EdenSpinner.js";
import { EdenMessenger } from "../../utils/EdenMessenger.js";
import { EDEN_PAGES} from "../../constants/eden-pages.config.js";

export const EdenContentArea = {
    ...EdenMessenger,
    
    init() {
        this.cacheElements();
        this.bindEvents();
    },
    
    cacheElements() {
        this.container = document.querySelector('[data-eden-js="content-area"]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:page-render-request', ({ detail }) => {
            const { id } = detail;
            this.renderPage(id);
        });

        window.addEventListener('load', () => {
            const url = new URL(window.location.href);
            const pageId = url.searchParams.get("page");
            if(!pageId) return;         

            const page = EDEN_PAGES.find(item => item.id === pageId);;
            if(page) {
                document.title = `${page.name} | TES - Totalizador de Estatística de Saúde`;
                this.renderPage(pageId);
            }
        });
    },
    
    async renderPage(pageId) {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 600));
        this.container.innerHTML = EdenSpinner('A carregar ficha...');
        
        try {
            const [response] = await Promise.all([
                fetch(`./pages/tes/${pageId}.html`),
                minimumDelay
            ]);

            if(!response.ok) {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }

            const page = await response.text();
            this.container.innerHTML = page;

            this.notify('page','rendered', { id: pageId });

        } catch (error) {
            console.log(error.message);
            this.renderError(error, pageId);

            return false;
        }
    },

    renderError(error, pageId) {
        const messages = {
            '404': 'Esta ficha ainda não está disponível no novo portal.',
            '500': 'O servidor de dados está instável no momento.',
            'TypeError': 'Falha na ligação. Verifique sua internet.',
            'default': 'Ocorreu um comportamento inesperado ao carregar a ficha.'
        }

        const msgKey = error.status?.toString() || error.name;
        const msg = messages[msgKey] || messages.default;
        const buttons = this.getErrorButtons(error, pageId);

        this.container.innerHTML = `
            <div class="eden-c-content-area__error">
                <p class="eden-c-content-area__error-text">${msg}</p>
                <div class="eden-c-content-area__error-actions">${buttons}</div>
            </div>
        `;
    },

    getErrorButtons(error, pageId) {
        let buttons = '';

        if (error.status !== 404) {
            buttons += `<button class="eden-c-button eden-c-button--primary" data-eden-action="page:render" data-eden-page-id="${pageId}">Tentar novamente</button>`;
        }
        
        if (error.status !== 404 && error.status !== 500 && error.name !== 'TypeError') {
            const email = 'quinamine.aderitofelix@gmail.com';
            const subject = encodeURIComponent('Relatório de Erro - TES')
            const body = encodeURIComponent(
                `Olá, Quinamine!\n\n` + 
                `Ocorreu um erro ao tentar carregar a ficha ${pageId}.\n\n` + 
                `Detalhes do Erro: ${error.name} (${error.message}).\n` +
                `Data: ${new Date().toLocaleString('pt-PT')}`
            );
            
            buttons += `<a href="mailto:${email}?subject=${subject}&body=${body}" class="eden-c-button eden-c-button--secondary">Reportar Problema</a>`;
        }

        return buttons;
    },

}