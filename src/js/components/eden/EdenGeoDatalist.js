import { EDEN_MOZ_LOCATIONS } from "../../constants/eden-moz-locations.config.js";
import { EDEN_MONTHS } from "../../constants/eden-months.config.js";

export const EdenGeoDatalist = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.contentArea = document.querySelector('[data-eden-js="content-area"]');
    },

    bindEvents() {
        if (!this.contentArea) return;

        this.contentArea.addEventListener('focusin', (e) => {
            const input = e.target.closest('input[list]');
            if (!input) return;

            if (input.matches('#province')) {
                this.populateDatalist('province', EDEN_MOZ_LOCATIONS.provinces);
                return;
            }

            if (input.matches('#district')) {
                const selectedProvince = this.formatString(this.getInputValue('#province'));
                const districts = EDEN_MOZ_LOCATIONS[selectedProvince]?.districts || [];
                this.populateDatalist('district', districts);
                return;
            }

            if (input.matches('#health-unit')) {
                const healthUnits = this.getHealthUnitsList();
                const huNames = healthUnits.map(item => item.us);
                this.populateDatalist('health-unit', huNames);
                return;
            }

            if (input.matches('#month')) {
                const currentMonth = EDEN_MONTHS[new Date().getMonth()];
                this.populateDatalist('month', [currentMonth]);
                return;
            }

            if (input.matches('#year')) {
                const currentYear = new Date().getFullYear();
                this.populateDatalist('year', [currentYear]);
                return;
            }
        });


        this.contentArea.addEventListener('input', (e) => {
            const input = e.target.closest('input[list]');
            if (!input) return;

            if (input.matches('#province')) {
                this.clearFields(['#district', '#health-unit', '#health-unit-code']);
                return;
            }

            if (input.matches('#district')) {
                this.clearFields(['#health-unit', '#health-unit-code']);
                return;
            }

            if (input.matches('#health-unit')) {
                this.updateHealthUnitCode(input.value);
                return;
            }
        });
    },

    getHealthUnitsList() {
        const selectedProvince = this.formatString(this.getInputValue('#province'));
        const selectedDistrict = this.formatString(this.getInputValue('#district'));
        return EDEN_MOZ_LOCATIONS[selectedProvince]?.[selectedDistrict] || [];
    },

    updateHealthUnitCode(selectedHuName) {
        const healthUnitCodeField = this.contentArea.querySelector('input#health-unit-code');
        if (!healthUnitCodeField) return;

        const healthUnits = this.getHealthUnitsList();
        const formattedName = this.formatString(selectedHuName);

        const match = healthUnits.find(hu => this.formatString(hu.us) === formattedName);
        healthUnitCodeField.value = match ? match.code : '';
    },

    clearFields(selectors) {
        selectors.forEach(selector => {
            const field = this.contentArea.querySelector(selector);
            if (field) field.value = '';
        });
    },

    getInputValue(selector) {
        const field = this.contentArea.querySelector(selector);
        return field ? field.value : '';
    },

    populateDatalist(fieldType, items = []) {
        const datalist = this.contentArea.querySelector(`#${fieldType}-datalist`);
        if (!datalist) return;

        datalist.innerHTML = '';

        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            datalist.appendChild(opt);
        });
    },

    formatString(value = '') {
        return String(value)
            .normalize("NFD")
            .replace(/[\u0300-\u036f\s+]/g, "")
            .toLowerCase()
            .trim();
    }
};