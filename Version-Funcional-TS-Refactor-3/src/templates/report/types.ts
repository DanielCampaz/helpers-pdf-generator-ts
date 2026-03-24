
// ═══════════════════════════════════════════════════════════════
//  TIPOS DEL TEMPLATE: REPORT
// ═══════════════════════════════════════════════════════════════

import { BaseContext, BaseTemplateData } from "../../core/PdfGenerator";

export interface ReportSubsection {
    title: string;
    content: string;
}

export interface ReportQuote {
    text: string;
    source: string;
}

export interface ReportConclusion {
    title: string;
    text: string;
}

export interface ReportSection {
    number: string;
    title: string;
    paragraphs?: string[];
    subsections?: ReportSubsection[];
    list?: string[];
    quote?: ReportQuote;
    conclusions?: ReportConclusion[];
}

export interface ReportData extends BaseTemplateData {
    DOC_VERSION: string;
    AUTHOR_NAME: string;
    REVIEWER_NAME: string;
    APPROVER_NAME: string;
    CLASSIFICATION: string;
    EXECUTIVE_SUMMARY: string;
    SECTIONS: ReportSection[];
}

export interface ReportContext extends BaseContext, ReportData {
    SECTIONS_HTML: string;
    SIGN_CLASS: string;
    EXECUTIVE_HTML: string;
}

export interface ReportCardDetailData {
    label: string;
    name: string;
    detail: string[]
}