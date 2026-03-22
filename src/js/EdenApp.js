import { EdenSidebar } from "./components/EdenSidebar.js";
import { EdenReportEntry } from "./components/EdenReportEntry.js";
import { EDEN_REPORTS } from "./constants/eden-reports.config.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();

        this.cacheElements();
        this.setupObservers();
        this.bindEvents();
    },

    cacheElements() {
        this.headerTitle = document.querySelector('[data-eden-js="header-title"');
    },

    setupObservers() {
        const mobileView = window.matchMedia('(max-width: 1023px)');
        const desktopView = window.matchMedia('(min-width: 1024px)');

        mobileView.addEventListener('change', ({matches: isMobile}) => {
            if(isMobile) {
                this.handleSidebarReset();
            }
        });

        desktopView.addEventListener('change', ({matches: isDesktop}) => {
            if(isDesktop) {
                this.handleSidebarReset();
            }
        });
    },

    bindEvents() {
        document.body.addEventListener('click', (event) => {
            // SIDEBAR
            const sidebarOpener = event.target.closest('[data-eden-js~="sidebar-opener"]');
            const sidebarCloser = event.target.closest('[data-eden-js~="sidebar-closer"]');
            const accordionToggler = event.target.closest('[data-eden-js~="sidebar-accordion-toggler"]');

            if (sidebarOpener) {
                this.handleSidebarOpen();
                return;
            }

            if (sidebarCloser) {
                this.handleSidebarClose();
                return;
            }

            if (accordionToggler) {
                const accordion = accordionToggler.parentElement;
                this.toggleAccordion(accordion);
            }

            // REPORT ENTRY 
            const reportRenderer = event.target.closest('[data-eden-js~="report-renderer"');
            const reportRetryer = event.target.closest('[data-eden-js~="report-retryer"');

            if(reportRenderer) {
                const reportId = reportRenderer.dataset.edenReportId;
                this.handleReportRendering(reportId)
            }

            if(reportRetryer) {
                const reportId = reportRetryer.dataset.edenReportId;
                this.handleReportRendering(reportId);
            }
        });
    },

    handleSidebarOpen() {
        EdenSidebar.setState('open');
        document.body.classList.remove('has-eden-sidebar-closed');
    },

    handleSidebarClose() {
        EdenSidebar.setState('close');
        document.body.classList.add('has-eden-sidebar-closed');
    },

    handleSidebarReset() {
        document.body.classList.remove('has-eden-sidebar-open', 'has-eden-sidebar-closed');
    },

    toggleAccordion(container) {
        container.classList.toggle('is-open');
    },

    async handleReportRendering(id) {
        const reportName = this.getReportName(id);
        const isMobile = window.matchMedia('(max-width: 1023px)').matches;

        this.headerTitle.innerHTML = reportName;
        if(isMobile) {
            this.handleSidebarClose();
        }

        const isRendered = await EdenReportEntry.renderReport(id);
        this.updateToolbarVisibility(isRendered);
    },

    getReportName(reportId) {
        let reportName;
        for (const item of EDEN_REPORTS) {
            if(item.id === reportId) {
                reportName = item.name;
            }
        }
        return reportName;
    },

    updateToolbarVisibility(isVisible) {
        document.body.classList.toggle('has-eden-toolbar', isVisible);
    }
}

EdenApp.init();
