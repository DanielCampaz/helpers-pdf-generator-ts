// ═══════════════════════════════════════════════════════════════
//  BUILDERS — INVOICE
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";
import { InvoiceItemData } from "./types";

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