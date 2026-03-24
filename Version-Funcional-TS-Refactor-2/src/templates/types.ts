import { BaseContext, BaseTemplateData } from "../core/PdfGenerator";

export interface TBarData {
    documentTitle: string;
    label: string;
}

export interface MbCellData {
    label: string;
    value: string;
}

export interface HdrData extends Pick<BaseContext, 'LOGO_CLASS' | 'LOGO_IMG_TAG' | 'LOGO_INITIALS' | 'COMPANY_NAME' | 'COMPANY_TAGLINE'>, Pick<BaseTemplateData, 'DOC_DATE' | 'DOC_TYPE_LABEL' | 'DOC_NUMBER'> { }

export interface HeaderData {
    tbar: TBarData;
    mbCells?: MbCellData[] | null;
    hdr: HdrData;
}