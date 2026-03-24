// ═══════════════════════════════════════════════════════════════
//  BUILDERS — TABLES REPORT
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";
import { DataTable, Metric, TableCell, TableColumn, TableRow } from "./types";

export function buildMetrics(metrics: Metric[]): string {
    const indicators: Record<Metric['trend'], string> = {
        up: '▲',
        down: '▼',
        flat: '→',
        none: '',
    }
    const metricsHtml = metrics.map(m => `
    <div class="mcard">
      <div class="mc-lbl">${esc(m.label)}</div>
      <div class="mc-val">${esc(m.value)}</div>
      <div class="mc-dlt ${esc(m.trend)}">${indicators[m.trend]} ${esc(m.delta)}</div>
    </div>`
    ).join('');
    return `<div class="sep"><span class="sep-txt">Indicadores Clave</span><span class="sep-ln"></span></div><div class="metrics">${metricsHtml}</div>`;
}

export function buildIntro(text: string): string {
    if (!text) return '';
    return `<div class="intro">${esc(text)}</div>`;
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
        <div class="sep"><span class="sep-txt">Tablas de Datos</span><span class="sep-ln"></span></div>
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