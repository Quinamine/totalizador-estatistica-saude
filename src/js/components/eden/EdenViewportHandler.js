import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenViewportHandler = {
    ...EdenMessenger,

    isUpdatingFrame: false,
    lastScrollY: 0,
    rowObserver: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        window.visualViewport?.addEventListener('resize', () => {
            this.requestFrame(() => this.updateKeyboardHeight());
        });

        window.visualViewport?.addEventListener('scroll', () => {
            this.requestFrame(() => this.updateKeyboardHeight());
        });

        window.addEventListener('scroll', () => {
            this.requestFrame(() => this.notifyScrollDirection());
        });

        document.addEventListener('eden:page:rendered', () => {
            this.updatePageContentMaxWidth();
        });

        document.addEventListener('eden:balancete:rendered', () => {
            this.rows = document.querySelectorAll('[data-eden-js="balancete-tbody"] tr');
            console.log(this.rows)
            this.initBalanceteRowObserver();
        });
    },

    requestFrame(callback) {
        if (!this.isUpdatingFrame) {
            this.isUpdatingFrame = true;

            window.requestAnimationFrame(() => {
                callback();

                this.isUpdatingFrame = false;
            });
        }
    },

    updateKeyboardHeight() {
        const keyboardHeight = window.innerHeight - (window.visualViewport.height + window.visualViewport.offsetTop);
        const toolbarHeight = document.querySelector('[data-eden-js="tes-toolbar"]').offsetHeight;
        const hasKeyboardOpen = (window.innerHeight - window.visualViewport.height) > 60;

        document.documentElement.style.setProperty('--eden-sys-keyboard-height', `${keyboardHeight}px`);
        document.documentElement.style.setProperty('--eden-sys-toolbar-height', `${toolbarHeight}px`);

        this.toggleBodyClass('has-keyboard-open', hasKeyboardOpen);
    },

    updatePageContentMaxWidth() {
        const currentTable = document.querySelector('[data-eden-js="tes-report"] table');

        if (currentTable) {
            const tableWidth = currentTable.offsetWidth;
            document.documentElement.style.setProperty('--eden-sys-page-content-max-width', `${tableWidth}px`);
        }
    },

    initBalanceteRowObserver() {
        if (this.rowObserver) this.rowObserver.disconnect();
        
        
        if (!this.rows.length) return;

        this.rowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-hidden', !entry.isIntersecting);
            });
        }, {
            root: null,
            rootMargin: "400px 0px",
            threshold: 0.01
        });

        this.rows.forEach(row => this.rowObserver.observe(row));
    },

    toggleBodyClass(className, shouldAdd) {
        document.body.classList.toggle(className, shouldAdd);
    },

    notifyScrollDirection() {
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) return;

        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > 64 && window.scrollY > this.lastScrollY;

        EdenViewportHandler.notify('viewport', 'scroll-direction', { isScrollingDown });

        this.lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }
}
