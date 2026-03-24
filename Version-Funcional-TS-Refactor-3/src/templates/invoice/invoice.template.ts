import { BrandConfig, buildSignatories, LogoResult, PdfTemplate } from '../../core/PdfGenerator';
import { buildHtmlCompleteFooter, buildHtmlCompleteHeader } from '../builders';
import { buildDescriptionSection, buildGeneratedCardsDetails, buildTableInvoice, buildTableInvoiceItems, buildTermsAndConditions } from './builders';
import { InvoiceContext, InvoiceData } from './types';

export class InvoiceTemplate implements PdfTemplate<InvoiceData, InvoiceContext> {
  public static readonly key = 'invoice';           // ← clave CLI: --type contract
  public static readonly templateFile = 'invoice-template.html';
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

  private getColor(status: InvoiceData['STATUS_BADGE_CEO']): string[] | undefined {
    let classesTbar = undefined;
    switch (status) {
      case 'paid': {
        classesTbar = ['color', 'green']
        break;
      }
      case 'pending': {
        classesTbar = ['color', 'amber']
        break;
      }
      case 'overdue': {
        classesTbar = ['color', 'red']
        break;
      }
      case 'delayed': {
        classesTbar = ['color', 'amber']
        break;
      }
      default: {
        classesTbar = undefined
        break;
      };
    }
    return classesTbar;
  }

  buildContext(data: InvoiceData & BrandConfig & LogoResult): InvoiceContext {
    const cols = data.SIGNATORIES?.length ?? 2;
    let classesTbar = this.getColor(data.STATUS_BADGE_CEO);
    return {
      ...data,
      SIGN_CLASS: `sign-${Math.min(cols, 10)}`,
      ITEMS_HTML: buildTableInvoiceItems(data.ITEMS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
      PARTIES_HTML: buildGeneratedCardsDetails([
        {
          name: 'Emisor',
          label: data.SENDER_NAME,
          detail: [
            data.SENDER_ADDRESS,
            data.SENDER_CITY,
            data.SENDER_TAX_ID,
            data.SENDER_EMAIL
          ]
        },
        {
          name: 'Receptor',
          label: data.RECEIVER_NAME,
          detail: [
            data.RECEIVER_ADDRESS,
            data.RECEIVER_CITY,
            data.RECEIVER_TAX_ID,
            data.RECEIVER_EMAIL
          ]
        }
      ]),
      DESCRIPTION_HTML: buildDescriptionSection(data.DOCUMENT_DESCRIPTION),
      DETAILS_INVOICE_HTML: buildTableInvoice({
        name: 'Detalle de la Factura',
        items: data.ITEMS,
        ths: ['#', 'Concepto', 'Cantidad', 'Precio Unitario', 'Total'],
        totalTableItems: [
          { label: 'Subtotal', value: data.SUBTOTAL },
          { label: `Descuento (${data.DISCOUNT_PCT}%)`, value: data.DISCOUNT_AMOUNT },
          { label: `IVA / Tax (${data.TAX_PCT}%)`, value: data.TAX_AMOUNT },
          { label: 'Total', value: data.TOTAL }
        ]
      }),
      TERMS_HTML: buildTermsAndConditions(data.TERMS_AND_CONDITIONS),
      ...buildHtmlCompleteHeader({
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
          label: data.STATUS_BADGE,
          classes: classesTbar,
        }
      }),
      ...buildHtmlCompleteFooter()
    };
  }
}
