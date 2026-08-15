import { TES_BALANCETE_MEDICATIONS } from "../../constants/tes-balancete-medications.config";

export const TesBalancetePopulator = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    document.addEventListener("eden:page:rendered", (e) => this.handleContentLoaded(e));
  },

  handleContentLoaded(e) {
    const { id } = e.detail || {};

    if (id === "balancete") {
      const tbody = document.querySelector('[data-eden-js="balancete-tbody"]');

      if (tbody) {
        this.populateTable(tbody);
      }
    }
  },

  populateTable(tbody) {
    const rowsHtml = TES_BALANCETE_MEDICATIONS.map((item, index) => {
      const line = index + 1;
      return `
        <tr>
          <td class="tes-balancete__fnm">
            <input type="text" name="l${line}-c1" id="l${line}-c1" value="${item.fnm}" placeholder="FNM" tabindex="-1">
          </td>
          <td class="tes-balancete__medicine">
            <input type="text" name="l${line}-c2" id="l${line}-c2" value="${item.name}" placeholder="Medicamento/Artigo" tabindex="-1" class="eden-u-text-left" data-eden-js="balancete-medicine">
          </td>
          <td>
            <input type="number" name="l${line}-c3" id="l${line}-c3" data-eden-group="theoretical-ending-stock difference">
          </td>
          <td>
            <input type="number" name="l${line}-c4" id="l${line}-c4" data-eden-group="theoretical-ending-stock difference">
          </td>
          <td>
            <input type="number" name="l${line}-c5" id="l${line}-c5" data-eden-group="theoretical-ending-stock difference quantity-to-requisition">
          </td>
          <td>
            <input type="number" name="l${line}-c6" id="l${line}-c6" value="0" readonly tabindex="-1" data-eden-total="theoretical-ending-stock" data-eden-ending-balance="l${line}-c3 l${line}-c4 l${line}-c5">
          </td>
          <td>
            <input type="number" name="l${line}-c7" id="l${line}-c7">
          </td>
          <td>
            <input type="number" name="l${line}-c8" id="l${line}-c8" data-eden-group="quantity-to-requisition difference">
          </td>
          <td>
            <input type="number" name="l${line}-c9" id="l${line}-c9" value="0" readonly tabindex="-1" data-eden-total="difference" data-eden-difference="l${line}-c8 l${line}-c6">
          </td>
          <td>
            <input type="number" name="l${line}-c10" id="l${line}-c10" value="0" readonly tabindex="-1" data-eden-total="quantity-to-requisition" data-eden-quantity-to-requisition="l${line}-c5 l${line}-c8">
          </td>
          <td>
            <input type="number" name="l${line}-c11" id="l${line}-c11" data-eden-group="quantity-to-requisition">
          </td>
          <td>
            <input type="number" name="l${line}-c12" id="l${line}-c12" data-eden-group="quantity-to-requisition">
          </td>
        </tr>`;
    }).join('');

    tbody.innerHTML = rowsHtml;

    document.dispatchEvent(new CustomEvent("eden:balancete:rendered", { detail: { count: TES_BALANCETE_MEDICATIONS.length } }));
  }
};