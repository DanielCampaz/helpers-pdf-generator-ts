import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from "../../core/PdfGenerator";
import { buildIntro, buildMetrics, buildObservations, buildTables } from "./builders";
import { TablesReportContext, TablesReportData } from "./types";


export class TablesReportTemplate implements PdfTemplate<TablesReportData, TablesReportContext> {
  public static readonly key = 'tables';           // ← clave CLI: --type contract
  public static readonly templateFile = 'report-tables-template.html';
  readonly key = TablesReportTemplate.key;
  readonly templateFile = TablesReportTemplate.templateFile;

  private data: TablesReportData | null = null

  setData(data: TablesReportData): void {
    this.data = data;
  }

  getData(): TablesReportData {
    if (this.data === null) {
      throw new Error(`Data no establecida para template "${this.key}". Asegúrate de pasar los datos al generar el PDF.`);
    }
    return this.data;
  }

  buildContext(data: TablesReportData & BrandConfig & LogoResult): TablesReportContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS: `sign-${Math.min(cols, 10)}`,
      METRICS_HTML: buildMetrics(data.METRICS),
      TABLES_HTML: buildTables(data.TABLES),
      OBSERVATIONS_HTML: buildObservations(data.OBSERVATIONS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
      INTRO_HTML: buildIntro(data.INTRO_HTML),
    };
  }
}
