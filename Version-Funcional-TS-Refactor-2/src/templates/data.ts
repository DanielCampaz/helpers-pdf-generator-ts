import { ContractData } from "./contract";
import { InvoiceData } from "./invoice";
import { cell, chipCell, ReportData } from "./report";
import { TablesReportData } from "./tables-report";

const contractDefaultData: ContractData = {
    DOC_TYPE_LABEL: 'Contrato',
    DOC_NUMBER: 'CT-2025-001',
    DOC_DATE: '15 de marzo de 2025',
    DOCUMENT_TITLE: 'Contrato de Prestación de Servicios',
    CONTRACT_NUMBER: 'CT-2025-001',
    VALID_FROM: '1 de abril de 2025',
    VALID_UNTIL: '31 de marzo de 2026',
    PARTY_A_NAME: 'Acme Consulting S.A.S.',
    PARTY_A_TAX_ID: 'NIT: 900.123.456-7',
    PARTY_B_NAME: 'Cliente S.A.',
    PARTY_B_TAX_ID: 'NIT: 800.000.000-1',
    CLAUSES: [
        { number: '1', title: 'Objeto', text: 'El contratista se compromete a prestar servicios de consultoría.' },
        { number: '2', title: 'Duración', text: 'El contrato tendrá una vigencia de 12 meses.' },
        { number: '3', title: 'Valor', text: 'El valor total del contrato es de $100.000.000 COP.' },
    ],
    TOTAL_VALUE: '$100.000.000 COP',
    SIGNATORIES: [
        { name: 'Laura Martínez', role: 'Representante Legal — Acme' },
        { name: 'Pedro Gómez', role: 'Representante Legal — Cliente' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
}

const invoiceDefaultData: InvoiceData = {
    DOC_TYPE_LABEL: 'Factura',
    DOC_NUMBER: 'INV-2025-001',
    DOC_DATE: '15 de marzo de 2025',
    DOCUMENT_TITLE: 'Factura de Servicios Profesionales',
    STATUS_BADGE: 'Pendiente',

    SENDER_NAME: 'Acme Consulting S.A.S.',
    SENDER_ADDRESS: 'Cra. 7 # 71-21, Of. 502',
    SENDER_CITY: 'Bogotá D.C., Colombia',
    SENDER_TAX_ID: 'NIT: 900.123.456-7',
    SENDER_EMAIL: 'facturacion@acmeconsulting.co',
    SENDER_SIGNER_NAME: 'Laura Martínez',
    SENDER_SIGNER_ROLE: 'Gerente Comercial',

    RECEIVER_NAME: 'Inversiones del Valle Ltda.',
    RECEIVER_ADDRESS: 'Av. 6N # 25-35, Piso 3',
    RECEIVER_CITY: 'Cali, Valle del Cauca',
    RECEIVER_TAX_ID: 'NIT: 800.987.654-2',
    RECEIVER_EMAIL: 'compras@inversionesvalle.co',
    RECEIVER_SIGNER_NAME: 'Carlos Ríos',
    RECEIVER_SIGNER_ROLE: 'Director de Compras',

    DOCUMENT_DESCRIPTION:
        'Servicios de consultoría estratégica y transformación digital prestados durante ' +
        'el período comprendido entre el 1 y el 28 de febrero de 2025, conforme al ' +
        'contrato No. CT-2025-018. Valores expresados en pesos colombianos (COP).',

    ITEMS: [
        { index: 1, concept: 'Consultoría en transformación digital', qty: 40, unit_price: '$250.000', total: '$10.000.000' },
        { index: 2, concept: 'Diseño de arquitectura de sistemas', qty: 20, unit_price: '$320.000', total: '$6.400.000' },
        { index: 3, concept: 'Capacitación al equipo (8 sesiones)', qty: 8, unit_price: '$180.000', total: '$1.440.000' },
        { index: 4, concept: 'Soporte técnico post-implementación', qty: 1, unit_price: '$2.500.000', total: '$2.500.000' },
        { index: 5, concept: 'Elaboración de documentación técnica', qty: 1, unit_price: '$900.000', total: '$900.000' },
    ],

    SUBTOTAL: '$21.240.000',
    DISCOUNT_PCT: '5%',
    DISCOUNT_AMOUNT: '-$1.062.000',
    TAX_PCT: '19%',
    TAX_AMOUNT: '$3.834.204',
    TOTAL: '$24.012.204',

    TERMS_AND_CONDITIONS:
        'Pago dentro de 30 días calendario. Retraso genera recargo del 1.5% mensual. ' +
        'Esta factura aplica como título valor según legislación colombiana vigente.',

    SIGNATORIES: [
        { name: 'Laura Martínez', role: 'Gerente Comercial' },
        { name: 'Carlos Ríos', role: 'Director de Compras' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
};

const reportDefaultData: ReportData = {
    DOC_TYPE_LABEL: 'Informe Corporativo',
    DOC_NUMBER: 'RPT-2025-Q1-007',
    DOC_DATE: '15 de marzo de 2025',
    DOC_VERSION: 'v2.1',
    DOCUMENT_TITLE: 'Informe de Gestión — Primer Trimestre 2025',
    AUTHOR_NAME: 'Dpto. de Planeación',
    REVIEWER_NAME: 'Gerencia Financiera',
    APPROVER_NAME: 'Junta Directiva',
    CLASSIFICATION: 'Confidencial',

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
                { title: 'Unidad de Tecnología', content: '5 soluciones desplegadas.' },
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
                text: 'Los resultados del Q1 reflejan la solidez de nuestra estrategia.',
                source: 'Laura Martínez, Presidenta Ejecutiva',
            },
        },
        {
            number: '05', title: 'Conclusiones',
            paragraphs: ['Acciones prioritarias para Q2:'],
            conclusions: [
                { title: 'Acelerar expansión digital', text: 'Aumentar inversión en cloud en 30%.' },
                { title: 'Fortalecer el talento', text: 'Plan de formación en IA para 60 personas.' },
            ],
        },
    ],

    SIGNATORIES: [
        { name: 'Laura Martínez', role: 'Presidenta Ejecutiva' },
        { name: 'Jorge Peñaloza', role: 'Director Financiero' },
        { name: 'Camila Ríos', role: 'Directora de Planeación' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
};

const tablesReportDefaultData: TablesReportData = {
    DOC_TYPE_LABEL: 'Informe de Datos',
    DOC_NUMBER: 'DAT-2025-Q1-003',
    DOC_DATE: '15 de marzo de 2025',
    DOC_VERSION: 'v1.0',
    DOCUMENT_TITLE: 'Consolidado de Indicadores Operativos — Q1 2025',
    PERIOD: 'Ene – Mar 2025',
    RESPONSIBLE: 'Dpto. Analytics',
    AREA: 'Operaciones',
    STATUS: 'Aprobado',
    CLASSIFICATION: 'Interno',

    INTRO_HTML:
        'Consolidado de indicadores y datos operativos del primer trimestre de 2025.',

    METRICS: [
        { label: 'Ingresos Totales', value: '$24.3M', delta: '+18% vs Q1 2024', trend: 'up' },
        { label: 'Proyectos Activos', value: '47', delta: '+12 proyectos', trend: 'up' },
        { label: 'Costo Operativo', value: '$8.1M', delta: '-5% vs meta', trend: 'down' },
        { label: 'Satisfacción Cliente', value: '94%', delta: 'sin variación', trend: 'flat' },
    ],

    TABLES: [
        {
            index: '01', title: 'Resumen por Unidad de Negocio', badge: 'Financiero',
            description: 'Ingresos, costos y margen bruto por unidad al cierre del trimestre.',
            columns: [
                { label: 'Unidad', align: '' },
                { label: 'Ingresos', align: 'right' },
                { label: 'Costos', align: 'right' },
                { label: 'Margen', align: 'center' },
                { label: 'Estado', align: 'center' },
            ],
            rows: [
                { cells: [cell('Consultoría'), cell('$10.200.000', 'right mono'), cell('$3.800.000', 'right mono'), cell('62.7%', 'center bold'), chipCell('En meta', 'green', 'center')] },
                { cells: [cell('Tecnología'), cell('$8.900.000', 'right mono'), cell('$2.950.000', 'right mono'), cell('66.9%', 'center bold'), chipCell('Supera', 'gold', 'center')] },
                { cells: [cell('Capacitación'), cell('$3.200.000', 'right mono'), cell('$1.650.000', 'right mono'), cell('48.4%', 'center bold'), chipCell('Bajo', 'red', 'center')] },
                { cells: [cell('BPO'), cell('$2.000.000', 'right mono'), cell('$980.000', 'right mono'), cell('51.0%', 'center bold'), chipCell('En meta', 'green', 'center')] },
            ],
            footer_row: [
                cell('TOTAL', 'bold'), cell('$24.300.000', 'right bold'),
                cell('$9.380.000', 'right bold'), cell('61.4%', 'center bold'), cell('—', 'center'),
            ],
            footnote: 'Margen = (Ingresos − Costos) / Ingresos. Valores en COP.',
        },
        {
            index: '02', title: 'Pipeline de Proyectos Activos', badge: 'Operativo',
            description: null,
            columns: [
                { label: 'Código', align: '' },
                { label: 'Cliente', align: '' },
                { label: 'Inicio', align: 'center' },
                { label: 'Cierre Est.', align: 'center' },
                { label: 'Avance', align: 'center' },
                { label: 'Estado', align: 'center' },
            ],
            rows: [
                { cells: [cell('PRJ-001', 'mono'), cell('BancoColombia'), cell('Ene 10', 'center'), cell('Abr 30', 'center'), cell('78%', 'center bold'), chipCell('En tiempo', 'green', 'center')] },
                { cells: [cell('PRJ-002', 'mono'), cell('Éxito Retail'), cell('Ene 15', 'center'), cell('Mar 31', 'center'), cell('95%', 'center bold'), chipCell('Cierre', 'gold', 'center')] },
                { cells: [cell('PRJ-003', 'mono'), cell('Seguros Bolívar'), cell('Feb 01', 'center'), cell('May 15', 'center'), cell('42%', 'center bold'), chipCell('En riesgo', 'red', 'center')] },
                { cells: [cell('PRJ-004', 'mono'), cell('ISA'), cell('Feb 10', 'center'), cell('Abr 10', 'center'), cell('60%', 'center bold'), chipCell('En tiempo', 'green', 'center')] },
                { cells: [cell('PRJ-005', 'mono'), cell('Grupo Nutresa'), cell('Mar 01', 'center'), cell('Jun 30', 'center'), cell('15%', 'center bold'), chipCell('Inicio', 'navy', 'center')] },
            ],
            footer_row: null,
            footnote: '"En riesgo" = desviación >10% frente al cronograma original.',
        },
        {
            index: '03', title: 'Cumplimiento de SLA — Soporte', badge: 'Calidad',
            description: null,
            columns: [
                { label: 'Mes', align: '' },
                { label: 'Tickets', align: 'center' },
                { label: 'Resueltos', align: 'center' },
                { label: 'Tiempo Prom.', align: 'center' },
                { label: 'SLA %', align: 'center' },
                { label: 'Resultado', align: 'center' },
            ],
            rows: [
                { cells: [cell('Enero'), cell('142', 'center'), cell('138', 'center'), cell('3.2 h', 'center mono'), cell('97.2%', 'center bold'), chipCell('✓ Cumple', 'green', 'center')] },
                { cells: [cell('Febrero'), cell('167', 'center'), cell('158', 'center'), cell('4.8 h', 'center mono'), cell('94.6%', 'center bold'), chipCell('⚠ Límite', 'amber', 'center')] },
                { cells: [cell('Marzo'), cell('189', 'center'), cell('185', 'center'), cell('2.9 h', 'center mono'), cell('97.9%', 'center bold'), chipCell('✓ Cumple', 'green', 'center')] },
            ],
            footer_row: [
                cell('TRIMESTRE', 'bold'), cell('498', 'center bold'), cell('481', 'center bold'),
                cell('3.6 h', 'center bold'), cell('96.6%', 'center bold'), cell('✓ Cumple', 'center bold'),
            ],
            footnote: 'Meta SLA ≥ 95%. Tiempo = primera respuesta.',
        },
    ],

    OBSERVATIONS:
        'Capacitación presenta margen bajo (48.4%) por costos de nueva plataforma virtual.',

    SIGNATORIES: [
        { name: 'María F. Ospina', role: 'Analista de Datos Sr.' },
        { name: 'Andrés Castaño', role: 'Director de Operaciones' },
        { name: 'Laura Martínez', role: 'Presidenta Ejecutiva' },
    ],
    PAGE_NUMBER: '1',
    TOTAL_PAGES: '1',
};

export const dataDefaults = {
    CONTRACTDEFAULTDATA: contractDefaultData,
    INVOICEDEFAULTDATA: invoiceDefaultData,
    REPORTDEFAULTDATA: reportDefaultData,
    TABLESREPORTDEFAULTDATA: tablesReportDefaultData,
};