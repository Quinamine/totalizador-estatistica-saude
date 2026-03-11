import { EDEN_REPORT_ENTRY_CONFIG } from "../constants/eden-report-entry.config.js";
import { EdenSidebar } from "./EdenSidebar.js";
import { EdenSpinner } from "./EdenSpinner.js";

export const EdenReportEntry = {
    cacheElements() {
        this.sidebarNav = document.querySelector('.eden-c-sidebar__nav');
        this.reportEntry = document.querySelector('[data-eden-js="report-entry"]');
        this.headerTitle = document.querySelector('[data-eden-js="current-title"]');
    },
    
    async renderTemplate(templateId, templateName) {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 600));

        this.reportEntry.innerHTML = EdenSpinner('A carregar ficha...');
        this.headerTitle.innerHTML = templateName;
        try {
            const [response] = await Promise.all([
                fetch(`./templates/${templateId}.html`),
                minimumDelay
            ]);

            if(!response.ok) {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }

            const templateData = await response.text();
            this.reportEntry.innerHTML = templateData;
            this.headerTitle.innerHTML = templateName;

            window.dispatchEvent(new CustomEvent('report-inject'));

        } catch (error) {
            console.log(error.message);
            this.renderError(error, templateId);

            window.dispatchEvent(new CustomEvent('report-clear'));
        }
    },

    renderError(error, templateId) {
        const messages = {
            '404': 'Esta ficha ainda não está disponível no novo portal.',
            '500': 'O servidor de dados está instável no momento.',
            'TypeError': 'Falha na ligação. Verifique sua internet.',
            'default': 'Ocorreu um comportamento inesperado ao carregar a ficha.'
        }

        const msgKey = error.status?.toString() || error.name;
        const msg = messages[msgKey] || messages.default;
        const buttons = this.getErrorButtons(error, templateId);

        this.reportEntry.innerHTML = `
            <div class="eden-c-report-entry__error">
                <p class="eden-c-report-entry__error-text">${msg}</p>
                <div class="eden-c-report-entry__error-actions">${buttons}</div>
            </div>
        `;
    },

    getErrorButtons(error, templateId) {
        let buttons = '';

        if (error.status !== 404) {
            buttons += `<button class="eden-c-button eden-c-button--primary" data-eden-js="btn-retry" data-eden-template-id="${templateId}">Tentar novamente</button>`;
        }
        
        if (error.status !== 404 && error.status !== 500 && error.name !== 'TypeError') {
            const email = 'quinamine.aderitofelix@gmail.com';
            const subject = encodeURIComponent('Relatório de Erro - TES')
            const body = encodeURIComponent(
                `Olá, Quinamine!\n\n` + 
                `Ocorreu um erro ao tentar carregar a ficha ${templateId}.\n\n` + 
                `Detalhes do Erro: ${error.name} (${error.message}).\n` +
                `Data: ${new Date().toLocaleString('pt-PT')}`
            );
            
            buttons += `<a href="mailto:${email}?subject=${subject}&body=${body}" class="eden-c-button eden-c-button--secondary">Reportar Problema</a>`;
        }

        return buttons;
    },

    getTemplateName(templateId) {
        let templateName;
        for (const item of EDEN_REPORT_ENTRY_CONFIG) {
            if(item.id === templateId) {
                templateName = item.name;
            }
        }

        return templateName;
    },

    bindEvents() {
        this.sidebarNav.addEventListener('click', event => {
            const templateRender= event.target.closest('[data-eden-js="template-render"]');
            if(templateRender) {
                (window.matchMedia('(max-width: 1023px)').matches) && EdenSidebar.close();

                const templateId = templateRender.dataset.edenTemplateId;
                let templateName = this.getTemplateName(templateId);
                
                this.renderTemplate(templateId, templateName);
            }
        });

        this.reportEntry.addEventListener('click', event => {
            const retryBtn = event.target.closest('[data-eden-js="btn-retry"]');
            if(retryBtn) {
                const templateId = retryBtn.dataset.edenTemplateId;
                let templateName = this.getTemplateName(templateId);
                this.renderTemplate(templateId, templateName);
            }
        });
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    }
}