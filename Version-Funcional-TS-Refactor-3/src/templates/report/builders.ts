// ═══════════════════════════════════════════════════════════════
//  BUILDERS — REPORT
// ═══════════════════════════════════════════════════════════════

import { esc } from "../../core/PdfGenerator";
import { ReportBuildSection, ReportConclusion, ReportSection, ReportSubSectionData, SpacingOption } from "./types";


export function buildParagraphs(paragraphs: string | string[], spacing?: SpacingOption): string {
    let classs = '';
    if (spacing !== undefined && spacing) {
        classs = `sub-spacing-${spacing}`;
    }
    if (Array.isArray(paragraphs)) {
        return paragraphs.map(p => `<p class="${classs}">${esc(p)}</p>`).join('<br><br>');
    }
    return `<p class="${classs}">${esc(paragraphs)}</p>`
}

export function buildSections(sections: ReportSection[]): string {
    return sections.map(sec => {
        let inner = '';

        if (sec.paragraphs?.length) {
            inner += sec.paragraphs.map(p => buildParagraphs(p, 'L-15')).join('');
        }

        if (sec.subsections?.length) {
            inner += sec.subsections.map(sub => buildHtmlSubSection(sub, 'L-15')).join('');
        }

        if (sec.list?.length) {
            inner += buildHtmlList(sec.list, 'L-15');
        }

        if (sec.quote) {
            inner += buildHtmlPQuote(sec.quote.text, sec.quote.source);
        }

        if (sec.conclusions?.length) {
            inner += buildHtmlCardNumerated(sec.conclusions);
        }

        return buildHtmlSection({
            number: sec.number,
            title: sec.title,
            html: inner
        });
    }).join('');
}

export function buildHtmlList(items: string[], spacing?: SpacingOption): string {
    let classs = '';
    if (spacing !== undefined && spacing) {
        classs = `sub-spacing-${spacing}`;
    }
    return `<ul class="${classs} clist">
        ${items.map(li => `<li>${esc(li)}</li>`).join('')}
    </ul>`;
}

export function buildHtmlCardNumerated(data: ReportConclusion[]) {
    return `<div class="cgrid">${data.map((c, i) => `
        <div class="ccard">
          <div class="ccard-num">0${i + 1}</div>
          <div class="ccard-ttl">${esc(c.title)}</div>
          <div class="ccard-desc">${esc(c.text)}</div>
        </div>`
    ).join('')}</div>`
}

export function buildHtmlPQuote(text: string, source: string): string {
    return `
        <div class="pquote">
          <div class="pquote-text">${esc(text)}</div>
          <div class="pquote-src">— ${esc(source)}</div>
        </div>
    `;
}

export function buildHtmlSubSection(data: ReportSubSectionData, spacing?: SpacingOption): string {
    return `
                <h4 class="sub-spacing-L-15">${esc(data.title)}</h4>
                ${buildParagraphs(data.content, spacing)}
            `
}

export function buildHtmlSection(data: ReportBuildSection): string {
    return `
        <div class="sec">
            <div class="sec-hd">
                <span class="sec-dot"></span>
                <h3>${esc(data.number)}. ${esc(data.title)}</h3>
                <span class="sec-rule"></span>
            </div>
            ${typeof data.html === 'function' ? data.html() : data.html}
        </div>`;
}

export function buildExcutiveSummary(summary: string) {
    return `
    <div class="exec">
        <div class="exec-lbl">Resumen Ejecutivo</div>
        <p>${esc(summary)}</p>
      </div>
    `;
}