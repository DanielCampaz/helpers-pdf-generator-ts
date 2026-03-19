// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: INVOICE
// ═══════════════════════════════════════════════════════════════

import { BaseContext, BaseTemplateData } from "../../core/PdfGenerator";

export interface InvoiceItem {
    index: number;
    concept: string;
    qty: number | string;
    unit_price: string;
    total: string;
}

export interface InvoiceData extends BaseTemplateData {
    STATUS_BADGE: string;
    SENDER_NAME: string;
    SENDER_ADDRESS: string;
    SENDER_CITY: string;
    SENDER_TAX_ID: string;
    SENDER_EMAIL: string;
    SENDER_SIGNER_NAME: string;
    SENDER_SIGNER_ROLE: string;
    RECEIVER_NAME: string;
    RECEIVER_ADDRESS: string;
    RECEIVER_CITY: string;
    RECEIVER_TAX_ID: string;
    RECEIVER_EMAIL: string;
    RECEIVER_SIGNER_NAME: string;
    RECEIVER_SIGNER_ROLE: string;
    DOCUMENT_DESCRIPTION: string;
    ITEMS: InvoiceItem[];
    SUBTOTAL: string;
    DISCOUNT_PCT: string;
    DISCOUNT_AMOUNT: string;
    TAX_PCT: string;
    TAX_AMOUNT: string;
    TOTAL: string;
    TERMS_AND_CONDITIONS: string;
}

export interface InvoiceContext extends BaseContext, InvoiceData {
    ITEMS_HTML: string;
}