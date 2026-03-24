import { HdrData, HeaderData, MbCellData, TBarData } from "./types";

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
    return `
        <div class="tbar">
            <h2>${tbarData.documentTitle}</h2><span class="tbar-badge">${tbarData.label}</span>
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