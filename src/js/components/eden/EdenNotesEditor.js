export const EdenNotesEditor = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.contentArea = document.querySelector('.eden-c-content-area');
    },

    bindEvents() {
        this.contentArea.addEventListener('input', (e) => {
            const field = e.target.closest('[data-eden-js="report-notes"]');
            if(!field) return;

            if (field.innerHTML === '<br>' || field.innerText.trim() === '') {
                field.innerHTML = '';
            }
        });
    }
}