
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
        this.container = document.querySelector('[data-eden-js="cell-position-bar"]')
        this.workspace = document.querySelector('[data-eden-js="report-workspace"]');
    },

    bindEvents() {
        this.workspace.addEventListener('focusin', (e) => {
            const isInput = e.target.closest('input:not([readonly])');
            const tableCell = e.target.closest('td');

            if (!isInput || !tableCell) return;

            this.updateTableLocator(e.target);
        });

        this.workspace.addEventListener('focusout', (e) => this.clearLabels());
    },

    getCellCoordinates(field) {
        const tr = field.closest('tr');
        const table = field.closest('table');

        const rowLabelColIndex = tr.dataset.edenRowLabelColIndex ?? table.dataset.edenRowLabelColIndex;
        const rowLabel = tr.children[rowLabelColIndex] || null;

        const [_row, colId] = field.name.split('-');
        const colLabel = document.querySelector(`[data-eden-col-label~="${colId}"]`);

        const complementaryId = colId;
        const complementaryLabel = document.querySelector(`[data-eden-complementary-label~="${complementaryId}"]`);

        const rowCategoryId = tr.dataset.edenRowCategoryId;
        const rowCategoryLabel = document.querySelector(`[data-eden-row-category-label="${rowCategoryId}"]`);

        return { rowCategoryLabel, rowLabel, colLabel, complementaryLabel };
    },

    updateTableLocator(field) {
        const labels = this.getCellCoordinates(field);
        const existingLabels = Object.entries(labels).filter(([, label]) => {
            return label !== null && label.textContent.trim() !== ''
        });

        this.clearLabels();
        existingLabels.forEach(([key, label]) => {
            const span = document.createElement('span');
            const baseClass = this.displayElClasses.base;
            span.className = baseClass;

            const modifierSuffix = this.displayElClasses[key];
            if (modifierSuffix) {
                span.classList.add(`${baseClass}${modifierSuffix}`);
                span.textContent = label.textContent.replace(/\s+/g, ' ').trim();
                span.title = span.textContent;
            }

            this.container.appendChild(span);
        });
    },

    clearLabels() {
        this.container.textContent = '';
    }
}