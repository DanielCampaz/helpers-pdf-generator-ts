// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: TABLES REPORT
// ═══════════════════════════════════════════════════════════════
import { BaseContext, BaseTemplateData } from "../../core/PdfGenerator";

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

export interface DataTable {
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
    TABLES: DataTable[];
    OBSERVATIONS: string;
}

export interface TablesReportContext extends BaseContext, TablesReportData {
    METRICS_HTML: string;
    TABLES_HTML: string;
    OBSERVATIONS_HTML: string;
    COMPLETE_HEADER_HTML: string;
    COMPLETE_FOOTER_HTML: string;
}
