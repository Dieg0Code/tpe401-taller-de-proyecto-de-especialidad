const path = require('path');
const fs = require('fs');
const PptxGenJS = require('../../../../../tools/slides-system/node_modules/pptxgenjs');
const { theme, components, utils } = require('../../../../../tools/slides-system');
const { imageSizingContain, imageSizingCrop } = require('../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image');
const { TOKENS: C, TYPOGRAPHY: F, applyAiepTheme } = theme;

const pptx = new PptxGenJS();
applyAiepTheme(pptx, { author: 'Diego Obando', company: 'AIEP Osorno', subject: 'TPE401 · Lectura autónoma', title: 'Requerimientos, historias de usuario y estimación' });
const SH = pptx.ShapeType;
const W = 13.333, H = 7.5, M = 0.7, CW = W - 2 * M;
const output = path.resolve(__dirname, '../Clase-06-Requerimientos-Historias-y-Estimacion.pptx');
const assets = path.resolve(__dirname, 'assets');
const photos = {
  'herramientas.jpg': 'Barn Images · Unsplash · https://unsplash.com/photos/t5YUoHW6zRo · Licencia Unsplash',
  'ferreteria.jpg': 'Vijesh Vijayan · Pexels · https://www.pexels.com/photo/19756443/ · Licencia Pexels',
  'equipo.jpg': 'Vitaly Gariev · Unsplash · https://unsplash.com/photos/TSyD0nGc0Bs · Licencia Unsplash',
  'notas.jpg': 'Jakub Żerdzicki · Unsplash · https://unsplash.com/photos/fQOyF0D0cDU · Licencia Unsplash',
};
const S = {
  req: ['IREB · Glosario CPRE', 'https://cpre.ireb.org/en/downloads-and-resources/glossary'],
  story: ['Agile Alliance · Historias de usuario', 'https://agilealliance.org/glossary/user-stories/'],
  three: ['Agile Alliance · Tarjeta, conversación y confirmación', 'https://agilealliance.org/glossary/three-cs/'],
  given: ['Agile Alliance · Dado / Cuando / Entonces', 'https://agilealliance.org/glossary/given-when-then/'],
  split: ['Mountain Goat Software · División de historias', 'https://www.mountaingoatsoftware.com/agile/user-stories/story-splitting'],
  points: ['Mountain Goat Software · Puntos de historia', 'https://www.mountaingoatsoftware.com/agile/story-points'],
  intro: ['Mountain Goat Software · Estimación relativa', 'https://www.mountaingoatsoftware.com/agile/story-points/introducing-story-points-to-a-team'],
  poker: ['Mountain Goat Software · Planning Poker', 'https://www.mountaingoatsoftware.com/agile/story-points/planning-poker'],
  average: ['Mountain Goat Software · Diferencias de estimación', 'https://www.mountaingoatsoftware.com/agile/dont-average-during-planning-poker'],
  scrum: ['Guía Scrum · Product Backlog', 'https://scrumguides.org/scrum-guide.html#product-backlog'],
  order: ['Mountain Goat Software · Prioridad del backlog', 'https://www.mountaingoatsoftware.com/agile/product-backlog/how-to-prioritize-a-product-backlog'],
};

