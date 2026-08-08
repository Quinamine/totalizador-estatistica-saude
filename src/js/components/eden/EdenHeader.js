import { EDEN_PAGES} from "../../constants/eden-pages.config.js";

export const EdenHeader = {
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupObserver();
    },

    cacheElements() {
        this.container = document.querySelector('[data-eden-js="header"]'); 
        this.title = this.container.querySelector('[data-eden-js="header-title"]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:page-render-request', ({ detail }) => {
            const { id } = detail;
            this.updateTitle(id);
        });

        document.addEventListener('eden:viewport:scroll-direction', ({ detail }) => {
            const { isScrollingDown } = detail;
            this.toggleStaticMode(isScrollingDown);
        });

        window.addEventListener('load', () => {
            const url = new URL(window.location.href);
            const pageId = url.searchParams.get("page");
            if(!pageId) return;        
            
            this.updateTitle(pageId);
        });
    },

    setupObserver() {
        this.observer = new ResizeObserver(entries => {
            const height = entries[0].target.offsetHeight;
            document.documentElement.style.setProperty('--eden-sys-layout-header-height', `${height}px`);
        });

        this.observer.observe(this.container);
    },

    updateTitle(id) {
        const page = EDEN_PAGES.find(item => item.id === id);

        if (page) {
            this.title.textContent = page.name;
        }
    },

    toggleStaticMode(isScrollingDown) {
        const currentPage = document.querySelector('.eden-c-page');
        if(!currentPage) return;

        if(currentPage?.dataset.edenIgnoreHeaderScroll) {
            this.container.classList.remove('eden-c-header--static');
            return;
        }

        this.container.classList.toggle('eden-c-header--static', isScrollingDown);
    }
};

