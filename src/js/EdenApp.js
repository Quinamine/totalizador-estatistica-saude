import { EdenSidebar } from "./components/EdenSidebar.js";
import { EdenReportEntry } from "./components/EdenReportEntry.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();

        this.setupObservers();
        this.bindEvents();
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
    }
}

EdenApp.init();
