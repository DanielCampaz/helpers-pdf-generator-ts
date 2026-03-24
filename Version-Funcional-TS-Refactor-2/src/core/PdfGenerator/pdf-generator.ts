import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { buildPuppeteerFooter, buildPuppeteerHeader, fill, injectStyles, loadLogo } from './dinamic-components';
import { PdfTemplate, PdfGeneratorOptions, BrandConfig, GenerateOptions, LogoResult, BaseTemplateData, BaseContext } from './types';
import { getTemplate } from './registers-templates';

// ═══════════════════════════════════════════════════════════════
//  MOTOR DE GENERACIÓN
// ═══════════════════════════════════════════════════════════════
export class PdfGenerator {
    private readonly templatesDir: string;
    private readonly cssPaths: string[];
    private brandConfig: BrandConfig | null = null;

    constructor(options: PdfGeneratorOptions) {
        this.templatesDir = options.templatesDir;
        //this.cssPath      = path.join(options.cssDir ?? options.templatesDir, 'styles-corporate.css');
        this.cssPaths = options.cssDirs;
        this.cssPaths.push(path.join(__dirname, './statics/css/styles-default.css'));
    }

    /*
    * Importacion del Brand de la marca.
    */

    setBrandConfig(config: BrandConfig) {
        this.brandConfig = config;
    }

    /**
     * Genera un PDF usando el template registrado bajo `options.type`.
     * Acepta datos parciales — usa defaultData del template como base.
     */
    async generate<TData extends BaseTemplateData>(
        options: GenerateOptions<TData>,
        customData?: Partial<TData>,
    ): Promise<void> {
        if (this.brandConfig === null) {
            throw new Error('BrandConfig no establecido. Usa setBrandConfig() antes de generar PDFs.');
        }
        const template = getTemplate(options.type) as PdfTemplate<TData, BaseContext>;
        if (options.data !== undefined) {
            template.setData(options.data);
        }
        // Fusionar: defaultData ← customData ← brand ← logo
        const logo = loadLogo(this.brandConfig.LOGO_PATH);
        const rawData = {
            ...template.getData(),  // defaultData
            ...customData,
            ...this.brandConfig,
            ...logo,
        } as TData & BrandConfig & LogoResult;

        // Construir contexto HTML
        const ctx = template.buildContext(rawData) as Record<string, unknown>;

        // Cargar y preparar HTML
        const tplPath = path.join(this.templatesDir, template.templateFile);
        if (!fs.existsSync(tplPath)) {
            throw new Error(`Template HTML no encontrado: ${tplPath}`);
        }
        const rawHtml = fs.readFileSync(tplPath, 'utf8');
        const withCss = injectStyles(rawHtml, this.cssPaths);
        const finalHtml = fill(withCss, ctx);

        // Puppeteer
        console.log(`🚀  Generando PDF [${options.type}]${this.brandConfig.LOGO_PATH ? ` — logo: ${this.brandConfig.LOGO_PATH}` : ''}…`);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

            const outPath = path.resolve(options.outputPath);
            await page.pdf({
                path: outPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '20px', right: '0', bottom: '42px', left: '0' },
                displayHeaderFooter: true,
                headerTemplate: buildPuppeteerHeader(ctx),
                footerTemplate: buildPuppeteerFooter(ctx, this.brandConfig),
            });

            const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
            console.log(`✅  PDF listo: ${outPath}  (${kb} KB)`);
        } catch (e) {
            console.error('❌  Error generando PDF:', e instanceof Error ? e.message : e);
            //throw e;
        } finally {
            await browser.close();
        }
    }
}
