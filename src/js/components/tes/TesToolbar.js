export const TesToolbar = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.toolbarElement = document.querySelector('[data-eden-js="tes-toolbar"]');
    },

    bindEvents() {
        window.addEventListener('eden:sidebar:report-selected', () => this.hide());
        window.addEventListener('eden:report-entry:report-injected', () => this.show());
    },

    hide() {
        window.dispatchEvent( new CustomEvent('eden:toolbar:visibility-changed', {
            detail: { visible: false }
        }));
    },

    show() {
        window.dispatchEvent( new CustomEvent('eden:toolbar:visibility-changed', {
            detail: { visible: true }
        }));
    }
}

