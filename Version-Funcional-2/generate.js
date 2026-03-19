/**
 * generate.js — Generador unificado de PDFs corporativos
 * ───────────────────────────────────────────────────────────────
 * Uso:
 *   node generate.js --type invoice
 *   node generate.js --type report
 *   node generate.js --type tables
 *   node generate.js --type invoice --logo ./logo.png --output ./out.pdf
 *
 * Instalar: npm install puppeteer
 * ───────────────────────────────────────────────────────────────
 */

'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────────────────────
//  UTILIDADES
// ──────────────────────────────────────────────────────────────
/** Escapa texto para incluirlo de forma segura en HTML */
function e(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sustituye {{KEY}} por ctx[KEY].
 * Si el key termina en _HTML o es LOGO_IMG_TAG, inyecta sin escapar (ya es HTML).
 */
function fill(template, ctx) {
  return template.replace(/\{\{([\w]+)\}\}/g, (_, k) => {
    if (k.endsWith('_HTML') || k === 'LOGO_IMG_TAG') return ctx[k] ?? '';
    return e(ctx[k]);
  });
}

// ──────────────────────────────────────────────────────────────
//  LOGO
// ──────────────────────────────────────────────────────────────
function loadLogo(logoPath) {
  if (!logoPath || !fs.existsSync(logoPath)) {
    return { LOGO_IMG_TAG: '', LOGO_CLASS: 'no-image' };
  }
  const ext = path.extname(logoPath).toLowerCase();
  const mime = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.webp': 'image/webp'
  }[ext] || 'image/png';
  const b64 = fs.readFileSync(logoPath).toString('base64');
  return {
    LOGO_IMG_TAG: `<img src="data:${mime};base64,${b64}" alt="logo"/>`,
    LOGO_CLASS: 'has-image',
  };
}

// ──────────────────────────────────────────────────────────────
//  BUILDERS — producen HTML puro desde datos JS
// ──────────────────────────────────────────────────────────────

function buildSignatories(list) {
  return list.map(s => `
    <div class="sblk">
      <div class="sline"></div>
      <div class="sname">${e(s.name)}</div>
      <div class="srole">${e(s.role)}</div>
    </div>`).join('');
}

// ── INVOICE ────────────────────────────────────────────────────
function buildItems(items) {
  return items.map(it => `
    <tr>
      <td>${e(it.index)}</td>
      <td>${e(it.concept)}</td>
      <td>${e(it.qty)}</td>
      <td>${e(it.unit_price)}</td>
      <td>${e(it.total)}</td>
    </tr>`).join('');
}

// ── REPORT ─────────────────────────────────────────────────────
function buildSections(sections) {
  return sections.map(sec => {
    let inner = '';

    if (sec.paragraphs && sec.paragraphs.length) {
      inner += sec.paragraphs.map(p => `<p>${e(p)}</p>`).join('');
    }

    if (sec.subsections && sec.subsections.length) {
      inner += sec.subsections.map(sub => `
        <h4>${e(sub.title)}</h4>
        <p>${e(sub.content)}</p>`).join('');
    }

    if (sec.list && sec.list.length) {
      inner += `<ul class="clist">${sec.list.map(li => `<li>${e(li)}</li>`).join('')}</ul>`;
    }

    if (sec.quote) {
      inner += `
        <div class="pquote">
          <div class="pquote-text">${e(sec.quote.text)}</div>
          <div class="pquote-src">— ${e(sec.quote.source)}</div>
        </div>`;
    }

    if (sec.conclusions && sec.conclusions.length) {
      inner += `<div class="cgrid">${sec.conclusions.map((c, i) => `
        <div class="ccard">
          <div class="ccard-num">0${i + 1}</div>
          <div class="ccard-ttl">${e(c.title)}</div>
          <div class="ccard-txt">${e(c.text)}</div>
        </div>`).join('')}</div>`;
    }

    return `
    <div class="sec">
      <div class="sec-hd">
        <span class="sec-dot"></span>
        <h3>${e(sec.number)}. ${e(sec.title)}</h3>
        <span class="sec-rule"></span>
      </div>
      ${inner}
    </div>`;
  }).join('');
}

