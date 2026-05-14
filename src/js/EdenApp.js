import { EdenSidebar } from "./components/eden/EdenSidebar.js";
import { EdenReportWorkspace } from "./components/eden/EdenReportWorkspace.js";
import { EdenHeader } from "./components/eden/EdenHeader.js";
import { TesToolbar } from "./components/tes/TesToolbar.js";
import { EDEN_REPORTS } from "./constants/eden-reports.config.js";
import { TesManager } from "./components/tes/TesManager.js";
import { TesNotesEditor } from "./components/tes/TesNotesEditor.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportWorkspace.init();
        EdenHeader.init();
        TesToolbar.init();
        TesManager.init()
        TesNotesEditor.init();

        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-eden-action]');
            if(!trigger) return;

            const action = trigger.dataset.edenAction;
            const detail = {};

            if(trigger.matches('[data-eden-action="report:render"]')) {
                detail.id = trigger.dataset.edenReportId;
            }

            this.dispatchTriggerRequest(action, detail);
        });

        document.addEventListener('eden:sidebar:visibility-request', (e) => this.handleVisibilityRequest(e));

        document.addEventListener('eden:toolbar:visibility-request', (e) => this.handleVisibilityRequest(e));
    },

    dispatchTriggerRequest(rawAction, detail = {}) {
        const [subject, action] = rawAction.split(':');
        
        const isVisibility = ['open', 'close', 'toggle'].includes(action);
        const nature = isVisibility ? 'visibility' : action;

        const eventName = `eden:trigger:${subject}-${nature}-request`;

        const event = new CustomEvent(eventName, {
            detail: { action, ...detail }
        });

        document.dispatchEvent(event);
    },

    handleVisibilityRequest({ detail, type }) {
        const { action } = detail;
        const isVisible = (action === 'open');
        
        const subject = type.split(':')[1]; 

        const strategies = {
            sidebar: () => {
                const isDesktop = window.innerWidth >= 1024;
                if (isDesktop) {
                    document.body.classList.toggle('has-eden-sidebar-closed', !isVisible);
                    document.body.classList.remove('has-eden-sidebar-open');
                    return;
                }
                document.body.classList.toggle('has-eden-sidebar-open', isVisible);
                document.body.classList.remove('has-eden-sidebar-closed');
            },
            toolbar: () => {
                document.body.classList.toggle('has-eden-toolbar', isVisible);
            }
        };

        if (strategies[subject]) {
            strategies[subject]();
        }
    },
}

EdenApp.init();
