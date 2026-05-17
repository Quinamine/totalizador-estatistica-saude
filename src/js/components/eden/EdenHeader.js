import { EDEN_REPORTS } from "../../constants/eden-reports.config";

export const EdenHeader = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.title = document.querySelector('[data-eden-js="header-title"]');
    },

    bindEvents() {
        window.addEventListener('eden:sidebar:report-selected', (event) => {
            const { id } = event.detail;
            this.updateTitle(id);
        });
    },

    updateTitle(id) {
        const report = EDEN_REPORTS.find(item => item.id === id);

        if (report) {
            this.title.textContent = report.name;
        }
    }
};

