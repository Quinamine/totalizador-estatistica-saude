import { EdenSpinner } from "./EdenSpinner.js";
import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenReportWorkspace = {
    ...EdenMessenger,
    
    init() {
        this.cacheElements();
        this.bindEvents();
    },
    
    cacheElements() {
        this.container = document.querySelector('[data-eden-js="report-workspace"]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:report-render-request', ({ detail }) => {
            const { id } = detail;
            this.renderReport(id);
        });
    },
    
    async renderReport(reportId) {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 600));
        this.container.innerHTML = EdenSpinner('A carregar ficha...');
        
        try {
            const [response] = await Promise.all([
                fetch(`./pages/tes/${reportId}.html`),
                minimumDelay
            ]);

            if(!response.ok) {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }

            const report = await response.text();
            this.container.innerHTML = report;

            this.notify('report','rendered', { id: reportId });

        } catch (error) {
            console.log(error.message);
            this.renderError(error, reportId);

            return false;
        }
    },

    renderError(error, reportId) {
        const messages = {
            '404': 'Esta ficha ainda não está disponível no novo portal.',
            '500': 'O servidor de dados está instável no momento.',
            'TypeError': 'Falha na ligação. Verifique sua internet.',
            'default': 'Ocorreu um comportamento inesperado ao carregar a ficha.'
        }

        const msgKey = error.status?.toString() || error.name;
        const msg = messages[msgKey] || messages.default;
        const buttons = this.getErrorButtons(error, reportId);

        this.container.innerHTML = `
            <div class="eden-c-report-workspace__error">
                <p class="eden-c-report-workspace__error-text">${msg}</p>
                <div class="eden-c-report-workspace__error-actions">${buttons}</div>
            </div>
        `;
    },

    getErrorButtons(error, reportId) {
        let buttons = '';

        if (error.status !== 404) {
            buttons += `<button class="eden-c-button eden-c-button--primary" data-eden-action="report:render" data-eden-report-id="${reportId}">Tentar novamente</button>`;
        }
        
        if (error.status !== 404 && error.status !== 500 && error.name !== 'TypeError') {
            const email = 'quinamine.aderitofelix@gmail.com';
            const subject = encodeURIComponent('Relatório de Erro - TES')
            const body = encodeURIComponent(
                `Olá, Quinamine!\n\n` + 
                `Ocorreu um erro ao tentar carregar a ficha ${reportId}.\n\n` + 
                `Detalhes do Erro: ${error.name} (${error.message}).\n` +
                `Data: ${new Date().toLocaleString('pt-PT')}`
            );
            
            buttons += `<a href="mailto:${email}?subject=${subject}&body=${body}" class="eden-c-button eden-c-button--secondary">Reportar Problema</a>`;
        }

        return buttons;
    },

}