// ── TABLES ─────────────────────────────────────────────────────
function buildMetrics(metrics) {
  return metrics.map(m => `
    <div class="mcard">
      <div class="mc-lbl">${e(m.label)}</div>
      <div class="mc-val">${e(m.value)}</div>
      <div class="mc-dlt ${e(m.trend)}">${e(m.delta)}</div>
    </div>`).join('');
}

function buildCell(c) {
  const cls = e(c.class || '');
  if (c.chip) {
    return `<td class="${cls}"><span class="chip chip-${e(c.chip)}">${e(c.value)}</span></td>`;
  }
  return `<td class="${cls}">${e(c.value)}</td>`;
}

function buildTables(tables) {
  return tables.map(t => {
    const headers = (t.columns || [])
      .map(col => `<th class="${e(col.align)}">${e(col.label)}</th>`).join('');

    const rows = (t.rows || [])
      .map(row => `<tr>${(row.cells || []).map(buildCell).join('')}</tr>`).join('');

    const foot = t.footer_row
      ? `<tfoot><tr>${t.footer_row.map(buildCell).join('')}</tr></tfoot>`
      : '';

    const desc = t.description
      ? `<div class="tb-desc">${e(t.description)}</div>` : '';

    const note = t.footnote
      ? `<div class="tb-note">${e(t.footnote)}</div>` : '';

    return `
    <div class="tblock">
      <div class="tb-hd">
        <span class="tb-idx">T–${e(t.index)}</span>
        <span class="tb-ttl">${e(t.title)}</span>
        <span class="tb-rule"></span>
        <span class="tb-tag">${e(t.badge)}</span>
      </div>
      ${desc}
      <div class="twrap">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
          ${foot}
        </table>
      </div>
      ${note}
    </div>`;
  }).join('');
}

function buildObservations(text) {
  if (!text) return '';
  return `
    <div class="obs">
      <div class="obs-ttl">Observaciones</div>
      <p>${e(text)}</p>
    </div>`;
}

// ──────────────────────────────────────────────────────────────
//  HELPERS para celdas de tabla (para usar en los datos)
// ──────────────────────────────────────────────────────────────
const cell = (value, cls = '') => ({ chip: null, value: String(value ?? ''), class: cls });
const chipCell = (value, color, cls = '') => ({ chip: color, value: String(value ?? ''), class: cls });

// ──────────────────────────────────────────────────────────────
//  EMPRESA (datos compartidos)
// ──────────────────────────────────────────────────────────────
const COMPANY = {
  LOGO_INITIALS: 'DC',
  COMPANY_NAME: 'Daniel Creator',
  COMPANY_TAGLINE: 'Tecnología · Diseño · Escalabilidad',
  COMPANY_WEBSITE: 'www.danielcreator.co',
};

