import { EDEN_REPORTS } from "../../constants/eden-reports.config";

export const EdenHeader = {
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupObserver();
    },

    cacheElements() {
        this.container = document.querySelector('[data-eden-js="header"]'); 
        this.title = this.container.querySelector('[data-eden-js="header-title"]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:report-render-request', ({ detail }) => {
            const { id } = detail;
            this.updateTitle(id);
        });

        document.addEventListener('eden:viewport:scroll-direction', ({ detail }) => {
            const { isScrollingDown } = detail;
            this.toggleStaticMode(isScrollingDown);
        });
    },

    setupObserver() {
        this.observer = new ResizeObserver(entries => {
            const height = entries[0].target.offsetHeight;
            document.documentElement.style.setProperty('--eden-sys-layout-header-height', `${height}px`);
        });

        this.observer.observe(this.container);
    },

    updateTitle(id) {
        const report = EDEN_REPORTS.find(item => item.id === id);

        if (report) {
            this.title.textContent = report.name;
        }
    },

    toggleStaticMode(isScrollingDown) {
        this.container.classList.toggle('eden-c-header--static', isScrollingDown);
    }
};

