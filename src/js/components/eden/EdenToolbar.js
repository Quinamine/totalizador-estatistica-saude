import { EdenMessenger } from "../../utils/EdenMessenger.js";

export const EdenToolbar = {
    ...EdenMessenger,

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.container = document.querySelector('[data-eden-js="tes-toolbar"');
        this.buttons = this.container.querySelectorAll('[data-eden-action]');
    },

    bindEvents() {
        document.addEventListener('eden:trigger:report-render-request', () => {
            this.requestVisibility('close'); // Mobile
            this.disableButtons(); // Desktop
        });

        document.addEventListener('eden:report:rendered', () => {
            this.requestVisibility('open')
            this.enableButtons();
        });
    },

    requestVisibility(action) {
        this.notify('toolbar','visibility-request', { action });
    },

    disableButtons() {
        this.buttons.forEach( button => button.setAttribute('disabled', 'disabled'));
    },

    enableButtons() {
        this.buttons.forEach( button => button.removeAttribute('disabled'));
    },
}

