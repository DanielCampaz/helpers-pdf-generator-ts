import fs from 'fs';
import path from 'path';
import { esc } from './builders';
import type { BrandConfig, LogoResult } from './types';

// ═══════════════════════════════════════════════════════════════
//  UTILIDADES INTERNAS
// ═══════════════════════════════════════════════════════════════

/**
 * Sustituye {{KEY}} por ctx[KEY].
 * Keys que terminan en _HTML o son LOGO_IMG_TAG se inyectan sin escapar.
 */
export function fill(template: string, ctx: Record<string, unknown>): string {
    return template.replace(/\{\{([\w]+)\}\}/g, (_, k: string) => {
        if (k.endsWith('_HTML') || k === 'LOGO_IMG_TAG') return String(ctx[k] ?? '');
        return esc(ctx[k]);
    });
}

/** Convierte un logo en base64 o devuelve vacío si no existe */
export function loadLogo(logoPath?: string | null): LogoResult {
    if (!logoPath || !fs.existsSync(logoPath)) {
        return { LOGO_IMG_TAG: '', LOGO_CLASS: 'no-image' };
    }
    const ext = path.extname(logoPath).toLowerCase();
    const mime = ({
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
    } as Record<string, string>)[ext] ?? 'image/png';

    const b64 = fs.readFileSync(logoPath).toString('base64');
    return {
        LOGO_IMG_TAG: `<img src="data:${mime};base64,${b64}" alt="logo"/>`,
        LOGO_CLASS: 'has-image',
    };
}

/** Lee el CSS compartido e inyecta el <link> como <style> inline */
export function injectStyles(html: string, cssFilePath: string): string {
    if (!fs.existsSync(cssFilePath)) {
        throw new Error(`CSS no encontrado: ${cssFilePath}`);
    }
    const css = fs.readFileSync(cssFilePath, 'utf8');
    const styleTag = `<style>\n${css}\n</style>`;
    const linkTag = html.match(/<link[^>]*styles-corporate\.css[^>]*\/?>/)?.[0];

    return linkTag
        ? html.replace(linkTag, styleTag)
        : html.replace('</head>', `${styleTag}\n</head>`);
}

// ═══════════════════════════════════════════════════════════════
//  PUPPETEER HEADER / FOOTER
// ═══════════════════════════════════════════════════════════════

export function buildPuppeteerHeader(data: Record<string, unknown>): string {
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

export function buildPuppeteerFooter(data: Record<string, unknown>, brand: BrandConfig): string {
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
      <span style="color:rgba(255,255,255,.90)">${esc(brand.COMPANY_NAME)} · ${esc(brand.COMPANY_WEBSITE)}</span>
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