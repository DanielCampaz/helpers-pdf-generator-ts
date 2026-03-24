import { esc } from "../core/PdfGenerator";
import {
    BuildSection,
    Conclusion,
    SectionData,
    SubSectionData,
    HdrData,
    HeaderData,
    MbCellData,
    SpacingOption,
    TBarData,
    TableCell,
    TableRow,
    TableColumn,
    TableData,
    Metric,
    InvoiceItemData,
    InvoiceTableData,
    CardDetailData,
    HtmlCompleteData
} from "./types";

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

export function generateHtmlComplete(templates: HtmlCompleteData) {
    return {
        ...templates.otethersArgs !== undefined ? templates.otethersArgs : {},
        HTML_CONTENT: `
            <div class="page">
                <!-- HEADER DINÁMICO -->
                ${templates.header}
                <main class="body">
                    <!-- CONTENIDO DINÁMICO -->
                    ${templates.body}
                </main>
                <!-- FOOTER DINÁMICO -->
                ${buildHtmlCompleteFooter().COMPLETE_FOOTER_HTML}
            </div>
        `
    }
}

export function generateBodyContext(builders: string[]): string {
    return builders.join('');
}

const MAX_CELLS = 7;
export function buildHtmlHdr(hdrData: HdrData): any {
    return `
      <header class="hdr">
        <div class="hdr-brand">
            <div class="logo-wrap ${hdrData.LOGO_CLASS}">${hdrData.LOGO_IMG_TAG}<span class="logo-initials">${hdrData.LOGO_INITIALS}</span></div>
            <div class="hdr-name">
            <h1>${hdrData.COMPANY_NAME}</h1>
            <p>${hdrData.COMPANY_TAGLINE}</p>
            </div>
        </div>
        <div class="hdr-meta">
            <div class="hm-type">${hdrData.DOC_TYPE_LABEL}</div>
            <div class="hm-num">${hdrData.DOC_NUMBER}</div>
            <div class="hm-date">${hdrData.DOC_DATE}</div>
        </div>
      </header>
    `
}

export function buildHtmlTbar(tbarData: TBarData): string {
    let classes = '';
    if (tbarData.classes && tbarData.classes.length > 0) {
        classes = tbarData.classes.join(' ');
    }
    return `
        <div class="tbar">
            <h2>${tbarData.documentTitle}</h2><span class="tbar-badge ${classes}">${tbarData.label}</span>
        </div>
    `;
}

export function buildHtmlMbCell(mbCellData: MbCellData[]): string {
    return `
        <div class="mbar">
            ${mbCellData.map(cell => `
                <div class="mb-cell">
                    <div class="mb-lbl">${cell.label}</div>
                    <div class="mb-val">${cell.value}</div>
                </div>
            `).join('')}
        </div>
    `
}

export function buildHtmlCompleteHeader(data: HeaderData): { COMPLETE_HEADER_HTML: string } {
    if (data.mbCells && data.mbCells.length > MAX_CELLS) {
        console.warn(`Advertencia: Se han proporcionado ${data.mbCells.length} celdas para el header, pero el diseño solo soporta mostrar ${MAX_CELLS}. Las celdas adicionales serán ignoradas.`);
        data.mbCells = data.mbCells.slice(0, MAX_CELLS);
    }
    return {
        COMPLETE_HEADER_HTML: `
            ${buildHtmlHdr(data.hdr)}
            ${buildHtmlTbar(data.tbar)}
            ${data.mbCells ? buildHtmlMbCell(data.mbCells) : ''}
        `
    };
}

export function buildHtmlCompleteFooter(): { COMPLETE_FOOTER_HTML: string } {
    return {
        COMPLETE_FOOTER_HTML: `
            <footer class="ftr">
                <span class="fl">{{COMPANY_NAME}} · {{COMPANY_WEBSITE}}</span>
                <span class="fpg">{{PAGE_NUMBER}} / {{TOTAL_PAGES}}</span>
                <span class="fr">{{DOC_NUMBER}} · {{DOC_DATE}}</span>
            </footer>
    `
    }
}

export function buildParagraphs(paragraphs: string | string[], optionals: { spacing?: SpacingOption, classes?: string[] }): string {
    let classs = '';
    if (optionals.spacing !== undefined && optionals.spacing) {
        classs = `sub-spacing-${optionals.spacing}`;
    }
    if (optionals.classes && optionals.classes.length > 0) {
        classs += optionals.classes !== undefined ? ` ${optionals.classes.join(' ')}` : "";
    }
    if (Array.isArray(paragraphs)) {
        return paragraphs.map(p => `<p class="${classs}">${esc(p)}</p>`).join('<br><br>');
    }
    return `<p class="${classs}">${esc(paragraphs)}</p>`
}

export function buildSections(sections: SectionData[]): string {
    return sections.map(sec => {
        let inner = '';

        if (sec.paragraphs?.length) {
            inner += sec.paragraphs.map(p => buildParagraphs(p, {
                spacing: 'L-15'
            })).join('');
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

export function buildHtmlCardNumerated(data: Conclusion[]) {
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

export function buildHtmlSubSection(data: SubSectionData, spacing?: SpacingOption): string {
    return `
                <h4 class="sub-spacing-L-15">${esc(data.title)}</h4>
                ${buildParagraphs(data.content, { spacing })}
            `
}

export function buildHtmlSection(data: BuildSection): string {
    return `
        <div class="sec">
            <div class="sec-hd">
                <span class="sec-dot"></span>
                <h3>${data.number !== undefined ? `${esc(data.number)}. ` : ''}${esc(data.title)}</h3>
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

export function buildTables(tables: TableData[]): string {
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

export function buildGeneratedCardsDetails(cardsData: CardDetailData[]) {
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

export function buildDescriptionSection(title: string, description: string): string {
    return buildHtmlSection({
        title: title,
        html: buildParagraphs(description, { classes: ['para'] })
    })
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
    return buildHtmlSection({
        title: tableInvoiceData.name,
        html: `<div class="twrap">
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
        </div>`
    })
}

export function buildTermsAndConditions(terms: string): string {
    return buildHtmlSection({
        title: "Términos y Condiciones",
        html: buildNote(terms)
    })
}

export function buildNote(text: string): string {
    return `<div class="note"><strong>Nota:</strong> ${esc(text)}</div>`
}
