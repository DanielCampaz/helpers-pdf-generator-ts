import { ReportContext, ReportData } from "./types";
import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from "../../core/PdfGenerator";
import { buildExcutiveSummary, buildSections } from "./builders";

export class ReportTemplate implements PdfTemplate<ReportData, ReportContext> {
  public static readonly key = 'report';           // ← clave CLI: --type contract
  public static readonly templateFile = 'report-template.html';
  readonly key = ReportTemplate.key;
  readonly templateFile = ReportTemplate.templateFile;

  private data: ReportData | null = null;

  setData(data: ReportData): void {
    this.data = data;
  }

  getData(): ReportData {
    if (this.data === null) {
      throw new Error(`Data no establecida para template "${this.key}". Asegúrate de pasar los datos al generar el PDF.`);
    }
    return this.data;
  }

  buildContext(data: ReportData & BrandConfig & LogoResult): ReportContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS: `sign-${Math.min(cols, 3)}`,
      SECTIONS_HTML: buildSections(data.SECTIONS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
      EXECUTIVE_HTML: buildExcutiveSummary(data.EXECUTIVE_SUMMARY)
    };
  }
}
