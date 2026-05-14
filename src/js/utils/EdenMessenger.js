export const EdenMessenger = {
    notify(subject, nature, details = {}) {
        const dispatcher = this.container || this.element || document;

        const eventName = `eden:${subject}:${nature}`;

        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: { ...details },
        });

        dispatcher.dispatchEvent(event);
    }
};

