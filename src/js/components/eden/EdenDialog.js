import { EdenMessenger } from "../../utils/EdenMessenger";

export const EdenDialog = {
    ...EdenMessenger,

    defaults: {
        title: 'Confirmação',
        content: '',
        confirmText: 'Ok',
        cancelText: 'Cancelar',
        isDanger: false,
        eventFeedback: {
            subject: null,
            nature: null,
            details: {}
        }
    },

    init(config = {}) {
        this.options = { ...this.defaults, ...config };

        this.render();
        this.bindEvents();
    },

    render() {
        const { title, content, confirmText, cancelText, isDanger } = this.options;
        
        this.dialog = document.createElement('dialog');
        this.dialog.classList.add('eden-c-dialog', 'eden-u-hide-on-print');

        let buttonModifier = isDanger 
            ? 'eden-c-button--danger' 
            : 'eden-c-button--primary';

        this.dialog.innerHTML = `
            <header class="eden-c-dialog__header">
                <h3 class="eden-c-dialog__title">${title}</h3>
            </header>
            <div class="eden-c-dialog__content">
                <p>${content}</p>
            </div>
            <div class="eden-c-dialog__footer">
                <button class="eden-c-button eden-c-button--secondary eden-c-dialog__action" data-eden-internal-action="cancel">${cancelText}</button>
                <button class="eden-c-button ${buttonModifier} eden-c-dialog__action" data-eden-internal-action="confirm">${confirmText}</button>
            </div>
        `;

        this.destroy();
        
        document.body.appendChild(this.dialog);

        this.dialog.showModal();
    },

    destroy() {
        if(this.dialog) {
            this.dialog.close();
            this.dialog.remove();
        }
    },

    bindEvents() {
        this.dialog.addEventListener('click', (e) => {
            const button = e.target.closest('[data-eden-internal-action]');

            if(button) {
                const confirmButton = button.matches('[data-eden-internal-action="confirm"]');

                if(confirmButton) {
                    const { subject, nature, details } = this.options.eventFeedback;

                    if(subject && nature) {
                        this.notify(subject, nature, details);
                    }
                }

                this.destroy();
            }
        });
    }
}