import puppeteer                        from 'puppeteer';
import fs                               from 'fs';
import path                             from 'path';
import type { GenerateOptions, BrandConfig, LogoResult, BaseTemplateData, BaseContext } from '../types';
import type { PdfTemplate }             from '../types';
import { getTemplate }                  from '../templates';

// ═══════════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE MARCA
//  Cambia aquí para actualizar header/footer en todos los PDFs
// ═══════════════════════════════════════════════════════════════
export const BRAND: BrandConfig = {
  LOGO_INITIALS:   'AC',
  COMPANY_NAME:    'Acme Consulting S.A.S.',
  COMPANY_TAGLINE: 'Estrategia · Tecnología · Resultados',
  COMPANY_WEBSITE: 'www.acmeconsulting.co',
  /*// Sync con --navy-base y --resalt-base en styles-corporate.css
  COLOR_NAVY:      '#0b2929',
  COLOR_RESALT:    '#3a77c8',
  COLOR_RESALT_LT: '#6aa9e4',*/
};

// ═══════════════════════════════════════════════════════════════
//  UTILIDADES INTERNAS
// ═══════════════════════════════════════════════════════════════

/** Escapa texto para HTML */
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Sustituye {{KEY}} por ctx[KEY].
 * Keys que terminan en _HTML o son LOGO_IMG_TAG se inyectan sin escapar.
 */
function fill(template: string, ctx: Record<string, unknown>): string {
  return template.replace(/\{\{([\w]+)\}\}/g, (_, k: string) => {
    if (k.endsWith('_HTML') || k === 'LOGO_IMG_TAG') return String(ctx[k] ?? '');
    return esc(ctx[k]);
  });
}

/** Convierte un logo en base64 o devuelve vacío si no existe */
function loadLogo(logoPath?: string | null): LogoResult {
  if (!logoPath || !fs.existsSync(logoPath)) {
    return { LOGO_IMG_TAG: '', LOGO_CLASS: 'no-image' };
  }
  const ext  = path.extname(logoPath).toLowerCase();
  const mime = ({
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg':  'image/svg+xml',
    '.webp': 'image/webp',
  } as Record<string, string>)[ext] ?? 'image/png';

  const b64 = fs.readFileSync(logoPath).toString('base64');
  return {
    LOGO_IMG_TAG: `<img src="data:${mime};base64,${b64}" alt="logo"/>`,
    LOGO_CLASS:   'has-image',
  };
}

/** Lee el CSS compartido e inyecta el <link> como <style> inline */
function injectStyles(html: string, cssFilePath: string): string {
  if (!fs.existsSync(cssFilePath)) {
    throw new Error(`CSS no encontrado: ${cssFilePath}`);
  }
  const css      = fs.readFileSync(cssFilePath, 'utf8');
  const styleTag = `<style>\n${css}\n</style>`;
  const linkTag  = html.match(/<link[^>]*styles-corporate\.css[^>]*\/?>/)?.[0];

  return linkTag
    ? html.replace(linkTag, styleTag)
    : html.replace('</head>', `${styleTag}\n</head>`);
}

// ═══════════════════════════════════════════════════════════════
//  PUPPETEER HEADER / FOOTER
// ═══════════════════════════════════════════════════════════════

function buildPuppeteerHeader(data: Record<string, unknown>): string {
  /*const navy      = BRAND.COLOR_NAVY;
  const resalt    = BRAND.COLOR_RESALT;
  const resalt_lt = BRAND.COLOR_RESALT_LT;

  const logoContent = data['LOGO_IMG_TAG']
    ? String(data['LOGO_IMG_TAG'])
    : `<span style="font-family:'Georgia',serif;font-size:18px;font-weight:bold;
        color:${navy};letter-spacing:-1px">${esc(BRAND.LOGO_INITIALS)}</span>`;*/

  return "<span></span>"
  // return `
  //   <div style="width:100%;background:${navy};padding:14px 53px 12px 53px;
  //     display:flex;align-items:center;justify-content:space-between;
  //     font-family:'Helvetica Neue',Arial,sans-serif;box-sizing:border-box;gap:24px;
  //     border-left:5px solid ${resalt};">
  //     <div style="display:flex;align-items:center;gap:14px;">
  //       <div style="width:46px;height:46px;border-radius:8px;overflow:hidden;
  //         background:${resalt};display:flex;align-items:center;justify-content:center;
  //         flex-shrink:0;">${logoContent}</div>
  //       <div>
  //         <div style="font-family:'Georgia',serif;font-size:16px;font-weight:bold;
  //           color:#FFF;letter-spacing:.2px;line-height:1.2;">${esc(BRAND.COMPANY_NAME)}</div>
  //         <div style="font-size:8px;color:rgba(255,255,255,.4);
  //           letter-spacing:1.8px;text-transform:uppercase;margin-top:3px;">
  //           ${esc(BRAND.COMPANY_TAGLINE)}</div>
  //       </div>
  //     </div>
  //     <div style="text-align:right;flex-shrink:0;">
  //       <div style="font-size:8px;letter-spacing:2.5px;text-transform:uppercase;
  //         color:${resalt_lt};margin-bottom:4px;">${esc(String(data['DOC_TYPE_LABEL'] ?? ''))}</div>
  //       <div style="font-family:'Georgia',serif;font-size:14px;font-weight:bold;
  //         color:#FFF;">${esc(String(data['DOC_NUMBER'] ?? ''))}</div>
  //       <div style="font-size:9px;color:rgba(255,255,255,.4);margin-top:3px;">
  //         ${esc(String(data['DOC_DATE'] ?? ''))}</div>
  //     </div>
  //   </div>`;
}

