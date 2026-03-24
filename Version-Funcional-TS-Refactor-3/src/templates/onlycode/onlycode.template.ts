import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from "../../core/PdfGenerator";
import { buildExcutiveSummary, buildHtmlCompleteHeader, buildSections, generateBodyContext, generateHtmlComplete } from "../builders";
import { HtmlCompleteReturn, Data, HtmlCompleteContext } from "../types";

export class OnlyCodeTemplate implements PdfTemplate<Data, HtmlCompleteContext> {
  public static readonly key = 'onlycode';           // ← clave CLI: --type contract
  public static readonly templateFile = 'template.html';
  readonly key = OnlyCodeTemplate.key;
  readonly templateFile = OnlyCodeTemplate.templateFile;

  private data: Data | null = null;

  setData(data: Data): void {
    this.data = data;
  }

  getData(): Data {
    if (this.data === null) {
      throw new Error(`Data no establecida para template "${this.key}". Asegúrate de pasar los datos al generar el PDF.`);
    }
    return this.data;
  }

  buildContext(data: Data & BrandConfig & LogoResult): HtmlCompleteContext {
    //const cols = data.SIGNATORIES?.length ?? 2;

    return generateHtmlComplete({
      body: generateBodyContext([
        buildExcutiveSummary(data.EXECUTIVE_SUMMARY),
        buildSections(data.SECTIONS),
        buildSignatories(data.SIGNATORIES)
      ]),
      header: buildHtmlCompleteHeader({
        hdr: {
          COMPANY_NAME: data.COMPANY_NAME,
          COMPANY_TAGLINE: data.COMPANY_TAGLINE,
          LOGO_CLASS: data.LOGO_CLASS,
          LOGO_IMG_TAG: data.LOGO_IMG_TAG,
          LOGO_INITIALS: data.LOGO_INITIALS,
          DOC_TYPE_LABEL: data.DOC_TYPE_LABEL,
          DOC_NUMBER: data.DOC_NUMBER,
          DOC_DATE: data.DOC_DATE,
        },
        tbar: {
          documentTitle: data.DOCUMENT_TITLE,
          label: data.DOC_VERSION
        },
        mbCells: [
          { label: 'Elaboración', value: data.AUTHOR_NAME },
          { label: 'Revisión', value: data.REVIEWER_NAME },
          { label: 'Aprobación', value: data.APPROVER_NAME },
          { label: 'Clasificación', value: data.CLASSIFICATION },
        ]
      }).COMPLETE_HEADER_HTML,
      otethersArgs: data
    }) as HtmlCompleteContext
  }
}
