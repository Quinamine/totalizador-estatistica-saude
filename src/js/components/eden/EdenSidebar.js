import { EDEN_SIDEBAR } from "../../constants/eden-sidebar.config.js";

export const EdenSidebar = {
    init() {
        this.cacheElements();
        this.renderMenu();
        this.bindEvents();
    },

    cacheElements() {
        this.sidebar = document.querySelector('[data-eden-js="sidebar"]');
        this.sidebarNav = document.querySelector('[data-eden-js="sidebar-nav"]');
    },

    bindEvents() {
        window.addEventListener('eden:sidebar:action-triggered', ({ detail }) => {
            const { action } = detail;
            this.setState(action);
        });

        this.sidebar.addEventListener('click', (event) => {
            const accordionToggler = event.target.closest('[data-eden-js="sidebar-accordion-toggler"]');
            if (accordionToggler) {
                const accordion = accordionToggler.parentElement;
                this.toggleAccordion(accordion);
            }

            const isMobile = window.innerWidth < 1024;
            if(isMobile) {
                const reportRenderer = event.target.closest('[data-eden-js="report-renderer"]');
                if (reportRenderer) {
                    this.setState('close');
                }
            }
        });
    },
    
    renderMenu() {
        const htmlMenu = EDEN_SIDEBAR.map(category => `
        <div class="eden-c-sidebar__accordion" data-eden-js="sidebar-accordion">
            <button class="eden-c-button eden-c-sidebar__accordion-header" data-eden-js="sidebar-accordion-toggler">
            ${category.categoryTitle}
            <span class="eden-c-sidebar__chevron">❯</span>
            </button>
            <div class="eden-c-sidebar__accordion-body">
            <ul class="eden-c-sidebar__list">
                ${category.itens.map(item => `
                <li>
                    <button class="eden-c-button eden-c-sidebar__item" data-eden-js="report-renderer" data-eden-report-id="${item.id}">
                    ${item.name}
                    </button>
                </li>
                `).join('')}
            </ul>
            </div>
        </div>
        `).join('');

        this.sidebarNav.innerHTML = htmlMenu;
    },

    setState(action) {
        const validActions = ['open', 'close'];
        if(!validActions.includes(action)) {
            console.warn(`[Sidebar]: Accção inválida recebida "${action}". Use apenas "open" ou "close"`);
            return;
        }

        window.dispatchEvent(new CustomEvent('eden:sidebar:visibility-changed', {
            detail: { visible: (action === 'open') }
        }));
    },
    
    toggleAccordion(accordion) {
        const shouldOpen = !accordion.matches('.is-open');
        accordion.classList.toggle('is-open', shouldOpen);
    }
}
