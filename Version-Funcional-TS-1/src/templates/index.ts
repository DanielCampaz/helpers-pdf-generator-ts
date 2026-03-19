import type { PdfTemplate, BaseTemplateData, BaseContext } from '../types';
import { InvoiceTemplate }      from './invoice.template';
import { ReportTemplate }       from './report.template';
import { TablesReportTemplate } from './tables-report.template';

// ═══════════════════════════════════════════════════════════════
//  REGISTRO DE TEMPLATES
//  Para agregar un nuevo template:
//  1. Crea src/templates/mi-template.template.ts
//  2. Implementa PdfTemplate<MiData, MiContext>
//  3. Instancia y agrega aquí abajo — nada más
// ═══════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATES: PdfTemplate<any, any>[] = [
  new InvoiceTemplate(),
  new ReportTemplate(),
  new TablesReportTemplate(),
  // new MiNuevoTemplate(),   ← agrega aquí
];

// Mapa clave → instancia, construido automáticamente
export const templateRegistry = new Map<string, PdfTemplate<BaseTemplateData, BaseContext>>(
  TEMPLATES.map(t => [t.key, t])
);

/** Devuelve el template o lanza error si la clave no existe */
export function getTemplate(key: string): PdfTemplate<BaseTemplateData, BaseContext> {
  const tpl = templateRegistry.get(key);
  if (!tpl) {
    const available = [...templateRegistry.keys()].join(' | ');
    throw new Error(`Template desconocido: "${key}". Disponibles: ${available}`);
  }
  return tpl;
}

export { InvoiceTemplate, ReportTemplate, TablesReportTemplate };
