import type { PdfTemplate, ReportData, ReportContext, BrandConfig, LogoResult } from '../types';
import { buildSections, buildSignatories } from '../builders';

export class ReportTemplate implements PdfTemplate<ReportData, ReportContext> {
  readonly key          = 'report';
  readonly templateFile = 'report-template.html';

  readonly defaultData: ReportData = {
    DOC_TYPE_LABEL:    'Informe Corporativo',
    DOC_NUMBER:        'RPT-2025-Q1-007',
    DOC_DATE:          '15 de marzo de 2025',
    DOC_VERSION:       'v2.1',
    DOCUMENT_TITLE:    'Informe de Gestión — Primer Trimestre 2025',
    AUTHOR_NAME:       'Dpto. de Planeación',
    REVIEWER_NAME:     'Gerencia Financiera',
    APPROVER_NAME:     'Junta Directiva',
    CLASSIFICATION:    'Confidencial',

    EXECUTIVE_SUMMARY:
      'Durante Q1 2025 registramos un crecimiento del 18% en ingresos operacionales, ' +
      'superando las metas proyectadas en 6%.',

    SECTIONS: [
      {
        number: '01', title: 'Contexto y Alcance',
        paragraphs: [
          'El informe cubre las unidades de Consultoría, Tecnología y Capacitación.',
        ],
      },
      {
        number: '02', title: 'Desempeño Operacional',
        subsections: [
          { title: 'Unidad de Consultoría', content: '47 proyectos ejecutados con 94% de satisfacción.' },
          { title: 'Unidad de Tecnología',  content: '5 soluciones desplegadas.' },
        ],
      },
      {
        number: '03', title: 'Logros Estratégicos',
        list: [
          'Certificación ISO 9001:2015 renovada.',
          'Alianza firmada con Microsoft para soluciones Azure.',
        ],
      },
      {
        number: '04', title: 'Perspectiva Directiva',
        quote: {
          text:   'Los resultados del Q1 reflejan la solidez de nuestra estrategia.',
          source: 'Laura Martínez, Presidenta Ejecutiva',
        },
      },
      {
        number: '05', title: 'Conclusiones',
        paragraphs: ['Acciones prioritarias para Q2:'],
        conclusions: [
          { title: 'Acelerar expansión digital', text: 'Aumentar inversión en cloud en 30%.' },
          { title: 'Fortalecer el talento',       text: 'Plan de formación en IA para 60 personas.' },
        ],
      },
    ],

    SIGNATORIES: [
      { name: 'Laura Martínez', role: 'Presidenta Ejecutiva'    },
      { name: 'Jorge Peñaloza', role: 'Director Financiero'     },
      { name: 'Camila Ríos',    role: 'Directora de Planeación' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
  };

  buildContext(data: ReportData & BrandConfig & LogoResult): ReportContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS:       `sign-${Math.min(cols, 3)}`,
      SECTIONS_HTML:    buildSections(data.SECTIONS),
      SIGNATORIES_HTML: buildSignatories(data.SIGNATORIES),
    };
  }
}
