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
            <input type="text" name="l${line}_fnm" id="l${line}_fnm" value="${item.fnm}" placeholder="FNM" tabindex="-1">
          </td>
          <td class="tes-balancete__medicine">
            <input type="text" name="l${line}_medicine" id="l${line}_medicine" value="${item.name}" placeholder="Medicamento/Artigo" tabindex="-1" class="eden-u-text-left" data-eden-js="balancete-medicine">
          </td>
          <td>
            <input type="number" name="l${line}_begginning-stock" id="l${line}_beginning-stock" data-eden-group="theoretical-ending-stock difference">
          </td>
          <td>
            <input type="number" name="l${line}_receipts" id="l${line}_receipts" data-eden-group="theoretical-ending-stock difference">
          </td>
          <td>
            <input type="number" name="l${line}_issues" id="l${line}_issues" data-eden-group="theoretical-ending-stock difference quantity-to-requisition">
          </td>
          <td>
            <input type="number" name="l${line}_theoretical-ending-stock" id="l${line}_theoretical-ending-stock" value="0" readonly tabindex="-1" data-eden-total="theoretical-ending-stock" data-eden-ending-balance="l${line}_beginning-stock l${line}_receipts l${line}_issues">
          </td>
          <td>
            <input type="number" name="l${line}_requested" id="l${line}_requested">
          </td>
          <td>
            <input type="number" name="l${line}_physical-inventory" id="l${line}_physical-inventory" data-eden-group="quantity-to-requisition difference">
          </td>
          <td>
            <input type="number" name="l${line}_difference" id="l${line}_difference" value="0" readonly tabindex="-1" data-eden-total="difference" data-eden-difference="l${line}_physical-inventory l${line}_theoretical-ending-stock">
          </td>
          <td>
            <input type="number" name="l${line}_quantity-to-requisition" id="l${line}_quantity-to-requisition" value="0" readonly tabindex="-1" data-eden-total="quantity-to-requisition" data-eden-quantity-to-requisition="l${line}_issues l${line}_physical-inventory">
          </td>
          <td>
            <input type="number" name="l${line}_quantity-requested" id="l${line}_quantity-requested" data-eden-group="">
          </td>
          <td>
            <input type="number" name="l${line}_quantity-authorized" id="l${line}_quantity-authorized" data-eden-group="">
          </td>
        </tr>`;
    }).join('');

    tbody.innerHTML = rowsHtml;

    document.dispatchEvent(new CustomEvent("eden:balancete:rendered", { detail: { count: TES_BALANCETE_MEDICATIONS.length } }));
  }
};