// ═══════════════════════════════════════════════════════════════
//  BUILDERS — INVOICE
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";
import { ReportCardDetailData } from "../report";
import { InvoiceItemData, InvoiceTableData } from "./types";


export function buildGeneratedCardsDetails(cardsData: ReportCardDetailData[]) {
  return `
      <div class="parties">
        ${cardsData.map(cd => `
          <div class="pcard">
            <div class="pcard-lbl">${esc(cd.label)}</div>
            <div class="pcard-name">${esc(cd.name)}</div>
            <div class="pcard-det">
              ${cd.detail.map(d => esc(d)).join('<br>')}
            </div>
          </div>
        `).join('')}
      </div>    
            `
}

export function buildDescriptionSection(description: string): string {
  return `
            <div class="sec">
            <div class="sec-hd"><span class="sec-dot"></span>
            <h3>Descripción</h3><span class="sec-rule"></span>
            </div>
            <p class="para">${esc(description)}</p>
            </div>
            `
}

export function buildTableInvoiceItems(items: InvoiceItemData[]): string {
  return items.map(it => `
              <tr>
                <td>${esc(it.index)}</td>
                <td>${esc(it.concept)}</td>
                <td>${esc(it.qty)}</td>
                <td>${esc(it.unit_price)}</td>
                <td>${esc(it.total)}</td>
              </tr>`
  ).join('');
}

export function buildTableInvoice(tableInvoiceData: InvoiceTableData): string {
  return `
    <div class="sec">
        <div class="sec-hd"><span class="sec-dot"></span>
          <h3>${tableInvoiceData.name}</h3><span class="sec-rule"></span>
        </div>
        <div class="twrap">
          <table>
            <thead>
              <tr>
                ${tableInvoiceData.ths.map(th => `<th>${esc(th)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>${buildTableInvoiceItems(tableInvoiceData.items)}</tbody>
          </table>
        </div>
        <div class="totals">
          <div class="tbox">
          ${tableInvoiceData.totalTableItems.map((ti, index) => `
              <div class="trow ${index === tableInvoiceData.totalTableItems.length - 1 ? 'trow-final' : ''}">
                <span class="tlbl">${esc(ti.label)}</span>
                <span class="tval">${esc(ti.value)}</span>
              </div>            
              `).join('')}
          </div>
        </div>
      </div>
  `
}

export function buildTermsAndConditions(terms: string): string {
  return `
    <div class="sec">
        <div class="sec-hd"><span class="sec-dot"></span>
          <h3>Términos y Condiciones</h3><span class="sec-rule"></span>
        </div>
        <div class="note"><strong>Nota:</strong> ${esc(terms)}</div>
    </div>
  `
}