import { EdenDialog } from './../eden/EdenDialog.js';
import { EdenToast } from "./../eden/EdenToast.js";
import { EdenSpinner } from "./../eden/EdenSpinner.js";
import { EDEN_PAGES_WITHOUT_TOOLBAR } from '../../constants/eden-pages-without-toolbar.config.js';
import { EdenStringFormatter } from "./../eden/EdenStringFormatter.js";

export const TesManager = {
    activeReportId: '',
    saveTimeout: null,
    totalTriggerSelector: '[data-eden-group]',

    get readWriteFields() {
        return Array.from(this.reportFields || []).filter(field => !field.readOnly);
    },

    get triggerFields() {
        return Array.from(this.reportFields || []).filter(field =>
            field.matches(this.totalTriggerSelector)
        );
    },

    get isReportEmpty() {
        const areFieldsEmpty = this.readWriteFields.every(field => field.value.trim() === '');

        const areNotesEmpty = this.pNotes ? this.pNotes.innerText.trim() === '' : true;

        return areFieldsEmpty && areNotesEmpty;
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.contentArea = document.querySelector('[data-eden-js="content-area"]');
    },

    refreshFields() {
        if (!this.contentArea) return;
        this.reportFields = this.contentArea.querySelectorAll('input');
        this.pNotes = this.contentArea.querySelector('[data-eden-js="report-notes"]');
    },

    bindEvents() {
        document.addEventListener('eden:page:rendered', ({ detail }) => {
            this.activeReportId = detail.id;

            document.body.classList.remove('has-eden-balancete-active');

            if (EDEN_PAGES_WITHOUT_TOOLBAR.includes(this.activeReportId)) return;

            this.refreshFields();
            this.loadFromStorage();
        });

        document.addEventListener('eden:balancete:rendered', () => {
            this.refreshFields();
            this.loadFromStorage();

            document.body.classList.add('has-eden-balancete-active');
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

                const isReportRendered = this.contentArea.querySelector('[data-eden-js="tes-report"]');
                if (isReportRendered) {
                    this.print();
                } else {
                    EdenToast.render({
                        message: `Nenhuma ficha aberta. Selecione uma ficha para imprimir.`,
                        type: 'warning'
                    });
                }
            }
        });

        document.addEventListener('eden:trigger:report-filter-request', () => {
            this.showFilterBox();
        })

        this.contentArea.addEventListener('change', (e) => {
            if (e.target.name === 'requisition-type') {
                this.radioCheckboxes(e.target, 'input[name="requisition-type"]');
            }

            if (e.target.name === 'document-copy') {
                this.radioCheckboxes(e.target, 'input[name="document-copy"]');

                const reportPage = this.contentArea.querySelector('[data-eden-js="tes-report"]');
                if (!reportPage) return;

                reportPage.classList.remove('tes-balancete--duplicate', 'tes-balancete--triplicate');

                if (e.target.dataset?.edenCopy === 'duplicate') {
                    reportPage.classList.add('tes-balancete--duplicate');
                } else if (e.target.dataset?.edenCopy === 'triplicate') {
                    reportPage.classList.add('tes-balancete--triplicate');
                }
            }

            this.saveToLocalStorage();
        });

        this.contentArea.addEventListener('input', (e) => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveToLocalStorage();
            }, 500);

            const totalTrigger = e.target.closest(this.totalTriggerSelector);
            if (!totalTrigger) return;

            this.updateRelatedTotals(totalTrigger);
        });
    },

    updateRelatedTotals(field) {
        const sourceIds = field.dataset?.edenGroup.split(' ').map(id => id.trim());
        const currentRow = field.closest('tr');
        let verticalFormat = /^(sec|s)\d+-c\d+$/i;

        sourceIds.forEach(id => {
            let context = verticalFormat.test(id)
                ? document
                : currentRow || document;

            const sources = context.querySelectorAll(`[data-eden-group~="${id}"]`);
            const totalField = context.querySelector(`[data-eden-total="${id}"]`);

            if (totalField) {
                totalField.value = this.calculateTotal(sources);

                if (totalField.dataset.edenEndingBalance) {
                    const [initialId, additionsId, deductionsId] = totalField.dataset.edenEndingBalance.split(' ');

                    const initialField = document.getElementById(initialId);
                    const additionsField = document.getElementById(additionsId);
                    const deductionsField = document.getElementById(deductionsId);

                    totalField.value = this.calculateEndingBalance(
                        initialField?.value || 0,
                        additionsField?.value || 0,
                        deductionsField?.value || 0
                    );
                }

                if (totalField.dataset.edenDifference) {
                    const [actualId, theoreticalId] = totalField.dataset.edenDifference.split(' ');

                    const actualField = document.getElementById(actualId);
                    const theoreticalField = document.getElementById(theoreticalId);

                    totalField.value = this.calculateDifference(
                        actualField?.value || 0,
                        theoreticalField?.value || 0
                    );
                }

                if (totalField.dataset.edenQuantityToRequisition) {
                    const [totalIssuesId, physicalStockId] = totalField.dataset.edenQuantityToRequisition.split(' ');
                    const totalIssuesField = document.getElementById(totalIssuesId);
                    const physicalStockField = document.getElementById(physicalStockId);

                    const quantityToRequisition = (Number(totalIssuesField?.value || 0) * 2) - Number(physicalStockField?.value || 0);
                    totalField.value = quantityToRequisition < 0 ? 0 : quantityToRequisition;
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

    calculateEndingBalance(initial, additions, deductions) {
        return Number(initial) + Number(additions) - Number(deductions);
    },

    calculateDifference(actual, theoretical) {
        return Number(actual) - Number(theoretical);
    },

    radioCheckboxes(currentCheckbox, checkboxesSelector) {
        if (!currentCheckbox.checked) return;

        const checkboxes = this.contentArea.querySelectorAll(checkboxesSelector);
        checkboxes.forEach(cb => {
            if (cb !== currentCheckbox) cb.checked = false;
        });
    },

    getReportData() {
        const data = {};

        this.readWriteFields.forEach(field => {
            if (field.value.trim() !== '' && field.name) {
                data[field.name] = field.value;
            }
        });

        if (this.pNotes) {
            data[this.pNotes.id] = this.pNotes.innerText;
        }
        return data;
    },

    saveToLocalStorage() {
        const storageKey = `report_${this.activeReportId}`;

        const previousBackup = JSON.parse(localStorage.getItem(storageKey)) || {};
        const currentData = this.getReportData();
        const updatedBackup = { ...previousBackup, ...currentData };

        localStorage.setItem(storageKey, JSON.stringify(updatedBackup));
    },

    loadFromStorage() {
        const storageKey = `report_${this.activeReportId}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey));
        if (savedData) {
            Object.entries(savedData).forEach(([name, value]) => {
                const field = this.contentArea.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;

                    if (field.matches(this.totalTriggerSelector)) {
                        this.updateRelatedTotals(field);
                    }
                }

                if (this.pNotes && name === this.pNotes.id) {
                    this.pNotes.innerText = value;
                }
            });
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

        this.pNotes && (this.pNotes.innerText = '');

        localStorage.removeItem(`report_${this.activeReportId}`);
    },

    fillEmptyWithZeros() {
        const emptyCells = this.contentArea.querySelectorAll('tbody input:not([readonly])');

        let count = 0;
        emptyCells.forEach(field => {
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

    hideEmptyRowsForPrint() {
        const rows = this.contentArea.querySelectorAll('[data-eden-js="balancete-tbody"] tr');

        rows.forEach(row => {
            const medicineInput = row.querySelector('input[name$="-c2"]');
            const hasMedicineName = medicineInput && medicineInput.value.trim() !== "";

            const movementInputs = row.querySelectorAll(`input:not([readonly], input[name$="-c1"])`);

            let hasActivityOrBalance = false;
            movementInputs.forEach(input => {
                const rawValue = input.value.trim();
                const parsedNumber = parseFloat(rawValue);
                if (rawValue !== "" && !isNaN(parsedNumber) && parsedNumber !== 0) {
                    hasActivityOrBalance = true;
                }
            });

            if (!hasMedicineName && !hasActivityOrBalance) {
                row.classList.add('eden-u-print-none');
            } else {
                row.classList.remove('eden-u-print-none');
            }
        });
    },

    print() {
        this.hideEmptyRowsForPrint();

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

        const isMultiPage = document.querySelector('[data-eden-js="tes-report"]')?.classList.contains('eden-c-page--has-pagination');
        if (isMultiPage) {
            pageFooter.classList.add('eden-c-page-footer--fixed');
        }

        const notTotalizableForms = ['pnct-01a'];
        const isNotTotalizable = notTotalizableForms.includes(this.activeReportId);

        const systemSignature = isNotTotalizable
            ? 'Impresso via Totalizador de Estatística de Saúde'
            : 'Totalizado via';

        pageFooter.innerHTML = `<span class="eden-c-page-footer__date">${date} ${hour}</span>
                            <span>${systemSignature}: <a href="https://quinamine.github.io/totalizador-estatistica-saude">quinamine.github.io/totalizador-estatistica-saude</a> - v2.0</span>`;

        this.contentArea.appendChild(pageFooter);

        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            const spinnerHTML = EdenSpinner('Gerando PDF...');
            document.body.insertAdjacentHTML('beforeEnd', spinnerHTML);

            const spinnerElement = document.body.lastElementChild;
            spinnerElement.classList.add('eden-c-spinner--fixed');

            setTimeout(() => {
                try {
                    window.print();
                } finally {
                    spinnerElement.remove();
                    pageFooter.remove();
                }
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
    },

    showFilterBox() {
        let filterContainer = document.body.querySelector('.eden-c-filter');

        if (filterContainer) {
            filterContainer.classList.add('eden-c-filter--pulse');
            const searchInput = document.getElementById('input-medicine-search');
            searchInput?.focus();

            setTimeout(() => {
                filterContainer.classList.remove('eden-c-filter--pulse');
            }, 400);

            return;
        }

        filterContainer = document.createElement('div');
        filterContainer.classList.add('eden-c-filter', 'eden-u-print-none');

        filterContainer.innerHTML = `
            <div class="eden-c-filter__header">
                <span class="eden-c-filter__title">Filtrar medicamento</span>
                <button id="btn-close-filter" 
                        class="eden-c-button eden-c-filter__close" 
                        title="Fechar filtro">
                            &times;
                </button>
            </div>
            <div class="eden-c-filter-body">
                <input type="text" 
                        id="input-medicine-search" 
                        class="eden-c-filter__field" 
                        placeholder="Digite o nome do medicamento..."
                        autocomplete="off">
            </div>`;


        document.body.append(filterContainer);

        const searchInput = document.getElementById('input-medicine-search');
        if (!searchInput) return;

        searchInput.focus();

        const closeBtn = document.getElementById('btn-close-filter');
        closeBtn?.addEventListener('click', () => {
            filterContainer.remove();
            this.filterMedicine('');
        });

        searchInput.addEventListener('input', (e) => {
            this.filterMedicine(e.target.value);
        });
    },

    filterMedicine(query) {
        if (!this.contentArea) return;
        const tbody = this.contentArea.querySelector('[data-eden-js="balancete-tbody"]');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr:not(.tes-balancete__no-results)');
        const cleanQuery = EdenStringFormatter.clean(query);

        tbody.querySelector('.tes-balancete__no-results')?.remove();

        let totalMatches = 0;

        rows.forEach(row => {
            const medicineField = row.querySelector('[data-eden-js="balancete-medicine"]');
            if (!medicineField) return;

            const medicineName = EdenStringFormatter.clean(medicineField.value);

            if (medicineName.includes(cleanQuery)) {
                row.classList.remove('tes-balancete__row--hidden');
                totalMatches++;
            } else {
                row.classList.add('tes-balancete__row--hidden');
            }
        });

        if (totalMatches === 0 && cleanQuery !== '') {
            const noResultsRow = document.createElement('tr');
            noResultsRow.classList.add('tes-balancete__no-results');

            noResultsRow.innerHTML = `
                <td colspan="100%" style="text-align: center; padding: var(--eden-sys-space-400); color: var(--eden-sys-surface-content-200); font-style: italic;">
                    Nenhum medicamento encontrado para "${query}".
                </td>
            `;
            tbody.appendChild(noResultsRow);
        }
    }

};

