import { BaseContext, BaseTemplateData } from "../../core/PdfGenerator";

// ── 1. Define los datos que necesita tu template ─────────────
export interface ContractClause {
    number: string;
    title: string;
    text: string;
}

export interface ContractData extends BaseTemplateData {
    CONTRACT_NUMBER: string;
    VALID_FROM: string;
    VALID_UNTIL: string;
    PARTY_A_NAME: string;
    PARTY_A_TAX_ID: string;
    PARTY_B_NAME: string;
    PARTY_B_TAX_ID: string;
    CLAUSES: ContractClause[];
    TOTAL_VALUE: string;
}

// ── 2. Define el contexto con los bloques HTML generados ─────
export interface ContractContext extends BaseContext, ContractData {
    CLAUSES_HTML: string;
}