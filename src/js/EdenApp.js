import { EdenSidebar } from "./components/eden/EdenSidebar.js";
import { EdenReportEntry } from "./components/eden/EdenReportEntry.js";
import { EdenHeader } from "./components/eden/EdenHeader.js";
import { TesToolbar } from "./components/tes/TesToolbar.js";
import { EDEN_REPORTS } from "./constants/eden-reports.config.js";
import { TesManager } from "./components/tes/TesManager.js";
import { TesNotesEditor } from "./components/tes/TesNotesEditor.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();
        EdenHeader.init();
        TesToolbar.init();
        TesManager.init()
        TesNotesEditor.init();

        this.bindEvents();
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
            const reportRenderer = event.target.closest('[data-eden-js="report-renderer"]') || 
                                    event.target.closest('[data-eden-js="report-retryer"]');
            if(reportRenderer) {
                const { edenReportId } = reportRenderer.dataset;

                const event = new CustomEvent('eden:sidebar:report-selected', {
                    detail: { id: edenReportId }
                });

                window.dispatchEvent(event);
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

        window.addEventListener('eden:toolbar:visibility-changed', ({ detail }) => {
            document.body.classList.toggle('has-eden-toolbar', detail.visible );
        });
    }
}

EdenApp.init();
