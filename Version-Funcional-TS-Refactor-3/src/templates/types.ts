import { BaseContext, BaseTemplateData } from "../core/PdfGenerator";

export type LocaleFormatDate = Intl.LocalesArgument;
export interface HtmlCompleteData {
    header: string,
    body: string,
    otethersArgs?: Record<string, any>;
}

export interface HtmlCompleteReturn {
    HTML_CONTENT: string;
}

export interface HtmlCompleteContext extends BaseContext {
    HTML_CONTENT: string;
}

export interface TBarData {
    documentTitle: string;
    label: string;
    classes?: string[];
}

export interface MbCellData {
    label: string;
    value: string;
}

export interface HdrData extends Pick<BaseContext, 'LOGO_CLASS' | 'LOGO_IMG_TAG' | 'LOGO_INITIALS' | 'COMPANY_NAME' | 'COMPANY_TAGLINE'>, Pick<BaseTemplateData, 'DOC_DATE' | 'DOC_TYPE_LABEL' | 'DOC_NUMBER'> { }

export interface HeaderData {
    tbar: TBarData;
    mbCells?: MbCellData[] | null;
    hdr: HdrData;
}

export interface Subsection {
    title: string;
    content: string;
}

export type SpacingOption = 'L-15' | 'L-30' | 'R-15' | 'R-30';

export interface Quote {
    text: string;
    source: string;
}

export interface Conclusion {
    title: string;
    text: string;
}

export interface BuildSection {
    number?: string | number;
    title: string;
    html: string | (() => string);
}

export interface SubSectionData {
    title: string;
    content: string;
}

export interface SectionData {
    number: string;
    title: string;
    paragraphs?: string[];
    subsections?: Subsection[];
    list?: string[];
    quote?: Quote;
    conclusions?: Conclusion[];
}

export interface Data extends BaseTemplateData {
    DOC_VERSION: string;
    AUTHOR_NAME: string;
    REVIEWER_NAME: string;
    APPROVER_NAME: string;
    CLASSIFICATION: string;
    EXECUTIVE_SUMMARY: string;
    SECTIONS: SectionData[];
}

export interface Context extends BaseContext, Data {
    SECTIONS_HTML: string;
    SIGN_CLASS: string;
    EXECUTIVE_HTML: string;
}

export interface CardDetailData {
    label: string;
    name: string;
    detail: string[]
}

export type ChipColor = 'green' | 'red' | 'amber' | 'navy' | 'gold';
export type CellAlign = 'right' | 'center' | 'mono' | 'bold' | 'muted' | string;

export interface TableCell {
    value: string;
    class: CellAlign;
    chip: ChipColor | null;
}

export interface TableRow {
    cells: TableCell[];
}

export interface TableColumn {
    label: string;
    align: CellAlign;
}

export interface TableData {
    index: string;
    title: string;
    badge: string;
    description: string | null;
    columns: TableColumn[];
    rows: TableRow[];
    footer_row: TableCell[] | null;
    footnote: string | null;
}

export interface Metric {
    label: string;
    value: string;
    delta: string;
    trend: 'up' | 'down' | 'flat' | 'none';
}

export interface TablesReportData extends BaseTemplateData {
    DOC_VERSION: string;
    PERIOD: string;
    RESPONSIBLE: string;
    AREA: string;
    STATUS: string;
    CLASSIFICATION: string;
    INTRO_HTML: string;
    METRICS: Metric[];
    TABLES: TableData[];
    OBSERVATIONS: string;
}

export interface TablesReportContext extends BaseContext, TablesReportData {
    METRICS_HTML: string;
    TABLES_HTML: string;
    OBSERVATIONS_HTML: string;
    COMPLETE_HEADER_HTML: string;
    COMPLETE_FOOTER_HTML: string;
}


export interface InvoiceItem {
    index: number;
    concept: string;
    qty: number | string;
    unit_price: string;
    total: string;
}

export interface InvoiceItemData {
    index: number | string;
    concept: string;
    qty: number | string;
    unit_price: string;
    total: string;
}

export interface InvoiceTableData {
    name: string;
    ths: string[];
    items: InvoiceItemData[];
    totalTableItems: {
        label: string;
        value: string;
    }[];
}

export interface InvoiceData extends BaseTemplateData {
    STATUS_BADGE: 'Pendiente' | 'Pagada' | 'Vencida' | 'Retrasada';
    STATUS_BADGE_CEO: 'paid' | 'pending' | 'overdue' | 'delayed',
    SENDER_NAME: string;
    SENDER_ADDRESS: string;
    SENDER_CITY: string;
    SENDER_TAX_ID: string;
    SENDER_EMAIL: string;
    SENDER_SIGNER_NAME: string;
    SENDER_SIGNER_ROLE: string;
    RECEIVER_NAME: string;
    RECEIVER_ADDRESS: string;
    RECEIVER_CITY: string;
    RECEIVER_TAX_ID: string;
    RECEIVER_EMAIL: string;
    RECEIVER_SIGNER_NAME: string;
    RECEIVER_SIGNER_ROLE: string;
    DOCUMENT_DESCRIPTION: string;
    ITEMS: InvoiceItem[];
    SUBTOTAL: string;
    DISCOUNT_PCT: string;
    DISCOUNT_AMOUNT: string;
    TAX_PCT: string;
    TAX_AMOUNT: string;
    TOTAL: string;
    TERMS_AND_CONDITIONS: string;
}

export interface InvoiceContext extends BaseContext, InvoiceData {
    ITEMS_HTML: string;
    PARTIES_HTML: string;
    DESCRIPTION_HTML: string;
    DETAILS_INVOICE_HTML: string;
    TERMS_HTML: string;
}