export const TesManager = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.reportEntry = document.querySelector('.eden-c-report-entry')
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

    bindEvents() {
        this.reportEntry.addEventListener('input', (event) => {
            const input = event.target.closest('[data-to-subtotal-x], [data-to-total-x]');
            if (!input) return;

            this.updateRelatedTotals(input);
        });
    }
};