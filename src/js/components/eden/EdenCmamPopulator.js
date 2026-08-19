import { TES_CMAM_MEDICATIONS } from "../../constants/tes-cmam-medications.config";

export const EdenCmamPopulator = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    document.addEventListener("eden:page:rendered", (e) => this.handleContentLoaded(e));
  },

  handleContentLoaded(e) {
    const { id } = e.detail || {};

    console.log(id)

    if (id === "balancete") {
      const tbody = document.querySelector('#tes-bal');

      if (tbody) {
        console.log("true")
        this.populateTable(tbody);
      }
    }
  },

  populateTable(tbody) {
    const rowsHtml = TES_CMAM_MEDICATIONS.map((item, index) => {
      const line = index + 1;
      return `
        <tr class="eden-u-row-spacer-sm">
                <td colspan="100%" class="eden-u-cell-spacer"></td>
        </tr>
        <tr>
          <td>
            <input type="text" name="l${line}-c1" id="l${line}-c1" value="${item.fnm}" placeholder="FNM">
          </td>
          <td>
            <input type="text" name="l${line}-c2" id="l${line}-c2" value="${item.name}" placeholder="Medicamento/Artigo">
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

    document.dispatchEvent(new CustomEvent("eden:cmam:rendered", { detail: { count: TES_CMAM_MEDICATIONS.length } }));
  }
};