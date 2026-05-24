export const EdenToast = {
    container: null,
    timers: {},

    init() {
        this.renderContainer();
        this.bindEvents();
    },

    bindEvents() {
        this.container.addEventListener('click', (e) => {
            const closeButton = e.target.closest('[data-eden-internal-action="toast:close"]');
            if(closeButton) {
                const toast = e.target.closest('.eden-c-toast');
                if(toast) {
                    this.dismiss(toast);
                }
            }
        })
    },

    renderContainer() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.classList.add('eden-toast-container', 'eden-u-hide-on-print');
        document.body.appendChild(this.container);
    },

    render({ message, type = 'info', duration = 3000 }) {
        if (this.handleDuplication(message)) return;

        const toast = document.createElement('div');
        toast.className = `eden-c-toast eden-c-toast--${type}`;
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <div class="eden-c-toast__content" data-eden-js="toast-message">${message}</div>
            <button 
                class="eden-c-button eden-c-toast__close" 
                data-eden-internal-action="toast:close" 
                aria-label="Fechar">
                    &times;
            </button>
        `;

        this.container.appendChild(toast);

        this.setTimer(toast, duration);
    },

    handleDuplication(message) {
        const existingToasts = Array.from(this.container.children);
        const duplicate = existingToasts.find(toast => {
            return toast.querySelector('[data-eden-js="toast-message"]').innerText === message;
        });

        if (duplicate) {
            duplicate.classList.remove('eden-c-toast--pulse');
            void duplicate.offsetWidth;
            duplicate.classList.add('eden-c-toast--pulse');

            this.setTimer(duplicate, 3000); 

            return true;
        }

        return false;
    },

    setTimer(toast, duration) {
        const id = toast.dataset.edenToastId || (Date.now() + Math.random());
        toast.dataset.edenToastId = id;

        if (this.timers[id]) {
            clearTimeout(this.timers[id]);
        }

        this.timers[id] = setTimeout(() => {
            this.dismiss(toast);
            delete this.timers[id];
        }, duration);
    },

    dismiss(toast) {
        if (toast.classList.contains('eden-c-toast--exit')) return;
        
        const id = toast.dataset.edenToastId;
        if (this.timers[id]) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
        }

        toast.classList.remove('eden-c-toast--pulse');
        void toast.offsetWidth;
        toast.classList.add('eden-c-toast--exit');

        toast.addEventListener('animationend', () => {
            toast.remove();
        }, { once: true });
    }
};
