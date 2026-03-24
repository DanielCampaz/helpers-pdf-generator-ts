/**
 * EJEMPLO: Cómo agregar un nuevo template "Contrato"
 * ─────────────────────────────────────────────────────────────
 * Pasos:
 *  1. Define los tipos en src/types/index.ts  (o en este mismo archivo)
 *  2. Crea el HTML en templates-html/contract-template.html
 *  3. Implementa la clase aquí
 *  4. Regístrala en src/templates/index.ts
 * ─────────────────────────────────────────────────────────────
 */

import { buildSignatories, esc, type PdfTemplate, type BrandConfig, type LogoResult } from '../../core/PdfGenerator';
import { ContractClause, ContractContext, ContractData } from './types';



// ── 3. Implementa el template ────────────────────────────────
export class ContractTemplate implements PdfTemplate<ContractData, ContractContext> {
  public static readonly key = 'contract';           // ← clave CLI: --type contract
  public static readonly templateFile = 'contract-template.html';
  readonly key = ContractTemplate.key;           // ← clave CLI: --type contract
  readonly templateFile = ContractTemplate.templateFile;

  // Datos de ejemplo / valores por defecto
  private data: ContractData | null = null;

  setData(data: ContractData): void {
    this.data = data;
  }

  getData(): ContractData {
    if (this.data === null) {
      throw new Error(`Data no establecida para template "${this.key}". Asegúrate de pasar los datos al generar el PDF.`);
    }
    return this.data;
  }

  // Builder: construye los bloques HTML específicos de este template
  buildContext(data: ContractData & BrandConfig & LogoResult): ContractContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS: `sign-${Math.min(cols, 3)}`,
      CLAUSES_HTML: this.buildClauses(data.CLAUSES),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
    };
  }

  private buildClauses(clauses: ContractClause[]): string {
    return clauses.map(c => `
      <div class="sec">
        <div class="sec-hd">
          <span class="sec-dot"></span>
          <h3>Cláusula ${esc(c.number)} — ${esc(c.title)}</h3>
          <span class="sec-rule"></span>
        </div>
        <p class="para">${esc(c.text)}</p>
      </div>`
    ).join('');
  }
}

// ── 4. En src/templates/index.ts agregar: ───────────────────
//
//   import { ContractTemplate } from './contract.template';
//
//   const TEMPLATES = [
//     new InvoiceTemplate(),
//     new ReportTemplate(),
//     new TablesReportTemplate(),
//     new ContractTemplate(),   // ← aquí
//   ];
//
// ── Uso desde código: ────────────────────────────────────────
//
//   const generator = new PdfGenerator({ templatesDir: '...' });
//
//   // Con datos por defecto:
//   await generator.generate({ type: 'contract', outputPath: './contrato.pdf' });
//
//   // Con datos personalizados (parcial — solo lo que quieres sobrescribir):
//   await generator.generate<ContractData>(
//     { type: 'contract', outputPath: './contrato.pdf' },
//     {
//       PARTY_B_NAME:  'Mi Cliente S.A.',
//       PARTY_B_TAX_ID:'NIT: 999.999.999-9',
//       CLAUSES: [ ... ],
//     }
//   );
