export const TesNotesEditor = {
    init() {
        document.addEventListener('eden:report:rendered', () => {
            this.cacheElements();
            this.bindEvents();
        });
    },

    cacheElements() {
        this.editor = document.querySelector('.tes-c-notes-editor__content');
    },

    bindEvents() {
        this.editor.addEventListener('input', (e) => {
            if (e.target.innerHTML === '<br>' || e.target.innerText.trim() === '') {
                e.target.innerHTML = '';
            }
        });
    }
}