import type { PdfTemplate, InvoiceData, InvoiceContext, BrandConfig, LogoResult } from '../types';
import { buildItems, buildSignatories } from '../builders';

export class InvoiceTemplate implements PdfTemplate<InvoiceData, InvoiceContext> {
  readonly key          = 'invoice';
  readonly templateFile = 'corporate-pdf-template.html';

  readonly defaultData: InvoiceData = {
    DOC_TYPE_LABEL:       'Factura',
    DOC_NUMBER:           'INV-2025-001',
    DOC_DATE:             '15 de marzo de 2025',
    DOCUMENT_TITLE:       'Factura de Servicios Profesionales',
    STATUS_BADGE:         'Pendiente',

    SENDER_NAME:          'Acme Consulting S.A.S.',
    SENDER_ADDRESS:       'Cra. 7 # 71-21, Of. 502',
    SENDER_CITY:          'Bogotá D.C., Colombia',
    SENDER_TAX_ID:        'NIT: 900.123.456-7',
    SENDER_EMAIL:         'facturacion@acmeconsulting.co',
    SENDER_SIGNER_NAME:   'Laura Martínez',
    SENDER_SIGNER_ROLE:   'Gerente Comercial',

    RECEIVER_NAME:        'Inversiones del Valle Ltda.',
    RECEIVER_ADDRESS:     'Av. 6N # 25-35, Piso 3',
    RECEIVER_CITY:        'Cali, Valle del Cauca',
    RECEIVER_TAX_ID:      'NIT: 800.987.654-2',
    RECEIVER_EMAIL:       'compras@inversionesvalle.co',
    RECEIVER_SIGNER_NAME: 'Carlos Ríos',
    RECEIVER_SIGNER_ROLE: 'Director de Compras',

    DOCUMENT_DESCRIPTION:
      'Servicios de consultoría estratégica y transformación digital prestados durante ' +
      'el período comprendido entre el 1 y el 28 de febrero de 2025, conforme al ' +
      'contrato No. CT-2025-018. Valores expresados en pesos colombianos (COP).',

    ITEMS: [
      { index: 1, concept: 'Consultoría en transformación digital',  qty: 40, unit_price: '$250.000',   total: '$10.000.000' },
      { index: 2, concept: 'Diseño de arquitectura de sistemas',      qty: 20, unit_price: '$320.000',   total: '$6.400.000'  },
      { index: 3, concept: 'Capacitación al equipo (8 sesiones)',     qty:  8, unit_price: '$180.000',   total: '$1.440.000'  },
      { index: 4, concept: 'Soporte técnico post-implementación',     qty:  1, unit_price: '$2.500.000', total: '$2.500.000'  },
      { index: 5, concept: 'Elaboración de documentación técnica',    qty:  1, unit_price: '$900.000',   total: '$900.000'    },
    ],

    SUBTOTAL:             '$21.240.000',
    DISCOUNT_PCT:         '5%',
    DISCOUNT_AMOUNT:      '-$1.062.000',
    TAX_PCT:              '19%',
    TAX_AMOUNT:           '$3.834.204',
    TOTAL:                '$24.012.204',

    TERMS_AND_CONDITIONS:
      'Pago dentro de 30 días calendario. Retraso genera recargo del 1.5% mensual. ' +
      'Esta factura aplica como título valor según legislación colombiana vigente.',

    SIGNATORIES: [
      { name: 'Laura Martínez', role: 'Gerente Comercial'   },
      { name: 'Carlos Ríos',    role: 'Director de Compras' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
  };

  buildContext(data: InvoiceData & BrandConfig & LogoResult): InvoiceContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS:       `sign-${Math.min(cols, 3)}`,
      ITEMS_HTML:       buildItems(data.ITEMS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
    };
  }
}