function buildPuppeteerFooter(data: Record<string, unknown>): string {
  /*const navy   = BRAND.COLOR_NAVY;
  const resalt = BRAND.COLOR_RESALT;*/

  return `
    <div style="
      width:100%; background:#0B1829;
      padding:8px 53px;
      display:flex; align-items:center; justify-content:space-between;
      font-family:'Helvetica Neue',Arial,sans-serif;
      font-size:9px; box-sizing:border-box;
    ">
      <span style="color:rgba(255,255,255,.90)">${esc(BRAND.COMPANY_NAME)} · ${esc(BRAND.COMPANY_WEBSITE)}</span>
      <span style="
        background:#C8973A; color:#0B1829; font-size:9px; font-weight:bold;
        padding:3px 12px; border-radius:20px;
      "><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      <span style="color:rgba(255,255,255,.90)">${esc(String(data['DOC_NUMBER'] ?? ''))} · ${esc(String(data['DOC_DATE'] ?? ''))}</span>
    </div>`;
  /*return `
    <div style="width:100%;background:${navy};padding:8px 53px;
      display:flex;align-items:center;justify-content:space-between;
      font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;box-sizing:border-box;">
      <span style="color:rgba(255,255,255,.70)">${esc(BRAND.COMPANY_NAME)} · ${esc(BRAND.COMPANY_WEBSITE)}</span>
      <span style="background:${resalt};color:${navy};font-size:9px;font-weight:bold;
        padding:3px 12px;border-radius:20px;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </span>
      <span style="color:rgba(255,255,255,.70)">${esc(String(data['DOC_NUMBER'] ?? ''))} · ${esc(String(data['DOC_DATE'] ?? ''))}</span>
    </div>`;*/
}

// ═══════════════════════════════════════════════════════════════
//  MOTOR DE GENERACIÓN
// ═══════════════════════════════════════════════════════════════

export interface PdfGeneratorOptions {
  /** Directorio donde están los .html y styles-corporate.css */
  templatesDir: string;
  /** Directorio del CSS compartido (default: mismo que templatesDir) */
  cssDir: string;
}

export class PdfGenerator {
  private readonly templatesDir: string;
  private readonly cssPath:      string;

  constructor(options: PdfGeneratorOptions) {
    this.templatesDir = options.templatesDir;
    //this.cssPath      = path.join(options.cssDir ?? options.templatesDir, 'styles-corporate.css');
    this.cssPath      = options.cssDir
  }

  /**
   * Genera un PDF usando el template registrado bajo `options.type`.
   * Acepta datos parciales — usa defaultData del template como base.
   */
  async generate<TData extends BaseTemplateData>(
    options:    GenerateOptions,
    customData?: Partial<TData>,
  ): Promise<void> {
    const template = getTemplate(options.type) as PdfTemplate<TData, BaseContext>;

    // Fusionar: defaultData ← customData ← brand ← logo
    const logo    = loadLogo(options.logoPath);
    const rawData = {
      ...template.defaultData,
      ...customData,
      ...BRAND,
      ...logo,
    } as TData & BrandConfig & LogoResult;

    // Construir contexto HTML
    const ctx = template.buildContext(rawData) as Record<string, unknown>;

    // Cargar y preparar HTML
    const tplPath = path.join(this.templatesDir, template.templateFile);
    if (!fs.existsSync(tplPath)) {
      throw new Error(`Template HTML no encontrado: ${tplPath}`);
    }
    const rawHtml  = fs.readFileSync(tplPath, 'utf8');
    const withCss  = injectStyles(rawHtml, this.cssPath);
    const finalHtml = fill(withCss, ctx);

    // Puppeteer
    console.log(`🚀  Generando PDF [${options.type}]${options.logoPath ? ` — logo: ${options.logoPath}` : ''}…`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      const outPath = path.resolve(options.outputPath);
      await page.pdf({
        path:                outPath,
        format:              'A4',
        printBackground:     true,
        margin:              { top: '20px', right: '0', bottom: '42px', left: '0' },
        displayHeaderFooter: true,
        headerTemplate:      buildPuppeteerHeader(ctx),
        footerTemplate:      buildPuppeteerFooter(ctx),
      });

      const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
      console.log(`✅  PDF listo: ${outPath}  (${kb} KB)`);
    } catch(e) {
      console.error('❌  Error generando PDF:', e instanceof Error ? e.message : e);
      //throw e;
    } finally {
      await browser.close();
    }
  }
}
