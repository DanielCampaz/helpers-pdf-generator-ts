import { PdfGenerator } from './pdf-generator';
import { setTemplate } from './registers-templates';
import { InitializePdfGeneratorOptions } from './types';

// Exports
export * from './pdf-generator';
export * from './dinamic-components';
export * from './builders/index';
export * from './registers-templates';
export * from './types';


export async function initializePdfGenerator(fnOptions: () => Promise<InitializePdfGeneratorOptions>): Promise<PdfGenerator> {
    const options = await fnOptions();
    const templates = options.templatesOptions;
    templates.forEach(t => {
        if (t.key === undefined || t.template === undefined) {
            throw new Error(`Error al registrar template: la función debe retornar un objeto con la forma { key: string, template: PdfTemplate }`);
        }
        setTemplate(() => t);
    });
    const generator = new PdfGenerator(options);
    generator.setBrandConfig(options);
    return generator;
}