// Composición local de la guía: ejemplos completos y secuencias de lectura.
// El tema, la marca y la validación se reutilizan desde slides-system.
function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, { x, y, w, h, fontFace: F.body, fontSize: 20, color: C.ink,
    margin: 0, breakLine: false, valign: 'top', paraSpaceAfterPt: 7,
    ...opts });
}
function rect(slide, x, y, w, h, color) {
  slide.addShape(SH.rect, { x, y, w, h, line: { color, transparency: 100 }, fill: { color } });
}
function line(slide, x1, y1, x2, y2, color = C.border) {
  slide.addShape(SH.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.1 } });
}
function finish(slide, takeaway, { dark = false, sources = [], example = false } = {}) {
  const fg = dark ? C.white : C.navy;
  if (takeaway) {
    line(slide, M, 6.31, M + 0.48, 6.31, C.red);
    text(slide, takeaway, M, 6.47, CW, 0.50, { fontSize: 16, bold: true, color: dark ? C.white : C.navy });
  }
  const cite = sources.map(key => S[key][0]).join(' · ');
  text(slide, cite || (example ? 'Caso ficticio · Ferretería de Osorno · Cifras y reglas propuestas para el ejemplo' : 'TPE401 · Taller de Proyecto de Especialidad'), M, 7.04, CW - 1.0, 0.2, { fontSize: 9.3, color: dark ? C.softBlue : C.slate });
  components.addSlideNumber(slide, pptx, { x: 11.93, y: 7.00, w: 0.69, h: 0.3, fontSize: 13, color: fg });
  slide.addNotes([
    'Base pedagógica: README de Clase 06, semana 03. Ejemplo conductor del módulo: ferretería de Osorno.',
    example ? 'Las condiciones, cifras y estimaciones del ejemplo son didácticas; no constituyen datos de una organización ni acuerdos del equipo.' : '',
    ...sources.map(key => `${S[key][0]}: ${S[key][1]}`),
    ...(slide._photoSources || []),
  ].filter(Boolean).join('\n'));
  // PptxGenJS guarda la geometría de las tablas en EMU y el resto en pulgadas.
  // Normalizar solo la vista que recibe el validador compartido, sin alterar el archivo.
  const originals = slide._slideObjects;
  slide._slideObjects = originals.map(obj => {
    if (!obj.arrTabRows) return obj;
    const o = obj.options;
    const heights = Array.isArray(o.rowH) ? o.rowH : obj.arrTabRows.map(() => o.rowH || 0.9);
    return { ...obj, type: 'table', options: { ...o, x: o.x / 914400, y: o.y / 914400,
      w: o.w / 914400, h: heights.reduce((a, b) => a + b, 0) } };
  });
  try { utils.validateSlide(slide, pptx); } finally { slide._slideObjects = originals; }
}
function slide(title, phase, { dark = false } = {}) {
  const s = pptx.addSlide();
  components.setBackground(s, dark ? C.navy : C.paper);
  components.addTopRule(s, SH, C.red);
  text(s, phase.toUpperCase(), M, 0.48, 9.3, 0.28, { fontSize: 11.5, charSpacing: 1.5, bold: true, color: dark ? C.gold : C.red });
  const logo = path.join(assets, dark ? 'logo-aiep-dark.png' : 'logo-aiep.svg');
  s.addImage({ path: logo, ...imageSizingContain(logo, 10.88, 0.37, 1.75, 0.67) });
  if (title) text(s, title, M, 1.05, CW, title.includes('\n') ? 1.25 : 0.76, { fontSize: 31, bold: true, fontFace: F.display, color: dark ? C.white : C.navy });
  return s;
}
function photo(s, file, x, y, w, h) {
  const src = path.join(assets, file);
  s.addImage({ path: src, ...imageSizingCrop(src, x, y, w, h) });
  s._photoSources = [...(s._photoSources || []), photos[file]];
}
function arrow(s, x, y, w, color = C.red) {
  const left = w < 0;
  s.addShape(SH.line, {x: left ? x + w : x, y, w: Math.abs(w), h: 0, line: {color, width: 1.8, ...(left ? {beginArrowType: 'triangle'} : {endArrowType: 'triangle'})}});
}
function number(s, n, x, y, size = 0.48, dark = false) {
  text(s, String(n), x, y, size, size, {shape: SH.ellipse, line: {color: dark ? C.gold : C.red}, fill: {color: dark ? C.gold : C.red}, fontSize: 17, bold: true, align: 'center', valign: 'mid', color: dark ? C.navy : C.white});
}
function pokerCard(s, n, x, y, w, h, active = false) {
  s.addShape(SH.roundRect, {x, y, w, h, radius: 0.08, line: {color: active ? C.red : C.border, width: active ? 2 : 1}, fill: {color: active ? C.navy : C.white}});
  text(s, String(n), x + .14, y + .10, .5, .25, {fontSize: 11, color: active ? C.gold : C.red, bold: true});
  text(s, String(n), x, y + .46, w, h - .65, {fontSize: h < 2 ? 40 : 54, align: 'center', valign: 'mid', bold: true, color: active ? C.white : C.navy});
}
function orderForm(s, x, y, w, h, input, state, detail) {
  components.addBrowserMock(s, SH, {x, y, w, h, url: 'ferreteria.local/pedidos'});
  // El componente compacto reserva una caja demasiado baja para la dirección.
  const addressIndex = s._slideObjects.findIndex(o => o.text?.some?.(run => run.text === 'ferreteria.local/pedidos'));
  if (addressIndex >= 0) {
    s._slideObjects[addressIndex].options.h = .18;
    s._slideObjects[addressIndex - 1].options.h = .27;
  }
  text(s, 'Consultar pedido', x + .25, y + .70, w - .5, .4, {fontSize: 23, bold: true, color: C.navy});
  label(s, 'Número de pedido', x + .25, y + 1.30, w - .5);
  rect(s, x + .25, y + 1.72, w - 1.9, .55, C.mist);
  text(s, input, x + .4, y + 1.81, w - 2.2, .34, {fontSize: 18});
  text(s, 'Buscar', x + w - 1.45, y + 1.72, 1.17, .55, {fill: {color: C.navy}, fontSize: 16, bold: true, align: 'center', valign: 'mid', color: C.white});
  line(s, x + .25, y + 2.58, x + w - .25, y + 2.58);
  text(s, state, x + .25, y + 2.85, w - .5, .55, {fontSize: 23, bold: true, color: C.navy});
  if (detail) text(s, detail, x + .25, y + 3.48, w - .5, .55, {fontSize: 18});
}
function label(s, value, x, y, w, color = C.red) {
  text(s, value.toUpperCase(), x, y, w, 0.25, { fontSize: 11.5, charSpacing: 1.0, bold: true, color });
}
function table(s, headers, rows, colW, { y = 2.1, fontSize = 19, rowH = 0.95 } = {}) {
  const head = headers.map(value => ({ text: value, options: { fontSize: Math.min(fontSize, 18), bold: true, color: C.white, fill: C.navy } }));
  const body = rows.map((row, i) => row.map(value => ({ text: value, options: { fill: i % 2 ? C.paper : C.white, color: C.ink } })));
  s.addTable([head, ...body], { x: M, y, w: CW, colW, rowH: [0.56, ...rows.map(() => rowH)], fontFace: F.body, fontSize,
    margin: [0.10, 0.15, 0.10, 0.15], border: { type: 'solid', pt: 0.6, color: C.border },
    valign: 'middle', autoPage: false, color: C.ink, breakLine: false,
  });
}

