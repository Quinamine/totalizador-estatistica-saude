import { EdenSidebar } from "./components/eden/EdenSidebar.js";
import { EdenReportEntry } from "./components/eden/EdenReportEntry.js";
import { EDEN_REPORTS } from "./constants/eden-reports.config.js";
import { TesManager } from "./components/tes/TesManager.js";
import { TesNotesEditor } from "./components/tes/TesNotesEditor.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();
        TesManager.init()
        TesNotesEditor.init();

        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.headerTitle = document.querySelector('[data-eden-js="header-title"');
    },

    bindEvents() {
        document.body.addEventListener('click', (event) => {
            // SIDEBAR
            const sidebarTrigger = event.target.closest('[data-eden-sidebar-action="open"]') || 
                                    event.target.closest('[data-eden-sidebar-action="close"]');

            if (sidebarTrigger) {
                const { edenSidebarAction } = sidebarTrigger.dataset;

                window.dispatchEvent(new CustomEvent('eden:sidebar:action-triggered', {
                    detail: { action: edenSidebarAction }
                }));
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

        window.addEventListener('eden:sidebar:visibility-changed', ({ detail }) => {
            const { visible } = detail;

            const isDesktop = window.innerWidth >= 1024;
            if(isDesktop) {
                document.body.classList.toggle('has-eden-sidebar-closed', !visible);
                document.body.classList.remove('has-eden-sidebar-open'); // Remoção preventiva da classe mobile
                return;
                /* No desktop, a sidebar é 'open' por padrão e o elemento que a fecha, passa o valor 'close' no CustomEvent('eden:sidebar:action-triggered) para EdenSidebar.js, o componente sidebar por sua vez retorna 'false' no atributo 'visible' atraves do CustomEvent 'eden:sidebar:visibility-changed' e aqui eu mudo para 'true'(!visible) de modo a coagir a adição da classe 'has-eden-sidebar-closed' no clique do elemento que a fecha a sidebar.*/
            }

            document.body.classList.toggle('has-eden-sidebar-open', visible);
            document.body.classList.remove('has-eden-sidebar-closed');
        });
    },

    async handleReportRendering(id) {
        const reportName = this.getReportName(id);
        const isMobile = window.matchMedia('(max-width: 1023px)').matches;

        this.headerTitle.innerHTML = reportName;

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
