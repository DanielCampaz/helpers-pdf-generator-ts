// ═══════════════════════════════════════════════════════════════
//  BUILDERS — REPORT
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";
import { TableCell } from "../tables-report";
import { ReportSection } from "./types";

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
//  HELPERS para construir celdas (para usar en los datos)
// ═══════════════════════════════════════════════════════════════

export const cell = (value: string | number, cls = ''): TableCell => ({
    chip: null,
    value: String(value ?? ''),
    class: cls,
});

export const chipCell = (value: string, color: TableCell['chip'], cls = ''): TableCell => ({
    chip: color,
    value: String(value ?? ''),
    class: cls,
});
