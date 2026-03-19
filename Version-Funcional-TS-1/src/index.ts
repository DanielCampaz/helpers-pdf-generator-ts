// ── Motor ────────────────────────────────────────────────────
export { PdfGenerator, BRAND }   from './core/PdfGenerator';
export type { PdfGeneratorOptions } from './core/PdfGenerator';

// ── Interfaces / tipos ───────────────────────────────────────
export type {
  // Contratos
  PdfTemplate,
  BrandConfig,
  LogoResult,
  GenerateOptions,
  BaseTemplateData,
  BaseContext,
  // Invoice
  InvoiceData,
  InvoiceContext,
  InvoiceItem,
  // Report
  ReportData,
  ReportContext,
  ReportSection,
  ReportSubsection,
  ReportQuote,
  ReportConclusion,
  // Tables
  TablesReportData,
  TablesReportContext,
  DataTable,
  TableCell,
  TableRow,
  TableColumn,
  Metric,
  ChipColor,
  // Shared
  Signatory,
} from './types';

// ── Templates ────────────────────────────────────────────────
export { templateRegistry, getTemplate } from './templates';
export { InvoiceTemplate }               from './templates/invoice.template';
export { ReportTemplate }                from './templates/report.template';
export { TablesReportTemplate }          from './templates/tables-report.template';

// ── Builders (útiles para crear templates personalizados) ────
export {
  esc,
  buildSignatories,
  buildItems,
  buildSections,
  buildMetrics,
  buildTables,
  buildObservations,
  buildCell,
  cell,
  chipCell,
} from './builders';
