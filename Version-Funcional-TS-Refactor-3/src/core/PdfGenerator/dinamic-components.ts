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

export function fillForHtmlComplete(template: string, ctx: Record<string, unknown>): string {
    return template.replace(/\{\{([\w]+)\}\}/g, (_, k: string) => {
        if (k.endsWith('_HTML') || k === 'LOGO_IMG_TAG') return String(ctx[k] ?? '');
        return ctx[k] !== undefined ? String(ctx[k]) : '';
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

/** Lee el CSS compartido e inyecta el <link> como <style> inline 
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
*/

/** Lee múltiples CSS e inyecta cada uno como <style> inline */
export function injectStyles(html: string, cssFilePaths: string | string[]): string {
    const paths = Array.isArray(cssFilePaths) ? cssFilePaths : [cssFilePaths];

    const styleTags = paths.map((cssFilePath) => {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`CSS no encontrado: ${cssFilePath}`);
        }
        const css = fs.readFileSync(cssFilePath, 'utf8');
        return `<style>\n${css}\n</style>`;
    });

    const combinedStyleTags = styleTags.join('\n');

    // Reemplaza el primer <link> de styles-corporate.css si existe
    const linkTag = html.match(/<link[^>]*styles-corporate\.css[^>]*\/?>/)?.[0];

    return linkTag
        ? html.replace(linkTag, combinedStyleTags)
        : html.replace('</head>', `${combinedStyleTags}\n</head>`);
}

// ═══════════════════════════════════════════════════════════════
//  PUPPETEER HEADER / FOOTER
// ═══════════════════════════════════════════════════════════════

export function buildPuppeteerHeader(_data: Record<string, unknown>): string {
    return "<span></span>";
}

export function buildPuppeteerFooter(data: Record<string, unknown>, brand: BrandConfig): string {
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
}