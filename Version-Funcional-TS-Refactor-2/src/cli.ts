/**
 * cli.ts — Punto de entrada por línea de comandos
 * ─────────────────────────────────────────────────────────────
 * Uso:
 *   npx ts-node src/cli.ts --type invoice
 *   npx ts-node src/cli.ts --type report  --logo ./logo.png
 *   npx ts-node src/cli.ts --type tables  --output ./out.pdf
 * ─────────────────────────────────────────────────────────────
 */

import path from 'path';
import { PdfGenerator } from './core/PdfGenerator';
import { dataDefaults, InvoiceTemplate, ReportTemplate, setTemplate, TablesReportTemplate } from './templates';

// Primero se deben de Registrar los Templates
setTemplate(() => {
  const invoiceTemplate = new InvoiceTemplate()
  invoiceTemplate.setData(dataDefaults.INVOICEDEFAULTDATA);
  return {
    key: InvoiceTemplate.key,
    template: invoiceTemplate
  };
});
setTemplate(() => {
  const reportTemplate = new ReportTemplate();
  reportTemplate.setData(dataDefaults.REPORTDEFAULTDATA);
  return {
    key: ReportTemplate.key,
    template: reportTemplate
  };
});
setTemplate(() => {
  const tablesReportTemplate = new TablesReportTemplate();
  tablesReportTemplate.setData(dataDefaults.TABLESREPORTDEFAULTDATA);
  return {
    key: TablesReportTemplate.key,
    template: tablesReportTemplate
  };
});

// ── Parsear argumentos CLI ───────────────────────────────────
const args = process.argv.slice(2);
const get = (flag: string): string | null => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] ?? null : null;
};

const type = get('--type') ?? 'invoice';
const logoPath = get('--logo') ?? null;
const outFile = get('--output') ?? `./${type}-output.pdf`;

// ── Instanciar el motor ──────────────────────────────────────
const templatePath = path.resolve(__dirname, './templates-html')
const templateCssPath = path.resolve(__dirname, './templates-html/styles-corporate.css');
console.log({
  __dirname,
  templatePath,
  templateCssPath
});
const generator = new PdfGenerator({
  templatesDir: templatePath,
  cssDir: templateCssPath,
});

// ── Configurar Brand (Obligatorio) ──────────────────────────────
// Antes de generar, se debe configurar la marca (Brand) con la que se desea generar los documentos. Esto es obligatorio, ya que los templates requieren esta información para construir el contexto de generación.
generator.setBrandConfig({
  LOGO_INITIALS: 'DC',
  COMPANY_NAME: 'Daniel Creator',
  COMPANY_TAGLINE: 'Tecnología · Diseño · Escalabilidad',
  COMPANY_WEBSITE: 'www.danielcreator.com',
});

// ── Generar ──────────────────────────────────────────────────
generator
  .generate({ type, logoPath, outputPath: outFile })
  .catch(err => {
    console.error('❌', err.message);
    process.exit(1);
  });
