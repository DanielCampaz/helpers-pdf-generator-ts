// ═══════════════════════════════════════════════════════════════
//  BUILDERS — INVOICE
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";

export interface InvoiceItemData {
    index: number | string;
    concept: string;
    qty: number | string;
    unit_price: string;
    total: string;
}

export function buildItems(items: InvoiceItemData[]): string {
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