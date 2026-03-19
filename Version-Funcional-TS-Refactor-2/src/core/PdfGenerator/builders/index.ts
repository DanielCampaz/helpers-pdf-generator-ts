//import type { Signatory, TableCell, TableRow, TableColumn, DataTable, Metric, ReportSection } from '../../../types';

import { TableCell } from "../../../templates/tables-report";
import { Signatory } from "../types";

// ═══════════════════════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════════════════════

/** Escapa texto para incluirlo de forma segura en HTML */
export function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════════
//  BUILDERS COMPARTIDOS
// ═══════════════════════════════════════════════════════════════

export function buildSignatories(list: Signatory[]): string {
  return list.map(s => `
    <div class="sblk">
      <div class="sline"></div>
      <div class="sname">${esc(s.name)}</div>
      <div class="srole">${esc(s.role)}</div>
    </div>`
  ).join('');
}