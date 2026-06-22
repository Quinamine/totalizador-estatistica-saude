import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenSidebar = {
    ...EdenMessenger,

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.container = document.querySelector('[data-eden-js="sidebar"]');
        this.nav = this.container.querySelector('[data-eden-js="sidebar-nav"]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:sidebar-visibility-request', ({ detail }) => {
            const { action } = detail;
            this.requestVisibility(action);
        });

        this.container.addEventListener('click', (e) => {
            const accordionTrigger = e.target.closest('[data-eden-internal-action="sidebar-accordion:toggle"]');
            if (accordionTrigger) {
                const accordion = accordionTrigger.parentElement;
                this.toggleAccordion(accordion);
            }

            const isMobile = window.innerWidth < 1024;
            if(isMobile) {
                const closeTrigger = e.target.closest('[data-eden-action="report:render"]');
                if (closeTrigger) {
                    this.requestVisibility('close');
                }
            }
        });
    },

    requestVisibility(action) {
        this.notify('sidebar', 'visibility-request', { action });
    },
    
    toggleAccordion(accordion) {
        const shouldOpen = !accordion.matches('.is-open');
        accordion.classList.toggle('is-open', shouldOpen);
    },

    
}
