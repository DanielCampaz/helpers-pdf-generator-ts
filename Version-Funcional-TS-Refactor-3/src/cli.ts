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
import { initializePdfGenerator } from './core/PdfGenerator';
import { dataDefaults, InvoiceTemplate, ReportTemplate, TablesReportTemplate } from './templates';

async function main() {
  // ── Parsear argumentos CLI ───────────────────────────────────
  const args = process.argv.slice(2);
  const get = (flag: string): string | null => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] ?? null : null;
  };

  const type = get('--type') ?? 'invoice';
  const logoPath = get('--logo') ?? pathResolve('./templates/html/logos/Logo-DanielCampaz.comIcoFormat.png');// Logo-DanielCampaz.comIcoFormat.png
  // const logoPath = get('--logo') ?? null;
  const outFile = get('--output') ?? `./${type}-output.pdf`;


  // Esto es opcional, solo si se quieren usar las funciones de registro dinámico de templates
  const generator = await initializePdfGenerator(async () => {
    // Primero se deben de Registrar los Templates
    const invoiceTemplate = new InvoiceTemplate()
    invoiceTemplate.setData(dataDefaults.INVOICEDEFAULTDATA);
    const invoiceRegister = {
      key: InvoiceTemplate.key,
      template: invoiceTemplate
    };
    const reportTemplate = new ReportTemplate();
    reportTemplate.setData(dataDefaults.REPORTDEFAULTDATA);
    const reportRegister = {
      key: ReportTemplate.key,
      template: reportTemplate
    };
    const tablesReportTemplate = new TablesReportTemplate();
    tablesReportTemplate.setData(dataDefaults.TABLESREPORTDEFAULTDATA);
    const tablesReportRegister = {
      key: TablesReportTemplate.key,
      template: tablesReportTemplate
    };
    const templatesOptions = [invoiceRegister, reportRegister, tablesReportRegister];
    // ── Configurar Brand (Obligatorio) ──────────────────────────────
    // Antes de generar, se debe configurar la marca (Brand) con la que se desea generar los documentos. Esto es obligatorio, ya que los templates requieren esta información para construir el contexto de generación.
    // ── Instanciar el motor ──────────────────────────────────────
    const templatePath = pathResolve('./templates/html')
    const templateCssPath = pathResolve('./templates/html/css/styles-corporate.css');
    console.log({
      __dirname,
      templatePath,
      templateCssPath
    });
    return {
      LOGO_INITIALS: 'DC',
      LOGO_PATH: logoPath,
      COMPANY_NAME: 'Daniel Creator',
      COMPANY_TAGLINE: 'Tecnología · Diseño · Escalabilidad',
      COMPANY_WEBSITE: 'www.danielcreator.com',
      templatesDir: templatePath,
      cssDirs: [templateCssPath],
      templatesOptions,
    }
  });

  function pathResolve(p: string) {
    return path.resolve(__dirname, p)
  }

  // ── Generar ──────────────────────────────────────────────────
  generator
    .generate({ type, outputPath: outFile })
    .catch(err => {
      console.error('❌', err.message);
      process.exit(1);
    });
}

main()
  .catch(err => {
    console.error('Error inesperado:', err);
    process.exit(1);
  });