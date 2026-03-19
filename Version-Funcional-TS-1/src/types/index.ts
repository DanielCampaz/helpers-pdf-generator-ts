// ═══════════════════════════════════════════════════════════════
//  TIPOS BASE
// ═══════════════════════════════════════════════════════════════

/** Datos de marca compartidos por todos los templates */
export interface BrandConfig {
  LOGO_INITIALS:   string;
  COMPANY_NAME:    string;
  COMPANY_TAGLINE: string;
  COMPANY_WEBSITE: string;
  /*COLOR_NAVY:      string;
  COLOR_RESALT:    string;
  COLOR_RESALT_LT: string;*/
}

/** Resultado de cargar un logo desde disco */
export interface LogoResult {
  LOGO_IMG_TAG: string;   // <img src="data:..."/> o string vacío
  LOGO_CLASS:   'has-image' | 'no-image';
}

/** Firmante */
export interface Signatory {
  name: string;
  role: string;
}

/** Opciones de entrada para generar un PDF */
export interface GenerateOptions {
  type:       string;         // clave del template, ej: 'invoice' | 'report'
  logoPath?:  string | null;  // ruta al PNG/JPG del logo
  outputPath: string;         // ruta del PDF resultante
}

// ═══════════════════════════════════════════════════════════════
//  CONTRATO DEL TEMPLATE
//  Cada template implementa esta interfaz
// ═══════════════════════════════════════════════════════════════

/**
 * TData  = forma del objeto de datos que necesita el template
 * TCtx   = forma del contexto HTML ya construido (con los _HTML)
 */
export interface PdfTemplate<TData extends BaseTemplateData, TCtx extends BaseContext> {
  /** Clave única: 'invoice', 'report', 'tables', etc. */
  readonly key: string;

  /** Ruta relativa al archivo .html del template */
  readonly templateFile: string;

  /** Datos de ejemplo / default del template */
  readonly defaultData: TData;

  /**
   * Convierte los datos crudos en el contexto HTML listo para fill().
   * Aquí van todos los buildXxx() específicos del template.
   */
  buildContext(data: TData & BrandConfig & LogoResult): TCtx;
}

// ═══════════════════════════════════════════════════════════════
//  CONTEXTO BASE (lo mínimo que fill() necesita siempre)
// ═══════════════════════════════════════════════════════════════

export interface BaseContext extends BrandConfig, LogoResult {
  SIGN_CLASS:       string;
  SIGNATORIES_HTML: string;
  PAGE_NUMBER:      string;
  TOTAL_PAGES:      string;
  [key: string]:    unknown;  // permite campos _HTML adicionales
}

export interface BaseTemplateData {
  DOC_TYPE_LABEL:  string;
  DOC_NUMBER:      string;
  DOC_DATE:        string;
  DOCUMENT_TITLE:  string;
  SIGNATORIES:     Signatory[];
  PAGE_NUMBER:     string;
  TOTAL_PAGES:     string;
}

// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: INVOICE
// ═══════════════════════════════════════════════════════════════

export interface InvoiceItem {
  index:      number;
  concept:    string;
  qty:        number | string;
  unit_price: string;
  total:      string;
}

export interface InvoiceData extends BaseTemplateData {
  STATUS_BADGE:         string;
  SENDER_NAME:          string;
  SENDER_ADDRESS:       string;
  SENDER_CITY:          string;
  SENDER_TAX_ID:        string;
  SENDER_EMAIL:         string;
  SENDER_SIGNER_NAME:   string;
  SENDER_SIGNER_ROLE:   string;
  RECEIVER_NAME:        string;
  RECEIVER_ADDRESS:     string;
  RECEIVER_CITY:        string;
  RECEIVER_TAX_ID:      string;
  RECEIVER_EMAIL:       string;
  RECEIVER_SIGNER_NAME: string;
  RECEIVER_SIGNER_ROLE: string;
  DOCUMENT_DESCRIPTION: string;
  ITEMS:                InvoiceItem[];
  SUBTOTAL:             string;
  DISCOUNT_PCT:         string;
  DISCOUNT_AMOUNT:      string;
  TAX_PCT:              string;
  TAX_AMOUNT:           string;
  TOTAL:                string;
  TERMS_AND_CONDITIONS: string;
}

export interface InvoiceContext extends BaseContext, InvoiceData {
  ITEMS_HTML: string;
}

// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: REPORT
// ═══════════════════════════════════════════════════════════════

export interface ReportSubsection {
  title:   string;
  content: string;
}

export interface ReportQuote {
  text:   string;
  source: string;
}

export interface ReportConclusion {
  title: string;
  text:  string;
}

export interface ReportSection {
  number:       string;
  title:        string;
  paragraphs?:  string[];
  subsections?: ReportSubsection[];
  list?:        string[];
  quote?:       ReportQuote;
  conclusions?: ReportConclusion[];
}

export interface ReportData extends BaseTemplateData {
  DOC_VERSION:       string;
  AUTHOR_NAME:       string;
  REVIEWER_NAME:     string;
  APPROVER_NAME:     string;
  CLASSIFICATION:    string;
  EXECUTIVE_SUMMARY: string;
  SECTIONS:          ReportSection[];
}

export interface ReportContext extends BaseContext, ReportData {
  SECTIONS_HTML: string;
  SIGN_CLASS:    string;
}

// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: TABLES REPORT
// ═══════════════════════════════════════════════════════════════

export type ChipColor = 'green' | 'red' | 'amber' | 'navy' | 'gold';
export type CellAlign = 'right' | 'center' | 'mono' | 'bold' | 'muted' | string;

export interface TableCell {
  value: string;
  class: CellAlign;
  chip:  ChipColor | null;
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableColumn {
  label: string;
  align: CellAlign;
}

export interface DataTable {
  index:       string;
  title:       string;
  badge:       string;
  description: string | null;
  columns:     TableColumn[];
  rows:        TableRow[];
  footer_row:  TableCell[] | null;
  footnote:    string | null;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

export interface TablesReportData extends BaseTemplateData {
  DOC_VERSION:    string;
  PERIOD:         string;
  RESPONSIBLE:    string;
  AREA:           string;
  STATUS:         string;
  CLASSIFICATION: string;
  INTRO_TEXT:     string;
  METRICS:        Metric[];
  TABLES:         DataTable[];
  OBSERVATIONS:   string;
}

export interface TablesReportContext extends BaseContext, TablesReportData {
  METRICS_HTML:      string;
  TABLES_HTML:       string;
  OBSERVATIONS_HTML: string;
}
