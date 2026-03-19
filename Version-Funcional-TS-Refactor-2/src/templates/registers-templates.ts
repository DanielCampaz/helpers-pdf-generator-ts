import type { BaseContext, BaseTemplateData, PdfTemplate } from '../core/PdfGenerator';

// ═══════════════════════════════════════════════════════════════
//  REGISTRO DE TEMPLATES
//  Para agregar un nuevo template:
//  1. Crea src/templates/mi-template.template.ts
//  2. Implementa PdfTemplate<MiData, MiContext>
//  3. Instancia y agrega aquí abajo — nada más
// ═══════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATES: PdfTemplate<any, any>[] = [];

// Mapa clave → instancia, construido automáticamente
export const templateRegistry = new Map<string, PdfTemplate<BaseTemplateData, BaseContext>>(
    TEMPLATES.map(t => [t.key, t])
);

// export function setTemplate(key: string, template: PdfTemplate<BaseTemplateData, BaseContext>) {
//   templateRegistry.set(key, template);
// }

export function setTemplate(fnTemplate: () => { key: string, template: PdfTemplate<BaseTemplateData, BaseContext> }) {
    const templateRegister = fnTemplate();
    if (templateRegister.key === undefined || templateRegister.template === undefined) {
        throw new Error(`Error al registrar template: la función debe retornar un objeto con la forma { key: string, template: PdfTemplate }`);
    }
    templateRegistry.set(templateRegister.key, templateRegister.template);
}


/** Devuelve el template o lanza error si la clave no existe */
export function getTemplate(key: string): PdfTemplate<BaseTemplateData, BaseContext> {
    const tpl = templateRegistry.get(key);
    if (!tpl) {
        const available = [...templateRegistry.keys()].join(' | ');
        throw new Error(`Template desconocido: "${key}". Disponibles: ${available}`);
    }
    return tpl;
}