// 01 · Portada: fotografía y recorrido breve.
{
  const s = slide('', 'TPE401 · Guía de repaso', {dark: true});
  photo(s, 'herramientas.jpg', 7.8, 1.25, 4.83, 4.72);
  rect(s, 7.8, 5.47, 4.83, .5, C.titleFill);
  text(s, 'Caso ficticio: pedidos de una ferretería', 8.0, 5.58, 4.4, .28, {fontSize: 16, color: C.white});
  text(s, 'Requerimientos,\nhistorias y\nestimación', M, 1.38, 6.8, 2.5, {fontSize: 42, bold: true, color: C.white, fontFace: F.display});
  text(s, 'Scrum organiza el trabajo en ciclos cortos para revisar resultados y ajustar lo siguiente.', M, 4.00, 6.35, 1.23, {fontSize: 24, color: C.softBlue});
  text(s, 'PRECISAR  →  ESCRIBIR  →  ESTIMAR  →  ORDENAR', M, 5.58, 6.5, .42, {fontSize: 13, bold: true, color: C.gold});
  finish(s, 'Sigue el ejemplo resuelto y úsalo como referencia para tu proyecto.', {dark: true, sources: ['scrum']});
}
// 02 · Marco explícito del ejemplo utilizado en todo el recorrido.
{
  const s = slide('Un caso ficticio para seguir toda la guía', 'Antes de comenzar');
  text(s, 'La ferretería de Osorno es inventada: sirve de ejemplo para practicar el procedimiento.', M, 1.98, CW, .72, {fontSize: 23});
  photo(s, 'ferreteria.jpg', M, 2.94, 4.2, 2.56);
  text(s, 'Foto ilustrativa; no corresponde a una ferretería de Osorno.\nVijesh Vijayan / Pexels', M, 5.62, 4.2, .48, {fontSize: 11});
  [['Situación', 'Los pedidos llegan por WhatsApp\ny se anotan en un cuaderno.'],
   ['Problema', 'Cuesta encontrar los pedidos\ny responder por su estado.'],
   ['Personas', 'La persona del mesón usa el sistema.\nEl cliente compra y consulta.']].forEach(([a,b], i) => {
    const y = 2.99 + i * 1.04;
    label(s, a, 5.42, y + .06, 1.6);
    text(s, b, 7.19, y, 5.43, .80, {fontSize: 21});
    if (i < 2) line(s, 5.42, y + .86, 12.63, y + .86);
  });
  finish(s, 'Los números, reglas y puntos son del ejemplo. Tu equipo aplica el procedimiento a su proyecto asignado.', {example: true});
}
// 03 · Fotografía de contexto y traducción de necesidad a función.
{
  const s = slide('La necesidad orienta la función', '01 · Requerimientos');
  rect(s, M, 2.05, 4.5, 2.55, C.navy);
  label(s, 'Consulta del cliente', M + .25, 2.34, 4, C.gold);
  text(s, '«¿Mi pedido está\nlisto para retiro?»', M + .25, 2.97, 4, 1.3, {fontSize: 29, bold: true, color: C.white});
  label(s, 'Qué significa «Listo para retiro»', M, 4.95, 4.5);
  text(s, 'Todos los productos del pedido\nya están preparados.', M, 5.39, 4.5, .8, {fontSize: 22});
  label(s, 'Necesidad · qué se busca conseguir', 5.72, 2.07, 6.5);
  text(s, 'Encontrar el pedido\ny conocer su estado.', 5.72, 2.50, 6.45, 1.15, {fontSize: 29, bold: true});
  s.addShape(SH.line, {x: 5.9, y: 3.79, w: 0, h: .45, line: {color: C.red, width: 2, endArrowType: 'triangle'}});
  label(s, 'Función propuesta para resolverlo', 5.72, 4.54, 6.6);
  text(s, 'Buscar por número y mostrar\nel estado actual.', 5.72, 4.98, 6.45, 1.1, {fontSize: 27, bold: true});
  finish(s, 'Un requerimiento es una capacidad o condición que el sistema debe cumplir. Esta función es un ejemplo.', {sources: ['req'], example: true});
}
// 04 · Comparación con datos explícitos.
{
  const s = slide('Función, calidad y regla de negocio', '01 · Requerimientos');
  table(s, ['Qué se precisa', 'Qué significa', 'Ejemplo propuesto'], [
    ['Funcional', 'Lo que el sistema debe hacer.', 'Buscar un pedido por número y mostrar su estado.'],
    ['No funcional', 'Una condición de calidad o restricción.', 'Mostrar el resultado en 2 segundos como máximo, con 1.000 pedidos guardados y una persona consultando.'],
    ['Regla de negocio', 'Lo válido en la operación.', 'Entregar solo pedidos listos para retiro.'],
  ], [2.15, 3.35, CW-5.5], {fontSize: 19, rowH: .98});
  text(s, 'El tiempo se mide desde pulsar «Buscar» hasta ver el resultado. La prueba registra el equipo y la red usados.', M, 5.83, CW, .42, {fontSize: 16});
  finish(s, 'La regla origina una función: impedir marcar como entregado un pedido que aún no esté listo.', {sources: ['req'], example: true});
}
// 05 · Un requisito se ve en su comportamiento.
{
  const s = slide('Un comportamiento que se puede comprobar', '01 · Precisión');
  label(s, 'Demasiado amplio', M, 2.05, 4.5);
  text(s, '«Gestionar\npedidos»', M, 2.51, 4.7, 1.4, {fontSize: 35, bold: true});
  text(s, '¿Registrar, buscar, preparar, entregar o informar?', M, 4.15, 4.6, .95, {fontSize: 24});
  arrow(s, 4.77, 3.28, .6);
  orderForm(s, 5.66, 1.98, 6.97, 4.12, '1042', 'Pedido 1042 · Listo para retiro', '1042 identifica el pedido; no es una cantidad.');
  finish(s, 'En tu proyecto, identifica cada supuesto: una decisión provisional que aún necesita confirmación.', {example: true});
}
// 06 · Una historia, con sus tres piezas conectadas.
{
  const s = slide('Usuario + capacidad + valor', '02 · Historias de usuario');
  text(s, 'Una historia de usuario describe una capacidad desde la perspectiva de quien la necesita.', M, 1.95, CW, .68, {fontSize: 22});
  const xs = [M, 4.85, 9.0], widths = [3.45, 3.45, 3.63];
  [['COMO', 'Persona que atiende\nen el mesón', 'Quién lo necesita'],
   ['QUIERO', 'Consultar un pedido\npor su número', 'Qué quiere hacer'],
   ['PARA', 'Informar al cliente\nsobre su estado', 'Qué beneficio obtiene']].forEach(([key, value, why], i) => {
    rect(s, xs[i], 2.82, widths[i], .08, i === 2 ? C.red : C.navy);
    label(s, key, xs[i], 3.16, widths[i]);
    text(s, value, xs[i], 3.70, widths[i], 1.45, {fontSize: 26, bold: true});
    text(s, why, xs[i], 5.43, widths[i], .55, {fontSize: 19});
    if (i < 2) text(s, '+', xs[i] + 3.6, 4.0, .4, .6, {fontSize: 31, color: C.red, bold: true, align: 'center'});
  });
  finish(s, 'La historia incluye la frase, los detalles conversados y los criterios para comprobar el resultado.', {sources: ['story', 'three'], example: true});
}
// 07 · Los estados de una búsqueda se pueden observar.
{
  const s = slide('Criterios de aceptación: qué debe ocurrir', '02 · Comprobar la historia');
  text(s, 'Condiciones observables que debe cumplir la consulta de un pedido:', M, 1.97, CW, .55, {fontSize: 22});
  const cases = [
    ['Número existente', '1042', 'Pedido 1042', 'Listo para retiro', C.softBlue],
    ['Número inexistente', '9999', 'Pedido no encontrado', 'Revisa el número ingresado.', C.warm],
    ['Campo vacío', '', 'Ingresa un número', 'Se solicita antes de buscar.', C.paleRed],
  ];
  cases.forEach(([title, input, result, detail, fill], i) => {
    const x = M + i * 4.07;
    label(s, title, x, 2.87, 3.65);
    rect(s, x, 3.4, 3.77, .68, C.white);
    text(s, input, x + .18, 3.57, 2.5, .35, {fontSize: 20});
    text(s, '→', x + 3.02, 3.48, .48, .48, {fontSize: 25, color: C.red, align: 'center'});
    rect(s, x, 4.38, 3.77, 1.53, fill);
    text(s, result, x + .2, 4.62, 3.37, .51, {fontSize: 22, bold: true});
    text(s, detail, x + .2, 5.23, 3.37, .5, {fontSize: 17});
  });
  finish(s, '1042 existe en este ejemplo; 9999 no está registrado. Campo vacío significa no escribir nada.', {sources: ['given'], example: true});
}
// 08 · Escenario como una secuencia.
{
  const s = slide('Dado / Cuando / Entonces', '02 · Escribir un escenario');
  const items = [
    ['DADO', 'Contexto inicial', 'Existe el pedido 1042,\nlisto para retiro.'],
    ['CUANDO', 'Acción', 'La persona del mesón\nbusca el número 1042.'],
    ['ENTONCES', 'Resultado observable', 'Se muestran el número\n1042 y el estado\n«Listo para retiro».'],
  ];
  items.forEach(([key, meaning, value], i) => {
    const x = M + 4.1 * i;
    number(s, i + 1, x, 2.35, .6);
    label(s, key, x, 3.24, 3.6);
    text(s, meaning, x, 3.72, 3.6, .7, {fontSize: 20, bold: true});
    text(s, value, x, 4.55, 3.6, 1.22, {fontSize: 23});
    if (i < 2) arrow(s, x + .88, 2.65, 2.77, C.border);
  });
  finish(s, 'Es una forma de redactar un caso: qué existe al inicio, qué hace la persona y qué resultado debe ver.', {sources: ['given'], example: true});
}
// 09 · La capacidad integrada contiene trabajo técnico.
{
  const s = slide('Una historia se implementa con tareas', '02 · Historia y tareas');
  rect(s, M, 2.08, 4.14, 3.95, C.navy);
  label(s, 'Resultado para el usuario', M + .25, 2.38, 3.65, C.gold);
  text(s, 'Consultar el pedido\ny responder\nal cliente', M + .25, 3.1, 3.65, 2.1, {fontSize: 30, bold: true, color: C.white});
  line(s, 5.2, 2.78, 5.2, 5.39, C.red);
  arrow(s, 4.84, 4.0, .36);
  [[2.48, 'Datos', 'Implementar la búsqueda.'], [3.65, 'Pantalla', 'Capturar número y mostrar resultado.'], [4.82, 'Integración y pruebas', 'Unir pantalla y datos; probar los tres casos.']].forEach(([y, title, detail]) => {
    arrow(s, 5.2, y + .28, .47);
    text(s, title, 5.96, y, 6.55, .45, {fontSize: 23, bold: true});
    text(s, detail, 5.96, y + .49, 6.55, .58, {fontSize: 20});
  });
  finish(s, 'Una tarea terminada no demuestra que la capacidad integrada cumpla sus criterios.', {sources: ['split'], example: true});
}
// 10 · División vertical: cada historia conserva un resultado útil.
{
  const s = slide('Dividir por capacidades útiles', '02 · Historias pequeñas');
  text(s, '«Gestionar pedidos» puede separarse así:', M, 1.98, CW, .58, {fontSize: 24});
  [['Registrar pedido', 'Guardar productos\ny cantidades.'], ['Consultar pedido', 'Buscar por número\ny mostrar el estado.'], ['Marcar listo para retiro', 'Cambiar el estado de\nun pedido preparado.']].forEach(([title, result], i) => {
    const x = M + i * 4.07;
    text(s, title, x, 2.88, 3.7, .90, {fontSize: 24, bold: true});
    text(s, result, x, 3.93, 3.7, .95, {fontSize: 23});
    ['Pantalla: interacción', 'Lógica: reglas y procesos', 'Datos: guardar y consultar'].forEach((t, j) => {
      text(s, t, x, 4.9 + j * .35, 3.7, .29, {fill: {color: [C.softBlue, C.sand, C.softNeutral][j]}, fontSize: 12.5, align: 'center', valign: 'mid', bold: true});
    });
  });
  finish(s, 'Cada historia puede necesitar pantalla, lógica y datos. Marcar listo no incluye un aviso automático.', {sources: ['split'], example: true});
}
// 11 · Apertura visual al trabajo de estimar.
{
  const s = slide('Estimar todo el trabajo necesario', '03 · Estimación', {dark: true});
  photo(s, 'equipo.jpg', M, 2.02, 5.62, 3.50);
  text(s, 'Comparar el esfuerzo de completar\nla historia y sus criterios.', M, 5.70, 5.62, .59, {fontSize: 16, color: C.softBlue});
  [['Cantidad de trabajo', 'Implementar, integrar y probar.'], ['Complejidad', 'Dificultad de reglas y relaciones.'], ['Incertidumbre y riesgo', 'Lo desconocido que puede aumentar el esfuerzo.']].forEach(([a,b],i) => {
    const y = 2.13 + i * 1.34;
    text(s, a, 6.83, y, 5.65, .57, {fontSize: 23, bold: true, color: C.gold});
    text(s, b, 6.83, y + .62, 5.65, .71, {fontSize: 21, color: C.white});
  });
  finish(s, 'Estiman quienes harán el trabajo. Puntos y Planning Poker son técnicas opcionales en Scrum.', {dark: true, sources: ['points', 'scrum']});
}
// 12 · La escala se presenta como cartas editables.
{
  const s = slide('Puntos relativos y una referencia común', '03 · Comparar tamaños');
  text(s, 'Los puntos comparan el esfuerzo entre historias del mismo equipo. Primero se elige una historia clara y se acuerda su puntaje como referencia.', M, 1.98, CW, .85, {fontSize: 22});
  [1,2,3,5,8].forEach((n,i) => {
    const x = 1.06 + i * 2.42;
    pokerCard(s, n, x, 3.03, 1.77, 2.28, n === 2);
    text(s, n === 2 ? 'Referencia' : 'puntos', x - .1, 5.47, 1.97, .38, {fontSize: 17, bold: n === 2, align: 'center'});
  });
  text(s, 'En esta escala, un número mayor representa más esfuerzo estimado. Los valores son aproximaciones.', M, 5.97, CW, .3, {fontSize: 16});
  finish(s, 'Referencia del ejemplo: consultar un pedido, 2 puntos, con los casos existente, inexistente y vacío.', {sources: ['intro'], example: true});
}
// 13 · Comparación de referencia, con tabla nativa.
{
  const s = slide('Cada número necesita una razón', '03 · Comparación razonada');
  table(s, ['Historia', 'Puntos', 'Razón ilustrativa'], [
    ['Consultar por número', '2', 'Referencia: búsqueda, resultado y alternativas.'],
    ['Marcar listo para retiro', '3', 'Guardar el nuevo estado y comprobar que el pedido está preparado.'],
    ['Registrar pedido', '5', 'Entradas, validaciones y guardado de datos relacionados.'],
  ], [3.8, 1.4, CW-5.2], {fontSize: 20, rowH: .96});
  text(s, '5 puntos no son 5 horas', M, 5.85, 4.45, .46, {fontSize: 23, bold: true, color: C.red});
  text(s, 'El alcance y lo ya construido cambian la comparación.', 5.2, 5.86, 7.3, .4, {fontSize: 18});
  finish(s, 'El orden de trabajo se decide por separado. Los puntos no comparan productividad entre equipos.', {sources: ['points', 'intro'], example: true});
}
// 14 · Planning Poker en orden de lectura vertical.
{
  const s = slide('Planning Poker: seis pasos en orden', '03 · Estimar en equipo');
  const steps = [
    ['Aclarar la historia', 'Leer su propósito, criterios y supuestos.'],
    ['Comparar', 'Usar la historia de referencia de 2 puntos.'],
    ['Elegir en privado', 'Cada persona elige 1, 2, 3, 5 u 8 sin mostrarlo.'],
    ['Mostrar a la vez', 'Todos revelan su número al mismo tiempo.'],
    ['Explicar diferencias', 'Quienes votaron más alto y más bajo explican por qué.'],
    ['Volver a estimar', 'Registrar el puntaje acordado o lo que falta aclarar.'],
  ];
  line(s, .96, 2.4, .96, 5.73, C.border);
  steps.forEach(([title, detail],i) => {
    const y = 2.05 + i * .67;
    number(s, i+1, M, y, .52);
    text(s, title, 1.53, y+.03, 3.15, .5, {fontSize:21,bold:true});
    text(s, detail, 5.12, y+.03, 7.48, .54, {fontSize:20});
  });
  finish(s, 'Puede hacerse con papel. El puntaje se acuerda tras discutir; no se obtiene promediando los votos.', {sources: ['poker','average']});
}
// 15 · Votos e interpretaciones visibles.
{
  const s = slide('Una ronda antes de acordar el puntaje', '03 · Votos y acuerdo ficticios');
  text(s, 'Historia: marcar listo para retiro un pedido ya preparado.', M, 1.98, CW, .58, {fontSize: 23});
  [['2','Cambio de estado','Considera cambiar el estado del pedido.'], ['3','Validación y pruebas','Incluye comprobar que todos los productos estén preparados.'], ['8','Funciones añadidas','Supone seguimiento por producto y aviso automático.']].forEach(([n,a,b],i) => {
    const x = M + i * 4.1;
    pokerCard(s, n, x, 2.92, 1.19, 1.58);
    text(s, a, x+1.45, 3.25, 2.3, 1.1, {fontSize: 22, bold: true});
    text(s, b, x, 4.86, 3.65, 1.1, {fontSize: 22});
  });
  finish(s, 'Se excluyen el aviso y el seguimiento por producto. Tras otra votación, el equipo del ejemplo acuerda 3 puntos.', {sources: ['average'], example: true});
}
// 16 · Resolver la causa de la incertidumbre.
{
  const s = slide('Qué hacer cuando falta información', '03 · Situaciones posibles al estimar');
  [['Varias capacidades juntas','Dividir con resultados útiles.'], ['Criterios poco claros','Precisar casos y resultados.'], ['No se sabe si es posible construirlo','Investigar o hacer una prueba pequeña.'], ['Falta una regla decisiva','Anotar la duda y dejar el puntaje pendiente.']].forEach(([a,b],i) => {
    const y = 2.03 + i * 1.0;
    rect(s, M, y+.16, .14, .43, C.red);
    text(s, a, 1.43, y, 4.75, .75, {fontSize: 22, bold: true});
    arrow(s, 6.22, y+.28, .64);
    text(s, b, 7.22, y, 5.35, .77, {fontSize: 22});
    if(i<3) line(s, 1.43, y+.86, 12.6, y+.86);
  });
  finish(s, 'Pendiente significa que aún no hay un puntaje acordado: se registra qué falta aclarar para estimar.', {sources: ['poker']});
}
// 17 · Orden y tamaño mediante dos representaciones distintas.
{
  const s = slide('Prioridad y tamaño responden cosas distintas', '04 · Ordenar el trabajo');
  label(s, 'Prioridad · qué abordar antes', M, 2.04, 5.4);
  [['1','Registrar pedido'],['2','Consultar pedido'],['3','Marcar listo']].forEach(([n,t],i) => {
    const y = 2.65+i*.7;
    number(s, n, M, y, .43);
    text(s, t, 1.44, y+.02, 4.12, .47, {fontSize: 23});
  });
  text(s, 'Beneficio, urgencia, trabajo previo\nnecesario y dudas por resolver.', M, 5.12, 5.4, .9, {fontSize: 21});
  line(s, 6.25, 2.1, 6.25, 5.99);
  label(s, 'Tamaño · cuánto esfuerzo relativo', 6.8, 2.04, 5.8);
  [['Registrar',5],['Consultar',2],['Marcar listo',3]].forEach(([t,n],i) => {
    const y = 2.65+i*.7;
    text(s, t, 6.8, y, 2.05, .5, {fontSize: 20});
    rect(s, 9.08, y+.06, n*.52, .32, C.navy);
    text(s, String(n), 11.93, y, .5, .5, {fontSize: 23, bold: true, color: C.red});
  });
  text(s, 'Puntos didácticos, comparados con\nuna misma historia de referencia.', 6.8, 5.12, 5.8, .9, {fontSize: 21});
  finish(s, 'Registrar puede ir antes aunque tenga más puntos: aporta los datos que después se consultan.', {sources: ['order'], example: true});
}
// 18 · Backlog con tabla nativa, conserva orden y razón.
{
  const s = slide('Un backlog inicial de la ferretería', '04 · Trabajo ordenado');
  text(s, 'Product Backlog: lista ordenada del trabajo para mejorar el producto. Cambia al aprender más del proyecto.', M, 1.98, CW, .8, {fontSize: 22});
  table(s, ['Orden','Historia abreviada','Puntos','Motivo'], [
    ['1','Registrar pedido','5','Conservar lo solicitado.'],
    ['2','Consultar por número','2','Encontrar el pedido y ver su estado.'],
    ['3','Marcar listo para retiro','3','Registrar que está preparado.'],
  ], [1.1,3.5,1.4,CW-6], {y:2.99, fontSize:20, rowH:.74});
  text(s, 'Se puede probar la consulta con pedidos ficticios antes de construir el registro.', M, 5.87, CW, .43, {fontSize:16});
  finish(s, 'El Product Owner ordena la lista según el valor del producto. Quienes desarrollan estiman el esfuerzo.', {sources: ['scrum'], example: true});
}
// 19 · Refinar: revisión continua del contenido de una historia.
{
  const s = slide('Refinar es comprender mejor el trabajo', '04 · Refinamiento');
  photo(s, 'notas.jpg', 8.82, 2.01, 3.81, 4.04);
  [['Propósito','Quién lo necesita y para qué.'], ['Comprobación','Qué resultado debe observarse.'], ['Alcance','Qué incluye, qué deja fuera y qué se supone.'], ['Tamaño y dependencias','Esfuerzo y trabajo previo que necesita.']].forEach(([a,b],i) => {
    const y = 2.03+i*1.01;
    number(s, i+1, M, y+.05, .44);
    text(s, a, 1.5, y, 6.75, .46, {fontSize:23,bold:true});
    text(s, b, 1.5, y+.53, 6.75, .48, {fontSize:20});
  });
  finish(s, 'Si cambia la historia, revisa criterios, tamaño y orden. Los pendientes también se registran.', {sources:['scrum']});
}
// 20 · Cierre como ficha de referencia de una historia.
{
  const s = slide('Qué conservar junto a cada historia', 'Cierre · Referencia para tu proyecto', {dark:true});
  const items = [
    ['Usuario y propósito','Qué necesidad resuelve.'], ['Criterios de aceptación','Cómo comprobar el resultado.'],
    ['Puntos y referencia','Cómo se comparó el esfuerzo.'], ['Prioridad y pendientes','Qué abordar antes y qué falta aclarar.'],
  ];
  items.forEach(([a,b],i) => {
    const x = M+(i%2)*6.2, y = 2.12+Math.floor(i/2)*1.75;
    number(s, i+1, x, y, .51, true);
    text(s, a, x, y+.71, 5.7, .54, {fontSize:23,bold:true,color:C.gold});
    text(s, b, x, y+1.25, 5.7, .47, {fontSize:20,color:C.white});
  });
  finish(s, 'Historias, estimaciones y orden se revisan cuando se aprende más del producto.', {dark:true,sources:['scrum']});
}

if (pptx._slides.length !== 20) throw new Error(`Se esperaban 20 láminas; hay ${pptx._slides.length}.`);
fs.mkdirSync(path.dirname(output), {recursive:true});
pptx.writeFile({fileName:output}).then(() => console.log(`OK: ${pptx._slides.length} láminas -> ${output}`)).catch(error => {console.error(error);process.exit(1);});
