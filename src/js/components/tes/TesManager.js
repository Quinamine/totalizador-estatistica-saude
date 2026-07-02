import { EdenDialog } from './../eden/EdenDialog';
import { EdenToast } from "./../eden/EdenToast.js";
import { EdenSpinner } from "./../eden/EdenSpinner.js";

export const TesManager = {
    activeReportId: '',
    saveTimeout: null,
    totalTriggerSelector: '[data-to-subtotal-x], [data-to-total-x]',

    get readWriteFields() {
        return Array.from(this.reportFields || []).filter(field => !field.readOnly);
    },

    get triggerFields() {
        return Array.from(this.reportFields || []).filter(field =>
            field.matches(this.totalTriggerSelector)
        );
    },

    get isReportEmpty() {
        return this.readWriteFields.every(field => field.value.trim() === '' && this.pNotes.innerText === '');
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.reportWorkspace = document.querySelector('.eden-c-report-workspace');
    },

    bindEvents() {
        document.addEventListener('eden:report:rendered', ({ detail }) => {
            this.reportFields = this.reportWorkspace.querySelectorAll('input');
            this.pNotes = this.reportWorkspace.querySelector('[data-eden-js="report-notes"]');
            this.activeReportId = detail.id;
            this.loadFromStorage();
        });

        this.reportWorkspace.addEventListener('input', (e) => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveToLocalStorage();
            }, 500);

            const totalTrigger = e.target.closest(this.totalTriggerSelector);
            if (!totalTrigger) return;

            this.updateRelatedTotals(totalTrigger);
        });

        document.addEventListener('eden:trigger:report-clear-request', () => {
            if (this.isReportEmpty) {
                EdenToast.render({
                    message: `Não há alterações para limpar na ficha actual.`,
                    type: 'info'
                });

                return;
            }

            EdenDialog.init({
                title: 'Limpar',
                content: 'Limpar os dados desta ficha? Esta acção é irreversível.',
                confirmText: 'Limpar',
                isDanger: true,
                eventFeedback: {
                    subject: 'report',
                    nature: 'clear-confirmed'
                }
            });
        });

        document.addEventListener('eden:report:clear-confirmed', () => {
            this.clear();
            EdenToast.render({
                message: `Campos de inserção limpos com sucesso.`,
                type: 'success'
            });
        });

        document.addEventListener('eden:trigger:report-auto-zero-request', () => {
            this.fillEmptyWithZeros();
        });

        document.addEventListener('eden:trigger:report-print-request', () => {
            this.print();
        });

        document.addEventListener('eden:trigger:report-share-request', () => {
            this.share();
        });

        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'p')) {
                e.preventDefault();

                const isReportRendered = this.reportWorkspace.querySelector('[data-eden-js="tes-report"]');
                if (isReportRendered) {
                    this.print();
                } else {
                    EdenToast.render({
                        message: `Nenhuma ficha aberta. Selecione uma ficha para imprimir.`,
                        type: 'warning'
                    });
                }
            }
        })
    },

    updateRelatedTotals(field) {
        const targets = [
            { key: 'toSubtotalX', selector: 'data-to-subtotal-x' },
            { key: 'toTotalX', selector: 'data-to-total-x' },
            { key: 'toGrandTotalX', selector: 'data-to-grand-total-x' },
            { key: 'toCol', selector: 'data-to-col' },
            { key: 'toSubtotalY', selector: 'data-to-subtotal-y' },
            { key: 'toTotalY', selector: 'data-to-total-y' },
            { key: 'toGrandTotalY', selector: 'data-to-grand-total-y' },
        ];

        targets.forEach(({ key, selector }) => {
            const targetId = field.dataset[key];
            if (targetId) {
                const sources = document.querySelectorAll(`[${selector}="${targetId}"]`);
                const targetField = document.getElementById(targetId);
                if (targetField) {
                    targetField.value = this.calculateTotal(sources);
                }
            }
        });
    },

    calculateTotal(fields) {
        let total = 0;
        for (const field of fields) {
            total += Number(field.value) || 0;
        }
        return total;
    },

    getReportData() {
        const data = {};

        this.readWriteFields.forEach(field => {
            if (field.value.trim() !== '' && field.name) {
                data[field.name] = field.value;
            }
        });

        data[this.pNotes.id] = this.pNotes.innerText;
        return data;
    },

    saveToLocalStorage() {
        const storageKey = `report_${this.activeReportId}`;

        const previousBackup = JSON.parse(localStorage.getItem(storageKey)) || {};
        const currentData = this.getReportData();
        const updatedBackup = { ...previousBackup, ...currentData };

        localStorage.setItem(storageKey, JSON.stringify(updatedBackup));

        console.log(`[Backup] Dados guardados para: ${this.activeReportId}`);
    },

    loadFromStorage() {
        const storageKey = `report_${this.activeReportId}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey));
        if (savedData) {
            Object.entries(savedData).forEach(([name, value]) => {
                const field = this.reportWorkspace.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;

                    if (field.matches(this.totalTriggerSelector)) {
                        this.updateRelatedTotals(field);
                    }
                }

                if (name === this.pNotes.id) {
                    this.pNotes.innerText = value;
                }
            });

            console.log(`[Storage] Dados recuperados com sucesso para: ${this.activeReportId}`);
        } else {
            console.log(`[Storage] Nenhum dado anterior encontrado para: ${this.activeReportId}`);
        }
    },

    clear() {
        this.reportFields.forEach(field => {
            if (field.readOnly) {
                field.value = 0;
                return;
            }

            field.value = '';
        });

        this.pNotes.innerText = '';

        localStorage.removeItem(`report_${this.activeReportId}`);
    },

    fillEmptyWithZeros() {
        let count = 0;
        this.triggerFields.forEach(field => {
            if (field.value.trim() === "") {
                field.value = "0";
                count++;
            }
        });

        if (count > 0) {
            this.saveToLocalStorage();

            EdenToast.render({
                message: `${count} células vazias preenchidas com 0.`,
                type: 'success'
            });
        } else {
            EdenToast.render({
                message: `Nenhuma célula vazia encontrada.`,
                type: 'info'
            });
        }
    },

    print() {
        // Update print date
        const now = new Date();

        const date = now.toLocaleDateString('pt-MZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const hour = now.toLocaleTimeString('pt-MZ', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const existingPageFooter = document.querySelector('.eden-c-page-footer');
        if (existingPageFooter) {
            existingPageFooter.remove();
        }

        const pageFooter = document.createElement('div');
        pageFooter.classList.add('eden-c-page-footer');
        pageFooter.innerHTML = `<span class="eden-c-page-footer__date">${date} ${hour}</span>
                                <span>Totalizado via: <a href="https://quinamine.github.io/totalizador-estatistica-saude">quinamine.github.io/totalizador-estatistica-saude</a> - v2.0</span>`

        this.reportWorkspace.appendChild(pageFooter);
        const footerHeight = pageFooter.offsetHeight;
        document.documentElement.style.setProperty('--eden-sys-page-footer-height', `${footerHeight}px`);

        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            const spinnerHTML = EdenSpinner('Gerando PDF...');
            document.body.insertAdjacentHTML('beforeEnd', spinnerHTML);

            const spinnerElement = document.body.lastElementChild;
            spinnerElement.classList.add('eden-c-spinner--fixed');

            setTimeout(() => {
                try { window.print(); }
                finally { spinnerElement.remove(); }
            }, 250);

            return;
        }

        setTimeout(() => {
            window.print();
            pageFooter.remove();
        }, 150);
    },

    async share() {

        const shareData = {
            title: 'TES - Totalizador de Estatística de Saúde',
            text: 'Olá, colega(s)! Encontrei este sistema que ajuda a totalizar os resumos mensais/trimestrais das US. É muito útil para as Consultas, PNCT, ITS/HIV, Nutrição e Farmácia. Vale a pena conferir:',
            url: 'https://quinamine.github.io/totalizador-estatistica-saude/'
        };

        const fullText = `${shareData.text} ${shareData.url}`;

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log("Partilha nativa falhou ou foi cancelada. Usando fallback...");
            }
        }

        try {
            await navigator.clipboard.writeText(fullText);

            EdenToast.render({
                message: `Link copiado. Partilhe com os colegas.`,
                type: 'success'
            });
        } catch (clipboardErr) {
            console.error("Erro ao copiar:", clipboardErr);
        }
    }
}