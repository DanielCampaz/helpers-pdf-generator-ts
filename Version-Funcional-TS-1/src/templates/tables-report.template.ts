import type { PdfTemplate, TablesReportData, TablesReportContext, BrandConfig, LogoResult } from '../types';
import { buildMetrics, buildTables, buildObservations, buildSignatories, cell, chipCell } from '../builders';

export class TablesReportTemplate implements PdfTemplate<TablesReportData, TablesReportContext> {
  readonly key          = 'tables';
  readonly templateFile = 'report-tables-template.html';

  readonly defaultData: TablesReportData = {
    DOC_TYPE_LABEL:  'Informe de Datos',
    DOC_NUMBER:      'DAT-2025-Q1-003',
    DOC_DATE:        '15 de marzo de 2025',
    DOC_VERSION:     'v1.0',
    DOCUMENT_TITLE:  'Consolidado de Indicadores Operativos — Q1 2025',
    PERIOD:          'Ene – Mar 2025',
    RESPONSIBLE:     'Dpto. Analytics',
    AREA:            'Operaciones',
    STATUS:          'Aprobado',
    CLASSIFICATION:  'Interno',

    INTRO_TEXT:
      'Consolidado de indicadores y datos operativos del primer trimestre de 2025.',

    METRICS: [
      { label: 'Ingresos Totales',     value: '$24.3M', delta: '▲ +18% vs Q1 2024', trend: 'up'   },
      { label: 'Proyectos Activos',    value: '47',     delta: '▲ +12 proyectos',   trend: 'up'   },
      { label: 'Costo Operativo',      value: '$8.1M',  delta: '▼ -5% vs meta',     trend: 'down' },
      { label: 'Satisfacción Cliente', value: '94%',    delta: '→ sin variación',   trend: 'flat' },
    ],

    TABLES: [
      {
        index: '01', title: 'Resumen por Unidad de Negocio', badge: 'Financiero',
        description: 'Ingresos, costos y margen bruto por unidad al cierre del trimestre.',
        columns: [
          { label: 'Unidad',   align: '' },
          { label: 'Ingresos', align: 'right' },
          { label: 'Costos',   align: 'right' },
          { label: 'Margen',   align: 'center' },
          { label: 'Estado',   align: 'center' },
        ],
        rows: [
          { cells: [cell('Consultoría'), cell('$10.200.000', 'right mono'), cell('$3.800.000', 'right mono'), cell('62.7%', 'center bold'), chipCell('En meta', 'green', 'center')] },
          { cells: [cell('Tecnología'),  cell('$8.900.000',  'right mono'), cell('$2.950.000', 'right mono'), cell('66.9%', 'center bold'), chipCell('Supera',  'gold',  'center')] },
          { cells: [cell('Capacitación'),cell('$3.200.000',  'right mono'), cell('$1.650.000', 'right mono'), cell('48.4%', 'center bold'), chipCell('Bajo',    'red',   'center')] },
        ],
        footer_row: [
          cell('TOTAL', 'bold'),
          cell('$24.300.000', 'right bold'),
          cell('$9.380.000',  'right bold'),
          cell('61.4%', 'center bold'),
          cell('—', 'center'),
        ],
        footnote: 'Margen = (Ingresos − Costos) / Ingresos. Valores en COP.',
      },
    ],

    OBSERVATIONS:
      'Capacitación presenta margen bajo (48.4%) por costos de nueva plataforma virtual.',

    SIGNATORIES: [
      { name: 'María F. Ospina', role: 'Analista de Datos Sr.'   },
      { name: 'Andrés Castaño',  role: 'Director de Operaciones' },
      { name: 'Laura Martínez',  role: 'Presidenta Ejecutiva'    },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
  };

  buildContext(data: TablesReportData & BrandConfig & LogoResult): TablesReportContext {
    const cols = data.SIGNATORIES?.length ?? 2;

    return {
      ...data,
      SIGN_CLASS:        `sign-${Math.min(cols, 3)}`,
      METRICS_HTML:      buildMetrics(data.METRICS),
      TABLES_HTML:       buildTables(data.TABLES),
      OBSERVATIONS_HTML: buildObservations(data.OBSERVATIONS),
      SIGNATORIES_HTML:  buildSignatories(data.SIGNATORIES),
    };
  }
}
