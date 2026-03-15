import { EdenSidebar } from "./components/EdenSidebar.js";
import { EdenReportEntry } from "./components/EdenReportEntry.js";
import { EDEN_REPORT_TEMPLATES } from "./constants/eden-report-templates.config.js";

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
            const templateRender = event.target.closest('[data-eden-js~="template-render"');
            const templateRetryer = event.target.closest('[data-eden-js~="template-retryer"');

            if(templateRender) {
                const templateId = templateRender.dataset.edenTemplateId;
                this.handleTemplateRendering(templateId)
            }

            if(templateRetryer) {
                const templateId = templateRetryer.dataset.edenTemplateId;
                this.handleTemplateRendering(templateId);
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

    async handleTemplateRendering(id) {
        const templateName = this.getTemplateName(id);
        const isMobile = window.matchMedia('(max-width: 1023px)').matches;

        this.headerTitle.innerHTML = templateName;
        if(isMobile) {
            this.handleSidebarClose();
        }

        const isRendered = await EdenReportEntry.renderTemplate(id);
        this.updateToolbarVisibility(isRendered);
    },

    getTemplateName(templateId) {
        let templateName;
        for (const item of EDEN_REPORT_TEMPLATES) {
            if(item.id === templateId) {
                templateName = item.name;
            }
        }
        return templateName;
    },

    updateToolbarVisibility(isVisible) {
        document.body.classList.toggle('has-eden-toolbar', isVisible);
    }
}

EdenApp.init();
