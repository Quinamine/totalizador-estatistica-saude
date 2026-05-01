export const TesManager = {
    activeReportId: '',
    saveTimeout: null,

    init() {
        this.cacheElements();
        this.bindEvents();

        document.addEventListener('reportInjected', (event) => {
            this.activeReportId = event.detail.id;
            this.loadFromStorage();
        });
    },

    cacheElements() {
        this.reportEntry = document.querySelector('.eden-c-report-entry');
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
        if (!this.activeReportId) return;

        const storageKey = `report_${this.activeReportId}`;

        const previousBackup = JSON.parse(localStorage.getItem(storageKey)) || {};
        const currentData = {};

        const inputs = this.reportEntry.querySelectorAll('input');
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
        if (!this.activeReportId) return;

        const storageKey = `report_${this.activeReportId}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey));
        if (savedData) {
            Object.entries(savedData).forEach(([name, value]) => {
                const input = this.reportEntry.querySelector(`[name="${name}"]`);
                if (input) {
                    input.value = value;
                }
            });
            
            console.log(`[Storage] Dados recuperados com sucesso para: ${this.activeReportId}`);
        } else {
            console.log(`[Storage] Nenhum dado anterior encontrado para: ${this.activeReportId}`);
        }
    },

    bindEvents() {
        this.reportEntry.addEventListener('input', (event) => {

            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveToLocalStorage();
            }, 500);


            const tableInput = event.target.closest('[data-to-subtotal-x], [data-to-total-x]');
            if (!tableInput) return;

            this.updateRelatedTotals(tableInput);
        });
    }
};