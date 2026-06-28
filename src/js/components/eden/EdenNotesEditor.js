export const EdenNotesEditor = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.reportWorkspace = document.querySelector('.eden-c-report-workspace');
    },

    bindEvents() {
        this.reportWorkspace.addEventListener('input', (e) => {
            const field = e.target.closest('[data-eden-js="report-notes"]');
            if(!field) return;

            if (field.innerHTML === '<br>' || field.innerText.trim() === '') {
                field.target.innerHTML = '';
            }
        });
    }
}