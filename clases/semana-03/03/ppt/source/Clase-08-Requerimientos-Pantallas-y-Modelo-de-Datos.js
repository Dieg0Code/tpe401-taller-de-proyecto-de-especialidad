const fs = require('fs');
const path = require('path');
const PptxGenJS = require('../../../../../tools/slides-system/node_modules/pptxgenjs');
const { theme, components, utils } = require('../../../../../tools/slides-system');
const { imageSizingContain, imageSizingCrop } = require('../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image');
const { TOKENS: C, TYPOGRAPHY: F, applyAiepTheme } = theme;

const pptx = new PptxGenJS();
applyAiepTheme(pptx, {
  author: 'Diego Obando', company: 'AIEP Osorno',
  subject: 'TPE401 · Clase 08', title: 'Requerimientos, pantallas y modelo de datos',
});
const SH = pptx.ShapeType;
const W = 13.333, H = 7.5, M = 0.72, CW = W - 2 * M;
const output = path.resolve(__dirname, '../Clase-08-Requerimientos-Pantallas-y-Modelo-de-Datos.pptx');
const assets = path.resolve(__dirname, 'assets');

const PHOTOS = {
  'ferreteria.jpg': 'Vijesh Vijayan · Pexels 19756443 · Licencia Pexels',
  'mensajes-celular.jpg': 'RDNE Stock project · Pexels 10376167 · Licencia Pexels',
  'cuaderno.jpg': 'Tima Miroshnichenko · Pexels 4841704 · Licencia Pexels',
  'equipo.jpg': 'Vitaly Gariev · Unsplash TSyD0nGc0Bs · Licencia Unsplash',
  'equipo-mesa.jpg': 'Monstera Production · Pexels 6238170 · Licencia Pexels',
  'boceto-papel.jpg': 'Compagnons · Unsplash 4UGmm3WRUoQ · Licencia Unsplash',
  'sacos-cemento-recorte.jpg': 'Arthur Uzoagba · Pexels 29519165 · Licencia Pexels (recorte local)',
  'brochas-recorte.jpg': 'Ivan S · Pexels 5798971 · Licencia Pexels (recorte local)',
  'lupa-documento.jpg': 'RDNE Stock project · Pexels 7821674 · Licencia Pexels',
  'pausa-cafe.jpg': 'Karola G · Pexels 4195328 · Licencia Pexels',
  'fichero.jpg': 'Daniel Forsman · Unsplash Ph4ZJrwf4x8 · Licencia Unsplash',
  'planilla.jpg': 'Wolf Art · Pexels 34639577 · Licencia Pexels',
};

// Dispositivo de la clase: seis estaciones con color e ícono fijos. La tira del pie repite
// ese código en todas las láminas, de modo que siempre se ve en qué estación se está.
const ST = [
  { name: 'Necesidad', icon: 'target', color: C.red, fg: C.white },
  { name: 'Requerimientos', icon: 'list-checks', color: C.gold, fg: C.navy },
  { name: 'Historia y criterios', icon: 'book-open', color: C.success, fg: C.white },
  { name: 'Recorrido y pantallas', icon: 'monitor-smartphone', color: C.titleFill, fg: C.white },
  { name: 'Datos y tablas', icon: 'database', color: C.navy, fg: C.white },
  { name: 'Prueba', icon: 'flask-conical', color: C.slate, fg: C.white },
];
const QUESTIONS = [
  '¿Quién necesita conseguir qué, y qué operación completa le da ese resultado?',
  '¿Quién actúa, qué ingresa, qué hace el sistema y qué resultado se puede observar? ¿Cómo se comprueba su calidad?',
  '¿Cómo se reconoce que la operación quedó resuelta, también cuando falta un dato o falla el guardado?',
  '¿Qué hace la persona, qué responde el sistema y qué ocurre si no puede continuar?',
  '¿Qué debe poder recuperarse después, a qué pertenece cada dato y cómo se conectan los registros?',
  'Con datos concretos, ¿se guarda y se recupera lo que exige la historia?',
];
// Color fijo para la procedencia de cada decisión.
const ORIGIN = { confirmed: C.success, proposal: C.titleFill, assumption: C.gold, excluded: C.red };

// ---------------------------------------------------------------------------
// Primitivos locales. Tema, marca y validación vienen de slides-system.

function text(s, value, x, y, w, h, opts = {}) {
  s.addText(value, { x, y, w, h, fontFace: F.body, fontSize: 18, color: C.ink, margin: 0,
    valign: 'top', breakLine: false, ...opts });
}
function rect(s, x, y, w, h, fill, line = null, extra = {}) {
  s.addShape(SH.rect, { x, y, w, h, fill: { color: fill },
    line: line ? { color: line, width: 1 } : { color: fill, transparency: 100 }, ...extra });
}
function round(s, x, y, w, h, fill, line = null, extra = {}) {
  s.addShape(SH.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill },
    line: line ? { color: line, width: 1.2 } : { color: fill, transparency: 100 }, ...extra });
}
function hline(s, x, y, w, color = C.border, width = 1) {
  s.addShape(SH.line, { x, y, w, h: 0, line: { color, width } });
}
function arrow(s, x, y, w, color = C.red, width = 2.4) {
  s.addShape(SH.line, { x, y, w, h: 0, line: { color, width, endArrowType: 'triangle' } });
}
function label(s, value, x, y, w, color = C.red, size = 12, align = 'left') {
  text(s, value.toUpperCase(), x, y, w, 0.28, { fontSize: size, bold: true, charSpacing: 1.2, color, align });
}
// Texto dentro de una figura: un solo objeto, así comparten exactamente la misma caja.
function inShape(s, value, shape, x, y, w, h, fill, opts = {}) {
  s.addText(value, { shape, x, y, w, h, fill: { color: fill }, line: { color: fill, transparency: 100 },
    fontFace: F.display, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'mid', margin: 0, ...opts });
}
// Íconos Lucide recoloreados como SVG.
const iconCache = {};
function icon(s, name, x, y, size, color = C.navy, stroke = 2) {
  const key = `${name}-${color}-${stroke}`;
  if (!iconCache[key]) {
    const raw = fs.readFileSync(path.join(assets, 'icons', `${name}.svg`), 'utf8')
      .replace(/<!--[\s\S]*?-->/, '')
      .replace(/stroke="currentColor"/, `stroke="#${color}"`)
      .replace(/stroke-width="2"/, `stroke-width="${stroke}"`)
      .replace(/width="24"/, 'width="240"').replace(/height="24"/, 'height="240"');
    iconCache[key] = 'image/svg+xml;base64,' + Buffer.from(raw).toString('base64');
  }
  s.addImage({ data: iconCache[key], x, y, w: size, h: size });
}
// Disco de color con un ícono centrado.
function disc(s, name, x, y, d, fill, color = C.white, ratio = 0.54, ring = null) {
  s.addShape(SH.ellipse, { x, y, w: d, h: d, fill: { color: fill },
    line: ring ? { color: ring, width: 1.5 } : { color: fill, transparency: 100 } });
  const k = d * ratio;
  icon(s, name, x + (d - k) / 2, y + (d - k) / 2, k, color, 2);
}
function photo(s, file, x, y, w, h) {
  const src = path.join(assets, file);
  s.addImage({ path: src, ...imageSizingCrop(src, x, y, w, h) });
  s._photos = [...(s._photos || []), PHOTOS[file]];
}
function veil(s, x, y, w, h, color = C.navy, transparency = 22) {
  s.addShape(SH.rect, { x, y, w, h, fill: { color, transparency }, line: { color, transparency: 100 } });
}
function logo(s, dark) {
  const file = path.join(assets, dark ? 'logo-aiep-dark.png' : 'logo-aiep.svg');
  s.addImage({ path: file, ...imageSizingContain(file, 10.88, 0.34, 1.75, 0.62) });
}

// Tira de estaciones al pie.
function rail(s, active = [], dark = false) {
  const x0 = M, y = 6.93, h = 0.32, gap = 0.06, w = (10.9 - x0 - gap * 5) / 6;
  const last = active.length ? Math.max(...active) : -1;
  ST.forEach((st, i) => {
    const x = x0 + i * (w + gap);
    const on = active.includes(i), done = i < last && !on;
    const fill = on ? st.color : done ? (dark ? C.titleFill : C.softBlue) : (dark ? C.navy : C.white);
    rect(s, x, y, w, h, fill, on ? (dark && st.color === C.navy ? C.softBlue : null) : done ? null : (dark ? C.titleFill : C.border));
    const fg = on ? st.fg : dark ? C.softBlue : C.navy;
    icon(s, st.icon, x + 0.08, y + 0.06, 0.2, fg, 2.2);
    text(s, st.name, x + 0.32, y, w - 0.36, h, { fontSize: 9.5, bold: on, color: fg, valign: 'mid' });
  });
}

function base(title, phase, { dark = false, active = [], bg = null, titleSize = 31 } = {}) {
  const s = pptx.addSlide();
  components.setBackground(s, bg || (dark ? C.navy : C.paper));
  components.addTopRule(s, SH, C.red);
  s._dark = dark; s._active = active; s._title = title; s._phase = phase; s._titleSize = titleSize;
  return s;
}
// Encabezado: se dibuja después de las fotos de fondo para quedar encima.
function header(s) {
  const dark = s._dark;
  if (s._phase) label(s, s._phase, M, 0.42, 9.6, dark ? C.gold : C.red, 12);
  logo(s, dark);
  if (s._title) text(s, s._title, M, 0.86, 9.9, 0.8, { fontSize: s._titleSize, bold: true, fontFace: F.display, color: dark ? C.white : C.navy, valign: 'mid' });
}
function finish(s, takeaway, { notes = [] } = {}) {
  if (!s._headed) header(s);
  const dark = s._dark;
  if (takeaway) {
    rect(s, M, 6.24, 0.1, 0.46, C.red);
    text(s, takeaway, M + 0.26, 6.2, CW - 0.26, 0.54, { fontSize: 16.5, bold: true, color: dark ? C.white : C.navy, valign: 'mid' });
  }
  rail(s, s._active, dark);
  components.addSlideNumber(s, pptx, { x: 11.93, y: 6.93, w: 0.69, h: 0.32, fontSize: 13, color: dark ? C.white : C.navy });
  s.addNotes([
    'Base: README de la Clase 08, semana 03. Ejemplo conductor: ferretería ficticia de Osorno; sus datos, reglas y cifras son didácticos.',
    ...notes,
    ...(s._photos || []).map(p => `Fotografía: ${p}`),
    'Íconos: Lucide (licencia ISC).',
  ].join('\n'));
  utils.validateSlide(s, pptx);
}
function headed(s) { header(s); s._headed = true; return s; }

// ---------------------------------------------------------------------------
// INTRO

