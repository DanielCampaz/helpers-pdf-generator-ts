import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from "../../core/PdfGenerator";
import { buildHtmlCompleteFooter, buildHtmlCompleteHeader } from "../builders";
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
      ...buildHtmlCompleteHeader({
        tbar: {
          documentTitle: data.DOCUMENT_TITLE,
          label: data.STATUS,
        },
        mbCells: [
          { label: 'Periodo', value: data.PERIOD },
          { label: 'Responsable', value: data.RESPONSIBLE },
          { label: 'Área', value: data.AREA },
          { label: 'Versión', value: data.DOC_VERSION },
          { label: 'Clasificación', value: data.CLASSIFICATION },
        ],
        hdr: {
          COMPANY_NAME: data.COMPANY_NAME,
          COMPANY_TAGLINE: data.COMPANY_TAGLINE,
          LOGO_CLASS: data.LOGO_CLASS,
          LOGO_IMG_TAG: data.LOGO_IMG_TAG,
          LOGO_INITIALS: data.LOGO_INITIALS,
          DOC_TYPE_LABEL: data.DOC_TYPE_LABEL,
          DOC_NUMBER: data.DOC_NUMBER,
          DOC_DATE: data.DOC_DATE,
        }
      }),
      ...buildHtmlCompleteFooter()
    };
  }
}
