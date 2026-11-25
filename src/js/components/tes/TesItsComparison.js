export const TesItsComparison = {
    containerSelector: '[data-eden-js="its-indicator-comparison"]',
    contentArea: null,

    init() {
        this.contentArea = document.querySelector('[data-eden-js="content-area"]');
        if (!this.contentArea) return;

        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const onUpdate = () => this.update();

        this.contentArea.addEventListener('input', onUpdate);
        this.contentArea.addEventListener('change', onUpdate);
        document.addEventListener('eden:page:rendered', onUpdate);
        document.addEventListener('eden:balancete:rendered', onUpdate);
        document.addEventListener('eden:report:clear-confirmed', onUpdate);
    },

    val(id) {
        return Number(this.contentArea.querySelector(`#${id}`)?.value) || 0;
    },

    pct(num, den) {
        return den > 0 ? `${((num / den) * 100).toFixed(1)}%` : '0.0%';
    },

    avg(num, den) {
        if (den <= 0) return '0';
        const res = num / den;
        return Number.isInteger(res) ? String(res) : res.toFixed(1);
    },

    setTrend(row, prevVal, currVal) {
        const trendCells = row.querySelectorAll('.tes-its__trend-cell');
        trendCells.forEach(cell => {
            cell.classList.remove('tes-its__trend-cell--active');
            cell.innerHTML = '';
        });

        if (prevVal === '' || currVal === '') return;

        const prev = parseFloat(prevVal);
        const curr = parseFloat(currVal);
        if (Number.isNaN(prev) || Number.isNaN(curr)) return;

        let trend = 'estacionario';
        let arrowClass = 'tes-its__arrow--unchanged';

        if (curr > prev) {
            trend = 'aumentou';
            arrowClass = 'tes-its__arrow--increased';
        } else if (curr < prev) {
            trend = 'diminuiu';
            arrowClass = 'tes-its__arrow--decreased';
        }

        const targetCell = row.querySelector(`.tes-its__trend-cell[data-trend="${trend}"]`);
        if (targetCell) {
            targetCell.classList.add('tes-its__trend-cell--active');
            targetCell.innerHTML = `<span class="tes-its__arrow ${arrowClass}"></span>`;
        }
    },

    update() {
        const table = this.contentArea.querySelector(this.containerSelector);
        if (!table) return;

        const cons1a = this.val('tot-us_consulta');
        const casosIndices = this.val('total_ci');
        const contactos = this.val('total_contacto');
        const convites = this.val('tot-us_prevencao_convites');
        const todasConsSexo = this.val('tot-us_todas-consultas_sexo');
        const popChaveS = this.val('tot-us_todas-consultas_pop-chave_s');
        const pvhivCons = this.val('pvhiv-total-consultas');
        const pvhivRastreio = this.val('its-pvhiv-total-rastreio');

        const hivTestados = this.val('tot_teste-hiv_p') + this.val('tot_teste-hiv_n') + this.val('tot_teste-hiv_id');
        const sifilisTestados = this.val('tot_teste-sifilis_p') + this.val('tot_teste-sifilis_n');

        const values = {
            ind_1_1_curr: String(cons1a),
            ind_2_2_curr: this.pct(hivTestados, cons1a),
            ind_4_4_curr: this.pct(sifilisTestados, cons1a),
            ind_3_1_curr: this.avg(convites, casosIndices),
            ind_3_2_curr: this.avg(contactos, casosIndices),
            ind_4_1_curr: this.pct(cons1a, todasConsSexo),
            ind_4_5_curr: this.pct(popChaveS, cons1a),
            ind_4_6_curr: this.pct(pvhivRastreio, pvhivCons)
        };

        Object.entries(values).forEach(([currId, result]) => {
            const currInput = table.querySelector(`#${currId}`);
            if (!currInput) return;

            currInput.value = result;

            const row = currInput.closest('tr');
            const prevInput = row?.querySelector('[data-compare-role="prev"]');
            if (row && prevInput) {
                this.setTrend(row, prevInput.value.trim(), result);
            }
        });
    }
};

