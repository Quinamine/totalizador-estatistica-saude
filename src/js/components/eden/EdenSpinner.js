export const EdenSpinner = (text = 'Carregando...') => `
    <div class="eden-c-spinner">
        <div class="eden-c-spinner__icon"></div>
        ${text !== '' ? `<p class="eden-c-spinner__text">${text}</p>` : ''}
    </div>
`