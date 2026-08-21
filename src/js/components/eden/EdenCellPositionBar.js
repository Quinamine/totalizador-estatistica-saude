export const EdenCellPositionBar = {
    displayElClasses: {
        base: 'eden-c-cell-position-bar__label',
        rowCategoryLabel: '--row-category',
        rowLabel: '--row',
        colLabel: '--col',
        complementaryLabel: '--complementary'
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.container = document.querySelector('[data-eden-js="cell-position-bar"]');
        this.contentArea = document.querySelector('[data-eden-js="content-area"]');
    },

    bindEvents() {
        if (!this.contentArea) return;

        this.contentArea.addEventListener('focusin', (e) => {
            const isInput = e.target.closest('input:not([readonly])');
            const tableCell = e.target.closest('td');

            if (!isInput || !tableCell) return;

            this.updateTableLocator(e.target);
        });

        this.contentArea.addEventListener('focusout', () => this.clearLabels());
    },

    getCellCoordinates(field) {
        const tr = field.closest('tr');
        const table = field.closest('table');

        if (!tr || !table) return { rowCategoryLabel: null, rowLabel: null, colLabel: null, complementaryLabel: null };

        const isBalanceteRequisition = table.dataset.edenIsRequisition === 'true';

        const rowLabelColIndex = tr.dataset.edenRowLabelColIndex ?? table.dataset.edenRowLabelColIndex;
        let rowLabel = tr.children[rowLabelColIndex] || null;

        if (isBalanceteRequisition && rowLabel) {
            rowLabel = rowLabel.querySelector('input');
        }

        const [_row, colId] = field.name.split('-');
        const colLabel = table.querySelector(`[data-eden-col-label~="${colId}"]`);

        const complementaryId = colId;
        const complementaryLabel = document.querySelector(`[data-eden-complementary-label~="${complementaryId}"]`);

        const rowCategoryId = tr.dataset.edenRowCategoryId;
        const rowCategoryLabel = document.querySelector(`[data-eden-row-category-label="${rowCategoryId}"]`);

        return { rowCategoryLabel, rowLabel, colLabel, complementaryLabel };
    },

    updateTableLocator(field) {
        const labels = this.getCellCoordinates(field);
        
        const existingLabels = Object.entries(labels).filter(([, label]) => {
            if (!label) return false;
            const text = label.value !== undefined ? label.value : label.textContent;
            return text && text.trim() !== '';
        });

        this.clearLabels();

        existingLabels.forEach(([key, label]) => {
            const span = document.createElement('span');
            const baseClass = this.displayElClasses.base;
            span.className = baseClass;

            const modifierSuffix = this.displayElClasses[key];
            if (modifierSuffix) {
                span.classList.add(`${baseClass}${modifierSuffix}`);
                
                const rawText = label.value !== undefined ? label.value : label.innerText;
                span.textContent = rawText.replace(/\s+/g, ' ').trim();
                span.title = span.textContent;
            }

            this.container.appendChild(span);
        });
    },

    clearLabels() {
        if (this.container) {
            this.container.textContent = '';
        }
    }
};