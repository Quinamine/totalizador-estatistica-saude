import { EDEN_SIDEBAR } from "../../constants/eden-sidebar.config.js";
import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenSidebar = {
    ...EdenMessenger,

    init() {
        this.cacheElements();
        this.renderMenu();
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
    
    renderMenu() {
        const htmlMenu = EDEN_SIDEBAR.map(category => `
        <div class="eden-c-sidebar__accordion" data-eden-js="sidebar-accordion">
            <button class="eden-c-button eden-c-sidebar__accordion-header" data-eden-internal-action="sidebar-accordion:toggle">
            ${category.categoryTitle}
            <span class="eden-c-sidebar__chevron">❯</span>
            </button>
            <div class="eden-c-sidebar__accordion-body">
            <ul class="eden-c-sidebar__list">
                ${category.itens.map(item => `
                <li>
                    <button class="eden-c-button eden-c-sidebar__item" data-eden-action="report:render" data-eden-report-id="${item.id}">
                    ${item.name}
                    </button>
                </li>
                `).join('')}
            </ul>
            </div>
        </div>
        `).join('');

        this.nav.innerHTML = htmlMenu;
    },

    requestVisibility(action) {
        this.notify('sidebar', 'visibility-request', { action });
    },
    
    toggleAccordion(accordion) {
        const shouldOpen = !accordion.matches('.is-open');
        accordion.classList.toggle('is-open', shouldOpen);
    }
}
