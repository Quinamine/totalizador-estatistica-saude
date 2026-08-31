
export const EdenStringFormatter = {
    clean(string) {
        return String(string)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "")
                .toLowerCase()
                .trim();
    }
};
