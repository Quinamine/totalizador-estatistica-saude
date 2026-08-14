import { EdenSidebar } from "./components/eden/EdenSidebar.js";
import { EdenContentArea } from "./components/eden/EdenContentArea.js";
import { EdenHeader } from "./components/eden/EdenHeader.js";
import { EdenToolbar } from "./components/eden/EdenToolbar.js";
import { TesManager } from "./components/tes/TesManager.js";
import { EdenNotesEditor } from "./components/eden/EdenNotesEditor.js";
import { EdenToast } from "./components/eden/EdenToast.js";
import { EdenCellPositionBar } from "./components/eden/EdenCellPositionBar.js";
import { EdenViewportHandler } from "./components/eden/EdenViewportHandler.js";
import { EdenGeoDatalist } from "./components/eden/EdenGeoDatalist.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenContentArea.init();
        EdenHeader.init();
        EdenToast.init();
        EdenToolbar.init();
        TesManager.init()
        EdenNotesEditor.init();
        EdenCellPositionBar.init();
        EdenViewportHandler.init();
        EdenGeoDatalist.init();

        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-eden-action]');
            if(!trigger) return;

            const action = trigger.dataset.edenAction;
            const detail = {};

            if(trigger.matches('[data-eden-action="page:render"]')) {
                e.preventDefault();
                const pageId = trigger.dataset.edenPageId;
                const pageTitle = trigger.textContent;
                detail.id = pageId;

                this.updateRoute(pageId, pageTitle);
                
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

    updateRoute(pageId, title) {
        const url = new URL(window.location.href);
        url.searchParams.set("page", pageId);
        window.history.pushState({}, '', url.toString());
        
        document.title = `${title} | TES - Totalizador de Estatística de Saúde`;
    }


}

EdenApp.init();
