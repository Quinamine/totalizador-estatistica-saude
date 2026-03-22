import { EdenSpinner } from "./EdenSpinner.js";

export const EdenReportEntry = {
    init() {
        this.cacheElements();
    },
    
    cacheElements() {
        this.reportEntry = document.querySelector('[data-eden-js="report-entry"]');
    },
    
    async renderReport(reportId) {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 600));
        this.reportEntry.innerHTML = EdenSpinner('A carregar ficha...');
        
        try {
            const [response] = await Promise.all([
                fetch(`./reports/${reportId}.html`),
                minimumDelay
            ]);

            if(!response.ok) {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }

            const report = await response.text();
            this.reportEntry.innerHTML = report;

            return true;
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

        this.reportEntry.innerHTML = `
            <div class="eden-c-report-entry__error">
                <p class="eden-c-report-entry__error-text">${msg}</p>
                <div class="eden-c-report-entry__error-actions">${buttons}</div>
            </div>
        `;
    },

    getErrorButtons(error, reportId) {
        let buttons = '';

        if (error.status !== 404) {
            buttons += `<button class="eden-c-button eden-c-button--primary" data-eden-js="report-retryer" data-eden-report-id="${reportId}">Tentar novamente</button>`;
        }
        
        if (error.status !== 404 && error.status !== 500 && error.name !== 'TypeError') {
            const email = 'quinamine.aderitofelix@gmail.com';
            const subject = encodeURIComponent('Relatório de Erro - TES')
            const body = encodeURIComponent(
                `Olá, Quinamine!\n\n` + 
                `Ocorreu um erro ao tentar ascarregar a ficha ${reportId}.\n\n` + 
                `Detalhes do Erro: ${error.name} (${error.message}).\n` +
                `Data: ${new Date().toLocaleString('pt-PT')}`
            );
            
            buttons += `<a href="mailto:${email}?subject=${subject}&body=${body}" class="eden-c-button eden-c-button--secondary">Reportar Problema</a>`;
        }

        return buttons;
    },

}