// 01 · Portada.
{
  const s = base('', 'TPE401 · Clase 08 · Semana 03', { dark: true });
  photo(s, 'ferreteria.jpg', 6.75, 1.2, 5.86, 5.1);
  headed(s);
  text(s, 'Requerimientos,\npantallas y\nmodelo de datos', M, 1.25, 5.9, 2.7, { fontSize: 46, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Un método de seis estaciones para diseñar cualquier software.', M, 4.05, 5.6, 0.9, { fontSize: 21, color: C.softBlue });
  ST.forEach((st, i) => disc(s, st.icon, M + i * 0.78, 5.15, 0.62, st.color, st.fg, 0.54, st.color === C.navy ? C.softBlue : null));
  text(s, 'Miércoles 21 de octubre de 2026 · 08:30 a 10:50', M, 6.05, 5.9, 0.35, { fontSize: 14, bold: true, color: C.gold });
  rect(s, 6.75, 5.8, 5.86, 0.5, C.titleFill);
  text(s, 'Caso ficticio: una ferretería de Osorno', 6.95, 5.8, 5.5, 0.5, { fontSize: 15, color: C.white, valign: 'mid' });
  finish(s, '', { notes: ['Foto ilustrativa; no corresponde a una ferretería de Osorno.'] });
}

// 02 · Las seis estaciones como línea de metro.
{
  const s = headed(base('Un método de seis estaciones', 'Encuadre · El método', { active: [0, 1, 2, 3, 4, 5] }));
  text(s, 'Sirve para cualquier software: el de este módulo o uno futuro.', M, 1.72, CW, 0.45, { fontSize: 20 });
  const produce = ['Qué busca la persona', 'Qué hará el sistema', 'Cómo se sabe que funciona', 'Cómo se usa, paso a paso', 'Qué se guarda', 'Se comprueba con datos'];
  const d = 1.2, slot = CW / 6, cy = 3.5;
  rect(s, M + slot / 2, cy - 0.06, slot * 5, 0.12, C.border);
  ST.forEach((st, i) => {
    const cx = M + slot * i + slot / 2;
    disc(s, st.icon, cx - d / 2, cy - d / 2, d, st.color, st.fg);
    inShape(s, String(i + 1), SH.ellipse, cx - 0.2, cy - d / 2 - 0.55, 0.4, 0.4, C.white, { color: C.navy, fontSize: 13, line: { color: st.color, width: 1.5 } });
    text(s, st.name, cx - slot / 2 + 0.03, 4.25, slot - 0.06, 0.6, { fontSize: 15, bold: true, color: C.navy, align: 'center' });
    text(s, produce[i], cx - slot / 2 + 0.08, 4.85, slot - 0.16, 0.6, { fontSize: 14, align: 'center' });
  });
  const x1 = M + slot / 2, x6 = M + slot * 5.5, ry = 5.85;
  s.addShape(SH.line, { x: x6, y: ry - 0.2, w: 0, h: 0.2, line: { color: C.titleFill, width: 1.8 } });
  s.addShape(SH.line, { x: x1, y: ry, w: x6 - x1, h: 0, line: { color: C.titleFill, width: 1.8, beginArrowType: 'triangle' } });
  s.addShape(SH.line, { x: x1, y: ry - 0.2, w: 0, h: 0.2, line: { color: C.titleFill, width: 1.8 } });
  round(s, 3.65, ry - 0.24, 6.03, 0.48, C.paper);
  text(s, 'Si algo no calza, se vuelve a la estación anterior y se ajusta.', 3.7, ry - 0.24, 5.93, 0.48, { fontSize: 14.5, bold: true, color: C.titleFill, align: 'center', valign: 'mid' });
  finish(s, '');
}

// 03 · La operación: unidad que recorre el método.
{
  const s = headed(base('Todo empieza por una operación', 'Encuadre · 08:30 a 08:35'));
  text(s, 'Una operación es una acción completa que una persona realiza con el sistema para obtener un resultado útil.', M, 1.7, CW, 0.85, { fontSize: 21, color: C.navy });
  const items = [
    ['user', C.red, 'Quién', 'La persona que atiende en el mesón'],
    ['mouse-pointer-click', C.navy, 'Qué hace', 'Registra un pedido en el sistema'],
    ['hash', C.success, 'Qué obtiene', 'Un número para consultarlo después'],
  ];
  const slot = CW / 3, d = 1.55;
  items.forEach(([ic, color, k, v], i) => {
    const cx = M + slot * i + slot / 2;
    disc(s, ic, cx - d / 2, 2.8, d, color);
    label(s, k, cx - slot / 2, 4.5, slot, color === C.navy ? C.titleFill : color, 12.5, 'center');
    text(s, v, cx - slot / 2 + 0.25, 4.85, slot - 0.5, 0.85, { fontSize: 21, bold: true, color: C.navy, align: 'center' });
    if (i < 2) arrow(s, cx + d / 2 + 0.25, 3.58, slot - d - 0.5);
  });
  finish(s, 'En el taller se sigue una sola operación, de la necesidad hasta los datos guardados.');
}

// 04 · La pregunta de cada estación, en tarjetas.
{
  const s = headed(base('Cada estación responde una pregunta', 'Encuadre · El método', { active: [0, 1, 2, 3, 4, 5] }));
  const w = 3.78, h = 2.14, gx = (CW - 3 * w) / 2;
  ST.forEach((st, i) => {
    const x = M + (i % 3) * (w + gx), y = 1.74 + Math.floor(i / 3) * (h + 0.14);
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, 0.12, h, st.color);
    disc(s, st.icon, x + 0.32, y + 0.25, 0.66, st.color, st.fg);
    text(s, `${i + 1} · ${st.name}`, x + 1.12, y + 0.25, w - 1.25, 0.66, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
    text(s, QUESTIONS[i], x + 0.32, y + 1.0, w - 0.5, 1.08, { fontSize: 14.5 });
  });
  finish(s, 'La respuesta de una estación es el punto de partida de la siguiente.');
}

// 05 · Mapa de la sesión como línea de tiempo proporcional.
{
  const s = headed(base('Mapa de la sesión', 'Encuadre · 140 minutos'));
  const k = CW / 140, by = 3.05, bh = 0.78;
  const segs = [
    [0, 5, C.slate, null, null, []],
    [5, 25, C.navy, 'Bloque 1', 'Requerimientos', [0, 1]],
    [30, 30, C.navy, 'Bloque 2', 'Historias y pantallas', [2, 3]],
    [60, 10, C.gold, null, null, []],
    [70, 30, C.navy, 'Bloque 3', 'Datos', [4]],
    [100, 30, C.navy, 'Bloque 4', 'Tablas y prueba', [4, 5]],
    [130, 10, C.slate, null, null, []],
  ];
  segs.forEach(([start, len, color, name, sub, sts]) => {
    const x = M + start * k, w = len * k;
    rect(s, x + 0.02, by, w - 0.04, bh, color);
    if (name) {
      text(s, name, x, 2.05, w, 0.36, { fontSize: 17, bold: true, color: C.navy, align: 'center' });
      text(s, sub, x, 2.42, w, 0.5, { fontSize: 13.5, align: 'center' });
      const n = sts.length, d = 0.5, gap = 0.12, total = n * d + (n - 1) * gap;
      sts.forEach((j, q) => disc(s, ST[j].icon, x + (w - total) / 2 + q * (d + gap), by + (bh - d) / 2, d, ST[j].color, ST[j].fg, 0.54, ST[j].color === C.navy ? C.softBlue : null));
    }
  });
  icon(s, 'coffee', M + 60 * k + (10 * k - 0.5) / 2, 2.42, 0.5, C.gold, 2);
  icon(s, 'target', M + (5 * k - 0.32) / 2, 3.28, 0.32, C.white, 2);
  icon(s, 'badge-check', M + 130 * k + (10 * k - 0.4) / 2, 3.24, 0.4, C.white, 2);
  const under = [[M, 'Encuadre', '08:30', 'left'], [M + 65 * k - 0.9, 'Pausa', '09:30 a 09:40', 'center'], [M + CW - 1.8, 'Cierre', '10:40 a 10:50', 'right']];
  under.forEach(([x, n, t, align]) => {
    text(s, n, x, 3.95, 1.8, 0.3, { fontSize: 15, bold: true, color: C.navy, align });
    text(s, t, x, 4.25, 1.8, 0.3, { fontSize: 13, align });
  });
  // Ritmo de cada bloque.
  const steps = ['Explicación breve', 'Trabajo en equipo', 'Tres preguntas'];
  round(s, M, 4.95, CW, 1.0, C.white, C.border);
  label(s, 'Cada bloque', M + 0.3, 5.3, 1.8, C.red, 12);
  steps.forEach((t, i) => {
    const x = M + 2.3 + i * 3.25;
    inShape(s, String(i + 1), SH.ellipse, x, 5.2, 0.5, 0.5, C.navy, { fontSize: 15 });
    text(s, t, x + 0.65, 5.2, 2.3, 0.5, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
    if (i < 2) arrow(s, x + 2.62, 5.45, 0.45);
  });
  finish(s, '');
}

// 06 · El caso conductor en tres cuadros.
{
  const s = headed(base('El caso: una ferretería ficticia de Osorno', 'Encuadre · Ejemplo conductor'));
  const w = 3.72, gap = (CW - 3 * w) / 2, y = 1.8, h = 3.55;
  photo(s, 'mensajes-celular.jpg', M, y, w, h);
  photo(s, 'cuaderno.jpg', M + w + gap, y, w, h);
  const x3 = M + 2 * (w + gap);
  rect(s, x3, y, w, h, C.navy);
  // Conversación simulada: la consulta del cliente.
  round(s, x3 + 0.3, y + 0.35, w - 0.9, 0.85, C.white);
  text(s, '¿Mi pedido ya está listo?', x3 + 0.5, y + 0.35, w - 1.3, 0.85, { fontSize: 18, bold: true, color: C.navy, valign: 'mid' });
  disc(s, 'search', x3 + (w - 1.2) / 2, y + 1.45, 1.2, C.red);
  const caps = ['Los pedidos llegan por WhatsApp', 'Se anotan a mano en un cuaderno', 'Cuesta encontrar qué pidió y en qué estado está'];
  caps.forEach((c, i) => {
    const x = M + i * (w + gap);
    veil(s, x, y + h - 0.85, w, 0.85, C.navy, 12);
    inShape(s, String(i + 1), SH.ellipse, x + 0.18, y + h - 0.66, 0.46, 0.46, C.red, { fontSize: 15 });
    text(s, c, x + 0.78, y + h - 0.85, w - 0.95, 0.85, { fontSize: 15.5, bold: true, color: C.white, valign: 'mid' });
    if (i < 2) arrow(s, x + w + 0.05, y + h / 2, gap - 0.1);
  });
  icon(s, 'user', M, 5.62, 0.42, C.navy, 2);
  text(s, 'Quien atiende en el mesón necesita registrar los pedidos y encontrarlos después.', M + 0.58, 5.6, CW - 0.6, 0.46, { fontSize: 18, bold: true, color: C.navy, valign: 'mid' });
  finish(s, 'El caso es inventado: muestra el procedimiento. Tu equipo lo aplica a su proyecto.', { notes: ['Fotos ilustrativas.'] });
}

// ---------------------------------------------------------------------------
// BLOQUE 1 · Delimitar y precisar requerimientos

// 07 · Apertura del bloque sobre fotografía.
{
  const s = base('', 'Bloque 1 · 08:35 a 09:00 · 25 minutos', { dark: true, active: [0, 1] });
  photo(s, 'equipo.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 18);
  headed(s);
  inShape(s, '1', SH.ellipse, M, 1.3, 1.2, 1.2, C.red, { fontSize: 54 });
  text(s, 'Delimitar y precisar\nrequerimientos', M, 2.75, 6.6, 1.8, { fontSize: 42, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Qué hará la primera versión, y cómo escribirlo para poder comprobarlo.', M, 4.6, 5.9, 0.9, { fontSize: 19, color: C.softBlue });
  [0, 1].forEach(i => {
    const y = 1.4 + i * 2.2, st = ST[i];
    round(s, 7.45, y, 5.16, 1.95, C.navy, st.color, { line: { color: st.color, width: 2 } });
    disc(s, st.icon, 7.7, y + 0.25, 0.72, st.color, st.fg);
    text(s, `${i + 1} · ${st.name}`, 8.6, y + 0.25, 3.8, 0.72, { fontSize: 21, bold: true, color: C.white, valign: 'mid' });
    text(s, QUESTIONS[i], 7.7, y + 1.07, 4.7, 0.8, { fontSize: 14.5, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 08 · Necesidad frente a operación.
{
  const s = headed(base('Necesidad y operación no son lo mismo', 'Bloque 1 · Estación 1', { active: [0] }));
  round(s, M, 1.72, 5.0, 0.5, C.white, C.border);
  icon(s, 'user', M + 0.15, 1.8, 0.34, C.navy);
  text(s, 'Persona: quien atiende en el mesón', M + 0.6, 1.72, 4.3, 0.5, { fontSize: 15.5, bold: true, color: C.navy, valign: 'mid' });
  const w = 5.35, y = 2.5, h = 3.5, x2 = M + CW - w;
  round(s, M, y, w, h, C.white, C.border);
  disc(s, 'target', M + 0.35, y + 0.35, 1.05, C.red);
  label(s, 'Necesidad', M + 1.6, y + 0.45, 3, C.red, 13);
  text(s, 'Lo que la persona busca conseguir', M + 1.6, y + 0.78, w - 1.9, 0.5, { fontSize: 15 });
  text(s, 'Conservar y encontrar la información del pedido.', M + 0.35, y + 1.75, w - 0.7, 1.5, { fontSize: 25, bold: true, color: C.navy });
  arrow(s, M + w + 0.2, y + h / 2, x2 - M - w - 0.4);
  text(s, 'se logra con', M + w, y + h / 2 - 0.45, x2 - M - w, 0.3, { fontSize: 12, bold: true, color: C.red, align: 'center' });
  round(s, x2, y, w, h, C.navy);
  disc(s, 'mouse-pointer-click', x2 + 0.35, y + 0.35, 1.05, C.white, C.navy);
  label(s, 'Operación', x2 + 1.6, y + 0.45, 3, C.gold, 13);
  text(s, 'Una acción completa con el sistema, con un resultado útil', x2 + 1.6, y + 0.78, w - 1.9, 0.7, { fontSize: 15, color: C.softBlue });
  text(s, 'Registrar un pedido y recibir su número para consultarlo después.', x2 + 0.35, y + 1.75, w - 0.7, 1.5, { fontSize: 25, bold: true, color: C.white });
  finish(s, 'La necesidad dice para qué. La operación dice qué se hace con el sistema.');
}

// 09 · Alcance: dentro y fuera.
{
  const s = headed(base('Qué entra en la primera versión', 'Bloque 1 · Estación 1', { active: [0] }));
  text(s, 'El alcance indica qué resolverá el sistema en esta versión y qué queda fuera.', M, 1.68, CW, 0.42, { fontSize: 19 });
  const bx = M, by = 2.3, bw = 7.65, bh = 3.7;
  round(s, bx, by, bw, bh, C.softBlue, C.navy, { line: { color: C.navy, width: 1.6 } });
  label(s, 'Dentro', bx + 0.3, by + 0.22, 2, C.navy, 13);
  const fns = [
    ['circle-plus', 'Registrar un pedido', true],
    ['search', 'Consultar un pedido por su número', false],
    ['badge-check', 'Marcar un pedido como listo para retiro', false],
  ];
  fns.forEach(([ic, t, hot], i) => {
    const y = by + 0.62 + i * 0.9, fx = bx + 0.3, fw = bw - 0.6;
    round(s, fx, y, fw, 0.76, C.white, hot ? C.red : C.border, hot ? { line: { color: C.red, width: 2.6 } } : {});
    disc(s, ic, fx + 0.14, y + 0.1, 0.56, hot ? C.red : C.navy);
    text(s, t, fx + 0.88, y, fw - (hot ? 3.4 : 1.0), 0.76, { fontSize: 18.5, bold: hot, color: C.navy, valign: 'mid' });
    if (hot) inShape(s, 'Se diseña hoy', SH.roundRect, fx + fw - 2.15, y + 0.17, 1.95, 0.42, C.red, { fontSize: 13, rectRadius: 0.06 });
  });
  text(s, '«Listo para retiro»: todos los productos del pedido ya están preparados.', bx + 0.3, by + 3.3, bw - 0.6, 0.32, { fontSize: 13.5, color: C.ink });
  const ox = bx + bw + 0.35, ow = M + CW - ox;
  s.addShape(SH.roundRect, { x: ox, y: by, w: ow, h: bh, rectRadius: 0.08, fill: { color: C.paper }, line: { color: C.red, width: 1.6, dashType: 'dash' } });
  label(s, 'Fuera de esta versión', ox + 0.3, by + 0.22, ow - 0.6, C.red, 13);
  [['credit-card', 'Cobrar dentro del sistema'], ['truck', 'Planificar repartos'], ['message-square-more', 'Mensajes automáticos']].forEach(([ic, t], i) => {
    const y = by + 0.75 + i * 0.98;
    disc(s, ic, ox + 0.3, y, 0.66, C.sand, C.slate);
    s.addShape(SH.line, { x: ox + 0.3, y, w: 0.66, h: 0.66, line: { color: C.red, width: 2.6 } });
    text(s, t, ox + 1.15, y, ow - 1.35, 0.66, { fontSize: 16.5, color: C.ink, valign: 'mid' });
  });
  finish(s, 'Las tres funciones están dentro. El taller sigue solo el registro, hasta sus datos.',
    { notes: ['Todas las decisiones de alcance son didácticas; cada equipo delimita su propio proyecto.'] });
}

// 10 · Procedencia: cada decisión lleva su sello.
{
  const s = headed(base('Cada decisión lleva su sello', 'Bloque 1 · Estación 1', { active: [0] }));
  const cards = [
    [ORIGIN.confirmed, 'CONFIRMADO', 'Dato del caso o acuerdo', 'Se anota la fuente y lo que efectivamente indica.'],
    [ORIGIN.proposal, 'PROPUESTA', 'Idea del equipo', 'Se presenta para discutir. Todavía no es del referente.'],
    [ORIGIN.assumption, 'SUPUESTO', 'Decisión provisional', 'Se adopta para avanzar y falta confirmarla.'],
  ];
  const w = 3.75, gap = (CW - 3 * w) / 2, y = 1.75, h = 3.6;
  cards.forEach(([color, stamp, kind, body], i) => {
    const x = M + i * (w + gap);
    rect(s, x, y, w, h, C.white, C.border);
    s.addText(stamp, { shape: SH.roundRect, x: x + 0.45, y: y + 0.45, w: w - 0.9, h: 0.95, rectRadius: 0.1, rotate: -6,
      fill: { color: C.white }, line: { color, width: 3.5 },
      fontFace: F.display, fontSize: 26, bold: true, color, align: 'center', valign: 'mid', charSpacing: 3, margin: 0 });
    text(s, kind, x + 0.3, y + 1.85, w - 0.6, 0.45, { fontSize: 19, bold: true, color: C.navy });
    text(s, body, x + 0.3, y + 2.35, w - 0.6, 1.05, { fontSize: 17 });
  });
  text(s, 'Referente: la persona de la organización que representa el caso. Una nota de reunión no aprueba todas las ideas mencionadas.', M, 5.7, CW, 0.45, { fontSize: 13.5, color: C.ink });
  finish(s, 'Antes de diseñar, cada decisión queda marcada con uno de estos tres sellos.');
}

// 11 · Supuesto frente a exclusión: lápiz y candado.
{
  const s = headed(base('Un supuesto no es una exclusión', 'Bloque 1 · Estación 1', { active: [0] }));
  const w = 5.5, y = 1.75, h = 4.25, x2 = M + CW - w;
  const sides = [
    [M, C.gold, C.navy, 'pencil', 'Supuesto', 'Se adopta para avanzar.', 'Puede cambiar cuando llega más información.', null],
    [x2, C.red, C.white, 'lock', 'Exclusión', 'Se decidió dejarlo fuera.', 'No se reabre, aunque otro sistema parecido lo tenga.', ['credit-card', 'Ejemplo: cobrar dentro del sistema']],
  ];
  sides.forEach(([x, color, fg, ic, name, a, b, ex]) => {
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, w, 0.14, color);
    disc(s, ic, x + (w - 1.5) / 2, y + 0.4, 1.5, color, fg);
    text(s, name, x, y + 2.0, w, 0.6, { fontSize: 30, bold: true, color: C.navy, align: 'center', fontFace: F.display });
    text(s, a, x + 0.3, y + 2.62, w - 0.6, 0.42, { fontSize: 19, bold: true, color: C.ink, align: 'center' });
    text(s, b, x + 0.3, y + 3.05, w - 0.6, 0.7, { fontSize: 17, align: 'center' });
    if (ex) {
      round(s, x + 0.7, y + h - 0.55, w - 1.4, 0.42, C.paleRed);
      icon(s, ex[0], x + 0.85, y + h - 0.5, 0.32, C.red);
      text(s, ex[1], x + 1.25, y + h - 0.55, w - 2.1, 0.42, { fontSize: 14, bold: true, color: C.navy, valign: 'mid' });
    }
  });
  text(s, '≠', M + w, y + 1.4, x2 - M - w, 1.0, { fontSize: 60, bold: true, color: C.red, align: 'center', valign: 'mid' });
  finish(s, 'El supuesto se puede borrar y corregir. La exclusión queda cerrada.');
}

// 12 · Requerimiento funcional: los verbos de un sistema.
{
  const s = headed(base('Qué es un requerimiento funcional', 'Bloque 1 · Estación 2', { active: [1] }));
  text(s, [
    { text: 'Requerimiento: ', options: { bold: true, color: C.red } },
    { text: 'una capacidad o condición que el sistema debe cumplir.', options: { color: C.navy } },
  ], M, 1.72, CW, 0.5, { fontSize: 22 });
  text(s, [
    { text: 'Funcional: ', options: { bold: true, color: C.red } },
    { text: 'describe una acción del sistema.', options: { color: C.navy } },
  ], M, 2.25, CW, 0.5, { fontSize: 22 });
  const verbs = [['circle-plus', 'Registrar'], ['search', 'Consultar'], ['square-pen', 'Modificar'], ['calculator', 'Calcular'], ['ban', 'Impedir']];
  const w = 2.2, gap = (CW - 5 * w) / 4, y = 3.05, h = 2.85;
  verbs.forEach(([ic, v], i) => {
    const x = M + i * (w + gap), hot = i === 4;
    round(s, x, y, w, h, hot ? C.navy : C.white, hot ? null : C.border);
    disc(s, ic, x + (w - 1.15) / 2, y + 0.35, 1.15, hot ? C.red : C.gold, hot ? C.white : C.navy);
    text(s, v, x, y + 1.7, w, 0.5, { fontSize: 22, bold: true, color: hot ? C.white : C.navy, align: 'center', fontFace: F.display });
    if (hot) text(s, 'si no se cumplen las condiciones', x + 0.15, y + 2.2, w - 0.3, 0.55, { fontSize: 13, color: C.softBlue, align: 'center' });
  });
  finish(s, 'Impedir también es una función: el sistema rechaza lo que no cumple.');
}

// 13 · «Gestionar pedidos»: una frase con cuatro preguntas abiertas.
{
  const s = headed(base('«Gestionar pedidos» no dice qué hacer', 'Bloque 1 · Estación 2', { active: [1] }));
  const cx = W / 2, cy = 3.95, bw = 5.6, bh = 1.6;
  const qs = [
    ['user', '¿Quién lo hace?', M + 0.1, 1.85],
    ['file-text', '¿Con qué datos?', M + CW - 3.6, 1.85],
    ['save', '¿Qué hace el sistema?', M + 0.1, 5.05],
    ['eye', '¿Qué resultado se ve?', M + CW - 3.6, 5.05],
  ];
  // Conectores desde cada pregunta hacia la frase central.
  const box = [cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2];
  s.addShape(SH.line, { x: M + 3.6, y: 2.62, w: box[0] + 0.5 - M - 3.6, h: box[1] - 2.62, line: { color: C.red, width: 1.4, dashType: 'dash' } });
  s.addShape(SH.line, { x: box[2] - 0.5, y: 2.62, w: M + CW - 3.6 - box[2] + 0.5, h: box[1] - 2.62, flipH: true, line: { color: C.red, width: 1.4, dashType: 'dash' } });
  s.addShape(SH.line, { x: M + 3.6, y: box[3], w: box[0] + 0.5 - M - 3.6, h: 5.05 - box[3], flipV: true, line: { color: C.red, width: 1.4, dashType: 'dash' } });
  s.addShape(SH.line, { x: box[2] - 0.5, y: box[3], w: M + CW - 3.6 - box[2] + 0.5, h: 5.05 - box[3], line: { color: C.red, width: 1.4, dashType: 'dash' } });
  inShape(s, '«Gestionar pedidos»', SH.roundRect, box[0], box[1], bw, bh, C.paleRed, { fontSize: 38, color: C.navy, line: { color: C.red, width: 2 }, rectRadius: 0.08 });
  qs.forEach(([ic, q, x, y]) => {
    round(s, x, y, 3.5, 0.78, C.white, C.border);
    disc(s, ic, x + 0.13, y + 0.12, 0.54, C.navy);
    text(s, q, x + 0.8, y, 2.6, 0.78, { fontSize: 17.5, bold: true, color: C.red, valign: 'mid' });
  });
  finish(s, 'Una frase amplia deja abiertas muchas acciones. Hay que responder las cuatro preguntas.');
}

// 14 · Anatomía de un requerimiento preciso: cada parte con su color.
const PARTS = [
  ['user', 'Quién actúa', C.paleRed, C.red],
  ['file-text', 'Qué ingresa', C.softBlue, C.titleFill],
  ['save', 'Qué hace el sistema', C.warningSoft, C.gold],
  ['eye', 'Qué resultado se ve', C.successSoft, C.success],
];
{
  const s = headed(base('Un requerimiento preciso, por partes', 'Bloque 1 · Estación 2', { active: [1] }));
  round(s, M, 1.75, CW, 2.55, C.white, C.border);
  const hi = (t, i) => ({ text: t, options: { bold: true, color: C.navy, highlight: PARTS[i][2] } });
  s.addText([
    { text: 'El sistema debe permitir a ', options: {} }, hi('la persona del mesón', 0),
    { text: ' registrar un pedido con ', options: {} }, hi('el cliente, los productos y sus cantidades', 1),
    { text: '. Al guardarlo, debe ', options: {} }, hi('asignarle un número único', 2),
    { text: ', ', options: {} }, hi('mostrarlo y permitir recuperar la información registrada', 3),
    { text: ' mediante ese número.', options: {} },
  ], { x: M + 0.4, y: 1.9, w: CW - 0.8, h: 2.25, fontFace: F.body, fontSize: 24, color: C.ink, valign: 'mid', margin: 0, lineSpacingMultiple: 1.15 });
  const w = (CW - 0.6) / 4;
  PARTS.forEach(([ic, name, soft, strong], i) => {
    const x = M + i * (w + 0.2), y = 4.55;
    round(s, x, y, w, 1.4, soft);
    disc(s, ic, x + 0.25, y + 0.3, 0.8, strong, strong === C.gold ? C.navy : C.white);
    text(s, `${i + 1} · ${name}`, x + 1.25, y + 0.2, w - 1.4, 1.0, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  });
  finish(s, 'Número único: dos pedidos distintos no comparten el mismo identificador.');
}

// 15 · La plantilla vacía, para cualquier función.
{
  const s = headed(base('La misma plantilla sirve para cualquier función', 'Bloque 1 · Estación 2', { active: [1] }));
  const answers = ['La persona del mesón', 'Cliente, productos y cantidad de cada uno', 'Comprueba los datos, guarda el pedido y le asigna un número', 'Muestra el número y permite recuperar el pedido'];
  const w = 2.75, gap = (CW - 4 * w) / 3, y = 1.8, h = 4.15;
  PARTS.forEach(([ic, name, soft, strong], i) => {
    const x = M + i * (w + gap);
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, w, 1.55, soft);
    disc(s, ic, x + (w - 0.9) / 2, y + 0.2, 0.9, strong, strong === C.gold ? C.navy : C.white);
    text(s, `${i + 1} · ${name}`, x + 0.1, y + 1.1, w - 0.2, 0.42, { fontSize: 15.5, bold: true, color: C.navy, align: 'center' });
    label(s, 'Tu proyecto', x + 0.25, y + 1.8, w - 0.5, C.red, 11);
    hline(s, x + 0.25, y + 2.35, w - 0.5, C.slate, 1.2);
    label(s, 'Ferretería', x + 0.25, y + 2.6, w - 0.5, C.titleFill, 11);
    text(s, answers[i], x + 0.25, y + 2.92, w - 0.5, 1.15, { fontSize: 15.5, color: C.navy });
    if (i < 3) arrow(s, x + w + 0.03, y + 0.65, gap - 0.06);
  });
  finish(s, 'Cuatro preguntas, siempre en este orden. La ferretería es solo un ejemplo resuelto.');
}

// 16 · Un aviso no comprueba el guardado.
{
  const s = headed(base('Un mensaje de éxito no basta', 'Bloque 1 · Estación 2', { active: [1] }));
  const w = 5.55, y = 1.75, h = 4.25, x2 = M + CW - w;
  rect(s, M, y, w, h, C.white, C.border);
  label(s, 'Solo un aviso', M + 0.35, y + 0.25, w - 0.7, C.red, 13);
  round(s, M + 0.55, y + 0.9, w - 1.1, 1.0, C.successSoft, C.success);
  disc(s, 'circle-check', M + 0.75, y + 1.08, 0.64, C.success);
  text(s, 'Pedido guardado', M + 1.55, y + 0.9, w - 2.2, 1.0, { fontSize: 23, bold: true, color: C.navy, valign: 'mid' });
  inShape(s, '?', SH.ellipse, M + (w - 1.2) / 2, y + 2.25, 1.2, 1.2, C.red, { fontSize: 46 });
  text(s, '¿Quedaron conservados los datos?', M + 0.3, y + 3.55, w - 0.6, 0.45, { fontSize: 17, bold: true, color: C.navy, align: 'center' });
  rect(s, x2, y, w, h, C.white, C.navy, { line: { color: C.navy, width: 2.2 } });
  label(s, 'Esto sí lo comprueba', x2 + 0.35, y + 0.25, w - 0.7, C.navy, 13);
  text(s, 'Consultar pedido', x2 + 0.35, y + 0.7, w - 0.7, 0.4, { fontSize: 18, bold: true, color: C.navy });
  rect(s, x2 + 0.35, y + 1.15, w - 2.15, 0.55, C.mist, C.border);
  text(s, 'Número de pedido', x2 + 0.5, y + 1.15, w - 2.4, 0.55, { fontSize: 15, color: C.ink, valign: 'mid' });
  inShape(s, 'Buscar', SH.rect, x2 + w - 1.65, y + 1.15, 1.3, 0.55, C.navy, { fontSize: 15, fontFace: F.body });
  ['El cliente registrado', 'Los productos registrados', 'Las cantidades registradas'].forEach((t, i) => {
    const ry = y + 2.05 + i * 0.62;
    disc(s, 'check', x2 + 0.4, ry + 0.05, 0.44, C.success);
    text(s, t, x2 + 1.0, ry, w - 1.3, 0.54, { fontSize: 18, color: C.ink, valign: 'mid' });
  });
  finish(s, 'Se comprueba consultando el número: deben aparecer los datos que se registraron.');
}

// 17 · Regla de negocio y validación.
{
  const s = headed(base('De regla de negocio a validación', 'Bloque 1 · Estación 2', { active: [1] }));
  const w = 5.5, y = 1.75, h = 4.25, x2 = M + CW - w;
  // Regla escrita como en el cuaderno del negocio.
  rect(s, M, y, w, h, C.warm);
  [0, 1, 2].forEach(j => hline(s, M + 0.35, y + 3.15 + j * 0.36, w - 0.7, C.sand, 1.2));
  disc(s, 'notebook-pen', M + 0.3, y + 0.3, 0.72, C.navy);
  label(s, 'Regla de negocio', M + 1.2, y + 0.32, 3.5, C.red, 13);
  text(s, 'Qué es válido en la operación', M + 1.2, y + 0.62, w - 1.5, 0.35, { fontSize: 14.5 });
  text(s, 'Un pedido debe incluir al menos un producto y cada cantidad debe ser mayor que cero.', M + 0.35, y + 1.3, w - 0.7, 2.5, { fontSize: 24, bold: true, color: C.navy });
  arrow(s, M + w + 0.15, y + h / 2, x2 - M - w - 0.3);
  // Formulario que aplica la regla.
  rect(s, x2, y, w, h, C.white, C.border);
  disc(s, 'shield-check', x2 + 0.3, y + 0.3, 0.72, C.gold, C.navy);
  label(s, 'Validación', x2 + 1.2, y + 0.32, 3.5, C.red, 13);
  text(s, 'El sistema comprueba los datos', x2 + 1.2, y + 0.62, w - 1.5, 0.35, { fontSize: 14.5 });
  const fx = x2 + 0.4, fw = w - 0.8;
  text(s, 'Cantidad', fx, y + 1.3, fw, 0.28, { fontSize: 13, bold: true, color: C.ink });
  rect(s, fx, y + 1.62, 1.7, 0.58, C.paleRed, C.red, { line: { color: C.red, width: 2 } });
  text(s, '0', fx + 0.2, y + 1.62, 1.3, 0.58, { fontSize: 20, bold: true, color: C.navy, valign: 'mid' });
  icon(s, 'triangle-alert', fx, y + 2.35, 0.36, C.red);
  text(s, 'Ingresa una cantidad mayor que cero', fx + 0.48, y + 2.32, fw - 0.5, 0.42, { fontSize: 15.5, bold: true, color: C.red, valign: 'mid' });
  hline(s, fx, y + 2.9, fw);
  disc(s, 'x', fx, y + 3.05, 0.46, C.red);
  text(s, 'No se guarda el pedido', fx + 0.6, y + 3.05, fw - 0.6, 0.46, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  disc(s, 'square-pen', fx, y + 3.6, 0.46, C.navy);
  text(s, 'Se indica qué corregir', fx + 0.6, y + 3.6, fw - 0.6, 0.46, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  finish(s, 'Validar es comprobar los datos. La regla dice qué es válido; la validación lo aplica.',
    { notes: ['La regla y el mensaje son propuestas para el ejemplo.'] });
}

// 18 · Requerimiento no funcional: los adjetivos se miden.
{
  const s = headed(base('Qué es un requerimiento no funcional', 'Bloque 1 · Estación 2', { active: [1] }));
  text(s, 'Una condición de calidad o una restricción de la solución.', M, 1.7, CW, 0.45, { fontSize: 21, bold: true, color: C.navy });
  ['«Que sea fácil»', '«Que sea rápido»'].forEach((t, i) => {
    const y = 2.55 + i * 1.6;
    s.addText(t, { shape: SH.wedgeRoundRectCallout, x: M, y, w: 4.2, h: 1.2, fill: { color: C.paleRed }, line: { color: C.red, width: 1.2 },
      fontFace: F.display, fontSize: 27, bold: true, color: C.navy, align: 'center', valign: 'mid', margin: 0 });
  });
  arrow(s, M + 4.45, 3.85, 0.9);
  text(s, 'Para medirlos faltan tres datos', M + 5.6, 2.45, 6.2, 0.4, { fontSize: 18, bold: true, color: C.red });
  [['gauge', 'Cuánto', 'Un límite medible'], ['timer', 'Cómo se mide', 'Desde qué momento y hasta cuál'], ['layers', 'En qué condiciones', 'Con qué datos, equipo y conexión']].forEach(([ic, k, v], i) => {
    const y = 3.0 + i * 1.02;
    disc(s, ic, M + 5.6, y, 0.8, C.gold, C.navy);
    text(s, k, M + 6.6, y, 5, 0.42, { fontSize: 20, bold: true, color: C.navy });
    text(s, v, M + 6.6, y + 0.42, 5, 0.38, { fontSize: 15.5 });
  });
  finish(s, '«Fácil» y «rápido» son deseos. Se vuelven requerimientos cuando se pueden medir.');
}

// 19 · Uso desde celular, con el ancho dibujado.
{
  const s = headed(base('Calidad comprobable: uso desde celular', 'Bloque 1 · Estación 2', { active: [1] }));
  const px = M + 0.5, py = 1.72, pw = 2.6, ph = 3.95;
  round(s, px, py, pw, ph, C.navy, null, { rectRadius: 0.22 });
  round(s, px + 0.95, py + 0.12, 0.7, 0.1, C.titleFill);
  rect(s, px + 0.13, py + 0.32, pw - 0.26, ph - 0.62, C.white);
  const fx = px + 0.3, fw = pw - 0.6;
  text(s, 'Registrar pedido', fx, py + 0.45, fw, 0.3, { fontSize: 13, bold: true, color: C.navy });
  ['Cliente', 'Producto', 'Cantidad'].forEach((f, i) => {
    const y = py + 0.88 + i * 0.62;
    text(s, f, fx, y, fw, 0.2, { fontSize: 9.5, bold: true, color: C.ink });
    rect(s, fx, y + 0.22, fw, 0.32, C.mist, C.border);
  });
  inShape(s, 'Guardar pedido', SH.rect, fx, py + 2.8, fw, 0.38, C.red, { fontSize: 11, fontFace: F.body });
  s.addShape(SH.line, { x: px + 0.13, y: py + ph + 0.15, w: pw - 0.26, h: 0, line: { color: C.red, width: 1.8, beginArrowType: 'triangle', endArrowType: 'triangle' } });
  text(s, '360 píxeles de ancho', px - 0.3, py + ph + 0.22, pw + 0.6, 0.3, { fontSize: 13.5, bold: true, color: C.red, align: 'center' });
  const x = M + 3.9, w = M + CW - x;
  const steps = [
    ['smartphone', C.slate, 'Condición inicial', 'Poder registrar desde celular'],
    ['ruler', C.gold, 'Propuesta verificable', 'Todo el formulario usable a 360 píxeles, sin desplazarse hacia los lados'],
    ['scan-search', C.red, 'Cómo se comprueba', 'Vista móvil del navegador a ese ancho; recorrer el formulario completo'],
  ];
  steps.forEach(([ic, color, k, v], i) => {
    const y = 1.75 + i * 1.42;
    disc(s, ic, x, y + 0.1, 0.86, color, color === C.gold ? C.navy : C.white);
    label(s, k, x + 1.1, y + 0.08, w - 1.1, color === C.gold ? C.navy : color, 12);
    text(s, v, x + 1.1, y + 0.4, w - 1.1, 0.85, { fontSize: i === 1 ? 19 : 17, bold: i === 1, color: C.navy });
    if (i < 2) s.addShape(SH.line, { x: x + 0.43, y: y + 1.0, w: 0, h: 0.48, line: { color: C.border, width: 2, endArrowType: 'triangle' } });
  });
  finish(s, 'Desplazamiento horizontal: tener que mover la pantalla hacia los lados. 360 es un valor del ejemplo.');
}

// 20 · Consulta rápida: tres cifras grandes.
{
  const s = headed(base('Calidad comprobable: rapidez', 'Bloque 1 · Estación 2', { active: [1] }));
  text(s, 'La consulta por número debe mostrar el resultado en un máximo de 2 segundos.', M, 1.68, CW, 0.45, { fontSize: 20, bold: true, color: C.navy });
  const figs = [
    ['timer', '2 s', 'Límite de respuesta', 'Desde pulsar Buscar hasta ver el resultado', C.red],
    ['database', '1.000', 'Pedidos guardados', 'Datos de prueba preparados antes de medir', C.navy],
    ['user', '1', 'Consulta a la vez', 'Solo una persona consulta mientras se mide', C.titleFill],
  ];
  const w = 3.7, gap = (CW - 3 * w) / 2, y = 2.4;
  figs.forEach(([ic, n, k, v, color], i) => {
    const x = M + i * (w + gap);
    round(s, x, y, w, 3.0, C.white, C.border);
    disc(s, ic, x + 0.3, y + 0.3, 0.7, color);
    text(s, n, x + 1.15, y + 0.12, w - 1.3, 1.05, { fontSize: 50, bold: true, color, fontFace: F.display, valign: 'mid' });
    text(s, k, x + 0.3, y + 1.35, w - 0.6, 0.45, { fontSize: 19, bold: true, color: C.navy });
    text(s, v, x + 0.3, y + 1.82, w - 0.6, 0.9, { fontSize: 16 });
  });
  icon(s, 'file-text', M, 5.6, 0.36, C.navy);
  text(s, 'En cada prueba se anotan el equipo, el navegador y la conexión usados.', M + 0.5, 5.56, CW - 0.5, 0.44, { fontSize: 17, color: C.navy, valign: 'mid' });
  finish(s, 'Son valores ilustrativos: cada equipo propone los del uso esperado de su sistema.');
}

// 21 · La calidad cambia el diseño.
{
  const s = headed(base('La calidad también cambia el diseño', 'Bloque 1 · Estación 2', { active: [1] }));
  const rows = [
    ['smartphone', 'Uso desde celular', 'layout-template', 'Cambia cómo se ordenan los campos y los botones'],
    ['timer', 'Tiempo de consulta', 'database', 'Obliga a revisar cómo se recuperan los datos'],
  ];
  rows.forEach(([a, ka, b, kb], i) => {
    const y = 1.9 + i * 2.0;
    round(s, M, y, 4.6, 1.6, C.navy);
    disc(s, a, M + 0.3, y + 0.35, 0.9, C.gold, C.navy);
    text(s, ka, M + 1.45, y, 3.0, 1.6, { fontSize: 22, bold: true, color: C.white, valign: 'mid' });
    arrow(s, M + 4.8, y + 0.8, 1.0);
    round(s, M + 6.0, y, CW - 6.0, 1.6, C.white, C.border);
    disc(s, b, M + 6.3, y + 0.35, 0.9, C.titleFill);
    text(s, kb, M + 7.45, y, CW - 7.7, 1.6, { fontSize: 21, color: C.navy, valign: 'mid' });
  });
  finish(s, 'La calidad acompaña a la función mientras se diseñan sus pantallas, su lógica y sus pruebas.');
}

// 22 · Trabajo en equipo sobre fotografía.
{
  const s = base('', 'Bloque 1 · Trabajo en equipo', { dark: true, active: [0, 1] });
  photo(s, 'equipo-mesa.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  text(s, 'Ahora en tu proyecto', M, 1.0, 6.2, 0.75, { fontSize: 36, bold: true, color: C.white, fontFace: F.display });
  inShape(s, '10 min', SH.roundRect, M, 1.95, 2.0, 0.7, C.red, { fontSize: 24, rectRadius: 0.08 });
  text(s, 'Aplica las estaciones 1 y 2 a una operación de tu proyecto.', M, 2.9, 6.1, 0.9, { fontSize: 21, bold: true, color: C.white });
  [['file-text', 'Evidencia', 'Una ficha de alcance y requerimientos'],
   ['book-open', 'Instrucciones', 'Guía de la clase, sección 1.4'],
   ['pencil', 'Si falta confirmar', 'Queda como supuesto explícito']].forEach(([ic, k, v], i) => {
    const y = 3.95 + i * 0.82;
    disc(s, ic, M, y, 0.62, C.gold, C.navy);
    label(s, k, M + 0.8, y - 0.02, 4, C.gold, 11.5);
    text(s, v, M + 0.8, y + 0.26, 5.6, 0.4, { fontSize: 17, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa. No se inventan respuestas del referente.'] });
}

// 23 · Preguntas de comprobación.
const B1 = [
  ['target', 'Función y resultado', '¿Por qué «gestionar pedidos» no basta para comenzar a diseñar la operación de registro?',
    'Busca quién actúa, qué ingresa y qué resultado debería poder comprobarse.',
    'Faltan la acción concreta, el usuario, los datos y el resultado esperado.',
    'Pantallas y datos se diseñan sobre una operación que se recorre de principio a fin.'],
  ['timer', 'Calidad verificable', '¿Qué información falta si un requisito dice solamente «debe ser rápido»?',
    'Piensa desde cuándo medirías, hasta cuándo y bajo qué condiciones repetirías la prueba.',
    'Faltan un límite medible y las condiciones de comprobación.',
    'La calidad se comprueba sobre una función concreta, no con un adjetivo.'],
  ['lock', 'Supuesto y exclusión', '¿Qué diferencia hay entre una regla provisional y una función que quedó fuera del alcance?',
    'Revisa cuál se adopta temporalmente para avanzar y cuál se decidió no incorporar.',
    'El supuesto es provisional y se confirma después; la exclusión delimita lo que no se incorporará.',
    'Evita que una sugerencia se vuelva compromiso o que se reabra algo descartado.'],
];
const QCOLORS = [C.red, C.titleFill, C.gold];
function qaRows(s, mode, data = B1) {
  data.forEach(([ic, tag, q, hint, answer, reveals], i) => {
    const y = 1.78 + i * 1.62, color = QCOLORS[i];
    rect(s, M, y, CW, 1.52, mode === 'q' ? C.white : C.paper, mode === 'q' ? C.border : null);
    rect(s, M, y, 0.12, 1.52, color);
    disc(s, ic, M + 0.32, y + 0.25, 0.62, color, color === C.gold ? C.navy : C.white);
    label(s, `${i + 1} · ${tag}`, M + 1.15, y + 0.12, 6, C.navy, 11.5);
    text(s, mode === 'q' ? q : answer, M + 1.15, y + 0.4, CW - 1.4, 0.72, { fontSize: 18, bold: true, color: C.navy });
    if (mode === 'q') {
      text(s, `Pista: ${hint}`, M + 1.15, y + 1.12, CW - 1.4, 0.34, { fontSize: 15, color: C.ink });
    } else {
      label(s, 'Lo que revela', M + 1.15, y + 1.16, 1.6, C.red, 11);
      text(s, reveals, M + 2.85, y + 1.12, CW - 3.1, 0.34, { fontSize: 14.5 });
    }
  });
}
{
  const s = headed(base('Preguntas de comprobación', 'Bloque 1 · Cierre', { active: [0, 1] }));
  qaRows(s, 'q');
  finish(s, '');
}
// 24 · Lo que tenía que aparecer en tu respuesta.
{
  const s = headed(base('Lo que tenía que aparecer en tu respuesta', 'Bloque 1 · Cierre', { active: [0, 1], bg: C.white, titleSize: 28 }));
  qaRows(s, 'a');
  finish(s, '');
}

// ---------------------------------------------------------------------------
// BLOQUE 2 · Historias, recorridos y pantallas

// Controles de un boceto: campo con texto y botón, cada uno como un solo objeto.
function field(s, value, x, y, w, h = 0.44, opts = {}) {
  inShape(s, value, SH.rect, x, y, w, h, opts.fill || C.white, { line: { color: opts.line || C.slate, width: opts.lw || 1.2 },
    color: opts.color || C.navy, fontFace: F.body, bold: false, fontSize: opts.size || 14, align: 'left', margin: 6 });
}
function button(s, value, x, y, w, h = 0.46, primary = true) {
  inShape(s, value, SH.rect, x, y, w, h, primary ? C.red : C.white, { line: { color: primary ? C.red : C.navy, width: 1.4 },
    color: primary ? C.white : C.navy, fontFace: F.body, fontSize: 13.5 });
}
function marker(s, n, x, y) {
  inShape(s, String(n), SH.ellipse, x, y, 0.34, 0.34, C.gold, { color: C.navy, fontSize: 12 });
}
// Celular en miniatura con un estado de pantalla.
function miniPhone(s, x, y, w, h, state) {
  round(s, x, y, w, h, C.navy, null, { rectRadius: 0.18 });
  rect(s, x + 0.1, y + 0.26, w - 0.2, h - 0.46, C.white);
  const fx = x + 0.22, fw = w - 0.44;
  text(s, 'Registrar pedido', fx, y + 0.36, fw, 0.24, { fontSize: 10.5, bold: true, color: C.navy });
  if (state === 'fail') {
    inShape(s, 'No se pudo guardar', SH.rect, fx, y + 0.68, fw, 0.36, C.paleRed, { line: { color: C.red, width: 1.2 }, color: C.red, fontSize: 10, fontFace: F.body });
  }
  const filled = state !== 'empty';
  const vals = ['Ana Soto', 'Cemento', state === 'error' ? '0' : '2'];
  ['Cliente', 'Producto', 'Cantidad'].forEach((f, i) => {
    const fy = y + (state === 'fail' ? 1.12 : 0.72) + i * 0.5;
    text(s, f, fx, fy, fw, 0.18, { fontSize: 8.5, bold: true, color: C.ink });
    const err = state === 'error' && i === 2;
    rect(s, fx, fy + 0.19, fw, 0.27, err ? C.paleRed : C.mist, err ? C.red : C.border);
    if (filled) text(s, vals[i], fx + 0.06, fy + 0.19, fw - 0.1, 0.27, { fontSize: 9.5, color: C.navy, valign: 'mid' });
  });
  if (state === 'error') text(s, 'Ingresa una cantidad mayor que cero', fx, y + 2.24, fw, 0.3, { fontSize: 8.5, bold: true, color: C.red });
  inShape(s, 'Guardar pedido', SH.rect, fx, y + h - 0.62, fw, 0.3, C.red, { fontSize: 9, fontFace: F.body });
}

// 25 · Apertura del bloque sobre fotografía.
{
  const s = base('', 'Bloque 2 · 09:00 a 09:30 · 30 minutos', { dark: true, active: [2, 3] });
  photo(s, 'boceto-papel.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  inShape(s, '2', SH.ellipse, M, 1.3, 1.2, 1.2, ST[2].color, { fontSize: 54 });
  text(s, 'Historias, recorridos\ny pantallas', M, 2.75, 6.6, 1.8, { fontSize: 42, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Cómo se sabe que la operación funciona, y cómo se usa paso a paso.', M, 4.6, 5.9, 0.9, { fontSize: 19, color: C.softBlue });
  [2, 3].forEach((i, k) => {
    const y = 1.4 + k * 2.2, st = ST[i];
    round(s, 7.45, y, 5.16, 1.95, C.navy, st.color, { line: { color: st.color, width: 2 } });
    disc(s, st.icon, 7.7, y + 0.25, 0.72, st.color, st.fg);
    text(s, `${i + 1} · ${st.name}`, 8.6, y + 0.25, 3.8, 0.72, { fontSize: 21, bold: true, color: C.white, valign: 'mid' });
    text(s, QUESTIONS[i], 7.7, y + 1.07, 4.7, 0.8, { fontSize: 14.5, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 26 · La historia de usuario como ficha de tres piezas.
{
  const s = headed(base('Una historia de usuario en tres piezas', 'Bloque 2 · Estación 3', { active: [2] }));
  text(s, 'Describe una capacidad desde la persona que la necesita y explica su beneficio.', M, 1.68, CW, 0.42, { fontSize: 19 });
  const cx = M, cy = 2.25, cw = CW, ch = 2.85;
  rect(s, cx, cy, cw, ch, C.white, C.border);
  rect(s, cx, cy + 0.5, cw, 0.03, C.paleRed);
  label(s, 'Historia de usuario · registrar un pedido', cx + 0.4, cy + 0.14, 8, C.slate, 11.5);
  const parts = [
    ['Como', 'user', C.navy, 'persona que atiende en el mesón', 'Quién usa la capacidad'],
    ['Quiero', 'circle-plus', C.gold, 'registrar un pedido con su cliente, productos y cantidades', 'Qué necesita hacer'],
    ['Para', 'target', C.success, 'conservar lo solicitado y encontrarlo cuando el cliente consulte', 'Qué beneficio obtiene'],
  ];
  const w = (cw - 0.6) / 3;
  parts.forEach(([k, ic, color, v, what], i) => {
    const x = cx + 0.3 + i * w;
    inShape(s, k.toUpperCase(), SH.roundRect, x + 0.1, cy + 0.7, 1.7, 0.48, color, { color: color === C.gold ? C.navy : C.white, fontSize: 15, charSpacing: 2, rectRadius: 0.06 });
    text(s, v, x + 0.1, cy + 1.35, w - 0.35, 1.35, { fontSize: 21, bold: true, color: C.navy });
    disc(s, ic, x + 0.1, 5.35, 0.6, color, color === C.gold ? C.navy : C.white);
    text(s, what, x + 0.85, 5.35, w - 1.0, 0.6, { fontSize: 16, bold: true, color: C.ink, valign: 'mid' });
  });
  finish(s, 'La historia conserva el propósito del requerimiento del Bloque 1.');
}

// 27 · Quien usa el sistema y quien pide.
{
  const s = headed(base('Usuario y cliente no son la misma persona', 'Bloque 2 · Estación 3', { active: [2] }));
  const w = 5.5, y = 1.75, h = 4.25, x2 = M + CW - w;
  const sides = [
    [M, C.navy, 'monitor-smartphone', 'Persona del mesón', 'Usa el sistema', 'Completa el formulario y registra el pedido.', 'Va en «Como…»'],
    [x2, C.red, 'package', 'Cliente', 'Solicita los productos', 'El pedido queda asociado a su nombre.', 'No usa el formulario'],
  ];
  sides.forEach(([x, color, ic, name, role, body, tag]) => {
    rect(s, x, y, w, h, C.white, C.border);
    disc(s, 'user', x + (w - 1.6) / 2, y + 0.35, 1.6, color);
    disc(s, ic, x + (w - 1.6) / 2 + 1.15, y + 1.4, 0.62, C.gold, C.navy, 0.54, C.white);
    text(s, name, x, y + 2.15, w, 0.55, { fontSize: 27, bold: true, color: C.navy, align: 'center', fontFace: F.display });
    text(s, role, x + 0.3, y + 2.72, w - 0.6, 0.42, { fontSize: 19, bold: true, color, align: 'center' });
    text(s, body, x + 0.3, y + 3.15, w - 0.6, 0.45, { fontSize: 16.5, align: 'center' });
    inShape(s, tag, SH.roundRect, x + (w - 2.6) / 2, y + h - 0.6, 2.6, 0.4, C.mist, { color: C.navy, fontSize: 13, rectRadius: 0.06 });
  });
  text(s, '≠', M + w, y + 1.0, x2 - M - w, 1.0, { fontSize: 60, bold: true, color: C.red, align: 'center', valign: 'mid' });
  finish(s, 'Ambos participan en el caso, pero cumplen papeles distintos.');
}

// 28 · Criterios de aceptación como casos de prueba.
{
  const s = headed(base('Criterios de aceptación', 'Bloque 2 · Estación 3', { active: [2] }));
  text(s, 'Resultados observables que permiten comprobar si la capacidad quedó resuelta.', M, 1.66, CW, 0.42, { fontSize: 19 });
  const cases = [
    ['circle-check', C.success, 'Cliente, al menos un producto y cantidades válidas', 'Se guarda, recibe un número único y se muestran la confirmación y los datos'],
    ['search', C.titleFill, 'Consulta posterior del número asignado', 'Se recuperan el cliente, los productos y las cantidades guardadas'],
    ['triangle-alert', C.gold, 'Falta el cliente, no hay productos o una cantidad no es mayor que cero', 'Se indica qué corregir, se conservan los otros datos y no se guarda'],
    ['circle-x', C.red, 'El guardado falla por un problema del sistema', 'Se informa que no se pudo guardar y no aparece una confirmación'],
  ];
  const w = (CW - 0.25) / 2, h = 1.86;
  cases.forEach(([ic, color, cas, res], i) => {
    const x = M + (i % 2) * (w + 0.25), y = 2.22 + Math.floor(i / 2) * (h + 0.12);
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, 0.12, h, color);
    disc(s, ic, x + 0.3, y + 0.3, 0.78, color, color === C.gold ? C.navy : C.white);
    label(s, 'Caso', x + 1.3, y + 0.14, 2, C.slate, 11);
    text(s, cas, x + 1.3, y + 0.4, w - 1.5, 0.6, { fontSize: 15.5, bold: true, color: C.navy });
    label(s, 'Resultado esperado', x + 1.3, y + 1.02, 3, color === C.gold ? C.navy : color, 11);
    text(s, res, x + 1.3, y + 1.28, w - 1.5, 0.55, { fontSize: 15 });
  });
  finish(s, 'Cantidad válida: un número mayor que cero. Conservar los datos evita volver a escribir todo.');
}

// 29 · Los datos de prueba con fotografías.
{
  const s = headed(base('Los datos de prueba del recorrido', 'Bloque 2 · Estación 3', { active: [2] }));
  const w = 3.72, gap = (CW - 3 * w) / 2, y = 1.72, h = 3.05;
  // Cliente ficticia.
  rect(s, M, y, w, h, C.navy);
  disc(s, 'user', M + (w - 1.3) / 2, y + 0.35, 1.3, C.white, C.navy);
  text(s, 'Ana Soto', M, y + 1.85, w, 0.55, { fontSize: 28, bold: true, color: C.white, align: 'center', fontFace: F.display });
  text(s, 'Cliente · nombre inventado', M, y + 2.42, w, 0.4, { fontSize: 15, color: C.softBlue, align: 'center' });
  const prods = [['sacos-cemento-recorte.jpg', '2', 'sacos de cemento', 'Unidad de venta: saco'], ['brochas-recorte.jpg', '3', 'brochas', 'Unidad de venta: unidad']];
  prods.forEach(([file, n, name, unit], i) => {
    const x = M + (i + 1) * (w + gap);
    photo(s, file, x, y, w, h);
    inShape(s, n, SH.ellipse, x + 0.2, y + 0.2, 1.05, 1.05, C.red, { fontSize: 40 });
    veil(s, x, y + h - 0.85, w, 0.85, C.navy, 10);
    text(s, name, x + 0.25, y + h - 0.82, w - 0.5, 0.42, { fontSize: 19, bold: true, color: C.white, valign: 'mid' });
    text(s, unit, x + 0.25, y + h - 0.42, w - 0.5, 0.34, { fontSize: 14, color: C.softBlue, valign: 'mid' });
  });
  // Número del pedido.
  const ty = 5.0;
  inShape(s, 'Pedido N.º 1042', SH.roundRect, M, ty, 3.6, 0.95, C.gold, { color: C.navy, fontSize: 24, rectRadius: 0.1 });
  icon(s, 'ticket', M + 3.85, ty + 0.2, 0.55, C.navy);
  text(s, '1042 identifica el pedido. No es una cantidad de productos ni un número que se asigne siempre.', M + 4.6, ty, CW - 4.6, 0.95, { fontSize: 17, color: C.navy, valign: 'mid' });
  finish(s, 'Todos estos datos son ficticios. Sirven para recorrer el caso que termina bien.', { notes: ['Fotos ilustrativas.'] });
}

// 30 · El supuesto que permite recorrer el registro.
{
  const s = headed(base('Un supuesto para recorrer el registro', 'Bloque 2 · Estación 3', { active: [2] }));
  rect(s, M, 1.75, 4.6, 4.25, C.white, C.border);
  s.addText('SUPUESTO', { shape: SH.roundRect, x: M + 0.45, y: 2.9, w: 3.7, h: 1.25, rectRadius: 0.1, rotate: -6,
    fill: { color: C.white }, line: { color: ORIGIN.assumption, width: 4 },
    fontFace: F.display, fontSize: 36, bold: true, color: ORIGIN.assumption, align: 'center', valign: 'mid', charSpacing: 3, margin: 0 });
  const x = M + 5.0, w = M + CW - x;
  text(s, 'El cliente y los productos ya existen en el sistema, listos para seleccionarlos.', x, 1.85, w, 1.0, { fontSize: 23, bold: true, color: C.navy });
  [['user', 'Ana Soto ya está registrada como cliente'], ['package', 'Cemento y Brocha ya están en el catálogo']].forEach(([ic, t], i) => {
    const y = 3.1 + i * 0.85;
    disc(s, ic, x, y, 0.62, C.gold, C.navy);
    text(s, t, x + 0.85, y, w - 0.85, 0.62, { fontSize: 18, color: C.ink, valign: 'mid' });
  });
  round(s, x, 4.95, w, 1.0, C.softBlue);
  icon(s, 'circle-plus', x + 0.25, 5.2, 0.5, C.titleFill);
  text(s, 'Crear esos registros es otra operación. Para este recorrido se usan datos de prueba preparados.', x + 0.95, 4.95, w - 1.15, 1.0, { fontSize: 16, color: C.navy, valign: 'mid' });
  finish(s, 'El supuesto queda escrito: si cambia, se revisa el recorrido.');
}

// 31 · El recorrido en dos carriles: persona y sistema.
{
  const s = headed(base('El recorrido, paso a paso', 'Bloque 2 · Estación 4', { active: [3] }));
  text(s, 'Recorrido: la secuencia de acciones y respuestas que completa una operación.', M, 1.62, CW, 0.4, { fontSize: 18 });
  const steps = [
    ['Elige registrar un pedido', 'Muestra el formulario vacío'],
    ['Elige a Ana Soto, 2 de cemento y 3 de brocha', 'Muestra productos, cantidades y unidades'],
    ['Pulsa Guardar pedido', 'Comprueba cliente, productos y cantidades'],
    ['Corrige si se informa un error', 'Si hay error lo señala; si no, intenta guardar'],
    ['Revisa la respuesta', 'Si guardó, muestra 1042; si falló, lo avisa'],
    ['Consulta el número 1042', 'Muestra lo que se guardó'],
  ];
  const lx = M, lw = 1.45, x0 = M + lw + 0.1, cw = (CW - lw - 0.1) / 6, ly1 = 2.55, ly2 = 4.3, lh = 1.45;
  [[ly1, 'user', 'Persona', C.red], [ly2, 'monitor-smartphone', 'Sistema', C.titleFill]].forEach(([y, ic, n, color]) => {
    rect(s, lx, y, CW, lh, C.white, C.border);
    rect(s, lx, y, lw, lh, color);
    icon(s, ic, lx + (lw - 0.5) / 2, y + 0.25, 0.5, C.white);
    text(s, n, lx, y + 0.85, lw, 0.4, { fontSize: 15, bold: true, color: C.white, align: 'center' });
  });
  steps.forEach(([p, r], i) => {
    const x = x0 + i * cw, branch = i === 3 || i === 4;
    inShape(s, String(i + 1), SH.ellipse, x + (cw - 0.42) / 2, 2.08, 0.42, 0.42, branch ? C.gold : C.navy, { color: branch ? C.navy : C.white, fontSize: 14 });
    text(s, p, x + 0.1, ly1 + 0.1, cw - 0.2, lh - 0.2, { fontSize: 13.5, bold: true, color: C.navy, valign: 'mid', align: 'center' });
    s.addShape(SH.line, { x: x + cw / 2, y: ly1 + lh + 0.02, w: 0, h: ly2 - ly1 - lh - 0.04, line: { color: C.red, width: 1.8, endArrowType: 'triangle' } });
    if (branch) rect(s, x + 0.05, ly2 + 0.06, cw - 0.1, lh - 0.12, C.warningSoft);
    text(s, r, x + 0.1, ly2 + 0.1, cw - 0.2, lh - 0.2, { fontSize: 13.5, color: C.ink, valign: 'mid', align: 'center' });
    if (i > 0) s.addShape(SH.line, { x, y: ly1 + 0.2, w: 0, h: lh - 0.4, line: { color: C.border, width: 1 } });
    if (i > 0) s.addShape(SH.line, { x, y: ly2 + 0.2, w: 0, h: lh - 0.4, line: { color: C.border, width: 1 } });
  });
  finish(s, 'Los pasos 4 y 5, en amarillo, tienen dos caminos posibles.');
}

// 32 · Los dos caminos del guardado como diagrama de decisión.
{
  const s = headed(base('Dos caminos antes de confirmar', 'Bloque 2 · Estación 4', { active: [3] }));
  const ty = 2.2, th = 1.0;
  const box = (t, x, w, fill, color = C.white) => inShape(s, t, SH.roundRect, x, ty, w, th, fill, { color, fontSize: 15.5, rectRadius: 0.08, fontFace: F.body });
  box('Pulsa Guardar pedido', M, 2.1, C.navy);
  arrow(s, M + 2.15, ty + th / 2, 0.4, C.navy, 2);
  inShape(s, '¿Datos válidos?', SH.diamond, M + 2.6, ty - 0.2, 2.1, 1.4, C.gold, { color: C.navy, fontSize: 14.5, fontFace: F.body });
  arrow(s, M + 4.75, ty + th / 2, 0.55, C.success, 2.2);
  text(s, 'Sí', M + 4.75, ty + 0.02, 0.55, 0.3, { fontSize: 14, bold: true, color: C.success, align: 'center' });
  box('Intenta guardar', M + 5.35, 1.85, C.navy);
  arrow(s, M + 7.25, ty + th / 2, 0.4, C.navy, 2);
  inShape(s, '¿Se guardó?', SH.diamond, M + 7.7, ty - 0.2, 2.0, 1.4, C.gold, { color: C.navy, fontSize: 14.5, fontFace: F.body });
  arrow(s, M + 9.75, ty + th / 2, 0.45, C.success, 2.2);
  text(s, 'Sí', M + 9.75, ty + 0.02, 0.45, 0.3, { fontSize: 14, bold: true, color: C.success, align: 'center' });
  inShape(s, 'Muestra 1042 y los datos', SH.roundRect, M + 10.25, ty, CW - 10.25, th, C.success, { fontSize: 15, rectRadius: 0.08, fontFace: F.body });
  // Caminos alternativos.
  const by = 4.25, bh = 1.25;
  const d1 = M + 2.6 + 1.05, d2 = M + 7.7 + 1.0;
  s.addShape(SH.line, { x: d1, y: ty + 1.22, w: 0, h: by - ty - 1.24, line: { color: C.red, width: 2.2, endArrowType: 'triangle' } });
  text(s, 'No', d1 + 0.1, ty + 1.45, 0.5, 0.3, { fontSize: 14, bold: true, color: C.red });
  s.addShape(SH.line, { x: d2, y: ty + 1.22, w: 0, h: by - ty - 1.24, line: { color: C.red, width: 2.2, endArrowType: 'triangle' } });
  text(s, 'No', d2 + 0.1, ty + 1.45, 0.5, 0.3, { fontSize: 14, bold: true, color: C.red });
  round(s, d1 - 1.55, by, 3.1, bh, C.warningSoft, C.gold, { line: { color: C.gold, width: 1.6 } });
  icon(s, 'triangle-alert', d1 - 1.4, by + 0.15, 0.42, C.navy);
  text(s, 'Señala qué corregir y conserva el formulario', d1 - 0.85, by + 0.08, 2.3, bh - 0.16, { fontSize: 14.5, bold: true, color: C.navy, valign: 'mid' });
  round(s, d2 - 1.55, by, 3.1, bh, C.paleRed, C.red, { line: { color: C.red, width: 1.6 } });
  icon(s, 'server-crash', d2 - 1.4, by + 0.15, 0.42, C.red);
  text(s, 'Informa que no se pudo guardar, sin confirmación', d2 - 0.85, by + 0.08, 2.3, bh - 0.16, { fontSize: 14.5, bold: true, color: C.navy, valign: 'mid' });
  // Vuelta: corregir y volver a pulsar Guardar.
  const lx = M + 1.0;
  s.addShape(SH.line, { x: lx, y: by + bh / 2, w: d1 - 1.55 - lx, h: 0, line: { color: C.gold, width: 2 } });
  s.addShape(SH.line, { x: lx, y: ty + th + 0.02, w: 0, h: by + bh / 2 - ty - th - 0.02, line: { color: C.gold, width: 2, beginArrowType: 'triangle' } });
  text(s, 'Corrige y vuelve a pulsar', M, by + bh / 2 + 0.12, 1.3, 0.75, { fontSize: 13.5, bold: true, color: C.navy });
  finish(s, 'La confirmación solo aparece cuando el pedido quedó guardado.');
}

// 33 · Un error en el camino: cantidad cero.
{
  const s = headed(base('Un error en el camino: cantidad cero', 'Bloque 2 · Estación 4', { active: [3] }));
  const wx = M, wy = 1.72, ww = 6.6, wh = 4.35;
  rect(s, wx, wy, ww, wh, C.white, C.border);
  text(s, 'Registrar pedido', wx + 0.3, wy + 0.2, 4, 0.4, { fontSize: 19, bold: true, color: C.navy });
  text(s, 'Cliente', wx + 0.3, wy + 0.72, 2, 0.26, { fontSize: 12.5, bold: true, color: C.ink });
  field(s, 'Ana Soto', wx + 0.3, wy + 1.0, 3.0);
  marker(s, 1, wx + 3.45, wy + 1.05);
  field(s, 'Cemento', wx + 0.3, wy + 1.75, 2.6);
  field(s, '0', wx + 3.1, wy + 1.75, 1.0, 0.44, { fill: C.paleRed, line: C.red, lw: 2, color: C.red });
  text(s, 'saco', wx + 4.3, wy + 1.75, 1.0, 0.44, { fontSize: 14, valign: 'mid' });
  icon(s, 'triangle-alert', wx + 0.3, wy + 2.3, 0.3, C.red);
  text(s, 'Ingresa una cantidad mayor que cero para Cemento', wx + 0.7, wy + 2.25, 5.3, 0.4, { fontSize: 14, bold: true, color: C.red, valign: 'mid' });
  marker(s, 2, wx + 6.1, wy + 2.28);
  field(s, 'Brocha', wx + 0.3, wy + 2.85, 2.6);
  field(s, '3', wx + 3.1, wy + 2.85, 1.0);
  text(s, 'unidad', wx + 4.3, wy + 2.85, 1.0, 0.44, { fontSize: 14, valign: 'mid' });
  marker(s, 1, wx + 5.4, wy + 2.9);
  button(s, 'Guardar pedido', wx + 0.3, wy + 3.6, 2.4);
  marker(s, 3, wx + 2.85, wy + 3.66);
  const x = M + 7.0, w = M + CW - x;
  const notes = [
    ['Ana Soto y las brochas siguen en el formulario: no hay que escribir todo de nuevo.'],
    ['El mensaje aparece junto al campo con error y dice qué corregir.'],
    ['Se cambia el 0 por 2 y se vuelve a pulsar Guardar para continuar.'],
  ];
  notes.forEach(([t], i) => {
    const y = 1.85 + i * 1.4;
    inShape(s, String(i + 1), SH.ellipse, x, y, 0.55, 0.55, C.gold, { color: C.navy, fontSize: 18 });
    text(s, t, x + 0.75, y - 0.05, w - 0.75, 1.15, { fontSize: 18, color: C.navy, bold: i === 1 });
  });
  finish(s, 'Un buen recorrido también muestra cómo se sale de un error.');
}

// 34 · Qué es un boceto.
{
  const s = headed(base('Un boceto muestra cómo se usa', 'Bloque 2 · Estación 4', { active: [3] }));
  photo(s, 'boceto-papel.jpg', M, 1.72, 5.9, 4.3);
  const x = M + 6.3, w = M + CW - x;
  label(s, 'Boceto de pantalla', x, 1.78, w, C.red, 13);
  text(s, 'Una representación sencilla de los campos, acciones y resultados que verá la persona.', x, 2.1, w, 1.1, { fontSize: 21, bold: true, color: C.navy });
  [['pen-tool', C.gold, C.navy, 'Se hace en papel o en una herramienta de dibujo'],
   ['target', C.red, C.white, 'Explica cómo se realiza la operación'],
   ['ban', C.slate, C.white, 'Todavía no elige colores, tipografía ni tecnología']].forEach(([ic, fill, fg, t], i) => {
    const y = 3.45 + i * 0.85;
    disc(s, ic, x, y, 0.62, fill, fg);
    text(s, t, x + 0.85, y, w - 0.85, 0.62, { fontSize: 17, color: C.ink, valign: 'mid' });
  });
  finish(s, 'Primero se dibuja lo que la operación necesita, no la página de inicio.', { notes: ['Foto ilustrativa.'] });
}

// 35 · Boceto del formulario con marcadores numerados.
{
  const s = headed(base('Boceto: formulario de registro', 'Bloque 2 · Estación 4', { active: [3] }));
  const wx = M, wy = 1.72, ww = 6.6, wh = 4.35;
  rect(s, wx, wy, ww, wh, C.white, C.slate, { line: { color: C.slate, width: 1.2, dashType: 'dash' } });
  text(s, 'Registrar pedido', wx + 0.3, wy + 0.2, 4, 0.4, { fontSize: 19, bold: true, color: C.navy });
  text(s, 'Cliente', wx + 0.3, wy + 0.7, 2, 0.26, { fontSize: 12.5, bold: true, color: C.ink });
  field(s, 'Ana Soto', wx + 0.3, wy + 0.98, 3.0);
  marker(s, 1, wx + 3.45, wy + 1.03);
  [['Producto', 0.3, 2.6], ['Cantidad', 3.1, 0.9], ['Unidad', 4.6, 0.8]].forEach(([h, dx, hw]) => text(s, h, wx + dx, wy + 1.65, hw, 0.26, { fontSize: 12.5, bold: true, color: C.ink }));
  marker(s, 3, wx + 4.05, wy + 1.62);
  marker(s, 2, wx + 5.45, wy + 1.62);
  [['Cemento', '2', 'saco'], ['Brocha', '3', 'unidad']].forEach(([p, q, u], i) => {
    const y = wy + 2.0 + i * 0.58;
    field(s, p, wx + 0.3, y, 2.6);
    field(s, q, wx + 3.1, y, 1.2);
    text(s, u, wx + 4.6, y, 1.5, 0.44, { fontSize: 14, valign: 'mid' });
  });
  button(s, '+ Agregar producto', wx + 0.3, wy + 3.4, 2.6, 0.46, false);
  marker(s, 4, wx + 3.0, wy + 3.46);
  button(s, 'Guardar pedido', wx + 3.6, wy + 3.4, 2.3);
  marker(s, 5, wx + 6.05, wy + 3.46);
  const x = M + 7.0, w = M + CW - x;
  const notes = [
    ['Cliente', 'El pedido queda asociado a Ana Soto'],
    ['Unidad', 'Se muestra según el producto elegido'],
    ['Cantidad', 'Lo pedido, no lo que hay en bodega'],
    ['Agregar producto', 'Suma otra fila para elegir producto y cantidad'],
    ['Guardar pedido', 'Guarda el conjunto completo, no solo la última fila'],
  ];
  notes.forEach(([k, t], i) => {
    const y = 1.75 + i * 0.86;
    marker(s, i + 1, x, y + 0.05);
    text(s, k, x + 0.5, y, w - 0.5, 0.32, { fontSize: 15.5, bold: true, color: C.navy });
    text(s, t, x + 0.5, y + 0.32, w - 0.5, 0.45, { fontSize: 14.5 });
  });
  finish(s, 'Los recuadros representan controles: campos para elegir o escribir datos, y botones.');
}

// 36 · Confirmación y consulta.
{
  const s = headed(base('Boceto: confirmación y consulta', 'Bloque 2 · Estación 4', { active: [3] }));
  const wx = M, wy = 1.72, ww = 6.2, wh = 4.35;
  rect(s, wx, wy, ww, wh, C.white, C.slate, { line: { color: C.slate, width: 1.2, dashType: 'dash' } });
  rect(s, wx, wy, ww, 0.7, C.successSoft);
  disc(s, 'circle-check', wx + 0.25, wy + 0.13, 0.44, C.success);
  text(s, 'Pedido guardado', wx + 0.85, wy, 4, 0.7, { fontSize: 19, bold: true, color: C.navy, valign: 'mid' });
  text(s, 'Número: 1042', wx + 0.3, wy + 0.85, 3, 0.36, { fontSize: 16, bold: true, color: C.navy });
  text(s, 'Cliente: Ana Soto', wx + 0.3, wy + 1.2, 3, 0.36, { fontSize: 16, color: C.navy });
  [['Producto', 'Cantidad', 'Unidad'], ['Cemento', '2', 'saco'], ['Brocha', '3', 'unidad']].forEach((row, r) => {
    row.forEach((c, k) => text(s, c, wx + 0.3 + [0, 2.2, 3.6][k], wy + 1.6 + r * 0.38, 1.3, 0.34, { fontSize: 14.5, bold: r === 0, color: r === 0 ? C.ink : C.navy }));
  });
  hline(s, wx + 0.3, wy + 1.94, ww - 0.6);
  const b1 = wy + 2.75, b2 = wy + 3.55;
  button(s, 'Consultar este pedido', wx + 0.3, b1, 3.0, 0.46, false);
  button(s, 'Registrar otro pedido', wx + 0.3, b2, 3.0, 0.46, false);
  const x = M + 6.95, w = M + CW - x;
  [[b1, 'search', C.titleFill, 'Abre la consulta con el número asignado y recupera lo guardado'],
   [b2, 'circle-plus', C.red, 'Abre un formulario vacío para un pedido nuevo']].forEach(([by, ic, color, t]) => {
    s.addShape(SH.line, { x: wx + 3.35, y: by + 0.23, w: x - wx - 3.4, h: 0, line: { color, width: 2, endArrowType: 'triangle' } });
  });
  [[b1, 'search', C.titleFill, 'Consultar este pedido', 'Abre la consulta y recupera lo guardado'],
   [b2, 'circle-plus', C.red, 'Registrar otro pedido', 'Abre un formulario vacío para otro pedido']].forEach(([by, ic, color, k, t]) => {
    const y = by + 0.23 - 0.37;
    disc(s, ic, x + 0.05, y + 0.07, 0.6, color);
    text(s, k, x + 0.85, y, w - 0.85, 0.36, { fontSize: 16, bold: true, color: C.navy });
    text(s, t, x + 0.85, y + 0.36, w - 0.85, 0.36, { fontSize: 14.5 });
  });
  round(s, x, wy, w, 1.6, C.successSoft);
  disc(s, 'circle-check', x + 0.25, wy + 0.25, 0.6, C.success);
  text(s, 'La confirmación aparece solo si el pedido quedó guardado.', x + 1.05, wy + 0.15, w - 1.25, 1.3, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  finish(s, 'La confirmación y la consulta muestran el mismo pedido; no crean pedidos nuevos.');
}

// 37 · Estados de una misma pantalla.
{
  const s = headed(base('Una pantalla, varios estados', 'Bloque 2 · Estación 4', { active: [3] }));
  text(s, 'Estado de pantalla: cómo se ve la interfaz en una situación.', M, 1.62, CW, 0.4, { fontSize: 19, bold: true, color: C.navy });
  const states = [['empty', 'Vacía', 'Entrada inicial', C.slate], ['filled', 'Completada', 'Datos ingresados', C.titleFill], ['error', 'Con error', 'Validación', C.gold], ['fail', 'Fallo de guardado', 'Problema del sistema', C.red]];
  const w = 2.35, gap = (CW - 4 * w) / 3, y = 2.2, h = 3.3;
  states.forEach(([st, name, sub, color], i) => {
    const x = M + i * (w + gap);
    miniPhone(s, x + 0.12, y, w - 0.24, h, st);
    inShape(s, name, SH.roundRect, x, y + h + 0.12, w, 0.44, color, { color: color === C.gold ? C.navy : C.white, fontSize: 14.5, rectRadius: 0.06 });
  });
  finish(s, 'No hace falta una página por mensaje. El estado de la pantalla no es el estado del pedido.');
}

// 38 · Pantalla, lógica y almacenamiento como capas.
{
  const s = headed(base('Pantalla, lógica y almacenamiento', 'Bloque 2 · Estación 4', { active: [3] }));
  const layers = [
    ['monitor-smartphone', C.titleFill, C.white, 'Pantalla', 'Lo que ve y usa la persona', 'Seleccionar cliente y productos, editar cantidades, leer mensajes y resultados'],
    ['cpu', C.gold, C.navy, 'Lógica', 'El procesamiento que aplica las reglas', 'Aplicar las reglas, coordinar el guardado y asignar un número único'],
    ['database', C.navy, C.white, 'Almacenamiento', 'Conserva la información al salir de la pantalla', 'Conservar el pedido, su cliente y sus cantidades para recuperarlos después'],
  ];
  layers.forEach(([ic, color, fg, name, def, job], i) => {
    const y = 1.72 + i * 1.47, x = M + i * 0.35, w = CW - 0.7;
    round(s, x, y, w, 1.22, C.white, color, { line: { color, width: 2 } });
    rect(s, x, y, 3.55, 1.22, color);
    disc(s, ic, x + 0.22, y + 0.25, 0.72, C.white, color);
    text(s, name, x + 1.1, y + 0.12, 2.4, 0.5, { fontSize: 21, bold: true, color: fg, valign: 'mid' });
    text(s, def, x + 1.1, y + 0.6, 2.35, 0.55, { fontSize: 12.5, color: fg });
    text(s, job, x + 3.85, y, w - 4.1, 1.22, { fontSize: 17, color: C.navy, valign: 'mid' });
    if (i < 2) icon(s, 'arrow-down-up', x + 1.55, y + 1.22, 0.25, C.slate, 2);
  });
  finish(s, 'Las tres partes se conectan, aunque el equipo todavía no elija cómo implementarlas.');
}

// 39 · Declaración: un dibujo no prueba nada.
{
  const s = base('', 'Bloque 2 · Estación 4', { dark: true, active: [3] });
  photo(s, 'lupa-documento.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 14);
  headed(s);
  button(s, 'Guardar pedido', M, 1.6, 2.6, 0.6);
  text(s, 'Un botón Guardar dibujado es una acción prevista, no una prueba.', M, 2.6, 8.5, 1.9, { fontSize: 40, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Se comprueba en el sistema construido: se recorre la operación y se recuperan los datos guardados.', M, 4.6, 7.6, 1.0, { fontSize: 21, color: C.softBlue });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 40 · Trabajo en equipo del bloque.
{
  const s = base('', 'Bloque 2 · Trabajo en equipo', { dark: true, active: [2, 3] });
  photo(s, 'equipo-mesa.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  text(s, 'Ahora en tu proyecto', M, 1.0, 6.2, 0.75, { fontSize: 36, bold: true, color: C.white, fontFace: F.display });
  inShape(s, '12 min', SH.roundRect, M, 1.95, 2.0, 0.7, C.red, { fontSize: 24, rectRadius: 0.08 });
  text(s, 'Aplica las estaciones 3 y 4 a la operación del Bloque 1.', M, 2.9, 6.3, 0.9, { fontSize: 21, bold: true, color: C.white });
  [['file-text', 'Evidencia', 'Una historia con criterios y un recorrido con bocetos'],
   ['book-open', 'Instrucciones', 'Guía de la clase, sección 2.4'],
   ['sparkles', 'Si usas IA para revisar', 'Verifica cada sugerencia: una función nueva no es un acuerdo']].forEach(([ic, k, v], i) => {
    const y = 3.95 + i * 0.82;
    disc(s, ic, M, y, 0.62, C.gold, C.navy);
    label(s, k, M + 0.8, y - 0.02, 5, C.gold, 11.5);
    text(s, v, M + 0.8, y + 0.26, 6.6, 0.4, { fontSize: 17, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa. No convertir los datos de la ferretería en requisitos del proyecto.'] });
}

// 41 y 42 · Preguntas y respuestas del bloque.
const B2 = [
  ['user', 'Usuario y beneficio', 'En la historia de registro, ¿quién usa el sistema y qué obtiene al completar la operación?',
    'Distingue a quien atiende en el mesón de quien solicita los productos.',
    'La persona del mesón registra lo solicitado y puede encontrarlo cuando el cliente consulte. Ana Soto es la cliente.',
    'Identificar bien al usuario permite decidir quién necesita acceso a cada pantalla.'],
  ['triangle-alert', 'Errores y recorrido', 'Si la cantidad de cemento es cero, ¿qué debe ocurrir antes de poder mostrar «Pedido guardado»?',
    'Sigue la corrección de datos, la nueva solicitud y el resultado del guardado.',
    'Se señala la cantidad y no se guarda. Tras corregir y volver a pulsar, solo se confirma si el guardado se completa.',
    'El recorrido también explica cómo se recupera una operación que no pudo continuar.'],
  ['database', 'Pantalla y datos', '¿Por qué dibujar un botón Guardar y un mensaje de éxito no demuestra que se cumplió la historia?',
    'Revisa qué debe ocurrir al consultar después el número asignado.',
    'El dibujo es una intención. El sistema debe guardar y recuperar cliente, productos y cantidades al consultar el número.',
    'Una historia se comprueba con un resultado que conecta pantalla, lógica y almacenamiento.'],
];
{
  const s = headed(base('Preguntas de comprobación', 'Bloque 2 · Cierre', { active: [2, 3] }));
  qaRows(s, 'q', B2);
  finish(s, '');
}
{
  const s = headed(base('Lo que tenía que aparecer en tu respuesta', 'Bloque 2 · Cierre', { active: [2, 3], bg: C.white, titleSize: 28 }));
  qaRows(s, 'a', B2);
  finish(s, '');
}

// 43 · Pausa.
{
  const s = base('', 'Pausa · 09:30 a 09:40', { dark: true });
  photo(s, 'pausa-cafe.jpg', 7.45, 1.15, M + CW - 7.45, 5.55);
  headed(s);
  disc(s, 'coffee', M, 1.4, 1.3, C.gold, C.navy);
  text(s, 'Pausa', M, 2.95, 6, 1.0, { fontSize: 58, bold: true, color: C.white, fontFace: F.display });
  text(s, '10 minutos', M, 3.95, 6, 0.6, { fontSize: 26, color: C.gold, bold: true });
  round(s, M, 4.95, 6.0, 1.0, C.titleFill);
  disc(s, ST[4].icon, M + 0.2, 5.12, 0.66, C.white, C.navy);
  text(s, 'Al volver: obtener los datos desde la operación', M + 1.05, 4.95, 4.8, 1.0, { fontSize: 18, bold: true, color: C.white, valign: 'mid' });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// ---------------------------------------------------------------------------
// BLOQUE 3 · Obtener los datos desde la operación

// Color fijo por entidad; se mantiene en el Bloque 4.
const ENT = {
  cliente: { name: 'Cliente', icon: 'user', color: C.red, fg: C.white },
  producto: { name: 'Producto', icon: 'package', color: C.gold, fg: C.navy },
  pedido: { name: 'Pedido', icon: 'ticket', color: C.titleFill, fg: C.white },
  linea: { name: 'Línea de pedido', icon: 'list', color: C.success, fg: C.white },
};
// Segmento entre dos puntos, con flecha opcional al final.
function seg(s, x1, y1, x2, y2, color = C.navy, width = 1.8, endArrow = false) {
  s.addShape(SH.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(0.001, Math.abs(x2 - x1)), h: Math.max(0.001, Math.abs(y2 - y1)),
    flipH: x2 < x1, flipV: y2 < y1, line: { color, width, ...(endArrow ? { endArrowType: 'triangle' } : {}) } });
}
// Boleta de un pedido con sus líneas; resalta un producto.
function ticket(s, x, y, w, num, lines, hi = null) {
  const h = 1.05 + lines.length * 0.46;
  rect(s, x, y, w, h, C.white, C.border);
  rect(s, x, y, w, 0.55, ENT.pedido.color);
  icon(s, 'ticket', x + 0.18, y + 0.11, 0.33, C.white);
  text(s, `Pedido N.º ${num}`, x + 0.62, y, w - 0.7, 0.55, { fontSize: 17, bold: true, color: C.white, valign: 'mid' });
  text(s, 'Cliente: Ana Soto', x + 0.25, y + 0.6, w - 0.5, 0.36, { fontSize: 14.5, color: C.ink, valign: 'mid' });
  lines.forEach(([p, q, u], i) => {
    const ly = y + 1.0 + i * 0.46;
    if (p === hi) rect(s, x + 0.12, ly, w - 0.24, 0.42, C.warningSoft);
    text(s, p, x + 0.25, ly, w * 0.45, 0.42, { fontSize: 16, bold: p === hi, color: C.navy, valign: 'mid' });
    text(s, q, x + w * 0.52, ly, 0.6, 0.42, { fontSize: 18, bold: true, color: p === hi ? C.red : C.navy, valign: 'mid' });
    text(s, u, x + w * 0.52 + 0.6, ly, w * 0.48 - 0.75, 0.42, { fontSize: 14.5, color: C.ink, valign: 'mid' });
  });
  return h;
}
function entityBox(s, key, x, y, w, h, label = null) {
  const e = ENT[key];
  inShape(s, label || e.name, SH.roundRect, x, y, w, h, e.color, { color: e.fg, fontSize: 18, rectRadius: 0.08 });
}

// 44 · Apertura del bloque sobre fotografía.
{
  const s = base('', 'Bloque 3 · 09:40 a 10:10 · 30 minutos', { dark: true, active: [4] });
  photo(s, 'fichero.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  inShape(s, '3', SH.ellipse, M, 1.3, 1.2, 1.2, C.navy, { fontSize: 54, line: { color: C.white, width: 2 } });
  text(s, 'Obtener los datos\ndesde la operación', M, 2.75, 6.6, 1.8, { fontSize: 42, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Qué debe conservar el sistema y a qué pertenece cada dato.', M, 4.6, 5.9, 0.9, { fontSize: 19, color: C.softBlue });
  const st = ST[4];
  round(s, 7.45, 1.4, 5.16, 2.1, C.navy, C.white, { line: { color: C.white, width: 2 } });
  disc(s, st.icon, 7.7, 1.65, 0.72, C.white, C.navy);
  text(s, `5 · ${st.name}`, 8.6, 1.65, 3.8, 0.72, { fontSize: 21, bold: true, color: C.white, valign: 'mid' });
  text(s, QUESTIONS[4], 7.7, 2.47, 4.7, 0.9, { fontSize: 14.5, color: C.white });
  ['cliente', 'producto', 'pedido'].forEach((k, i) => {
    const e = ENT[k], x = 7.45 + i * 1.75;
    disc(s, e.icon, x + 0.45, 3.95, 0.8, e.color, e.fg);
    text(s, e.name, x, 4.85, 1.7, 0.4, { fontSize: 15, bold: true, color: C.white, align: 'center' });
  });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 45 · Lo que se consulta indica lo que se guarda.
{
  const s = headed(base('Lo que se consulta es lo que se guarda', 'Bloque 3 · Estación 5', { active: [4] }));
  const wx = M, wy = 1.75, ww = 5.6, wh = 4.25;
  rect(s, wx, wy, ww, wh, C.white, C.navy, { line: { color: C.navy, width: 2 } });
  text(s, 'Consultar pedido', wx + 0.3, wy + 0.2, 4, 0.4, { fontSize: 18, bold: true, color: C.navy });
  field(s, '1042', wx + 0.3, wy + 0.7, 3.2);
  inShape(s, 'Buscar', SH.rect, wx + 3.7, wy + 0.7, 1.5, 0.44, C.navy, { fontSize: 14, fontFace: F.body });
  hline(s, wx + 0.3, wy + 1.45, ww - 0.6);
  const rows = [['Cliente', 'Ana Soto', 'cliente'], ['Cemento', '2 sacos', 'producto'], ['Brocha', '3 unidades', 'producto']];
  rows.forEach(([k, v, e], i) => {
    const y = wy + 1.7 + i * 0.75;
    rect(s, wx + 0.3, y, 0.12, 0.55, ENT[e].color);
    text(s, k, wx + 0.6, y, 2.2, 0.55, { fontSize: 18, bold: true, color: C.navy, valign: 'mid' });
    text(s, v, wx + 2.8, y, 2.4, 0.55, { fontSize: 18, color: C.ink, valign: 'mid' });
  });
  arrow(s, wx + ww + 0.2, wy + wh / 2, 0.9, C.red, 2.6);
  const x = M + 6.95, w = M + CW - x;
  label(s, 'Debe conservarse', x, wy + 0.1, w, C.red, 13);
  [['user', ENT.cliente.color, C.white, 'El cliente del pedido'], ['package', ENT.producto.color, C.navy, 'Los productos pedidos'], ['hash', ENT.linea.color, C.white, 'La cantidad de cada producto']].forEach(([ic, color, fg, t], i) => {
    const y = wy + 0.6 + i * 1.15;
    disc(s, ic, x, y, 0.85, color, fg);
    text(s, t, x + 1.1, y, w - 1.1, 0.85, { fontSize: 20, bold: true, color: C.navy, valign: 'mid' });
  });
  finish(s, 'Los resultados que exige la consulta indican qué información debe guardar el sistema.');
}

// 46 · Base de datos y modelo de datos.
{
  const s = headed(base('Base de datos y modelo de datos', 'Bloque 3 · Estación 5', { active: [4] }));
  const w = 5.6, y = 1.75, h = 3.3, x2 = M + CW - w;
  [[M, 'database', C.navy, C.white, 'Base de datos', 'Un conjunto organizado de datos que el sistema guarda para consultarlos y modificarlos.'],
   [x2, 'layers', C.gold, C.navy, 'Modelo de datos', 'Describe qué información se necesita y cómo se relaciona.']].forEach(([x, ic, color, fg, name, def]) => {
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, w, 0.14, color);
    disc(s, ic, x + 0.35, y + 0.45, 1.1, color, fg);
    text(s, name, x + 1.7, y + 0.45, w - 1.9, 1.1, { fontSize: 26, bold: true, color: C.navy, valign: 'mid', fontFace: F.display });
    text(s, def, x + 0.35, y + 1.8, w - 0.7, 1.3, { fontSize: 19, color: C.ink });
  });
  // Qué se hace en cada bloque.
  const by = 5.3;
  inShape(s, 'Bloque 3 · el modelo, desde la operación', SH.roundRect, M, by, 5.6, 0.62, C.navy, { fontSize: 16, rectRadius: 0.08 });
  arrow(s, M + 5.75, by + 0.31, x2 - M - 5.9, C.red, 2.2);
  inShape(s, 'Bloque 4 · las tablas y sus claves', SH.roundRect, x2, by, w, 0.62, C.white, { color: C.navy, fontSize: 16, rectRadius: 0.08, line: { color: C.navy, width: 1.4 } });
  finish(s, '');
}

// 47 · Leer los datos del recorrido.
{
  const s = headed(base('Qué representa cada dato del ejemplo', 'Bloque 3 · Estación 5', { active: [4] }));
  const rows = [
    ['Ana Soto', 'cliente', 'La cliente del pedido', 'Saber de quién es y permitir que tenga otros pedidos'],
    ['1042', 'pedido', 'Un pedido concreto', 'Recuperarlo sin confundirlo con otro'],
    ['Cemento · Brocha', 'producto', 'Productos que se pueden pedir', 'Reconocerlos y usarlos en otros pedidos'],
    ['saco · unidad', 'producto', 'La unidad de venta de cada producto', 'Entender qué representan las cantidades'],
    ['2 · 3', 'linea', 'Lo pedido de cada producto en el 1042', 'Conservar cuánto pidió en esa operación'],
  ];
  const x1 = M, x2 = M + 3.35, x3 = M + 7.45, y0 = 1.72;
  label(s, 'Dato', x1, y0, 3, C.slate, 11);
  label(s, 'Qué representa', x2, y0, 4, C.slate, 11);
  label(s, 'Por qué se necesita', x3, y0, 4, C.slate, 11);
  rows.forEach(([v, e, rep, why], i) => {
    const y = y0 + 0.35 + i * 0.8, en = ENT[e];
    inShape(s, v, SH.roundRect, x1, y, 3.1, 0.66, en.color, { color: en.fg, fontSize: 18, rectRadius: 0.08 });
    arrow(s, x1 + 3.12, y + 0.33, 0.2, C.slate, 1.4);
    text(s, rep, x2 + 0.05, y, 3.95, 0.66, { fontSize: 16.5, bold: true, color: C.navy, valign: 'mid' });
    text(s, why, x3, y, M + CW - x3, 0.66, { fontSize: 15.5, valign: 'mid' });
    if (i < 4) hline(s, x2, y + 0.73, M + CW - x2, C.border);
  });
  finish(s, 'El nombre de un producto sirve en muchos pedidos; la cantidad cambia en cada uno.');
}

// 48 · No todo lo que se ve se guarda.
{
  const s = headed(base('No todo lo que aparece en pantalla se guarda', 'Bloque 3 · Estación 5', { active: [4] }));
  const w = 5.6, y = 1.75, h = 4.25, x2 = M + CW - w;
  round(s, M, y, w, h, C.successSoft, C.success, { line: { color: C.success, width: 2 } });
  disc(s, 'database', M + 0.3, y + 0.3, 0.75, C.success);
  text(s, 'Se guarda', M + 1.25, y + 0.3, 3, 0.75, { fontSize: 24, bold: true, color: C.navy, valign: 'mid' });
  text(s, 'Datos que ingresa o elige la persona', M + 0.3, y + 1.15, w - 0.6, 0.4, { fontSize: 15.5 });
  [['Ana Soto', 0.3, 1.7, 3.0], ['Cemento', 0.3, 2.4, 2.8], ['2', 3.3, 2.4, 1.0], ['Brocha', 0.3, 3.1, 2.8], ['3', 3.3, 3.1, 1.0]].forEach(([t, dx, dy, cw]) => {
    field(s, t, M + dx, y + dy, cw, 0.56, { size: 17, line: C.success, lw: 1.6 });
  });
  text(s, 'Cliente, productos y cantidades', M + 0.3, y + 3.78, w - 0.6, 0.4, { fontSize: 16, bold: true, color: C.success });
  round(s, x2, y, w, h, C.paleRed, C.red, { line: { color: C.red, width: 2, dashType: 'dash' } });
  disc(s, 'ban', x2 + 0.3, y + 0.3, 0.75, C.red);
  text(s, 'No es un dato del pedido', x2 + 1.25, y + 0.3, w - 1.4, 0.75, { fontSize: 22, bold: true, color: C.navy, valign: 'mid' });
  button(s, 'Guardar pedido', x2 + 0.3, y + 1.4, 2.6, 0.56);
  text(s, 'Representa una acción', x2 + 3.1, y + 1.4, w - 3.3, 0.56, { fontSize: 15.5, bold: true, color: C.navy, valign: 'mid' });
  icon(s, 'triangle-alert', x2 + 0.3, y + 2.42, 0.36, C.red);
  text(s, 'Ingresa una cantidad mayor que cero', x2 + 0.75, y + 2.35, w - 1.0, 0.5, { fontSize: 15, bold: true, color: C.red, valign: 'mid' });
  text(s, 'Explica una validación', x2 + 0.75, y + 2.85, w - 1.0, 0.4, { fontSize: 15.5, bold: true, color: C.navy });
  finish(s, 'Dibujar un botón o un mensaje en el formulario no los convierte en datos del pedido.');
}

// 49 · Entidad, registro, atributo y valor sobre una ficha.
{
  const s = headed(base('Entidad, registro, atributo y valor', 'Bloque 3 · Estación 5', { active: [4] }));
  const cx = 4.45, cy = 2.35, cw = 4.6, ch = 2.55;
  // Otro registro detrás: el catálogo tiene muchas fichas.
  inShape(s, 'Otra ficha: Brocha · unidad', SH.rect, cx + 0.3, cy - 0.34, cw, 0.34, C.white, { color: C.ink, fontSize: 11.5, fontFace: F.body, bold: false, align: 'left', margin: 6, line: { color: C.border, width: 1 } });
  rect(s, cx, cy, cw, ch, C.white, C.navy, { line: { color: C.navy, width: 1.6 } });
  rect(s, cx, cy, cw, 0.7, ENT.producto.color);
  icon(s, 'package', cx + 0.2, cy + 0.15, 0.4, C.navy);
  text(s, 'PRODUCTO', cx + 0.75, cy, 3, 0.7, { fontSize: 18, bold: true, color: C.navy, valign: 'mid', charSpacing: 2 });
  [['nombre', 'Cemento'], ['unidad de venta', 'saco']].forEach(([a, v], i) => {
    const y = cy + 0.95 + i * 0.7;
    text(s, a, cx + 0.25, y, 2.1, 0.5, { fontSize: 15.5, color: C.ink, valign: 'mid' });
    inShape(s, v, SH.rect, cx + 2.4, y, 1.95, 0.5, C.warningSoft, { color: C.navy, fontSize: 17, align: 'left', margin: 6 });
  });
  // Etiquetas con conectores externos.
  const L = [
    ['Entidad', 'Producto: el tipo de cosa sobre la que se guarda información', cy + 0.05, cy + 0.35, C.red],
    ['Atributo', 'nombre: una característica que se guarda', cy + 0.95, cy + 1.2, C.titleFill],
    ['Registro', 'Esta ficha: los datos de un caso concreto', cy + 2.0, cy + 2.2, C.success],
  ];
  L.forEach(([k, t, ty, ly, color]) => {
    label(s, k, M, ty, 3.3, color, 13);
    text(s, t, M, ty + 0.3, 3.3, 0.62, { fontSize: 14, color: C.navy });
    seg(s, M + 3.35, ly, cx, ly, color, 1.6);
    s.addShape(SH.ellipse, { x: cx - 0.07, y: ly - 0.07, w: 0.14, h: 0.14, fill: { color }, line: { color, transparency: 100 } });
  });
  const vx = cx + cw + 0.35, vy = cy + 1.2;
  seg(s, cx + 4.35, vy, vx, vy, C.gold, 1.6);
  s.addShape(SH.ellipse, { x: cx + 4.28, y: vy - 0.07, w: 0.14, h: 0.14, fill: { color: C.gold }, line: { color: C.gold, transparency: 100 } });
  label(s, 'Valor', vx + 0.05, cy + 0.85, 3, C.navy, 13);
  text(s, 'Cemento: el contenido concreto de ese atributo', vx + 0.05, cy + 1.15, M + CW - vx - 0.05, 0.8, { fontSize: 14, color: C.navy });
  finish(s, 'Ana Soto es un caso de Cliente; Cemento, de Producto; el pedido 1042, de Pedido.');
}

// 50 · Las tres entidades propuestas.
{
  const s = headed(base('Tres entidades para el registro', 'Bloque 3 · Estación 5', { active: [4] }));
  const data = [
    ['cliente', 'La persona a quien corresponde lo solicitado', ['Nombre'], 'Ana Soto'],
    ['producto', 'Un artículo del catálogo de la ferretería', ['Nombre', 'Unidad de venta'], 'Cemento · saco'],
    ['pedido', 'Una solicitud concreta de un cliente', ['Número de pedido'], '1042'],
  ];
  const w = 3.75, gap = (CW - 3 * w) / 2, y = 1.75, h = 4.25;
  data.forEach(([k, rep, attrs, ex], i) => {
    const e = ENT[k], x = M + i * (w + gap);
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, w, 1.15, e.color);
    disc(s, e.icon, x + 0.25, y + 0.2, 0.75, C.white, e.color);
    text(s, e.name, x + 1.15, y + 0.2, w - 1.3, 0.75, { fontSize: 25, bold: true, color: e.fg, valign: 'mid', fontFace: F.display });
    text(s, rep, x + 0.25, y + 1.3, w - 0.5, 0.75, { fontSize: 15.5, color: C.ink });
    label(s, 'Atributos', x + 0.25, y + 2.1, 3, C.slate, 11);
    attrs.forEach((a, j) => inShape(s, a, SH.roundRect, x + 0.25, y + 2.42 + j * 0.5, w - 0.5, 0.42, C.mist, { color: C.navy, fontSize: 15, rectRadius: 0.06, align: 'left', margin: 6 }));
    label(s, 'Un caso concreto', x + 0.25, y + 3.48, 3, C.slate, 11);
    text(s, ex, x + 0.25, y + 3.75, w - 0.5, 0.45, { fontSize: 19, bold: true, color: C.navy });
  });
  finish(s, 'Dos clientes pueden llamarse igual: compartir nombre no los hace la misma persona.');
}

// 51 · Supuesto: unidad de venta por producto.
{
  const s = headed(base('Un supuesto sobre las unidades', 'Bloque 3 · Estación 5', { active: [4] }));
  s.addText('SUPUESTO', { shape: SH.roundRect, x: M + 0.2, y: 1.95, w: 3.6, h: 1.05, rectRadius: 0.1, rotate: -6,
    fill: { color: C.white }, line: { color: ORIGIN.assumption, width: 4 },
    fontFace: F.display, fontSize: 32, bold: true, color: ORIGIN.assumption, align: 'center', valign: 'mid', charSpacing: 3, margin: 0 });
  text(s, 'Cada producto tiene una unidad de venta definida.', M, 3.4, 4.3, 1.2, { fontSize: 24, bold: true, color: C.navy });
  text(s, 'Cada proyecto revisa las unidades que usa su propia operación.', M, 4.7, 4.3, 0.9, { fontSize: 17 });
  const w = 3.6, gap = 0.3, x0 = M + 4.7;
  [['sacos-cemento-recorte.jpg', 'Cemento', 'saco'], ['brochas-recorte.jpg', 'Brocha', 'unidad']].forEach(([file, p, u], i) => {
    const x = x0 + i * (w + gap);
    photo(s, file, x, 1.75, w, 3.4);
    rect(s, x, 5.15, w, 0.85, C.navy);
    text(s, p, x + 0.25, 5.15, 1.8, 0.85, { fontSize: 20, bold: true, color: C.white, valign: 'mid' });
    inShape(s, u, SH.roundRect, x + w - 1.45, 5.35, 1.25, 0.45, C.gold, { color: C.navy, fontSize: 16, rectRadius: 0.06 });
  });
  finish(s, 'Si el supuesto cambia, cambian los atributos del producto.', { notes: ['Fotos ilustrativas.'] });
}

// 52 · Segundo pedido: la cantidad cambia.
{
  const s = headed(base('¿A qué pertenece la cantidad?', 'Bloque 3 · Estación 5', { active: [4] }));
  text(s, 'Se agrega un segundo pedido ficticio de Ana Soto, el 1043.', M, 1.66, CW, 0.42, { fontSize: 19 });
  ticket(s, M, 2.35, 4.6, '1042', [['Cemento', '2', 'saco'], ['Brocha', '3', 'unidad']], 'Cemento');
  ticket(s, M + CW - 4.6, 2.35, 4.6, '1043', [['Cemento', '5', 'saco']], 'Cemento');
  inShape(s, '?', SH.ellipse, W / 2 - 0.75, 2.6, 1.5, 1.5, C.red, { fontSize: 64 });
  text(s, 'El mismo producto, dos cantidades', W / 2 - 1.5, 4.25, 3.0, 0.75, { fontSize: 17, bold: true, color: C.navy, align: 'center' });
  text(s, 'Esta comparación sirve para leer los dos pedidos; todavía no es la propuesta de tablas.', M, 5.45, CW, 0.45, { fontSize: 15.5, color: C.ink });
  finish(s, '1043 identifica otra operación; el 5 es la cantidad pedida en ella.');
}

// 53 · Si la cantidad estuviera en Producto.
{
  const s = headed(base('Si la cantidad fuera un dato de Producto', 'Bloque 3 · Estación 5', { active: [4] }));
  const px = 4.6, py = 2.3, pw = 4.1;
  inShape(s, '1042 · 2 sacos', SH.roundRect, M, 2.2, 3.0, 0.8, ENT.pedido.color, { fontSize: 18, rectRadius: 0.08 });
  inShape(s, '1043 · 5 sacos', SH.roundRect, M, 4.2, 3.0, 0.8, ENT.pedido.color, { fontSize: 18, rectRadius: 0.08 });
  seg(s, M + 3.05, 2.6, px - 0.05, 3.55, C.red, 2.2, true);
  seg(s, M + 3.05, 4.6, px - 0.05, 3.75, C.red, 2.2, true);
  rect(s, px, py, pw, 2.75, C.white, C.navy, { line: { color: C.navy, width: 1.6 } });
  rect(s, px, py, pw, 0.65, ENT.producto.color);
  text(s, 'PRODUCTO · Cemento', px + 0.25, py, pw - 0.4, 0.65, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  text(s, 'cantidad pedida', px + 0.25, py + 0.95, 2.0, 0.55, { fontSize: 15.5, color: C.ink, valign: 'mid' });
  inShape(s, '2  →  5', SH.rect, px + 2.2, py + 0.95, 1.65, 0.55, C.paleRed, { color: C.red, fontSize: 19, line: { color: C.red, width: 2 } });
  disc(s, 'circle-x', px + 0.25, py + 1.75, 0.7, C.red);
  text(s, 'Una sola casilla: el 5 borra el 2', px + 1.1, py + 1.75, pw - 1.25, 0.7, { fontSize: 16, bold: true, color: C.navy, valign: 'mid' });
  const x = px + pw + 0.45, w = M + CW - x;
  text(s, 'No se podrían representar a la vez los 2 sacos del pedido 1042 y los 5 del pedido 1043.', x, 2.3, w, 2.0, { fontSize: 20, bold: true, color: C.navy });
  finish(s, 'La cantidad no es una característica general del producto: depende de cada pedido.');
}

// 54 · La línea de pedido guarda la cantidad.
{
  const s = headed(base('La cantidad vive en la línea de pedido', 'Bloque 3 · Estación 5', { active: [4] }));
  text(s, [
    { text: 'Línea de pedido o detalle de pedido: ', options: { bold: true, color: ENT.linea.color } },
    { text: 'cada aparición de un producto dentro de un pedido.', options: { color: C.navy } },
  ], M, 1.66, CW, 0.45, { fontSize: 19 });
  const pw = 2.3, chipX = 5.25, chipW = 2.85, prX = M + CW - pw;
  const yTop = 2.65, yMid = 3.95, yBot = 5.2;
  entityBox(s, 'pedido', M, yTop - 0.45, pw, 0.9, 'Pedido 1042');
  entityBox(s, 'pedido', M, yBot - 0.45, pw, 0.9, 'Pedido 1043');
  entityBox(s, 'producto', prX, yTop - 0.45, pw, 0.9, 'Brocha');
  entityBox(s, 'producto', prX, yBot - 0.45, pw, 0.9, 'Cemento');
  const chips = [[yTop, 'Brocha · 3 unidades'], [yMid, 'Cemento · 2 sacos'], [yBot, 'Cemento · 5 sacos']];
  chips.forEach(([y, t]) => inShape(s, t, SH.roundRect, chipX, y - 0.33, chipW, 0.66, ENT.linea.color, { fontSize: 16, rectRadius: 0.08 }));
  const c = C.slate;
  seg(s, M + pw, yTop, chipX, yTop, c); seg(s, chipX + chipW, yTop, prX, yTop, c);
  seg(s, M + pw, yTop + 0.2, chipX, yMid, c); seg(s, chipX + chipW, yMid, prX, yBot - 0.2, c);
  seg(s, M + pw, yBot, chipX, yBot, c); seg(s, chipX + chipW, yBot, prX, yBot, c);
  finish(s, 'La cantidad pertenece a la relación entre un pedido y un producto.');
}

// 55 · Relación y cardinalidad: dos preguntas, dos sentidos.
{
  const s = headed(base('Una relación se pregunta en los dos sentidos', 'Bloque 3 · Estación 5', { active: [4] }));
  text(s, [
    { text: 'Relación: ', options: { bold: true, color: C.red } }, { text: 'cómo se vinculan las entidades.   ', options: { color: C.navy } },
    { text: 'Cardinalidad: ', options: { bold: true, color: C.red } }, { text: 'cuántos casos de una pueden vincularse con un caso de otra.', options: { color: C.navy } },
  ], M, 1.66, CW, 0.8, { fontSize: 18 });
  const d = 1.8, y = 3.0;
  disc(s, ENT.cliente.icon, M + 0.6, y, d, ENT.cliente.color);
  text(s, 'Cliente', M + 0.6, y + d + 0.1, d, 0.45, { fontSize: 20, bold: true, color: C.navy, align: 'center' });
  disc(s, ENT.pedido.icon, M + CW - 0.6 - d, y, d, ENT.pedido.color);
  text(s, 'Pedido', M + CW - 0.6 - d, y + d + 0.1, d, 0.45, { fontSize: 20, bold: true, color: C.navy, align: 'center' });
  const ax = M + 0.6 + d + 0.3, aw = CW - 1.2 - 2 * d - 0.6;
  arrow(s, ax, y + 0.55, aw, C.red, 2.6);
  text(s, '¿Cuántos pedidos puede tener un cliente?', ax, y - 0.05, aw, 0.5, { fontSize: 18, bold: true, color: C.navy, align: 'center' });
  s.addShape(SH.line, { x: ax, y: y + 1.3, w: aw, h: 0, line: { color: C.titleFill, width: 2.6, beginArrowType: 'triangle' } });
  text(s, '¿A cuántos clientes corresponde un pedido?', ax, y + 1.4, aw, 0.5, { fontSize: 18, bold: true, color: C.navy, align: 'center' });
  finish(s, 'Una relación queda clara solo cuando se responden las dos preguntas.');
}

// 56 · Uno a muchos.
{
  const s = headed(base('Cliente y Pedido: uno a muchos', 'Bloque 3 · Estación 5', { active: [4] }));
  const d = 1.6, cy = 3.6;
  disc(s, ENT.cliente.icon, M + 0.4, cy - d / 2, d, ENT.cliente.color);
  text(s, 'Ana Soto', M + 0.4, cy + d / 2 + 0.1, d, 0.45, { fontSize: 19, bold: true, color: C.navy, align: 'center' });
  const tx = 6.4, tw = 2.6;
  [[2.35, '1042'], [3.85, '1043']].forEach(([y, n]) => {
    entityBox(s, 'pedido', tx, y, tw, 0.85, `Pedido ${n}`);
    seg(s, M + 0.4 + d, cy, tx, y + 0.42, C.slate, 2);
  });
  inShape(s, 'o ninguno todavía', SH.roundRect, tx, 5.35, tw, 0.6, C.paper, { color: C.navy, fontSize: 15, fontFace: F.body, bold: false, rectRadius: 0.08, line: { color: ENT.pedido.color, width: 1.4, dashType: 'dash' } });
  seg(s, M + 0.4 + d, cy, tx, 5.65, C.border, 1.5);
  const x = tx + tw + 0.4, w = M + CW - x;
  inShape(s, 'UNO A MUCHOS', SH.roundRect, x, 2.0, w, 0.6, C.navy, { fontSize: 17, charSpacing: 2, rectRadius: 0.08 });
  [['user', ENT.cliente.color, 'Un cliente puede estar registrado sin pedidos o tener varios'], ['ticket', ENT.pedido.color, 'Cada pedido guardado corresponde a un solo cliente']].forEach(([ic, color, t], i) => {
    const y = 2.95 + i * 1.35;
    disc(s, ic, x, y, 0.7, color);
    text(s, t, x + 0.9, y - 0.1, w - 0.9, 0.95, { fontSize: 16.5, color: C.navy, valign: 'mid' });
  });
  finish(s, 'Ana Soto está vinculada a los pedidos 1042 y 1043: una cliente, dos pedidos.');
}

// 57 · Muchos a muchos.
{
  const s = headed(base('Pedido y Producto: muchos a muchos', 'Bloque 3 · Estación 5', { active: [4] }));
  const lx = M, rx = M + 5.0, bw = 2.5, yT = 2.25, yB = 4.25, bh = 0.85;
  entityBox(s, 'pedido', lx, yT, bw, bh, 'Pedido 1042');
  entityBox(s, 'pedido', lx, yB, bw, bh, 'Pedido 1043');
  entityBox(s, 'producto', rx, yT, bw, bh, 'Brocha');
  entityBox(s, 'producto', rx, yB, bw, bh, 'Cemento');
  seg(s, lx + bw, yT + 0.42, rx, yT + 0.42, C.slate, 2.2);
  seg(s, lx + bw, yT + 0.55, rx, yB + 0.3, C.slate, 2.2);
  seg(s, lx + bw, yB + 0.42, rx, yB + 0.42, C.slate, 2.2);
  const x = rx + bw + 0.45, w = M + CW - x;
  inShape(s, 'MUCHOS A MUCHOS', SH.roundRect, x, 2.0, w, 0.6, C.navy, { fontSize: 17, charSpacing: 2, rectRadius: 0.08 });
  [['ticket', ENT.pedido.color, C.white, 'Un pedido guardado incluye uno o varios productos'], ['package', ENT.producto.color, C.navy, 'Un producto puede no aparecer todavía en pedidos o aparecer en varios']].forEach(([ic, color, fg, t], i) => {
    const y = 2.95 + i * 1.35;
    disc(s, ic, x, y, 0.7, color, fg);
    text(s, t, x + 0.9, y - 0.1, w - 0.9, 0.95, { fontSize: 16.5, color: C.navy, valign: 'mid' });
  });
  text(s, 'El 1042 tiene dos productos. Cemento aparece en el 1042 y en el 1043.', M, 5.45, 7.6, 0.5, { fontSize: 16, bold: true, color: C.navy });
  finish(s, 'Esta relación, con una cantidad propia en cada línea, es la que pide un detalle de pedido.');
}

// 58 · Mínimos y máximos en una recta numérica.
{
  const s = headed(base('Cuántos: el mínimo también importa', 'Bloque 3 · Estación 5', { active: [4] }));
  text(s, '«Uno a muchos» y «muchos a muchos» resumen los máximos. También hay que decir el mínimo.', M, 1.66, CW, 0.45, { fontSize: 18 });
  const rows = [
    ['Pedidos de un cliente', [1, 1, 1, 1], '0 o más'],
    ['Clientes de un pedido guardado', [0, 1, 0, 0], 'Exactamente 1'],
    ['Productos de un pedido guardado', [0, 1, 1, 1], '1 o más'],
    ['Pedidos en que aparece un producto', [1, 1, 1, 1], '0 o más'],
  ];
  const labels = ['0', '1', '2', '…'];
  const nx = M + 5.6, d = 0.6, gap = 0.55;
  text(s, 'SE LEE', M + CW - 2.0, 2.2, 1.8, 0.3, { fontSize: 12, bold: true, color: C.slate, align: 'right', charSpacing: 1.2 });
  labels.forEach((t, j) => text(s, j === 3 ? 'varios' : t, nx + j * (d + gap) - 0.2, 2.2, d + 0.4, 0.3, { fontSize: 12, bold: true, color: C.slate, align: 'center' }));
  rows.forEach(([k, ok, read], i) => {
    const y = 2.6 + i * 0.85;
    if (i % 2 === 0) rect(s, M, y - 0.1, CW, 0.8, C.white);
    text(s, read, M + CW - 2.0, y - 0.1, 1.8, 0.8, { fontSize: 18, bold: true, color: C.red, valign: 'mid', align: 'right' });
    text(s, k, M + 0.2, y - 0.1, 5.2, 0.8, { fontSize: 18, bold: true, color: C.navy, valign: 'mid' });
    labels.forEach((t, j) => {
      const x = nx + j * (d + gap);
      if (ok[j]) inShape(s, t, SH.ellipse, x, y, d, d, C.navy, { fontSize: 16 });
      else inShape(s, t, SH.ellipse, x, y, d, d, C.white, { color: C.border, fontSize: 16, line: { color: C.border, width: 1.4 } });
    });
  });
  text(s, 'Azul: cantidades permitidas', M + CW - 3.2, 5.95, 3.2, 0.3, { fontSize: 12.5, color: C.navy, align: 'right' });
  finish(s, 'El formulario vacío es un borrador en pantalla, no un pedido guardado válido.');
}

// 59 · Los datos de prueba confirman las reglas.
{
  const s = headed(base('Los datos de prueba confirman las reglas', 'Bloque 3 · Estación 5', { active: [4] }));
  const checks = [
    ['Ana Soto está en los pedidos 1042 y 1043', 'Una cliente, dos pedidos'],
    ['El pedido 1042 incluye Cemento y Brocha', 'Un pedido, dos productos distintos'],
    ['Cemento aparece en el 1042 y en el 1043', 'Un producto, dos pedidos'],
    ['Cada línea conserva su propia cantidad', 'Los 2 del 1042 no se mezclan con los 5 del 1043'],
  ];
  checks.forEach(([a, b], i) => {
    const y = 1.75 + i * 1.05;
    disc(s, 'check', M, y + 0.08, 0.72, C.success);
    text(s, a, M + 0.95, y, 6.3, 0.5, { fontSize: 19, bold: true, color: C.navy, valign: 'mid' });
    text(s, b, M + 0.95, y + 0.45, 6.3, 0.42, { fontSize: 16 });
  });
  const x = M + 7.55, w = M + CW - x;
  photo(s, 'sacos-cemento-recorte.jpg', x, 1.75, w, 2.6);
  rect(s, x, 4.35, w, 1.65, C.navy);
  inShape(s, '2', SH.ellipse, x + 0.25, 4.6, 0.95, 0.95, C.red, { fontSize: 34 });
  text(s, '2 sacos son dos unidades de venta, no dos productos distintos.', x + 1.4, 4.4, w - 1.55, 1.55, { fontSize: 17, bold: true, color: C.white, valign: 'mid' });
  finish(s, 'Los datos de prueba ayudan a descubrir lo que necesita el modelo antes de construir tablas.', { notes: ['Foto ilustrativa.'] });
}

// 60 · Una pantalla no determina una entidad.
{
  const s = headed(base('Una pantalla no es una entidad', 'Bloque 3 · Estación 5', { active: [4] }));
  const w = 5.6, y = 1.75, h = 3.85, x2 = M + CW - w;
  [[M, 'Una pantalla usa varias entidades'], [x2, 'Una entidad aparece en varias pantallas']].forEach(([x, t]) => {
    rect(s, x, y, w, h, C.white, C.border);
    label(s, t, x + 0.3, y + 0.2, w - 0.6, C.red, 12.5);
  });
  // Izquierda: el formulario reúne tres entidades.
  inShape(s, 'Formulario de registro', SH.roundRect, M + 0.3, y + 1.9, 2.2, 0.9, C.white, { color: C.navy, fontSize: 15, line: { color: C.navy, width: 1.6 }, rectRadius: 0.08 });
  ['cliente', 'pedido', 'producto'].forEach((k, i) => {
    const ey = y + 0.8 + i * 1.0;
    entityBox(s, k, M + 3.4, ey, 1.9, 0.72);
    seg(s, M + 2.5, y + 2.35, M + 3.4, ey + 0.36, C.slate, 1.6, true);
  });
  // Derecha: un pedido en dos pantallas.
  entityBox(s, 'pedido', x2 + 3.3, y + 1.9, 2.0, 0.9, 'Pedido 1042');
  [['Confirmación', y + 0.85], ['Consulta', y + 2.95]].forEach(([t, sy]) => {
    inShape(s, t, SH.roundRect, x2 + 0.3, sy, 2.2, 0.8, C.white, { color: C.navy, fontSize: 15, line: { color: C.navy, width: 1.6 }, rectRadius: 0.08 });
    seg(s, x2 + 2.5, sy + 0.4, x2 + 3.3, y + 2.35, C.slate, 1.6, true);
  });
  text(s, 'Para justificar una entidad: qué representa, qué datos conserva y en qué operación se usa.', M, 5.7, CW, 0.45, { fontSize: 16, bold: true, color: C.navy });
  finish(s, 'Encontrar una palabra en el relato es solo una pista, no una entidad.');
}

// 61 · Trabajo en equipo del bloque.
{
  const s = base('', 'Bloque 3 · Trabajo en equipo', { dark: true, active: [4] });
  photo(s, 'equipo-mesa.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  text(s, 'Ahora en tu proyecto', M, 1.0, 6.2, 0.75, { fontSize: 36, bold: true, color: C.white, fontFace: F.display });
  inShape(s, '12 min', SH.roundRect, M, 1.95, 2.0, 0.7, C.red, { fontSize: 24, rectRadius: 0.08 });
  text(s, 'Aplica la estación 5 al recorrido y los bocetos del Bloque 2.', M, 2.9, 6.6, 0.9, { fontSize: 21, bold: true, color: C.white });
  [['file-text', 'Evidencia', 'Entidades, atributos, relaciones y sus cantidades, con dos casos ficticios'],
   ['book-open', 'Instrucciones', 'Guía de la clase, sección 3.4'],
   ['copy', 'Prueba un segundo caso', 'Que reutilice información: otro pedido, otro servicio, otra entrega']].forEach(([ic, k, v], i) => {
    const y = 3.95 + i * 0.82;
    disc(s, ic, M, y, 0.62, C.gold, C.navy);
    label(s, k, M + 0.8, y - 0.02, 5, C.gold, 11.5);
    text(s, v, M + 0.8, y + 0.26, 7.6, 0.4, { fontSize: 17, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa. Las orientaciones por proyecto están en la sección 3.4 de la guía.'] });
}

// 62 y 63 · Preguntas y respuestas del bloque.
const B3 = [
  ['tag', 'Entidad, atributo y valor', 'En el dato «Producto: Cemento», ¿qué representa Producto y qué representa Cemento? ¿Dónde se ubica su unidad de venta?',
    'Separa el tipo de cosa que se registra, la característica y su contenido concreto.',
    'Producto es la entidad; nombre y unidad de venta son atributos; Cemento y saco son valores de ese registro.',
    'Separar el concepto de sus valores permite describir un catálogo sin una entidad por artículo.'],
  ['list', 'Cantidad por operación', '¿Por qué no basta con guardar la cantidad solicitada como un dato general de Cemento?',
    'Compara los 2 sacos del pedido 1042 con los 5 sacos del pedido 1043.',
    'Cemento tiene cantidad 2 en un pedido y 5 en otro: la cantidad pertenece a cada línea entre un pedido y ese producto.',
    'Un dato de una relación no debe reemplazar la información general de una entidad.'],
  ['link-2', 'Relaciones', '¿Qué datos del ejemplo permiten afirmar que Pedido y Producto se relacionan de muchos a muchos?',
    'Revisa cuántos productos tiene un pedido y en cuántos pedidos aparece Cemento.',
    'El pedido 1042 incluye dos productos, y Cemento aparece en los pedidos 1042 y 1043.',
    'Una relación se revisa en ambos sentidos, no solo desde lo que muestra un formulario.'],
];
{
  const s = headed(base('Preguntas de comprobación', 'Bloque 3 · Cierre', { active: [4] }));
  qaRows(s, 'q', B3);
  finish(s, '');
}
{
  const s = headed(base('Lo que tenía que aparecer en tu respuesta', 'Bloque 3 · Cierre', { active: [4], bg: C.white, titleSize: 28 }));
  qaRows(s, 'a', B3);
  finish(s, '');
}

// ---------------------------------------------------------------------------
// BLOQUE 4 · Proponer tablas y comprobar el diseño

// Tabla con datos: encabezado del color de su entidad, llaves en las columnas clave.
// cols: [[nombre, fracción de ancho, 'PK' | 'FK' | 'PKFK' | null]]
function dbTable(s, x, y, w, ent, name, cols, rows, opts = {}) {
  const e = ENT[ent], hh = opts.hh || 0.48, rh = opts.rh || 0.4, fs = opts.fs || 13;
  const hi = opts.hi || [];
  const h = hh + rh + rows.length * rh;
  rect(s, x, y, w, h, C.white, C.border);
  rect(s, x, y, w, hh, e.color);
  icon(s, 'table', x + 0.12, y + (hh - 0.28) / 2, 0.28, e.fg);
  text(s, name, x + 0.5, y, w - 0.6, hh, { fontSize: fs + 2, bold: true, color: e.fg, valign: 'mid', fontFace: F.mono });
  let cx = x;
  const xs = cols.map(([, f]) => { const v = cx; cx += f * w; return v; });
  rect(s, x, y + hh, w, rh, C.mist);
  cols.forEach(([cn, f, key], j) => {
    let tx = xs[j] + 0.08;
    if (key === 'PK' || key === 'PKFK') { icon(s, 'key-round', tx, y + hh + (rh - 0.22) / 2, 0.22, C.gold, 2.4); tx += 0.24; }
    if (key === 'FK' || key === 'PKFK') { icon(s, 'link-2', tx, y + hh + (rh - 0.22) / 2, 0.22, C.red, 2.4); tx += 0.24; }
    const avail = xs[j] + f * w - tx - 0.04;
    // Monoespaciada: el tamaño se ajusta para que el nombre quepa en una línea.
    const size = Math.min(fs - 1.5, avail / (cn.length * 0.0088));
    text(s, cn, tx, y + hh, avail, rh, { fontSize: size, bold: true, color: C.navy, valign: 'mid', fontFace: F.mono });
  });
  rows.forEach((r, i) => {
    const ry = y + hh + rh + i * rh;
    if (hi.includes(i)) rect(s, x + 0.02, ry, w - 0.04, rh, C.warningSoft);
    r.forEach((v, j) => text(s, v, xs[j] + 0.1, ry, cols[j][1] * w - 0.14, rh, { fontSize: fs, color: C.navy, bold: hi.includes(i), valign: 'mid' }));
    hline(s, x, ry, w, C.border, 0.75);
  });
  return h;
}
// Caja de esquema: columnas en lista, con llave y tipo.
function schemaBox(s, x, y, w, ent, name, cols) {
  const e = ENT[ent], hh = 0.55, rh = 0.46;
  const h = hh + cols.length * rh + 0.1;
  rect(s, x, y, w, h, C.white, e.color, { line: { color: e.color, width: 1.8 } });
  rect(s, x, y, w, hh, e.color);
  text(s, name, x + 0.15, y, w - 0.3, hh, { fontSize: 15, bold: true, color: e.fg, valign: 'mid', fontFace: F.mono });
  const ys = [];
  cols.forEach(([cn, key, type], i) => {
    const ry = y + hh + 0.05 + i * rh;
    ys.push(ry + rh / 2);
    let tx = x + 0.12;
    if (key === 'PK' || key === 'PKFK') { icon(s, 'key-round', tx, ry + 0.11, 0.24, C.gold, 2.4); tx += 0.26; }
    if (key === 'FK' || key === 'PKFK') { icon(s, 'link-2', tx, ry + 0.11, 0.24, C.red, 2.4); tx += 0.26; }
    text(s, cn, tx, ry, w - (tx - x) - 0.08, rh, { fontSize: 12.5, bold: !!key, color: C.navy, valign: 'mid', fontFace: F.mono });
  });
  return { h, ys };
}
function colFrame(s, x, y, w, h, color) {
  seg(s, x, y, x + w, y, color, 3); seg(s, x, y + h, x + w, y + h, color, 3);
  seg(s, x, y, x, y + h, color, 3); seg(s, x + w, y, x + w, y + h, color, 3);
}
const COLS = {
  cliente: [['id_cliente', 0.42, 'PK'], ['nombre', 0.58, null]],
  producto: [['id_producto', 0.36, 'PK'], ['nombre', 0.3, null], ['unidad_venta', 0.34, null]],
  pedido: [['numero_pedido', 0.55, 'PK'], ['id_cliente', 0.45, 'FK']],
  detalle: [['numero_pedido', 0.39, 'PKFK'], ['id_producto', 0.36, 'PKFK'], ['cantidad', 0.25, null]],
};
const ROWS = {
  cliente: [['1', 'Ana Soto']],
  producto: [['10', 'Cemento', 'saco'], ['20', 'Brocha', 'unidad']],
  pedido: [['1042', '1'], ['1043', '1']],
  detalle: [['1042', '10', '2'], ['1042', '20', '3'], ['1043', '10', '5']],
};

// 64 · Apertura del bloque sobre fotografía.
{
  const s = base('', 'Bloque 4 · 10:10 a 10:40 · 30 minutos', { dark: true, active: [4, 5] });
  photo(s, 'planilla.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 14);
  headed(s);
  inShape(s, '4', SH.ellipse, M, 1.3, 1.2, 1.2, C.slate, { fontSize: 54 });
  text(s, 'Proponer tablas y\ncomprobar el diseño', M, 2.75, 6.6, 1.8, { fontSize: 42, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Cómo se guardan los datos y cómo se prueba que vuelven completos.', M, 4.6, 5.9, 0.9, { fontSize: 19, color: C.softBlue });
  [4, 5].forEach((i, k) => {
    const y = 1.4 + k * 2.2, st = ST[i], ring = st.color === C.navy ? C.white : st.color;
    round(s, 7.45, y, 5.16, 1.95, C.navy, ring, { line: { color: ring, width: 2 } });
    disc(s, st.icon, 7.7, y + 0.25, 0.72, st.color === C.navy ? C.white : st.color, st.color === C.navy ? C.navy : st.fg);
    text(s, `${i + 1} · ${st.name}`, 8.6, y + 0.25, 3.8, 0.72, { fontSize: 21, bold: true, color: C.white, valign: 'mid' });
    text(s, QUESTIONS[i], 7.7, y + 1.07, 4.7, 0.8, { fontSize: 14.5, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 65 · Tabla, fila y columna.
{
  const s = headed(base('Una tabla: filas y columnas', 'Bloque 4 · Estación 5', { active: [4] }));
  text(s, [
    { text: 'Modelo relacional: ', options: { bold: true, color: C.red } },
    { text: 'los datos se organizan en tablas que se conectan mediante claves.', options: { color: C.navy } },
  ], M, 1.66, CW, 0.45, { fontSize: 19 });
  const tx = M + 0.4, ty = 2.75, tw = 6.6;
  const h = dbTable(s, tx, ty, tw, 'producto', 'producto', COLS.producto.map(([n, f]) => [n, f, null]), ROWS.producto, { rh: 0.55, hh: 0.6, fs: 17, hi: [0] });
  // Marca de columna.
  colFrame(s, tx + 0.36 * tw + 0.02, ty + 0.6, 0.3 * tw - 0.04, h - 0.62, C.titleFill);
  seg(s, tx + 0.51 * tw, ty + 0.62, tx + 0.51 * tw, 2.35, C.titleFill, 1.6);
  label(s, 'Columna: un dato de la estructura', tx + 0.51 * tw - 2.0, 2.12, 4.0, C.titleFill, 12, 'center');
  // Marca de fila.
  seg(s, tx + tw, ty + 0.6 + 0.55 + 0.275, tx + tw + 0.45, ty + 0.6 + 0.55 + 0.275, C.red, 1.6);
  const lx = tx + tw + 0.55;
  label(s, 'Fila', lx, ty + 1.0, 4, C.red, 12);
  text(s, 'Un registro: los datos de un producto', lx, ty + 1.3, M + CW - lx, 0.6, { fontSize: 16, bold: true, color: C.navy });
  label(s, 'Tabla', lx, ty + 2.2, 4, C.navy, 12);
  text(s, 'Reúne registros con la misma estructura', lx, ty + 2.5, M + CW - lx, 0.6, { fontSize: 16, bold: true, color: C.navy });
  finish(s, 'La entidad Producto del Bloque 3 se traduce en una tabla con identificador, nombre y unidad.');
}

// 66 · Clave primaria.
{
  const s = headed(base('Clave primaria: identifica cada fila', 'Bloque 4 · Estación 5', { active: [4] }));
  const tx = M, ty = 1.85, tw = 5.6;
  const h = dbTable(s, tx, ty, tw, 'cliente', 'cliente', COLS.cliente, [['1', 'Ana Soto'], ['2', 'Ana Soto']], { rh: 0.6, hh: 0.62, fs: 18 });
  colFrame(s, tx + 0.02, ty + 0.62, 0.42 * tw - 0.04, h - 0.64, C.gold);
  text(s, 'Si hubiera dos clientes llamados Ana Soto, la clave primaria los distinguiría.', tx, ty + h + 0.2, tw, 0.65, { fontSize: 15.5, color: C.ink });
  const x = M + 6.2, w = M + CW - x;
  disc(s, 'key-round', x, 1.85, 0.9, C.gold, C.navy);
  text(s, 'id_cliente identifica a cada cliente', x + 1.1, 1.85, w - 1.1, 0.9, { fontSize: 20, bold: true, color: C.navy, valign: 'mid' });
  [['circle-x', C.red, 'Su valor no se repite dentro de la tabla'], ['circle-check', C.success, 'Debe estar presente en cada fila']].forEach(([ic, color, t], i) => {
    const y = 3.1 + i * 0.85;
    disc(s, ic, x, y, 0.6, color);
    text(s, t, x + 0.85, y, w - 0.85, 0.6, { fontSize: 17.5, color: C.navy, valign: 'mid' });
  });
  round(s, x, 4.95, w, 1.05, C.mist);
  text(s, [
    { text: 'id', options: { bold: true, fontFace: F.mono, color: C.red } }, { text: ' significa identificador. El guion bajo de ', options: {} },
    { text: 'id_cliente', options: { bold: true, fontFace: F.mono, color: C.red } }, { text: ' separa palabras en el nombre.', options: {} },
  ], x + 0.25, 4.95, w - 0.5, 1.05, { fontSize: 15.5, color: C.navy, valign: 'mid' });
  finish(s, 'En el ejemplo, numero_pedido cumple el mismo papel en la tabla pedido.');
}

// 67 · Clave foránea.
{
  const s = headed(base('Clave foránea: apunta a otra tabla', 'Bloque 4 · Estación 5', { active: [4] }));
  const py = 2.0, pw = 4.4, cw = 4.0, cx = M + CW - cw;
  dbTable(s, M, py, pw, 'pedido', 'pedido', COLS.pedido, ROWS.pedido, { rh: 0.52, hh: 0.6, fs: 18, hi: [0] });
  dbTable(s, cx, py, cw, 'cliente', 'cliente', COLS.cliente, ROWS.cliente, { rh: 0.52, hh: 0.6, fs: 18, hi: [0] });
  const ay = py + 0.6 + 0.52 + 0.26;
  seg(s, M + pw, ay, cx, ay, C.red, 2.6, true);
  inShape(s, 'apunta a', SH.roundRect, (M + pw + cx) / 2 - 0.7, ay - 0.62, 1.4, 0.4, C.paper, { color: C.red, fontSize: 14, rectRadius: 0.06 });
  const y2 = 4.38;
  round(s, M, y2, CW, 0.9, C.white, C.border);
  icon(s, 'link-2', M + 0.25, y2 + 0.25, 0.4, C.red, 2.2);
  text(s, [
    { text: 'pedido.id_cliente', options: { bold: true, fontFace: F.mono, color: C.red } },
    { text: '  se lee «la columna id_cliente de la tabla pedido». Guarda a qué cliente corresponde el pedido.', options: {} },
  ], M + 0.85, y2, CW - 1.1, 0.9, { fontSize: 17, color: C.navy, valign: 'mid' });
  disc(s, 'shield-check', M, 5.45, 0.6, C.success);
  text(s, 'La referencia debe apuntar a un cliente que exista.', M + 0.85, 5.45, CW - 0.9, 0.6, { fontSize: 17.5, bold: true, color: C.navy, valign: 'mid' });
  finish(s, 'El punto separa la tabla de la columna: tabla.columna.');
}

// 68 · El esquema propuesto.
{
  const s = headed(base('Cuatro tablas conectadas por claves', 'Bloque 4 · Estación 5', { active: [4] }));
  const bw = 2.6, gap = (CW - 4 * bw) / 3, y = 1.8;
  const xs = [0, 1, 2, 3].map(i => M + i * (bw + gap));
  const cl = schemaBox(s, xs[0], y, bw, 'cliente', 'cliente', [['id_cliente', 'PK', 'entero'], ['nombre', null, 'texto']]);
  const pe = schemaBox(s, xs[1], y, bw, 'pedido', 'pedido', [['numero_pedido', 'PK', 'entero'], ['id_cliente', 'FK', 'entero']]);
  const de = schemaBox(s, xs[2], y, bw, 'linea', 'detalle_pedido', [['numero_pedido', 'PKFK', 'entero'], ['id_producto', 'PKFK', 'entero'], ['cantidad', null, 'número > 0']]);
  const pr = schemaBox(s, xs[3], y, bw, 'producto', 'producto', [['id_producto', 'PK', 'entero'], ['nombre', null, 'texto'], ['unidad_venta', null, 'texto']]);
  const link = (x1, y1, x2, y2) => {
    seg(s, x1, y1, x2, y2, C.slate, 2);
    text(s, '1', x1 + 0.04, y1 - 0.34, 0.3, 0.3, { fontSize: 14, bold: true, color: C.red });
    text(s, 'N', x2 - 0.3, y2 + 0.04, 0.3, 0.3, { fontSize: 14, bold: true, color: C.red, align: 'right' });
  };
  link(xs[0] + bw, cl.ys[0], xs[1], pe.ys[1]);
  link(xs[1] + bw, pe.ys[0], xs[2], de.ys[0]);
  // Producto está a la derecha del detalle: su «1» queda junto a producto.
  seg(s, xs[2] + bw, de.ys[1], xs[3], pr.ys[0], C.slate, 2);
  text(s, 'N', xs[2] + bw + 0.04, de.ys[1] + 0.04, 0.3, 0.3, { fontSize: 14, bold: true, color: C.red });
  text(s, '1', xs[3] - 0.3, pr.ys[0] - 0.34, 0.3, 0.3, { fontSize: 14, bold: true, color: C.red, align: 'right' });
  const ly = 4.2;
  round(s, M, ly, CW, 1.85, C.white, C.border);
  [['key-round', C.gold, 'Clave primaria', 'Identifica cada fila'], ['link-2', C.red, 'Clave foránea', 'Apunta a una fila de otra tabla'], ['git-branch', C.slate, '1 — N', 'Uno a muchos']].forEach(([ic, color, k, v], i) => {
    const x = M + 0.3 + i * 3.8;
    icon(s, ic, x, ly + 0.3, 0.42, color, 2.4);
    text(s, k, x + 0.6, ly + 0.22, 3.0, 0.4, { fontSize: 17, bold: true, color: C.navy });
    text(s, v, x + 0.6, ly + 0.62, 3.0, 0.4, { fontSize: 15 });
  });
  text(s, 'Las columnas con las dos marcas son a la vez parte de la clave y referencia a otra tabla.', M + 0.3, ly + 1.05, CW - 0.6, 0.36, { fontSize: 14.5, color: C.ink });
  text(s, 'Tipos: identificadores como números enteros; nombres y unidades como texto; cantidad como número mayor que cero.', M + 0.3, ly + 1.4, CW - 0.6, 0.36, { fontSize: 14.5, color: C.ink });
  finish(s, 'detalle_pedido conecta pedidos y productos, y guarda la cantidad de cada vínculo.');
}

// 69 · Clave compuesta.
{
  const s = headed(base('Clave compuesta: dos columnas juntas', 'Bloque 4 · Estación 5', { active: [4] }));
  const y = 1.95;
  inShape(s, 'numero_pedido', SH.roundRect, M, y, 3.2, 0.9, ENT.pedido.color, { fontSize: 20, fontFace: F.mono, rectRadius: 0.08 });
  text(s, '+', M + 3.2, y, 0.7, 0.9, { fontSize: 40, bold: true, color: C.red, align: 'center', valign: 'mid' });
  inShape(s, 'id_producto', SH.roundRect, M + 3.9, y, 3.0, 0.9, ENT.producto.color, { color: C.navy, fontSize: 20, fontFace: F.mono, rectRadius: 0.08 });
  text(s, '=', M + 6.9, y, 0.7, 0.9, { fontSize: 40, bold: true, color: C.red, align: 'center', valign: 'mid' });
  inShape(s, 'una línea', SH.roundRect, M + 7.6, y, CW - 7.6, 0.9, ENT.linea.color, { fontSize: 22, rectRadius: 0.08 });
  const ry = 3.25;
  [['1042', '10', 'Cemento del primer pedido'], ['1043', '10', 'Cemento del segundo pedido: otra fila']].forEach(([a, b, t], i) => {
    const yy = ry + i * 0.75;
    inShape(s, `${a}, ${b}`, SH.roundRect, M, yy, 2.0, 0.58, C.mist, { color: C.navy, fontSize: 18, fontFace: F.mono, rectRadius: 0.06 });
    text(s, t, M + 2.25, yy, 5, 0.58, { fontSize: 17, color: C.navy, valign: 'mid' });
  });
  const x = M + 7.6, w = CW - 7.6;
  s.addText('REGLA DIDÁCTICA', { shape: SH.roundRect, x: x + 0.25, y: ry - 0.05, w: w - 0.5, h: 0.6, rectRadius: 0.08, rotate: -4,
    fill: { color: C.white }, line: { color: ORIGIN.proposal, width: 3 }, fontFace: F.display, fontSize: 17, bold: true, color: ORIGIN.proposal, align: 'center', valign: 'mid', charSpacing: 2, margin: 0 });
  text(s, 'Un producto aparece una sola vez por pedido. Si se pide más, se cambia su cantidad.', x, ry + 0.75, w, 1.2, { fontSize: 16.5, bold: true, color: C.navy });
  text(s, 'Cada equipo revisa esta regla antes de adoptarla en su caso.', M, 5.45, CW, 0.45, { fontSize: 16, color: C.ink });
  finish(s, 'Compartir id_producto no convierte dos líneas en la misma fila.');
}

// 70 · Los datos de ejemplo guardados en las cuatro tablas.
{
  const s = headed(base('Los dos pedidos guardados en tablas', 'Bloque 4 · Estación 5', { active: [4] }));
  dbTable(s, M, 1.72, 3.1, 'cliente', 'cliente', COLS.cliente, ROWS.cliente);
  dbTable(s, M + 3.35, 1.72, 3.4, 'pedido', 'pedido', COLS.pedido, ROWS.pedido);
  dbTable(s, M + 7.0, 1.72, CW - 7.0, 'producto', 'producto', COLS.producto, ROWS.producto);
  dbTable(s, M, 3.9, 5.3, 'linea', 'detalle_pedido', COLS.detalle, ROWS.detalle);
  const x = M + 5.7, w = CW - 5.7;
  round(s, x, 3.9, w, 2.1, C.warningSoft);
  label(s, 'Identificadores del ejemplo', x + 0.3, 4.05, w - 0.6, C.navy, 12);
  [['1', 'Ana Soto'], ['10', 'Cemento'], ['20', 'Brocha']].forEach(([n, t], i) => {
    inShape(s, n, SH.roundRect, x + 0.3 + i * 1.95, 4.5, 0.6, 0.5, C.navy, { fontSize: 17, rectRadius: 0.06 });
    text(s, t, x + 1.0 + i * 1.95, 4.5, 1.2, 0.5, { fontSize: 16, bold: true, color: C.navy, valign: 'mid' });
  });
  text(s, 'Son identificadores: no son cantidades, precios ni posiciones en una lista.', x + 0.3, 5.2, w - 0.6, 0.65, { fontSize: 15, color: C.navy });
  finish(s, 'Ana Soto se registra una vez y sus dos pedidos apuntan a ese registro.');
}

// 71 · Un producto, varias cantidades.
{
  const s = headed(base('Cemento una vez, sus cantidades aparte', 'Bloque 4 · Estación 5', { active: [4] }));
  const ty = 1.95, rh = 0.55;
  const dw = 5.6, pw = 4.6, px = M + CW - pw;
  dbTable(s, M, ty, dw, 'linea', 'detalle_pedido', COLS.detalle, ROWS.detalle, { rh, hh: 0.6, fs: 16, hi: [0, 2] });
  dbTable(s, px, ty, pw, 'producto', 'producto', COLS.producto, ROWS.producto, { rh, hh: 0.6, fs: 16, hi: [0] });
  const rowY = i => ty + 0.6 + rh + i * rh + rh / 2;
  seg(s, M + dw, rowY(0), px, rowY(0), C.gold, 2.4, true);
  seg(s, M + dw, rowY(2), px, rowY(0) + 0.1, C.gold, 2.4, true);
  const y = 4.98;
  [['list', ENT.linea.color, '1042, 10 y 1043, 10 son dos líneas distintas: 2 sacos en un pedido y 5 en el otro'],
   ['ticket', ENT.pedido.color, 'El 1042 aparece dos veces en el detalle porque contiene dos productos distintos']].forEach(([ic, color, t], i) => {
    disc(s, ic, M, y + i * 0.62, 0.52, color);
    text(s, t, M + 0.8, y + i * 0.62, CW - 0.8, 0.52, { fontSize: 17, color: C.navy, valign: 'mid' });
  });
  finish(s, 'Producto describe el artículo; cada fila de detalle, su cantidad en un pedido.');
}

// 72 · Por qué no columnas producto_1, producto_2…
{
  const s = headed(base('Filas de detalle, no columnas de más', 'Bloque 4 · Estación 5', { active: [4] }));
  const w = 5.6, y = 1.8, x2 = M + CW - w;
  round(s, M, y, w, 4.2, C.paleRed, C.red, { line: { color: C.red, width: 1.6, dashType: 'dash' } });
  disc(s, 'circle-x', M + 0.3, y + 0.25, 0.65, C.red);
  text(s, 'Reservar columnas en pedido', M + 1.15, y + 0.25, w - 1.3, 0.65, { fontSize: 19, bold: true, color: C.navy, valign: 'mid' });
  const cols = ['numero_pedido', 'producto_1', 'producto_2', 'producto_3'];
  const cw = (w - 0.6) / 4;
  cols.forEach((c, j) => {
    inShape(s, c, SH.rect, M + 0.3 + j * cw, y + 1.25, cw, 0.5, C.mist, { color: C.navy, fontSize: 10.5, fontFace: F.mono, line: { color: C.border, width: 0.75 } });
    inShape(s, ['1042', 'Cemento', 'Brocha', '—'][j], SH.rect, M + 0.3 + j * cw, y + 1.75, cw, 0.5, C.white, { color: C.navy, fontSize: 13, fontFace: F.body, bold: false, line: { color: C.border, width: 0.75 } });
  });
  ['¿Y si se piden cuatro productos?', '¿Dónde queda la cantidad de cada uno?'].forEach((t, i) => text(s, t, M + 0.3, y + 2.55 + i * 0.55, w - 0.6, 0.5, { fontSize: 17, bold: true, color: C.red }));
  round(s, x2, y, w, 4.2, C.successSoft, C.success, { line: { color: C.success, width: 1.6 } });
  disc(s, 'circle-check', x2 + 0.3, y + 0.25, 0.65, C.success);
  text(s, 'Una fila de detalle por producto', x2 + 1.15, y + 0.25, w - 1.3, 0.65, { fontSize: 19, bold: true, color: C.navy, valign: 'mid' });
  dbTable(s, x2 + 0.3, y + 1.15, w - 0.6, 'linea', 'detalle_pedido', COLS.detalle, ROWS.detalle.slice(0, 2), { fs: 13 });
  inShape(s, '+ otra fila si el pedido crece', SH.roundRect, x2 + 0.3, y + 2.95, w - 0.6, 0.5, C.white, { color: C.success, fontSize: 15, rectRadius: 0.06, line: { color: C.success, width: 1.4, dashType: 'dash' } });
  finish(s, 'Un pedido puede tener más o menos líneas sin cambiar la estructura de la tabla.');
}

// 73 · Recuperar el pedido 1042 recorriendo referencias.
{
  const s = headed(base('Recuperar el 1042: seguir las referencias', 'Bloque 4 · Estación 6', { active: [5] }));
  const o = { rh: 0.38, hh: 0.45, fs: 12.5 };
  const lw = 3.95, tw = 3.4, lx = M, rx = M + 4.3, ty = 2.3, by = 4.5;
  const detCols = [['numero_pedido', 0.42, 'PKFK'], ['id_producto', 0.37, 'PKFK'], ['cantidad', 0.21, null]];
  const prCols = [['id_producto', 0.4, 'PK'], ['nombre', 0.3, null], ['unidad_venta', 0.3, null]];
  dbTable(s, lx, ty, lw, 'pedido', 'pedido', COLS.pedido, ROWS.pedido, { ...o, hi: [0] });
  dbTable(s, rx, ty, tw, 'cliente', 'cliente', COLS.cliente, ROWS.cliente, { ...o, hi: [0] });
  dbTable(s, lx, by, lw, 'linea', 'detalle_pedido', detCols, ROWS.detalle, { ...o, fs: 12, hi: [0, 1] });
  dbTable(s, rx, by, tw, 'producto', 'producto', prCols, ROWS.producto, { ...o, fs: 12, hi: [0, 1] });
  const b = (n, x, y) => inShape(s, String(n), SH.ellipse, x, y, 0.5, 0.5, C.red, { fontSize: 17 });
  b(1, lx, ty - 0.56); b(2, rx, ty - 0.56); b(3, lx + 1.25, by - 0.56); b(4, rx, by - 0.56);
  const tw0 = lw;
  seg(s, lx + tw0, ty + 0.45 + 0.38 + 0.19, rx, ty + 0.45 + 0.38 + 0.19, C.red, 2, true);
  seg(s, lx + 1.0, ty + 1.6, lx + 1.0, by - 0.05, C.red, 2, true);
  seg(s, lx + tw0, by + 0.45 + 0.38 + 0.38, rx, by + 0.45 + 0.38 + 0.38, C.red, 2, true);
  const x = M + 7.75, w = M + CW - x;
  const steps = ['Encuentra el pedido 1042', 'Lee su id_cliente, que vale 1, y encuentra a Ana Soto', 'Encuentra los detalles del 1042: productos 10 y 20, cantidades 2 y 3', 'Busca nombre y unidad de esos productos y los muestra junto a cada cantidad'];
  steps.forEach((t, i) => {
    const y = 1.85 + i * 1.02;
    inShape(s, String(i + 1), SH.ellipse, x, y, 0.5, 0.5, C.red, { fontSize: 17 });
    text(s, t, x + 0.65, y - 0.05, w - 0.65, 0.95, { fontSize: 16, color: C.navy });
  });
  text(s, 'Cada flecha sigue una clave: así se reconstruye el pedido completo.', x, 6.05, w, 0.6, { fontSize: 14.5, bold: true, color: C.red });
  finish(s, '');
}

// 74 · El resultado que ve la persona.
{
  const s = headed(base('El resultado que debe aparecer', 'Bloque 4 · Estación 6', { active: [5] }));
  const wx = M, wy = 1.75, ww = 7.4, wh = 4.25;
  rect(s, wx, wy, ww, wh, C.white, C.navy, { line: { color: C.navy, width: 2 } });
  text(s, 'Consultar pedido', wx + 0.3, wy + 0.2, 4, 0.4, { fontSize: 18, bold: true, color: C.navy });
  field(s, '1042', wx + 0.3, wy + 0.7, 4.2);
  inShape(s, 'Buscar', SH.rect, wx + 4.7, wy + 0.7, 1.5, 0.44, C.navy, { fontSize: 14, fontFace: F.body });
  const hdr = ['Número', 'Cliente', 'Producto', 'Cantidad', 'Unidad'], cx = [0, 1.15, 2.6, 4.1, 5.4], cwid = [1.1, 1.4, 1.45, 1.25, 1.4];
  hdr.forEach((h, j) => text(s, h, wx + 0.3 + cx[j], wy + 1.5, cwid[j], 0.4, { fontSize: 14.5, bold: true, color: C.ink }));
  hline(s, wx + 0.3, wy + 1.92, ww - 0.6);
  [['1042', 'Ana Soto', 'Cemento', '2', 'saco'], ['1042', 'Ana Soto', 'Brocha', '3', 'unidad']].forEach((r, i) => {
    r.forEach((v, j) => text(s, v, wx + 0.3 + cx[j], wy + 2.05 + i * 0.55, cwid[j], 0.5, { fontSize: 17, color: C.navy, bold: j === 3, valign: 'mid' }));
  });
  ['cliente', 'linea', 'producto'].forEach((k, i) => {
    const e = ENT[k];
    inShape(s, ['de cliente', 'de detalle_pedido', 'de producto'][i], SH.roundRect, wx + 0.3 + i * 2.3, wy + 3.4, 2.15, 0.46, e.color, { color: e.fg, fontSize: 13, rectRadius: 0.06 });
  });
  const x = M + 7.8, w = M + CW - x;
  disc(s, 'circle-check', x, 1.8, 0.85, C.success);
  text(s, 'Coincide con la historia', x + 1.05, 1.8, w - 1.05, 0.85, { fontSize: 20, bold: true, color: C.navy, valign: 'mid' });
  text(s, 'El criterio de aceptación pedía recuperar el cliente, los productos y las cantidades guardadas.', x, 2.85, w, 1.4, { fontSize: 17, color: C.navy });
  text(s, 'Cada columna del resultado viene de una tabla distinta.', x, 4.35, w, 1.0, { fontSize: 16, bold: true, color: C.ink });
  finish(s, 'La consulta combina las tablas mediante sus claves para armar lo que muestra la pantalla.');
}

// 75 · Palabras de una consulta SQL.
{
  const s = headed(base('Leer una consulta SQL', 'Bloque 4 · Estación 6', { active: [5] }));
  text(s, [
    { text: 'SQL: ', options: { bold: true, color: C.red } },
    { text: 'un lenguaje para definir y consultar datos en bases de datos relacionales.', options: { color: C.navy } },
  ], M, 1.66, CW, 0.45, { fontSize: 19 });
  const words = [
    ['SELECT', 'Qué columnas se muestran'], ['FROM', 'Desde qué tabla se consulta'], ['JOIN', 'Combina otra tabla'],
    ['ON', 'Qué columnas deben coincidir'], ['=', 'Igualdad entre dos valores'], ['AS', 'Pone nombre a una columna del resultado'],
    ['WHERE', 'Limita el resultado'], ['ORDER BY', 'Ordena las filas'], [';', 'Termina la instrucción'],
  ];
  const w = (CW - 0.4) / 3, h = 1.18;
  words.forEach(([k, v], i) => {
    const x = M + (i % 3) * (w + 0.2), y = 2.3 + Math.floor(i / 3) * (h + 0.12);
    rect(s, x, y, w, h, C.white, C.border);
    inShape(s, k, SH.roundRect, x + 0.2, y + 0.22, 1.6, 0.74, C.editorBg, { color: C.gold, fontSize: 19, fontFace: F.mono, rectRadius: 0.06 });
    text(s, v, x + 1.95, y, w - 2.1, h, { fontSize: 16, color: C.navy, valign: 'mid', bold: true });
  });
  finish(s, '');
}

// 76 · La consulta completa.
{
  const s = headed(base('La consulta que recupera el 1042', 'Bloque 4 · Estación 6', { active: [5] }));
  const code = [
    'SELECT',
    '    pedido.numero_pedido,',
    '    cliente.nombre AS cliente,',
    '    producto.nombre AS producto,',
    '    detalle_pedido.cantidad,',
    '    producto.unidad_venta',
    'FROM pedido',
    'JOIN cliente ON cliente.id_cliente = pedido.id_cliente',
    'JOIN detalle_pedido ON detalle_pedido.numero_pedido = pedido.numero_pedido',
    'JOIN producto ON producto.id_producto = detalle_pedido.id_producto',
    'WHERE pedido.numero_pedido = 1042',
    'ORDER BY producto.id_producto;',
  ].join('\n');
  const fs = 11, ph = 0.86 + 12 * (fs / 72 * 1.26) + 0.2;
  components.addCodePanel(s, SH, { x: M, y: 1.75, w: 7.75, h: ph, title: 'SQL · consulta del pedido', code, lang: 'sql', fontSize: fs });
  const x = M + 8.05, w = M + CW - x;
  const notes = [['1–6', 'Qué columnas mostrar'], ['7', 'Se parte desde pedido'], ['8–10', 'Se unen cliente, detalle y producto por sus claves'], ['11', 'Solo el pedido 1042'], ['12', 'Ordena por producto']];
  notes.forEach(([n, t], i) => {
    const y = 1.8 + i * 0.78;
    inShape(s, n, SH.roundRect, x, y, 0.85, 0.5, C.editorBg, { color: C.gold, fontSize: 14, fontFace: F.mono, rectRadius: 0.06 });
    text(s, t, x + 1.0, y - 0.08, w - 1.0, 0.68, { fontSize: 15.5, color: C.navy, valign: 'mid' });
  });
  text(s, 'Los números de la izquierda indican la línea del código.', M, 1.75 + ph + 0.15, 7.75, 0.4, { fontSize: 14, color: C.ink });
  finish(s, 'La consulta corresponde a la estructura y los datos de este ejemplo.');
}

// 77 · El 1042 llega como parámetro.
{
  const s = headed(base('El número llega como parámetro', 'Bloque 4 · Estación 6', { active: [5] }));
  text(s, [
    { text: 'Parámetro: ', options: { bold: true, color: C.red } },
    { text: 'un valor que se entrega a la consulta por separado de su texto.', options: { color: C.navy } },
  ], M, 1.66, CW, 0.45, { fontSize: 19 });
  field(s, '1042', M, 2.6, 2.6, 0.6, { size: 20 });
  text(s, 'Lo escribe la persona', M, 3.25, 2.6, 0.35, { fontSize: 14, color: C.ink });
  const w = 7.9, x = M + CW - w;
  seg(s, M + 2.65, 2.9, x - 0.1, 2.9, C.success, 2.4, true);
  round(s, x, 2.3, w, 1.4, C.successSoft, C.success, { line: { color: C.success, width: 1.6 } });
  disc(s, 'shield-check', x + 0.25, 2.55, 0.85, C.success);
  text(s, 'Se entrega como parámetro, con el mecanismo de acceso a datos de la tecnología elegida', x + 1.3, 2.3, w - 1.5, 1.4, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  seg(s, M + 1.3, 3.65, M + 1.3, 4.95, C.red, 2.4);
  seg(s, M + 1.3, 4.95, x - 0.1, 4.95, C.red, 2.4, true);
  round(s, x, 4.25, w, 1.4, C.paleRed, C.red, { line: { color: C.red, width: 1.6, dashType: 'dash' } });
  disc(s, 'ban', x + 0.25, 4.5, 0.85, C.red);
  text(s, 'No se arma la instrucción pegando directamente el texto escrito por la persona', x + 1.3, 4.25, w - 1.5, 1.4, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  finish(s, 'En la consulta de ejemplo, el 1042 está escrito; en una aplicación llega desde la pantalla.');
}

// 78 · Lo que deben impedir las claves y la operación.
{
  const s = headed(base('Lo que el sistema debe impedir', 'Bloque 4 · Estación 6', { active: [5] }));
  const rows = [
    ['Dos pedidos con el mismo número', 'key-round', C.gold, 'Clave primaria'],
    ['Un pedido con un cliente que no existe', 'link-2', C.red, 'Clave foránea'],
    ['La misma línea pedido y producto dos veces', 'puzzle', ENT.linea.color, 'Clave compuesta'],
    ['Una cantidad cero, negativa o no numérica', 'shield-check', C.titleFill, 'La operación y la restricción de cantidad positiva'],
    ['Un pedido sin productos o con una línea que falló', 'cpu', C.navy, 'La operación: evita un pedido incompleto'],
  ];
  label(s, 'Intento', M + 0.75, 1.68, 5, C.slate, 11);
  label(s, 'Qué lo impide', M + 7.25, 1.68, 4, C.slate, 11);
  rows.forEach(([a, ic, color, b], i) => {
    const y = 2.0 + i * 0.8;
    if (i % 2 === 0) rect(s, M, y, CW, 0.72, C.white);
    disc(s, 'ban', M + 0.12, y + 0.11, 0.5, C.paleRed, C.red);
    text(s, a, M + 0.75, y, 5.7, 0.72, { fontSize: 17, color: C.navy, valign: 'mid' });
    disc(s, ic, M + 6.6, y + 0.08, 0.56, color, color === C.gold ? C.navy : C.white);
    text(s, b, M + 7.25, y, CW - 7.35, 0.72, { fontSize: 16.5, bold: true, color: C.navy, valign: 'mid' });
  });
  finish(s, 'Las claves foráneas revisan referencias, pero no aseguran que un pedido tenga al menos una línea.');
}

// 79 · Transacción: todo o nada.
{
  const s = headed(base('Transacción: todo o nada', 'Bloque 4 · Estación 6', { active: [5] }));
  text(s, 'Una transacción agrupa los cambios: se confirman todos o se deshacen todos si alguno falla.', M, 1.66, CW, 0.45, { fontSize: 19 });
  const w = 5.6, y = 2.35, h = 3.65, x2 = M + CW - w;
  const scen = [
    [M, false, 'Todo se guarda', 'Se confirma el pedido completo', C.success, 'circle-check'],
    [x2, true, 'Falla una línea', 'Se deshace todo: no hay confirmación', C.red, 'rotate-ccw'],
  ];
  scen.forEach(([x, fail, title, res, color, ic]) => {
    s.addShape(SH.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.slate, width: 1.4, dashType: 'dash' } });
    label(s, 'Transacción', x + 0.3, y + 0.15, 3, C.slate, 11);
    text(s, title, x + 0.3, y + 0.42, w - 0.6, 0.45, { fontSize: 20, bold: true, color: C.navy });
    [['pedido 1042', 'pedido', false], ['línea: Cemento · 2', 'linea', false], ['línea: Brocha · 3', 'linea', fail]].forEach(([t, k, bad], i) => {
      const yy = y + 1.0 + i * 0.6, e = ENT[k];
      inShape(s, t, SH.roundRect, x + 0.3, yy, 3.3, 0.48, bad ? C.paleRed : e.color, { color: bad ? C.red : e.fg, fontSize: 14.5, rectRadius: 0.06, line: bad ? { color: C.red, width: 2 } : { color: e.color, transparency: 100 } });
      if (bad) icon(s, 'x', x + 3.7, yy + 0.06, 0.36, C.red, 3);
      else icon(s, 'check', x + 3.7, yy + 0.06, 0.36, C.success, 3);
    });
    disc(s, ic, x + 0.3, y + h - 0.8, 0.62, color);
    text(s, res, x + 1.1, y + h - 0.8, w - 1.3, 0.62, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  });
  finish(s, 'La confirmación de éxito solo corresponde cuando el conjunto completo quedó guardado.');
}

// 80 · La prueba: recuperar los dos pedidos.
{
  const s = headed(base('La prueba: recuperar los dos pedidos', 'Bloque 4 · Estación 6', { active: [5] }));
  const w = 5.6, y = 1.8, x2 = M + CW - w;
  ticket(s, M, y, w, '1042', [['Cemento', '2', 'saco'], ['Brocha', '3', 'unidad']]);
  ticket(s, x2, y, w, '1043', [['Cemento', '5', 'saco']]);
  disc(s, 'circle-check', M, 4.15, 0.62, C.success);
  text(s, 'Las cantidades del 1042 siguen sin cambios', M + 0.8, 4.15, w - 0.8, 0.62, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  disc(s, 'circle-check', x2, 4.15, 0.62, C.success);
  text(s, 'El 1043 muestra a Ana Soto con 5 sacos', x2 + 0.8, 4.15, w - 0.8, 0.62, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
  round(s, M, 5.05, CW, 0.95, C.mist);
  disc(s, ST[5].icon, M + 0.2, 5.17, 0.7, ST[5].color);
  text(s, 'Estación 6: con datos concretos se comprueba que el diseño guarda y recupera lo que exige la historia.', M + 1.1, 5.05, CW - 1.3, 0.95, { fontSize: 17, color: C.navy, valign: 'mid' });
  finish(s, 'Reutilizar un producto no reemplaza las cantidades de otro pedido.');
}

// 81 · Trabajo en equipo del bloque.
{
  const s = base('', 'Bloque 4 · Trabajo en equipo', { dark: true, active: [4, 5] });
  photo(s, 'equipo-mesa.jpg', 0, 0.16, W, H - 0.16);
  veil(s, 0, 0.16, W, H - 0.16, C.navy, 16);
  headed(s);
  text(s, 'Ahora en tu proyecto', M, 1.0, 6.2, 0.75, { fontSize: 36, bold: true, color: C.white, fontFace: F.display });
  inShape(s, '12 min', SH.roundRect, M, 1.95, 2.0, 0.7, C.red, { fontSize: 24, rectRadius: 0.08 });
  text(s, 'Traduce tu modelo a tablas y pruébalo con tus dos casos ficticios.', M, 2.9, 6.8, 0.9, { fontSize: 21, bold: true, color: C.white });
  [['file-text', 'Evidencia', 'Tablas con claves, filas de ejemplo y el resultado que debe recuperarse'],
   ['book-open', 'Instrucciones', 'Guía de la clase, sección 4.4'],
   ['shield-alert', 'Comprueba también', 'Un dato inválido y qué cambios deben guardarse juntos']].forEach(([ic, k, v], i) => {
    const y = 3.95 + i * 0.82;
    disc(s, ic, M, y, 0.62, C.gold, C.navy);
    label(s, k, M + 0.8, y - 0.02, 5, C.gold, 11.5);
    text(s, v, M + 0.8, y + 0.26, 7.8, 0.4, { fontSize: 17, color: C.white });
  });
  finish(s, '', { notes: ['Foto ilustrativa.'] });
}

// 82 y 83 · Preguntas y respuestas del bloque.
const B4 = [
  ['key-round', 'Claves y referencias', '¿Qué diferencia hay entre cliente.id_cliente y pedido.id_cliente, aunque ambos valgan 1 en el ejemplo?',
    'Identifica cuál distingue al cliente y cuál señala a quién corresponde el pedido.',
    'En cliente es la clave primaria; en pedido es una clave foránea que apunta a ese cliente.',
    'El mismo valor puede identificar una fila en una tabla y servir de referencia desde otra.'],
  ['list', 'Detalle y cantidades', '¿Por qué Cemento aparece una sola vez en producto, pero dos veces en detalle_pedido?',
    'Compara qué describe el producto y qué describe cada solicitud de ese producto.',
    'Producto describe el artículo que se reutiliza; cada fila de detalle registra su cantidad en un pedido concreto.',
    'La cantidad se conserva en la relación, sin sobrescribir operaciones distintas.'],
  ['shield-alert', 'Guardado completo', '¿Tener claves foráneas garantiza que un pedido se guardó con todos sus productos?',
    'Distingue comprobar que una referencia existe de confirmar la operación completa.',
    'No. También se exige al menos un producto y guardar el pedido con todos sus detalles como una operación completa.',
    'Tablas y lógica de guardado trabajan juntas para cumplir el criterio de aceptación.'],
];
{
  const s = headed(base('Preguntas de comprobación', 'Bloque 4 · Cierre', { active: [4, 5] }));
  qaRows(s, 'q', B4);
  finish(s, '');
}
{
  const s = headed(base('Lo que tenía que aparecer en tu respuesta', 'Bloque 4 · Cierre', { active: [4, 5], bg: C.white, titleSize: 28 }));
  qaRows(s, 'a', B4);
  finish(s, '');
}

// ---------------------------------------------------------------------------
// CIERRE

const ALL = [0, 1, 2, 3, 4, 5];
// 84 · La operación completa, estación por estación.
{
  const s = headed(base('Una operación completa, estación por estación', 'Cierre · 10:40 a 10:50', { active: ALL, titleSize: 29 }));
  const answers = [
    'Conservar y encontrar los pedidos',
    'Registrar con cliente, productos y cantidades; número único',
    'Como persona del mesón… y cuatro criterios',
    'Formulario, validación, guardado y número 1042',
    'Cliente, Producto, Pedido y detalle_pedido',
    'Consultar el 1042 y el 1043',
  ];
  const d = 1.05, slot = CW / 6, cy = 2.45;
  rect(s, M + slot / 2, cy - 0.06, slot * 5, 0.12, C.border);
  ST.forEach((st, i) => {
    const cx = M + slot * i + slot / 2;
    disc(s, st.icon, cx - d / 2, cy - d / 2, d, st.color, st.fg);
    text(s, st.name, cx - slot / 2 + 0.03, cy + d / 2 + 0.12, slot - 0.06, 0.6, { fontSize: 14.5, bold: true, color: C.navy, align: 'center' });
    round(s, cx - slot / 2 + 0.08, 3.95, slot - 0.16, 1.85, C.white, st.color, { line: { color: st.color, width: 1.8 } });
    text(s, answers[i], cx - slot / 2 + 0.18, 4.0, slot - 0.36, 1.75, { fontSize: 14.5, color: C.navy, align: 'center', valign: 'mid' });
  });
  finish(s, 'Cada estación responde su pregunta y entrega el punto de partida de la siguiente.');
}

// 85 · Qué debe poder explicar el equipo.
{
  const s = headed(base('Revisa el diseño de tu equipo', 'Cierre · Revisión', { active: ALL }));
  const rows = [
    [1, 'Alcance y requerimientos', 'Qué problema se atiende, quién usa la operación, qué incluye, qué queda fuera y de dónde salen sus reglas'],
    [2, 'Historia y criterios', 'Qué resultado útil se espera y cómo se reconoce el éxito o un dato por corregir'],
    [3, 'Recorrido y bocetos', 'Qué hace la persona, qué responde el sistema y qué pasa cuando no puede continuar'],
    [4, 'Modelo y tablas', 'Qué se guarda, a qué pertenece cada dato y cómo se relacionan los registros'],
    [5, 'Casos de comprobación', 'Qué datos se usan y qué debe recuperarse, con el segundo caso y un dato inválido'],
  ];
  rows.forEach(([si, k, v], i) => {
    const y = 1.72 + i * 0.86, st = ST[si];
    rect(s, M, y, CW, 0.78, C.white, C.border);
    rect(s, M, y, 0.12, 0.78, st.color);
    disc(s, st.icon, M + 0.3, y + 0.12, 0.54, st.color, st.fg);
    text(s, k, M + 1.05, y, 3.3, 0.78, { fontSize: 17, bold: true, color: C.navy, valign: 'mid' });
    text(s, v, M + 4.4, y, CW - 4.6, 0.78, { fontSize: 15.5, valign: 'mid' });
  });
  finish(s, 'Recorre un caso de tu proyecto con estos cinco materiales.');
}

// 86 · Si algo no calza, se vuelve atrás.
{
  const s = headed(base('Si algo no calza, se vuelve atrás', 'Cierre · Revisión', { active: ALL }));
  const cards = [
    ['El recorrido exige un dato que el modelo no guarda', 'Revisa el modelo', 4],
    ['Aparece una tabla o una pantalla sin relación con el alcance', 'Revisa qué necesidad la justifica', 0],
    ['Una regla sigue siendo provisional', 'Conserva el supuesto y anota qué cambiaría al confirmarse', 1],
  ];
  const w = 3.75, gap = (CW - 3 * w) / 2, y = 1.8, h = 3.6;
  cards.forEach(([sit, act, si], i) => {
    const x = M + i * (w + gap), st = ST[si];
    rect(s, x, y, w, h, C.white, C.border);
    label(s, 'Si…', x + 0.3, y + 0.25, 2, C.red, 12);
    text(s, sit, x + 0.3, y + 0.55, w - 0.6, 1.2, { fontSize: 17.5, bold: true, color: C.navy });
    disc(s, 'rotate-ccw', x + 0.3, y + 1.95, 0.7, C.titleFill);
    text(s, act, x + 1.2, y + 1.85, w - 1.45, 0.95, { fontSize: 16, bold: true, color: C.titleFill, valign: 'mid' });
    inShape(s, `Vuelve a: ${st.name}`, SH.roundRect, x + 0.3, y + h - 0.7, w - 0.6, 0.48, st.color, { color: st.fg, fontSize: 13.5, rectRadius: 0.06 });
  });
  round(s, M, 5.55, CW, 0.5, C.mist);
  text(s, 'Al terminar, registra qué parte del diseño ya se puede explicar y comprobar, y qué falta precisar.', M + 0.25, 5.55, CW - 0.5, 0.5, { fontSize: 15.5, bold: true, color: C.navy, valign: 'mid' });
  finish(s, '');
}

// 87 · Relación con la propuesta de proyecto.
{
  const s = headed(base('Lo del taller alimenta la propuesta', 'Cierre · Propuesta de proyecto', { active: ALL }));
  const rows = [
    ['Alcance, exclusiones y supuestos', 'Delimitación del desafío'],
    ['El sistema y la operación que se diseñan', 'Producto esperado'],
    ['Resultados que el software permite observar', 'Objetivos'],
  ];
  rows.forEach(([a, b], i) => {
    const y = 1.85 + i * 1.15;
    inShape(s, a, SH.roundRect, M, y, 5.4, 0.85, C.white, { color: C.navy, fontSize: 17, fontFace: F.body, rectRadius: 0.08, line: { color: C.border, width: 1.2 } });
    arrow(s, M + 5.55, y + 0.42, 1.0, C.red, 2.6);
    inShape(s, b, SH.roundRect, M + 6.75, y, CW - 6.75, 0.85, C.navy, { fontSize: 19, rectRadius: 0.08 });
  });
  round(s, M, 5.3, CW, 0.75, C.warningSoft);
  icon(s, 'file-pen', M + 0.25, 5.45, 0.45, C.navy);
  text(s, 'Conserva los bocetos, el modelo y las comprobaciones como evidencia del desarrollo del proyecto.', M + 0.9, 5.3, CW - 1.1, 0.75, { fontSize: 16, bold: true, color: C.navy, valign: 'mid' });
  finish(s, '');
}

// 88 · El mismo método en otros sistemas.
{
  const s = headed(base('El mismo método, otros sistemas', 'Cierre · Transferencia', { active: ALL }));
  text(s, 'La ferretería fue el ejemplo resuelto. Estas son operaciones posibles para recorrer con el mismo método:', M, 1.66, CW, 0.5, { fontSize: 18 });
  const cases = [
    ['calculator', 'Sistema de costos', 'Registrar los insumos utilizados en un servicio'],
    ['store', 'Órbita Digital', 'Crear una ficha de empresa'],
    ['truck', 'CRM Yo Compro Local', 'Registrar una entrega a un punto de venta'],
  ];
  const w = 3.75, gap = (CW - 3 * w) / 2, y = 2.35, h = 3.65;
  cases.forEach(([ic, name, op], i) => {
    const x = M + i * (w + gap);
    rect(s, x, y, w, h, C.white, C.border);
    rect(s, x, y, w, 1.0, C.navy);
    disc(s, ic, x + 0.25, y + 0.17, 0.66, C.white, C.navy);
    text(s, name, x + 1.1, y, w - 1.2, 1.0, { fontSize: 18, bold: true, color: C.white, valign: 'mid' });
    label(s, 'Operación posible', x + 0.3, y + 1.2, 3, C.red, 11);
    text(s, op, x + 0.3, y + 1.5, w - 0.6, 1.0, { fontSize: 19, bold: true, color: C.navy });
    ST.forEach((st, j) => disc(s, st.icon, x + 0.3 + j * 0.54, y + h - 0.75, 0.46, st.color, st.fg, 0.56, st.color === C.navy ? C.white : null));
  });
  finish(s, 'Cada equipo ajusta campos, reglas y datos a la información de su propio caso.');
}

// 89 · Cierre final.
{
  const s = base('', 'Cierre', { dark: true, active: ALL });
  headed(s);
  text(s, 'Una operación a la vez.', M, 1.4, CW, 1.0, { fontSize: 48, bold: true, color: C.white, fontFace: F.display });
  text(s, 'Seis estaciones, en orden, para levantar y desarrollar cualquier software.', M, 2.45, CW, 0.6, { fontSize: 22, color: C.softBlue });
  const d = 1.15, slot = CW / 6, cy = 4.2;
  rect(s, M + slot / 2, cy - 0.05, slot * 5, 0.1, C.titleFill);
  ST.forEach((st, i) => {
    const cx = M + slot * i + slot / 2;
    disc(s, st.icon, cx - d / 2, cy - d / 2, d, st.color, st.fg, 0.54, st.color === C.navy ? C.white : null);
    text(s, st.name, cx - slot / 2 + 0.03, cy + d / 2 + 0.15, slot - 0.06, 0.6, { fontSize: 15, bold: true, color: C.white, align: 'center' });
  });
  finish(s, '');
}

// PptxGenJS repite <a:pPr> entre los tramos de un párrafo con estilos mezclados, lo que
// deja el XML fuera de esquema. Se eliminan esas repeticiones antes de escribir el archivo.
const JSZip = require('../../../../../tools/slides-system/node_modules/jszip');
pptx.write({ outputType: 'nodebuffer' }).then(async (buf) => {
  const zip = await JSZip.loadAsync(buf);
  const files = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f));
  for (const f of files) {
    const xml = await zip.file(f).async('string');
    zip.file(f, xml.replace(/(<\/a:r>)<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, '$1'));
  }
  fs.writeFileSync(output, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log(`OK ${output}`);
});