// ──────────────────────────────────────────────────────────────
//  DATOS
// ──────────────────────────────────────────────────────────────
const DATA = {

  invoice: {
    ...COMPANY,
    DOC_TYPE_LABEL: 'Factura',
    DOC_NUMBER: 'INV-2025-001',
    DOC_DATE: '15 de marzo de 2025',
    STATUS_BADGE: 'Pendiente',
    DOCUMENT_TITLE: 'Factura de Servicios Profesionales',

    SENDER_NAME: COMPANY.COMPANY_NAME,
    SENDER_ADDRESS: 'Cra. 7 # 71-21, Of. 502',
    SENDER_CITY: 'Cali, Valle Del Cauca, Colombia',
    SENDER_TAX_ID: 'NIT: 900.123.456-7',
    SENDER_EMAIL: 'facturacion@danielcreator.co',
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
      'Servicios de consultoría estratégica y transformación digital prestados durante el ' +
      'período comprendido entre el 1 y el 28 de febrero de 2025, conforme al contrato ' +
      'No. CT-2025-018. Valores expresados en pesos colombianos (COP).',

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
    PAGE_NUMBER: '1', TOTAL_PAGES: '1',
  },

  report: {
    ...COMPANY,
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
      'superando las metas proyectadas en 6%. La expansión en servicios digitales y ' +
      'tres nuevas cuentas estratégicas fueron los principales impulsores.',

    SECTIONS: [
      {
        number: '01', title: 'Contexto y Alcance',
        paragraphs: [
          'El informe cubre las unidades de Consultoría, Tecnología y Capacitación, ' +
          'con datos consolidados al cierre del período enero–marzo de 2025.',
        ],
      },
      {
        number: '02', title: 'Desempeño Operacional',
        subsections: [
          { title: 'Unidad de Consultoría', content: '47 proyectos ejecutados con 94% de satisfacción. Se incorporaron 12 consultores senior.' },
          { title: 'Unidad de Tecnología', content: '5 soluciones desplegadas. Tiempo de implementación reducido un 22% con DevFast 3.0.' },
        ],
      },
      {
        number: '03', title: 'Logros Estratégicos',
        list: [
          'Certificación ISO 9001:2015 renovada satisfactoriamente.',
          'Alianza firmada con Microsoft para soluciones Azure.',
          'Lanzamiento del portal de autogestión B2B.',
          'Reducción del 15% en costos operativos por automatización.',
        ],
      },
      {
        number: '04', title: 'Perspectiva Directiva',
        quote: {
          text: 'Los resultados del Q1 reflejan la solidez de nuestra estrategia y el compromiso del equipo con la excelencia.',
          source: 'Laura Martínez, Presidenta Ejecutiva',
        },
      },
      {
        number: '05', title: 'Conclusiones y Recomendaciones',
        paragraphs: ['Con base en los resultados, el equipo directivo propone las siguientes acciones prioritarias para Q2:'],
        conclusions: [
          { title: 'Acelerar expansión digital', text: 'Aumentar inversión en servicios cloud en 30% para capturar demanda del sector financiero.' },
          { title: 'Fortalecer el talento', text: 'Plan de formación en IA aplicada para 60 colaboradores.' },
          { title: 'Optimizar procesos internos', text: 'Completar migración del ERP antes del cierre del Q2.' },
          { title: 'Ampliar cartera', text: 'Meta de 8 nuevas cuentas en salud y educación superior.' },
        ],
      },
    ],

    SIGNATORIES: [
      { name: 'Laura Martínez', role: 'Presidenta Ejecutiva' },
      { name: 'Jorge Peñaloza', role: 'Director Financiero' },
      { name: 'Camila Ríos', role: 'Directora de Planeación' },
    ],
    PAGE_NUMBER: '1', TOTAL_PAGES: '1',
  },

  tables: {
    ...COMPANY,
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

    INTRO_TEXT:
      'Consolidado de indicadores y datos operativos del primer trimestre de 2025. ' +
      'Los valores en rojo requieren atención inmediata; en verde superaron la meta establecida.',

    METRICS: [
      { label: 'Ingresos Totales', value: '$24.3M', delta: '▲ +18% vs Q1 2024', trend: 'up' },
      { label: 'Proyectos Activos', value: '47', delta: '▲ +12 proyectos', trend: 'up' },
      { label: 'Costo Operativo', value: '$8.1M', delta: '▼ -5% vs meta', trend: 'down' },
      { label: 'Satisfacción Cliente', value: '94%', delta: '→ sin variación', trend: 'flat' },
    ],

    // ─── Agrega o elimina objetos para tener N tablas ──────
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
      'Capacitación presenta margen bajo (48.4%) por costos de nueva plataforma virtual; ' +
      'se normalizará en Q2. PRJ-003 requiere revisión de cronograma antes del 20 de marzo.',

    SIGNATORIES: [
      { name: 'María F. Ospina', role: 'Analista de Datos Sr.' },
      { name: 'Andrés Castaño', role: 'Director de Operaciones' },
      { name: 'Laura Martínez', role: 'Presidenta Ejecutiva' },
    ],
    PAGE_NUMBER: '1', TOTAL_PAGES: '1',
  },
};

// ──────────────────────────────────────────────────────────────
//  PREPARAR CONTEXTO — convierte datos en HTML antes del fill()
// ──────────────────────────────────────────────────────────────
function prepareContext(type, rawData) {
  const ctx = { ...rawData };
  const cols = rawData.SIGNATORIES?.length || 2;
  ctx.SIGN_CLASS = `sign-${Math.min(cols, 3)}`;

  if (type === 'invoice') {
    ctx.ITEMS_HTML = buildItems(rawData.ITEMS || []);
    ctx.SIGNATORIES_HTML = buildSignatories(rawData.SIGNATORIES || []);
  }

  if (type === 'report') {
    ctx.SECTIONS_HTML = buildSections(rawData.SECTIONS || []);
    ctx.SIGNATORIES_HTML = buildSignatories(rawData.SIGNATORIES || []);
  }

  if (type === 'tables') {
    ctx.METRICS_HTML = buildMetrics(rawData.METRICS || []);
    ctx.TABLES_HTML = buildTables(rawData.TABLES || []);
    ctx.OBSERVATIONS_HTML = buildObservations(rawData.OBSERVATIONS);
    ctx.SIGNATORIES_HTML = buildSignatories(rawData.SIGNATORIES || []);
  }

  return ctx;
}

