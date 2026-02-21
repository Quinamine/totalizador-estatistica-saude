import { SIDEBAR_MENU } from "../constants/sidebar-menu-config.js";

export const Sidebar = {
    cacheElements() {
        this.sidebar = document.querySelector('[data-js="sidebar"]');
        this.sidebarOverlay = document.querySelector('[data-js="sidebar-overlay"]');
        this.body = document.querySelector('[data-js="main-body"]');
        this.sidebarTriggers = document.querySelectorAll('[data-group="sidebar-triggers"]');
        this.sidebarNav = document.querySelector('.eden-c-sidebar__nav');
    },

    open() {
        this.sidebar.classList.add('is-open');
        this.sidebarOverlay.classList.add('is-active', 'is-active-sidebar');
        if(window.matchMedia('(min-width: 1024px)').matches) {
            this.body.classList.remove('is-sidebar-closed');
        }
    },

    close() {
        this.sidebar.classList.remove('is-open');
        this.sidebarOverlay.classList.remove('is-active', 'is-active-sidebar');
         if(window.matchMedia('(min-width: 1024px').matches) {
            this.body.classList.add('is-sidebar-closed');
        }
    },

    toggleAccordion(accordion) {
        accordion.classList.toggle('is-open');
    },

    handleAction(action) {
        if(action == 'open')  return this.open();
        if(action == 'close')  return this.close();
    },

    renderMenu() {
        const htmlMenu = SIDEBAR_MENU.map(category => `
        <div class="eden-c-sidebar__accordion" data-js="sidebar-accordion">
            <button class="eden-c-button eden-c-sidebar__accordion-header" data-js="sidebar-accordion-toggles">
            ${category.categoryTitle}
            <span class="eden-c-sidebar__chevron">❯</span>
            </button>
            <div class="eden-c-sidebar__accordion-body">
            <ul class="eden-c-sidebar__list">
                ${category.itens.map(item => `
                <li>
                    <button class="eden-c-button eden-c-sidebar__item" data-template-id=${item.id}>
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

    bindEvents() {
        this.sidebarTriggers.forEach( btn => {
            const btnAction = btn.dataset.sidebarAction;
            btn.addEventListener('click', () => {
                this.handleAction(btnAction);
            });
        });

        this.sidebarNav.addEventListener('click', (event) => {
            const accordionToggle = event.target.closest('[data-js="sidebar-accordion-toggles"]');
            if(accordionToggle) {
                const accordion = accordionToggle.parentElement;
                this.toggleAccordion(accordion);
            }
        });
    },

    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderMenu();
    }
}
