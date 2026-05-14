export const TesManager = {
    activeReportId: '',
    saveTimeout: null,

    get isReportRendered () {
        return Boolean(this.activeReportId?.trim());
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.reportWorkspace = document.querySelector('.eden-c-report-workspace');
        this.totalTriggerSelector = '[data-to-subtotal-x], [data-to-total-x]';
    },

    bindEvents() {
        document.addEventListener('eden:report:rendered', ({ detail }) => {
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
    },

    updateRelatedTotals(input) {
        const subtotalXId = input.dataset.toSubtotalX;
        const subtotalXSources = document.querySelectorAll(`[data-to-subtotal-x="${subtotalXId}"]`);
        const subtotalXField = document.getElementById(subtotalXId);
        subtotalXField.value = this.calculateTotal(subtotalXSources);

        const totalXId = input.dataset.toTotalX;
        const totalXSources = document.querySelectorAll(`[data-to-total-x="${totalXId}"]`);
        const totalXField = document.getElementById(totalXId);
        totalXField.value = this.calculateTotal(totalXSources);

        const grandTotalXId = input.dataset.toGrandTotalX;
        const grandTotalXSources = document.querySelectorAll(`[data-to-grand-total-x="${grandTotalXId}"]`);
        const grandTotalXField = document.getElementById(grandTotalXId);
        grandTotalXField.value = this.calculateTotal(grandTotalXSources);

        if(input.dataset.toCol) {
            const targetId = input.dataset.toCol;
            const sources = document.querySelectorAll(`[data-to-col="${targetId}"]`);
            const targetField = document.getElementById(targetId);
            targetField.value = this.calculateTotal(sources);
        }
        if(input.dataset.toSubtotalY) {
            const targetId = input.dataset.toSubtotalY;
            const sources = document.querySelectorAll(`[data-to-subtotal-y="${targetId}"]`);
            const targetField = document.getElementById(targetId);
            targetField.value = this.calculateTotal(sources);
        }

        if(input.dataset.toTotalY) {
            const targetId = input.dataset.toTotalY;
            const sources = document.querySelectorAll(`[data-to-total-y="${targetId}"]`);
            const targetField = document.getElementById(targetId);
            targetField.value = this.calculateTotal(sources);
        }

        if(input.dataset.toGrandTotalY) {
            const targetId = input.dataset.toGrandTotalY;
            const sources = document.querySelectorAll(`[data-to-grand-total-y="${targetId}"]`);
            const targetField = document.getElementById(targetId);
            targetField.value = this.calculateTotal(sources);                     
        }
    },

    calculateTotal(inputs) {
        let total = 0;
        for (const input of inputs) {
            total += Number(input.value) || 0;
        }
        return total;
    },

    saveToLocalStorage() {
        if (!this.isReportRendered) return;

        const storageKey = `report_${this.activeReportId}`;

        const previousBackup = JSON.parse(localStorage.getItem(storageKey)) || {};
        const currentData = {};

        const inputs = this.reportWorkspace.querySelectorAll('input:read-write');
        inputs.forEach(input => {
            if (input.name) {
                currentData[input.name] = input.value;
            }
        });

        const updatedBackup = { ...previousBackup, ...currentData };
        localStorage.setItem(storageKey, JSON.stringify(updatedBackup));
        console.log(`[Backup] Dados guardados para: ${this.activeReportId}`);
    },

    loadFromStorage() {
        if (!this.isReportRendered) return;

        const storageKey = `report_${this.activeReportId}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey));
        if (savedData) {
            Object.entries(savedData).forEach(([name, value]) => {
                const input = this.reportWorkspace.querySelector(`[name="${name}"]`);
                if (input) {
                    input.value = value;

                    if(input.matches(this.totalTriggerSelector)) {
                        this.updateRelatedTotals(input);
                    }
                }
            });
            
            console.log(`[Storage] Dados recuperados com sucesso para: ${this.activeReportId}`);
        } else {
            console.log(`[Storage] Nenhum dado anterior encontrado para: ${this.activeReportId}`);
        }
    },
};