// ──────────────────────────────────────────────────────────────
//  GENERAR PDF
// ──────────────────────────────────────────────────────────────
async function generatePDF({ type, logoPath, outputPath }) {
  const tplMap = {
    invoice: 'corporate-pdf-template.html',
    report: 'report-template.html',
    tables: 'report-tables-template.html',
  };

  if (!tplMap[type]) {
    console.error(`❌  Tipo desconocido: "${type}". Usa: invoice | report | tables`);
    process.exit(1);
  }

  const tplPath = path.resolve(__dirname, tplMap[type]);
  if (!fs.existsSync(tplPath)) {
    console.error(`❌  Template no encontrado: ${tplPath}`);
    process.exit(1);
  }

  const logo = loadLogo(logoPath);
  const rawData = { ...DATA[type], ...logo };
  const ctx = prepareContext(type, rawData);

  // Lee el CSS compartido e inyéctalo inline antes del </head>
  // Puppeteer con setContent() no puede resolver <link href="archivo.css"> local
  const cssPath = path.resolve(__dirname, 'styles-corporate.css');
  if (!fs.existsSync(cssPath)) {
    console.error('❌  No se encontró styles-corporate.css junto a generate.js');
    process.exit(1);
  }
  const css = fs.readFileSync(cssPath, 'utf8');
  const styleTag = '<style>\n' + css + '\n</style>';

  // Reemplaza el <link> por el <style> completo — búsqueda por string fijo, sin regex
  let rawHtml = fs.readFileSync(tplPath, 'utf8');
  const linkTag = rawHtml.match(/<link[^>]*styles-corporate\.css[^>]*\/?>/)?.[0];
  if (linkTag) {
    rawHtml = rawHtml.replace(linkTag, styleTag);
  } else {
    // Fallback: inyecta antes de </head>
    rawHtml = rawHtml.replace('</head>', styleTag + '\n</head>');
  }
  const html = fill(rawHtml, ctx);

  console.log(`🚀  Generando [${type}]${logoPath ? ` — logo: ${logoPath}` : ' — iniciales'}…`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const out = path.resolve(outputPath);

  // Footer HTML inyectado por Puppeteer en cada página
  // Puppeteer reemplaza <span class="pageNumber"> y <span class="totalPages">
  const companyName = rawData.COMPANY_NAME || '';
  const companyWeb = rawData.COMPANY_WEBSITE || '';
  const docNumber = rawData.DOC_NUMBER || '';
  const docDate = rawData.DOC_DATE || '';

  const footerHtml = `
    <div style="
      width:100%; background:#0B1829;
      padding:8px 53px 8px 53px;
      display:flex; align-items:center; justify-content:space-between;
      font-family:'Helvetica Neue',Arial,sans-serif;
      font-size:9px; box-sizing:border-box;
    ">
      <span style="color:rgba(255,255,255,.72)">${companyName} · ${companyWeb}</span>
      <span style="
        background:#C8973A; color:#0B1829; font-size:9px; font-weight:bold;
        padding:3px 12px; border-radius:20px;
      "><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      <span style="color:rgba(255,255,255,.72)">${docNumber} · ${docDate}</span>
    </div>`;

  await page.pdf({
    path: out, format: 'A4', printBackground: true,
    margin: { top: '20px', right: '0', bottom: '38px', left: '0' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footerHtml,
  });
  await browser.close();

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`✅  Listo: ${out}  (${kb} KB)`);
  if (type === 'tables') console.log(`📊  Tablas: ${DATA[type].TABLES.length}`);
}

// ──────────────────────────────────────────────────────────────
//  CLI
// ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = f => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };

const type = get('--type') || 'invoice';
const logoPath = get('--logo') || null;
const outFile = get('--output') || `./${type}-output.pdf`;

generatePDF({ type, logoPath, outputPath: outFile })
  .catch(err => { console.error('❌', err.message); process.exit(1); });
