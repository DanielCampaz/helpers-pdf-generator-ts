import type { Signatory, TableCell, TableRow, TableColumn, DataTable, Metric, ReportSection } from '../types';

// ═══════════════════════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════════════════════

/** Escapa texto para incluirlo de forma segura en HTML */
export function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
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

// ═══════════════════════════════════════════════════════════════
//  BUILDERS — INVOICE
// ═══════════════════════════════════════════════════════════════

export interface InvoiceItemData {
  index:      number | string;
  concept:    string;
  qty:        number | string;
  unit_price: string;
  total:      string;
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

// ═══════════════════════════════════════════════════════════════
//  BUILDERS — REPORT
// ═══════════════════════════════════════════════════════════════

export function buildSections(sections: ReportSection[]): string {
  return sections.map(sec => {
    let inner = '';

    if (sec.paragraphs?.length) {
      inner += sec.paragraphs.map(p => `<p>${esc(p)}</p>`).join('');
    }

    if (sec.subsections?.length) {
      inner += sec.subsections.map(sub => `
        <h4>${esc(sub.title)}</h4>
        <p>${esc(sub.content)}</p>`
      ).join('');
    }

    if (sec.list?.length) {
      inner += `<ul class="clist">${sec.list.map(li => `<li>${esc(li)}</li>`).join('')}</ul>`;
    }

    if (sec.quote) {
      inner += `
        <div class="pquote">
          <div class="pquote-text">${esc(sec.quote.text)}</div>
          <div class="pquote-src">— ${esc(sec.quote.source)}</div>
        </div>`;
    }

    if (sec.conclusions?.length) {
      inner += `<div class="cgrid">${sec.conclusions.map((c, i) => `
        <div class="ccard">
          <div class="ccard-num">0${i + 1}</div>
          <div class="ccard-ttl">${esc(c.title)}</div>
          <div class="ccard-txt">${esc(c.text)}</div>
        </div>`
      ).join('')}</div>`;
    }

    return `
    <div class="sec">
      <div class="sec-hd">
        <span class="sec-dot"></span>
        <h3>${esc(sec.number)}. ${esc(sec.title)}</h3>
        <span class="sec-rule"></span>
      </div>
      ${inner}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  BUILDERS — TABLES REPORT
// ═══════════════════════════════════════════════════════════════

export function buildMetrics(metrics: Metric[]): string {
  return metrics.map(m => `
    <div class="mcard">
      <div class="mc-lbl">${esc(m.label)}</div>
      <div class="mc-val">${esc(m.value)}</div>
      <div class="mc-dlt ${esc(m.trend)}">${esc(m.delta)}</div>
    </div>`
  ).join('');
}

export function buildCell(c: TableCell): string {
  const cls = esc(c.class ?? '');
  if (c.chip) {
    return `<td class="${cls}"><span class="chip chip-${esc(c.chip)}">${esc(c.value)}</span></td>`;
  }
  return `<td class="${cls}">${esc(c.value)}</td>`;
}

export function buildTables(tables: DataTable[]): string {
  return tables.map(t => {
    const headers = t.columns
      .map((col: TableColumn) => `<th class="${esc(col.align)}">${esc(col.label)}</th>`)
      .join('');

    const rows = t.rows
      .map((row: TableRow) => `<tr>${row.cells.map(buildCell).join('')}</tr>`)
      .join('');

    const foot = t.footer_row
      ? `<tfoot><tr>${t.footer_row.map(buildCell).join('')}</tr></tfoot>`
      : '';

    const desc = t.description
      ? `<div class="tb-desc">${esc(t.description)}</div>`
      : '';

    const note = t.footnote
      ? `<div class="tb-note">${esc(t.footnote)}</div>`
      : '';

    return `
    <div class="tblock">
      <div class="tb-hd">
        <span class="tb-idx">T–${esc(t.index)}</span>
        <span class="tb-ttl">${esc(t.title)}</span>
        <span class="tb-rule"></span>
        <span class="tb-tag">${esc(t.badge)}</span>
      </div>
      ${desc}
      <div class="twrap">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
          ${foot}
        </table>
      </div>
      ${note}
    </div>`;
  }).join('');
}

export function buildObservations(text: string): string {
  if (!text) return '';
  return `
    <div class="obs">
      <div class="obs-ttl">Observaciones</div>
      <p>${esc(text)}</p>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS para construir celdas (para usar en los datos)
// ═══════════════════════════════════════════════════════════════

export const cell = (value: string | number, cls = ''): TableCell => ({
  chip:  null,
  value: String(value ?? ''),
  class: cls,
});

export const chipCell = (value: string, color: TableCell['chip'], cls = ''): TableCell => ({
  chip:  color,
  value: String(value ?? ''),
  class: cls,
});
