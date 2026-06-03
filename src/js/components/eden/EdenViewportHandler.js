import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenViewportHandler = {
    ...EdenMessenger,

    isUpdatingFrame: false,
    lastScrollY: 0,

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
    },

    requestFrame(callback) {
        if(!this.isUpdatingFrame) {
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

    toggleBodyClass(className, shouldAdd) {
        document.body.classList.toggle(className, shouldAdd);
    },

    notifyScrollDirection() {
        const isDesktop = window.innerWidth >= 1024;
        if(isDesktop) return;

        const currentScrollY = window.scrollY;
            
        const isScrollingDown = currentScrollY > 64 && window.scrollY > this.lastScrollY;

        EdenViewportHandler.notify('viewport', 'scroll-direction', { isScrollingDown });

        this.lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }
}