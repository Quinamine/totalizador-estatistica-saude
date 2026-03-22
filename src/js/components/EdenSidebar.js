import { EDEN_SIDEBAR } from "../constants/eden-sidebar.config.js";

export const EdenSidebar = {
    init() {
        this.cacheElements();
        this.renderMenu();
    },

    cacheElements() {
        this.sidebarNav = document.querySelector('[data-eden-js~="sidebar-nav"]');
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
        if(!validActions.includes(action)) return;

        const shouldOpen = (action === 'open');
        document.body.classList.toggle('has-eden-sidebar-open', shouldOpen);
    }
}
