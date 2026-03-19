/**
 * cli.ts — Punto de entrada por línea de comandos
 * ─────────────────────────────────────────────────────────────
 * Uso:
 *   npx ts-node src/cli.ts --type invoice
 *   npx ts-node src/cli.ts --type report  --logo ./logo.png
 *   npx ts-node src/cli.ts --type tables  --output ./out.pdf
 * ─────────────────────────────────────────────────────────────
 */

import path           from 'path';
import { PdfGenerator } from './core/PdfGenerator';

// ── Parsear argumentos CLI ───────────────────────────────────
const args = process.argv.slice(2);
const get  = (flag: string): string | null => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] ?? null : null;
};

const type     = get('--type')   ?? 'invoice';
const logoPath = get('--logo')   ?? null;
const outFile  = get('--output') ?? `./${type}-output.pdf`;

// ── Instanciar el motor ──────────────────────────────────────
const templatePath = path.resolve(__dirname, './templates-html')
const templateCssPath = path.resolve(__dirname, './templates-html/styles-corporate.css');
console.log(templatePath);
const generator = new PdfGenerator({
  templatesDir: templatePath,
  cssDir: templateCssPath,
});

// ── Generar ──────────────────────────────────────────────────
generator
  .generate({ type, logoPath, outputPath: outFile })
  .catch(err => {
    console.error('❌', err.message);
    process.exit(1);
  });
