import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from '../../core/PdfGenerator';
import { buildItems } from './builders';
import { InvoiceContext, InvoiceData } from './types';

export class InvoiceTemplate implements PdfTemplate<InvoiceData, InvoiceContext> {
  public static readonly key = 'invoice';           // ← clave CLI: --type contract
  public static readonly templateFile = 'corporate-pdf-template.html';
  readonly key = InvoiceTemplate.key;
  readonly templateFile = InvoiceTemplate.templateFile;

  private data: InvoiceData | null = null;

  setData(data: InvoiceData): void {
    this.data = data;
  }

  getData(): InvoiceData {
    if (this.data === null) {
      throw new Error(`Data no establecida para template "${this.key}". Asegúrate de pasar los datos al generar el PDF.`);
    }
    return this.data;
  }

  buildContext(data: InvoiceData & BrandConfig & LogoResult): InvoiceContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS: `sign-${Math.min(cols, 3)}`,
      ITEMS_HTML: buildItems(data.ITEMS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
    };
  }
}
