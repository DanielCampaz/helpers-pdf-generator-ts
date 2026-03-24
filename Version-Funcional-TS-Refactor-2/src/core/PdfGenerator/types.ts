
export interface PdfGeneratorOptions {
    /** Directorio donde están los .html y styles-corporate.css */
    templatesDir: string;
    /** Directorio del CSS compartido (default: mismo que templatesDir) */
    cssDirs: string[];
}

export interface PdfGeneratorSetTemplateOptions { key: string, template: PdfTemplate<BaseTemplateData, BaseContext> }

export interface InitializePdfGeneratorOptions extends PdfGeneratorOptions, BrandConfig {
    templatesOptions: PdfGeneratorSetTemplateOptions[]
}


// ═══════════════════════════════════════════════════════════════
//  TIPOS BASE
// ═══════════════════════════════════════════════════════════════

/** Datos de marca compartidos por todos los templates */
export interface BrandConfig {
    LOGO_INITIALS: string;
    LOGO_PATH?: string | null;
    COMPANY_NAME: string;
    COMPANY_TAGLINE: string;
    COMPANY_WEBSITE: string;
}

/** Resultado de cargar un logo desde disco */
export interface LogoResult {
    LOGO_IMG_TAG: string;   // <img src="data:..."/> o string vacío
    LOGO_CLASS: 'has-image' | 'no-image';
}

/** Firmante */
export interface Signatory {
    name: string;
    role: string;
}


/** Opciones de entrada para generar un PDF */
export interface GenerateOptions<TData extends BaseTemplateData> {
    type: string;         // clave del template, ej: 'invoice' | 'report'
    outputPath: string;         // ruta del PDF resultante
    data?: TData
}

// ═══════════════════════════════════════════════════════════════
//  CONTRATO DEL TEMPLATE
//  Cada template implementa esta interfaz
// ═══════════════════════════════════════════════════════════════

/**
 * TData  = forma del objeto de datos que necesita el template
 * TCtx   = forma del contexto HTML ya construido (con los _HTML)
 */
export interface PdfTemplate<TData extends BaseTemplateData, TCtx extends BaseContext> {
    /** Clave única: 'invoice', 'report', 'tables', etc. */
    readonly key: string;

    /** Ruta relativa al archivo .html del template */
    readonly templateFile: string;

    setData(data: TData): void;
    getData(): TData;
    /**
     * Convierte los datos crudos en el contexto HTML listo para fill().
     * Aquí van todos los buildXxx() específicos del template.
     */
    buildContext(data: TData & BrandConfig & LogoResult): TCtx;
}

// ═══════════════════════════════════════════════════════════════
//  CONTEXTO BASE (lo mínimo que fill() necesita siempre)
// ═══════════════════════════════════════════════════════════════

export interface BaseContext extends BrandConfig, LogoResult {
    SIGN_CLASS: string;
    SIGNATORIES_HTML: string;
    PAGE_NUMBER: string;
    TOTAL_PAGES: string;
    [key: string]: unknown;  // permite campos _HTML adicionales
}

export interface BaseTemplateData {
    DOC_TYPE_LABEL: string;
    DOC_NUMBER: string;
    DOC_DATE: string;
    DOCUMENT_TITLE: string;
    SIGNATORIES: Signatory[];
    PAGE_NUMBER: string;
    TOTAL_PAGES: string;
}