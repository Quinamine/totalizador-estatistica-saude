export const Sidebar = {
    cacheElements() {
        this.sidebar = document.querySelector('[data-js="sidebar"]');
        this.sidebarOverlay = document.querySelector('[data-js="sidebar-overlay"]');
        this.body = document.querySelector('[data-js="main-body"]');
        this.sidebarTriggers = document.querySelectorAll('[data-group="sidebar-triggers"]');
        this.accordionToggles = document.querySelectorAll('[data-js="sidebar-accordion-toggles"]');
    },

    open() {
        this.sidebar.classList.add('is-open');
        this.sidebarOverlay.classList.add('is-active', 'is-active-sidebar');
        if(window.matchMedia('(min-width: 1024px').matches) {
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

    bindEvents() {
        this.sidebarTriggers.forEach( btn => {
            const btnAction = btn.dataset.sidebarAction;
            btn.addEventListener('click', () => {
                this.handleAction(btnAction);
            });
        });

        this.accordionToggles.forEach( btn => {
            const accordion = btn.parentElement;
            btn.addEventListener('click', () => {
                this.toggleAccordion(accordion);
            });
        });
    },

    init() {
        this.cacheElements();
        this.bindEvents();
    }
}
