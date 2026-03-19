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

import type { PdfTemplate, BaseTemplateData, BaseContext, BrandConfig, LogoResult, Signatory } from '../types';
import { buildSignatories, esc } from '../builders';

// ── 1. Define los datos que necesita tu template ─────────────
export interface ContractClause {
  number: string;
  title:  string;
  text:   string;
}

export interface ContractData extends BaseTemplateData {
  CONTRACT_NUMBER:  string;
  VALID_FROM:       string;
  VALID_UNTIL:      string;
  PARTY_A_NAME:     string;
  PARTY_A_TAX_ID:   string;
  PARTY_B_NAME:     string;
  PARTY_B_TAX_ID:   string;
  CLAUSES:          ContractClause[];
  TOTAL_VALUE:      string;
}

// ── 2. Define el contexto con los bloques HTML generados ─────
export interface ContractContext extends BaseContext, ContractData {
  CLAUSES_HTML: string;
}

// ── 3. Implementa el template ────────────────────────────────
export class ContractTemplate implements PdfTemplate<ContractData, ContractContext> {
  readonly key          = 'contract';           // ← clave CLI: --type contract
  readonly templateFile = 'contract-template.html';

  // Datos de ejemplo / valores por defecto
  readonly defaultData: ContractData = {
    DOC_TYPE_LABEL:  'Contrato',
    DOC_NUMBER:      'CT-2025-001',
    DOC_DATE:        '15 de marzo de 2025',
    DOCUMENT_TITLE:  'Contrato de Prestación de Servicios',
    CONTRACT_NUMBER: 'CT-2025-001',
    VALID_FROM:      '1 de abril de 2025',
    VALID_UNTIL:     '31 de marzo de 2026',
    PARTY_A_NAME:    'Acme Consulting S.A.S.',
    PARTY_A_TAX_ID:  'NIT: 900.123.456-7',
    PARTY_B_NAME:    'Cliente S.A.',
    PARTY_B_TAX_ID:  'NIT: 800.000.000-1',
    CLAUSES: [
      { number: '1', title: 'Objeto',     text: 'El contratista se compromete a prestar servicios de consultoría.' },
      { number: '2', title: 'Duración',   text: 'El contrato tendrá una vigencia de 12 meses.' },
      { number: '3', title: 'Valor',      text: 'El valor total del contrato es de $100.000.000 COP.' },
    ],
    TOTAL_VALUE: '$100.000.000 COP',
    SIGNATORIES: [
      { name: 'Laura Martínez', role: 'Representante Legal — Acme' },
      { name: 'Pedro Gómez',    role: 'Representante Legal — Cliente' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
  };

  // Builder: construye los bloques HTML específicos de este template
  buildContext(data: ContractData & BrandConfig & LogoResult): ContractContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS:       `sign-${Math.min(cols, 3)}`,
      CLAUSES_HTML:     this.buildClauses(data.CLAUSES),
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
