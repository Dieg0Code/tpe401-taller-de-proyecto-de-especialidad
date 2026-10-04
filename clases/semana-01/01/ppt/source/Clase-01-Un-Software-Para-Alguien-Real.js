const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "TPE401 · Clase 01",
  title: "Un software para alguien real",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-01-Un-Software-Para-Alguien-Real.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

// Dispositivo visual de la clase: las seis etapas del ciclo de desarrollo, cada una con
// un color fijo. La misma tira reaparece en la portada, en el ciclo, en el perfil de
// egreso y en el mapa de la propuesta, para que el color diga a qué etapa pertenece cada cosa.
const ETAPAS = [
  { nombre: "Descubrimiento", color: C.red },
  { nombre: "Alcance", color: C.titleFill },
  { nombre: "Planificación", color: C.gold },
  { nombre: "Diseño", color: C.success },
  { nombre: "Construcción", color: C.navy },
  { nombre: "Puesta en marcha", color: C.slate },
];

const BLOQUES = ["Qué se construye", "El recorrido de diez semanas", "Con qué herramientas llegas"];

// ---------------------------------------------------------------------------
// Primitivos.

function addText(slide, value, opts = {}) {
  slide.addText(value, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fontFace: opts.fontFace || TYPOGRAPHY.body,
    fontSize: opts.fontSize || 18,
    bold: opts.bold || false,
    italic: opts.italic || false,
    color: opts.color || C.ink,
    align: opts.align || "left",
    valign: opts.valign || "top",
    margin: opts.margin ?? 0,
    breakLine: false,
    lineSpacingMultiple: opts.lineSpacingMultiple,
    charSpacing: opts.charSpacing,
    isTextBox: true,
  });
}

function rect(slide, x, y, w, h, fill, outline = fill) {
  slide.addShape(SH.rect, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    line: { color: outline, pt: outline === fill ? 0 : 1 },
  });
}

function rule(slide, x, y, w, color = C.border, pt = 1.2) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, pt, beginArrowType: "none", endArrowType: "none" },
  });
}

function arrow(slide, x, y, w, color, pt = 1.6, both = false) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, pt, beginArrowType: both ? "triangle" : "none", endArrowType: "triangle" },
  });
}

function addAiepLogo(slide, dark = false) {
  const logoPath = dark ? ASSETS.aiepDark : ASSETS.aiep;
  slide.addImage({
    path: logoPath,
    ...imageSizingContain(logoPath, 11.18, 0.28, 1.46, 0.62),
  });
}

function addTopMotif(slide, dark = false) {
  rect(slide, 0, 0, 0.72, 0.12, C.red);
  rect(slide, 0.82, 0, 0.44, 0.12, dark ? C.gold : C.navy);
  rect(slide, 1.36, 0, 0.28, 0.12, dark ? C.white : C.gold);
}

function addFooter(slide, dark = false) {
  addText(slide, "TPE401 · Taller de Proyecto de Especialidad", {
    x: M,
    y: 7.1,
    w: 6.2,
    h: 0.18,
    fontSize: 9.5,
    bold: true,
    color: dark ? C.sand : C.slate,
    charSpacing: 0.55,
  });
  addText(slide, String(pptx._slides.length).padStart(2, "0"), {
    x: 11.72,
    y: 7.02,
    w: 0.9,
    h: 0.28,
    fontFace: TYPOGRAPHY.display,
    fontSize: 14,
    bold: true,
    color: dark ? C.sand : C.ink,
    align: "right",
  });
}

function createSlide(mode = "light") {
  const slide = pptx.addSlide();
  const dark = mode === "dark";
  slide.background = { color: dark ? C.navy : C.paper };
  addTopMotif(slide, dark);
  addAiepLogo(slide, dark);
  addFooter(slide, dark);
  return { slide, dark };
}

function addHeader(slide, label, title, opts = {}) {
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.44,
    w: 7.8,
    h: 0.22,
    fontSize: 10.3,
    bold: true,
    color: C.red,
    charSpacing: 1.7,
  });
  addText(slide, title, {
    x: M,
    y: 0.82,
    w: opts.titleW || 10.2,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 28,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.03,
  });
}

function addKicker(slide, x, y, text, color, w = 5.2) {
  addText(slide, text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color,
    charSpacing: 1.3,
  });
}

function addTakeaway(slide, text, opts = {}) {
  const y = opts.y || 6.2;
  const h = opts.h || 0.58;
  rect(slide, M, y, CW, h, opts.fill || C.navy);
  addText(slide, text, {
    x: M + 0.32,
    y: y + 0.05,
    w: CW - 0.64,
    h: h - 0.1,
    fontSize: opts.fontSize || 14,
    bold: true,
    color: opts.color || C.white,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });
}

function addFuente(slide, y, text) {
  rect(slide, M, y, 0.05, 0.2, C.gold);
  addText(slide, text, {
    x: M + 0.16,
    y: y - 0.01,
    w: 10.5,
    h: 0.22,
    fontSize: 9,
    color: C.slate,
  });
}

// Chip de etapa: rectangulo del color de la etapa con su nombre en blanco.
function etapaChip(slide, x, y, w, h, etapa, fontSize = 11, outline) {
  rect(slide, x, y, w, h, etapa.color, outline || etapa.color);
  addText(slide, etapa.nombre, {
    x: x + 0.06,
    y: y + 0.02,
    w: w - 0.12,
    h: h - 0.04,
    fontSize,
    bold: true,
    color: etapa.color === C.gold ? C.ink : C.white,
    align: "center",
    valign: "mid",
  });
}

// Tira de las seis etapas, usada como firma visual de la clase.
function tiraEtapas(slide, x, y, w, h, opts = {}) {
  const gap = opts.gap ?? 0.08;
  const cw = (w - gap * 5) / 6;
  ETAPAS.forEach((etapa, i) => {
    etapaChip(slide, x + i * (cw + gap), y, cw, h, etapa, opts.fontSize || 10, opts.outline);
  });
}

// Indicador de bloque en las aperturas: los tres bloques, con el activo en rojo.
function rutaBloques(slide, activo, y) {
  const gap = 0.14;
  const w = (CW - gap * 2) / 3;
  BLOQUES.forEach((nombre, i) => {
    const x = M + i * (w + gap);
    const on = i + 1 === activo;
    rect(slide, x, y, w, 0.8, on ? C.red : "1D3A57");
    addText(slide, `BLOQUE ${i + 1}`, {
      x: x + 0.22,
      y: y + 0.12,
      w: w - 0.44,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color: on ? C.white : C.gold,
      charSpacing: 0.8,
    });
    addText(slide, nombre, {
      x: x + 0.22,
      y: y + 0.36,
      w: w - 0.44,
      h: 0.32,
      fontSize: 13.5,
      bold: true,
      color: C.white,
    });
  });
}

// ---------------------------------------------------------------------------
// 01 · Portada

function slideCover() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.42, "TPE401 · Clase 01 · Unidad 1", C.gold, 6);
  addText(slide, "Un software para alguien real", {
    x: M,
    y: 1.84,
    w: 11.4,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.12, 4.2, C.red, 3);
  addText(slide, "Qué se construye en este módulo, cómo se evalúa y con qué herramientas llega cada estudiante", {
    x: M,
    y: 3.4,
    w: 11.2,
    h: 0.5,
    fontSize: 18,
    color: C.softBlue,
  });
  tiraEtapas(slide, M, 4.3, CW, 0.5, { fontSize: 11, outline: C.softBlue });
  addText(slide, "Diez semanas para recorrer el ciclo completo de desarrollo de un sistema, sobre un desafío real.", {
    x: M,
    y: 4.94,
    w: CW,
    h: 0.3,
    fontSize: 13,
    color: C.sand,
  });
  rule(slide, M, 5.5, CW, "2C4A66", 1);
  addText(slide, "Lunes 5 de octubre de 2026 · 08:30 – 10:50", {
    x: M,
    y: 5.7,
    w: 7.2,
    h: 0.3,
    fontSize: 12.6,
    color: C.sand,
  });
  addText(slide, "Diego Obando · AIEP Osorno", {
    x: 8.2,
    y: 5.7,
    w: 4.4,
    h: 0.3,
    fontSize: 12.6,
    color: C.sand,
    align: "right",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 02 · Lo que se lleva de esta clase

function slideObjetivo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Objetivo de la clase", "Al terminar, tienes que poder responder tres preguntas");

  rect(slide, M, 2.0, 4.3, 3.86, C.navy);
  addText(slide, "Esta es la única sesión dedicada a explicar el módulo completo.", {
    x: M + 0.36,
    y: 2.3,
    w: 3.6,
    h: 1.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.08,
  });
  rule(slide, M + 0.36, 4.12, 1.4, C.red, 2.4);
  addText(slide, "Desde la próxima, cada sesión es un taller sobre el proyecto.", {
    x: M + 0.36,
    y: 4.36,
    w: 3.6,
    h: 1.1,
    fontSize: 14,
    color: C.softBlue,
    lineSpacingMultiple: 1.14,
  });

  const preguntas = [
    ["¿Qué se construye?", "Un sistema de software para una organización real, y el documento que cuenta cómo se desarrolla."],
    ["¿Cómo se evalúa?", "Tres entregas con nota sobre el mismo proyecto, y un examen en que el equipo lo presenta."],
    ["¿Con qué cuentas?", "Las herramientas que te dejó cada asignatura de la carrera, y el perfil de egreso que las ordena."],
  ];
  const x = M + 4.7;
  const w = CW - 4.7;
  preguntas.forEach(([q, a], i) => {
    const y = 2.0 + i * 1.32;
    addText(slide, String(i + 1), {
      x,
      y: y + 0.02,
      w: 0.6,
      h: 0.7,
      fontFace: TYPOGRAPHY.display,
      fontSize: 40,
      bold: true,
      color: C.red,
    });
    addText(slide, q, {
      x: x + 0.8,
      y,
      w: w - 0.8,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.ink,
    });
    addText(slide, a, {
      x: x + 0.8,
      y: y + 0.46,
      w: w - 0.8,
      h: 0.62,
      fontSize: 13,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    if (i < 2) rule(slide, x + 0.8, y + 1.2, w - 0.8, C.border, 0.8);
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · Mapa de la sesion, con el ancho de cada tramo proporcional a su duracion

function slideMapa() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la sesión", "140 minutos, en cinco tramos");

  const tramos = [
    ["08:30", 15, "Encuadre", "Un módulo distinto y el diagnóstico inicial", C.slate],
    ["08:45", 30, "Bloque 1", "Qué se construye", C.red],
    ["09:15", 25, "Bloque 2", "El recorrido de diez semanas", C.titleFill],
    ["09:40", 10, "Pausa", "", C.border],
    ["09:50", 45, "Bloque 3", "Con qué herramientas llegas", C.success],
    ["10:35", 15, "Cierre", "El paso siguiente", C.navy],
  ];
  const total = 140;
  const y = 2.7;
  let x = M;
  tramos.forEach(([hora, min, nombre, glosa, color], i) => {
    const w = (CW * min) / total;
    rect(slide, x, y, w - 0.04, 0.9, color);
    if (nombre !== "Pausa") {
      addText(slide, `${min}'`, {
        x: x + 0.1,
        y: y + 0.22,
        w: w - 0.24,
        h: 0.46,
        fontFace: TYPOGRAPHY.display,
        fontSize: 20,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
      });
    }
    addText(slide, hora, {
      x,
      y: y - 0.36,
      w: 0.8,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: C.slate,
    });
    const alto = i % 2 === 0;
    const ty = alto ? y + 1.14 : y + 2.24;
    rule(slide, x, ty - 0.1, Math.max(w - 0.08, 0.5), color === C.border ? C.slate : color, 1.6);
    const lw = Math.min(2.8, W - M - x);
    addText(slide, nombre, {
      x,
      y: ty,
      w: lw,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    if (glosa) {
      addText(slide, glosa, {
        x,
        y: ty + 0.32,
        w: lw,
        h: 0.5,
        fontSize: 11.5,
        color: C.slate,
        lineSpacingMultiple: 1.08,
      });
    }
    x += w;
  });
  addText(slide, "10:50", { x: W - M - 0.6, y: y + 0.96, w: 0.6, h: 0.24, fontSize: 11, bold: true, color: C.slate, align: "right" });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Un modulo distinto: contraste entre los modulos anteriores y este

function slideDistinto() {
  const { slide } = createSlide("light");
  addHeader(slide, "Encuadre", "Este módulo funciona distinto de todos los anteriores");

  const filas = [
    ["Lo que se aprende", "Un tema: un lenguaje, una base de datos, una técnica", "Nada nuevo: se usa lo que ya sabes"],
    ["De qué depende la nota", "De cuánto aprendiste del tema", "De lo que se construye y se documenta"],
    ["Quién define qué programar", "El enunciado del ejercicio", "Nadie: averiguarlo es parte del trabajo"],
    ["Para quién es", "Para el curso", "Para una organización real"],
    ["Cómo es la sesión", "Exposición del docente", "Taller sobre el proyecto, con el docente como asesor"],
  ];
  const x0 = M;
  const wLabel = 2.9;
  const wCol = (CW - wLabel - 0.2) / 2;
  const xA = x0 + wLabel + 0.1;
  const xB = xA + wCol + 0.1;
  rect(slide, xA, 1.96, wCol, 0.5, C.softNeutral);
  addText(slide, "Módulos anteriores", { x: xA + 0.24, y: 2.04, w: wCol - 0.4, h: 0.34, fontSize: 14, bold: true, color: C.slate, valign: "mid" });
  rect(slide, xB, 1.96, wCol, 0.5, C.navy);
  addText(slide, "Este módulo", { x: xB + 0.24, y: 2.04, w: wCol - 0.4, h: 0.34, fontSize: 14, bold: true, color: C.white, valign: "mid" });

  filas.forEach(([label, antes, ahora], i) => {
    const y = 2.6 + i * 0.7;
    addText(slide, label, { x: x0, y: y + 0.08, w: wLabel, h: 0.5, fontSize: 12.5, bold: true, color: C.ink, valign: "mid" });
    rect(slide, xA, y, wCol, 0.6, C.white);
    addText(slide, antes, { x: xA + 0.24, y: y + 0.06, w: wCol - 0.4, h: 0.48, fontSize: 12, color: C.slate, valign: "mid" });
    rect(slide, xB, y, wCol, 0.6, C.softBlue);
    rect(slide, xB, y, 0.06, 0.6, C.red);
    addText(slide, ahora, { x: xB + 0.24, y: y + 0.06, w: wCol - 0.4, h: 0.48, fontSize: 12.5, bold: true, color: C.ink, valign: "mid" });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · El caso que acompana todo el modulo

function slideCaso() {
  const { slide } = createSlide("light");
  addHeader(slide, "El ejemplo del módulo", "Una ferretería de Osorno y su cuaderno de pedidos");

  // Flujo actual: WhatsApp -> cuaderno, y tres fallas que salen del cuaderno.
  rect(slide, M, 2.2, 2.6, 1.3, C.white);
  rect(slide, M, 2.2, 2.6, 0.06, C.success);
  addText(slide, "WhatsApp", { x: M + 0.24, y: 2.42, w: 2.2, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.ink });
  addText(slide, "Llegan unos 40 pedidos al día", { x: M + 0.24, y: 2.86, w: 2.2, h: 0.5, fontSize: 12, color: C.slate });
  arrow(slide, M + 2.7, 2.85, 0.7, C.slate, 2);
  rect(slide, M + 3.5, 2.2, 2.6, 1.3, C.white);
  rect(slide, M + 3.5, 2.2, 2.6, 0.06, C.gold);
  addText(slide, "Cuaderno", { x: M + 3.74, y: 2.42, w: 2.2, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.ink });
  addText(slide, "Cada pedido se anota a mano", { x: M + 3.74, y: 2.86, w: 2.2, h: 0.5, fontSize: 12, color: C.slate });

  const fallas = [
    ["Pedidos que se pierden", "Unos tres por semana nunca se preparan"],
    ["Bodega a ciegas", "Nadie sabe qué productos faltan"],
    ["Clientes que llaman", "Para preguntar si su pedido está listo"],
  ];
  const xf = M + 6.9;
  const wf = CW - 6.9;
  fallas.forEach(([t, d], i) => {
    const y = 1.96 + i * 0.94;
    arrow(slide, M + 6.2, y + 0.4, 0.6, C.red, 1.4);
    rect(slide, xf, y, wf, 0.8, C.paleRed);
    addText(slide, "✗", { x: xf + 0.16, y: y + 0.14, w: 0.4, h: 0.5, fontSize: 22, bold: true, color: C.red, align: "center", valign: "mid" });
    addText(slide, t, { x: xf + 0.7, y: y + 0.1, w: wf - 0.9, h: 0.3, fontSize: 14, bold: true, color: C.ink });
    addText(slide, d, { x: xf + 0.7, y: y + 0.42, w: wf - 0.9, h: 0.3, fontSize: 11.5, color: C.slate });
  });

  addText(slide, "Este caso aparece en todo el módulo para mostrar cada etapa con algo concreto. Es solo una ilustración: cada proyecto trabaja con su propio desafío.", {
    x: M,
    y: 5.06,
    w: CW,
    h: 0.6,
    fontSize: 13,
    color: C.slate,
    lineSpacingMultiple: 1.14,
  });
  addTakeaway(slide, "El problema no es «no tienen una aplicación»: es que pierden ventas y clientes.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · El diagnostico inicial

function slideDiagnostico() {
  const { slide } = createSlide("light");
  addHeader(slide, "Esta semana", "El diagnóstico inicial de la asignatura");

  addText(slide, "Un cuestionario que mide con qué conocimientos llegas al módulo.", {
    x: M,
    y: 1.74,
    w: CW,
    h: 0.4,
    fontSize: 16,
    color: C.slate,
  });

  const datos = [
    ["Sin nota", "No se califica: sirve para saber desde dónde parte cada uno.", C.success],
    ["Por tu cuenta", "En el momento y el lugar que elijas, dentro del plazo.", C.titleFill],
    ["En otra aula virtual", "No en la del módulo: tiene su propio espacio.", C.gold],
    ["Aviso por correo", "El plazo y el acceso llegan a tu correo AIEP desde evaluacionesnacionales@aiep.cl", C.red],
  ];
  const gap = 0.2;
  const w = (CW - gap * 3) / 4;
  datos.forEach(([t, d, color], i) => {
    const x = M + i * (w + gap);
    rect(slide, x, 2.5, w, 2.3, C.white);
    rect(slide, x, 2.5, w, 0.08, color);
    addText(slide, String(i + 1).padStart(2, "0"), { x: x + 0.24, y: 2.76, w: 1, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color });
    addText(slide, t, { x: x + 0.24, y: 3.24, w: w - 0.44, h: 0.36, fontSize: 15, bold: true, color: C.ink });
    addText(slide, d, { x: x + 0.24, y: 3.66, w: w - 0.44, h: 1.0, fontSize: 11.8, color: C.slate, lineSpacingMultiple: 1.12 });
  });

  rect(slide, M, 5.12, CW, 0.78, C.softBlue);
  addText(slide, "Al cerrar el plazo puedes revisar tus respuestas junto con las correctas y su justificación: es la primera retroalimentación del módulo.", {
    x: M + 0.3,
    y: 5.18,
    w: CW - 0.6,
    h: 0.66,
    fontSize: 13.5,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · Apertura del Bloque 1

function slideBloqueUno() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 3 · 30 minutos", C.gold, 5);
  addText(slide, "Qué se construye", { x: M, y: 1.98, w: 10.7, h: 1.1, fontFace: TYPOGRAPHY.display, fontSize: 46, bold: true, color: C.white });
  rule(slide, M, 3.3, 4.2, C.red, 2.4);
  addText(slide, "Un sistema de software para una organización real, las etapas por las que pasa su desarrollo, y el documento que cuenta ese mismo desarrollo por escrito.", {
    x: M,
    y: 3.58,
    w: 10.4,
    h: 0.9,
    fontSize: 16,
    color: C.sand,
    lineSpacingMultiple: 1.2,
  });
  rutaBloques(slide, 1, 5.3);
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · Un sistema para alguien real

function slideAlguienReal() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Qué se construye", "Para alguien real, no para un enunciado");

  addText(slide, "Una organización que existe fuera de la sala, tiene un problema concreto y puede decir si el sistema le sirve.", {
    x: M,
    y: 1.78,
    w: 6.2,
    h: 0.8,
    fontSize: 15,
    color: C.slate,
    lineSpacingMultiple: 1.14,
  });
  const quienes = ["Una pyme", "Una institución", "Una junta de vecinos", "Una fundación"];
  quienes.forEach((q, i) => {
    const y = 2.8 + i * 0.74;
    rect(slide, M, y, 6.2, 0.6, i % 2 === 0 ? C.white : C.warm);
    rect(slide, M, y, 0.06, 0.6, C.red);
    addText(slide, q, { x: M + 0.3, y: y + 0.08, w: 5.6, h: 0.44, fontSize: 16, bold: true, color: C.ink, valign: "mid" });
  });

  const xr = M + 6.7;
  const wr = CW - 6.7;
  rect(slide, xr, 1.9, wr, 3.86, C.navy);
  addKicker(slide, xr + 0.36, 2.18, "Lo que cambia", C.gold, wr - 0.7);
  addText(slide, "En un ejercicio de clase, el enunciado dice qué programar.", {
    x: xr + 0.36,
    y: 2.6,
    w: wr - 0.72,
    h: 1.0,
    fontSize: 17,
    color: C.softBlue,
    lineSpacingMultiple: 1.12,
  });
  rule(slide, xr + 0.36, 3.74, 1.2, C.red, 2.4);
  addText(slide, "Aquí nadie lo dice: averiguarlo, y averiguarlo bien, es parte del trabajo.", {
    x: xr + 0.36,
    y: 3.96,
    w: wr - 0.72,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.08,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · El ciclo de desarrollo: seis etapas, seis preguntas

function slideCiclo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · El ciclo de desarrollo", "Construir un sistema no empieza programando");

  const preguntas = [
    "¿Qué está pasando, a quién le afecta y cuánto?",
    "¿Qué va a hacer el sistema y qué no?",
    "¿Con qué recursos, en cuánto tiempo, cuánto cuesta y quién hace qué?",
    "¿Qué valor entrega y cómo se organiza por dentro?",
    "¿Funciona lo que se diseñó?",
    "¿Lo usan las personas para las que se hizo?",
  ];
  const gap = 0.22;
  const w = (CW - gap * 5) / 6;
  ETAPAS.forEach((etapa, i) => {
    const x = M + i * (w + gap);
    const y = 2.1 + (i % 2) * 0.5;
    addText(slide, String(i + 1).padStart(2, "0"), {
      x,
      y,
      w,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color: etapa.color,
    });
    etapaChip(slide, x, y + 0.66, w, 0.5, etapa, 11);
    rect(slide, x, y + 1.24, w, 1.9, C.white);
    addText(slide, preguntas[i], {
      x: x + 0.14,
      y: y + 1.36,
      w: w - 0.28,
      h: 1.66,
      fontSize: 12.5,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    if (i < 5) arrow(slide, x + w + 0.02, y + 0.91 + (i % 2 === 0 ? 0.25 : -0.25), gap - 0.04, C.slate, 1.2);
  });
  addTakeaway(slide, "Cada etapa responde una pregunta distinta, y la siguiente depende de la respuesta de la anterior.", { y: 6.16 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · La ferreteria, etapa por etapa

function slideCicloFerreteria() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · El ciclo en el ejemplo", "La ferretería, etapa por etapa");

  const ejemplos = [
    "Entrevistar al dueño, mirar cómo se toma un pedido y contar cuántos se pierden por semana",
    "Registrar y seguir pedidos, sí. Controlar la bodega, no",
    "Un servidor, un computador para el mesón, ocho semanas y un responsable por tarea",
    "Que el cliente sepa cuándo está listo su pedido sin tener que llamar",
    "Programar el registro de pedidos y probarlo",
    "Instalarlo en el mesón y enseñarles a los vendedores a usarlo",
  ];
  // Linea de tiempo vertical en dos columnas: etapas 1-3 a la izquierda, 4-6 a la derecha.
  const colW = (CW - 0.4) / 2;
  ETAPAS.forEach((etapa, i) => {
    const col = Math.floor(i / 3);
    const row = i % 3;
    const x = M + col * (colW + 0.4);
    const y = 1.94 + row * 1.36;
    etapaChip(slide, x, y, 2.1, 1.16, etapa, 12.5);
    rect(slide, x + 2.1, y, colW - 2.1, 1.16, C.white);
    addText(slide, ejemplos[i], {
      x: x + 2.36,
      y: y + 0.1,
      w: colW - 2.56,
      h: 0.96,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    });
  });
  addFuente(slide, 6.2, "Las cifras de la ferretería son ilustrativas: muestran el tipo de dato que cada etapa necesita.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · El perfil de egreso dice lo mismo

function slidePerfilCiclo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · No es una invención del módulo", "El perfil de egreso describe ese mismo ciclo");

  addText(slide, "El perfil de egreso es lo que la carrera se compromete a que sepas hacer al titularte.", {
    x: M,
    y: 1.78,
    w: CW,
    h: 0.36,
    fontSize: 14.5,
    color: C.slate,
  });

  rect(slide, M, 2.3, CW, 2.0, C.white);
  rect(slide, M, 2.3, 0.08, 2.0, C.navy);
  addText(slide, "«…preparado/a para realizar el ciclo de desarrollo de software, incorporando en ello el análisis de requerimientos, diseño, construcción, pruebas e implementación de soluciones.»", {
    x: M + 0.42,
    y: 2.48,
    w: CW - 0.84,
    h: 1.2,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    italic: true,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });
  addText(slide, "Técnico de Nivel Superior en Programación y Análisis de Sistemas · perfil profesional de la malla de la carrera", {
    x: M + 0.42,
    y: 3.92,
    w: CW - 0.84,
    h: 0.26,
    fontSize: 10,
    bold: true,
    color: C.navy,
  });

  // Cada frase del perfil, bajo la etapa que le corresponde.
  const frases = [
    "", "análisis de requerimientos", "", "diseño", "construcción, pruebas", "implementación",
  ];
  const gapF = 0.08;
  const cwF = (CW - gapF * 5) / 6;
  frases.forEach((frase, i) => {
    if (!frase) return;
    addText(slide, `«${frase}»`, {
      x: M + i * (cwF + gapF),
      y: 4.62,
      w: cwF,
      h: 0.42,
      fontSize: 11.5,
      italic: true,
      bold: true,
      color: ETAPAS[i].color,
      align: "center",
      valign: "bottom",
    });
  });
  tiraEtapas(slide, M, 5.14, CW, 0.46, { fontSize: 10.5 });
  addText(slide, "Este módulo es el lugar donde ese ciclo se recorre completo, por primera vez, sobre un caso real.", {
    x: M,
    y: 5.84,
    w: CW,
    h: 0.36,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · Un proyecto se escribe para que alguien decida

function slideQuienDecide() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · La propuesta de proyecto", "Antes de construirse, un sistema se aprueba");

  // Al centro, quien decide; alrededor, las cuatro cosas que necesita entender.
  const cx = M + CW / 2;
  rect(slide, cx - 1.9, 3.12, 3.8, 1.5, C.navy);
  addText(slide, "Quien decide", { x: cx - 1.7, y: 3.24, w: 3.4, h: 0.36, fontSize: 16, bold: true, color: C.white, align: "center" });
  addText(slide, "El dueño de la ferretería, un jefe, un fondo público. No lee código.", {
    x: cx - 1.7,
    y: 3.64,
    w: 3.4,
    h: 0.86,
    fontSize: 12,
    color: C.softBlue,
    align: "center",
    lineSpacingMultiple: 1.1,
  });

  const cosas = [
    ["¿Qué problema hay?", M, 1.96],
    ["¿Qué se propone?", M + CW - 3.6, 1.96],
    ["¿Cuánto cuesta?", M, 4.66],
    ["¿Qué se gana?", M + CW - 3.6, 4.66],
  ];
  cosas.forEach(([t, x, y], i) => {
    rect(slide, x, y, 3.6, 0.92, C.white);
    rect(slide, x, y, 0.07, 0.92, C.red);
    addText(slide, t, { x: x + 0.3, y: y + 0.18, w: 3.1, h: 0.56, fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: C.ink, valign: "mid" });
    const derecha = x > cx;
    const ay = y + 0.46;
    if (derecha) rule(slide, cx + 1.92, ay < 3.6 ? 3.4 : 4.36, x - cx - 1.96, C.slate, 1.2);
    else rule(slide, x + 3.62, ay < 3.6 ? 3.4 : 4.36, cx - 1.92 - x - 3.66, C.slate, 1.2);
  });

  addTakeaway(slide, "El documento que responde esas cuatro preguntas se llama propuesta de proyecto.", { y: 6.06 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 y 14 · Cada parte de la propuesta registra una etapa

function slidePartes(tramo, titulo, partes) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque 1 · Las partes de la propuesta · ${tramo}`, titulo);

  const wParte = 3.2;
  const wResp = 3.9;
  const wEtapa = 2.0;
  const xResp = M + wParte + 0.16;
  const xEtapa = xResp + wResp + 0.16;
  const xEj = xEtapa + wEtapa + 0.16;
  const wEj = W - M - xEj;
  addKicker(slide, M, 1.86, "Parte", C.slate, wParte);
  addKicker(slide, xResp, 1.86, "Qué responde", C.slate, wResp);
  addKicker(slide, xEtapa, 1.86, "Etapa", C.slate, wEtapa);
  addKicker(slide, xEj, 1.86, "Ejemplo", C.slate, wEj);

  const h = partes.length > 4 ? 0.62 : 0.84;
  const gap = 0.1;
  partes.forEach(([parte, responde, etapaNombre, ejemplo], i) => {
    const y = 2.2 + i * (h + gap);
    const etapa = ETAPAS.find((e) => e.nombre === etapaNombre);
    rect(slide, M, y, wParte, h, C.white);
    rect(slide, M, y, 0.06, h, etapa.color);
    addText(slide, parte, { x: M + 0.22, y: y + 0.04, w: wParte - 0.34, h: h - 0.08, fontSize: 13.5, bold: true, color: C.ink, valign: "mid" });
    addText(slide, responde, { x: xResp, y: y + 0.04, w: wResp, h: h - 0.08, fontSize: 11.8, color: C.ink, valign: "mid", lineSpacingMultiple: 1.06 });
    etapaChip(slide, xEtapa, y + 0.08, wEtapa, h - 0.16, etapa, 10.5);
    addText(slide, ejemplo, { x: xEj, y: y + 0.04, w: wEj, h: h - 0.08, fontSize: 10.8, color: C.slate, valign: "mid", lineSpacingMultiple: 1.06 });
  });
  validateSlide(slide, pptx);
}

function slidePartesUno() {
  slidePartes("1 de 2", "Entender el problema y fijar el alcance", [
    ["Diagnóstico", "Cómo funciona hoy la organización y qué le falla, con datos", "Descubrimiento", "40 pedidos al día; 3 perdidos por semana"],
    ["Fundamentación", "Por qué vale la pena resolverlo", "Descubrimiento", "Cada pedido perdido es una venta perdida"],
    ["Definición y delimitación", "Qué parte del problema se resuelve y qué queda fuera", "Alcance", "Pedidos sí; bodega no"],
    ["Objetivos", "Qué tiene que lograr el sistema, de forma comprobable", "Alcance", "Registrar el 100 % de los pedidos del primer mes"],
    ["Impacto esperado", "Cómo se va a medir si sirvió", "Alcance", "Pedidos perdidos por semana: de 3 a 0"],
    ["Producto esperado", "Qué se va a construir concretamente", "Alcance", "Una aplicación web de pedidos"],
  ]);
}

function slidePartesDos() {
  slidePartes("2 de 2", "Planificar, diseñar y construir", [
    ["Recursos y presupuesto", "Qué se necesita y cuánto cuesta, con precios", "Planificación", "Servidor, computador y horas de trabajo"],
    ["Carta Gantt", "Qué se hace en cada semana", "Planificación", "Registro de pedidos en las semanas 6 y 7"],
    ["Organización", "Quién es responsable de cada actividad", "Planificación", "Una persona en entrevistas; otra en la base de datos"],
    ["Elevator Pitch", "El proyecto explicado en 90 segundos", "Planificación", "«Ayudamos a ferreterías de barrio a no perder ni una venta…»"],
    ["Lienzo Canvas", "El proyecto visto como negocio: a quién sirve, qué valor entrega, qué cuesta", "Diseño", "Para quién es y cuánto cuesta mantenerlo"],
    ["Cadena de valor", "Las actividades con que el equipo produce y entrega ese valor", "Construcción", "Programar y probar, instalar, capacitar"],
  ]);
}

// ---------------------------------------------------------------------------
// 15 · La regla que une al documento con el sistema

function slideRegla() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · La regla del módulo", "Lo que dice la propuesta tiene que verse en el sistema, y al revés");

  rect(slide, M, 1.98, 4.6, 1.2, C.navy);
  addText(slide, "Lo que dice la propuesta", { x: M + 0.3, y: 2.06, w: 4.0, h: 1.04, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.white, valign: "mid" });
  rect(slide, W - M - 4.6, 1.98, 4.6, 1.2, C.navy);
  addText(slide, "Lo que hace el sistema", { x: W - M - 4.3, y: 2.06, w: 4.0, h: 1.04, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.white, valign: "mid", align: "right" });
  arrow(slide, M + 4.76, 2.58, CW - 9.52, C.red, 3, true);
  addText(slide, "coherencia", { x: M + 4.76, y: 2.18, w: CW - 9.52, h: 0.3, fontSize: 12, bold: true, color: C.red, align: "center" });

  addKicker(slide, M, 3.5, "Tres formas de romperla, en la ferretería", C.red, 8);
  const rotas = [
    ["Un objetivo dice «avisar al cliente cuando su pedido esté listo»", "y el sistema no avisa a nadie."],
    ["El presupuesto no incluye el servidor", "y el sistema necesita uno para funcionar."],
    ["El sistema trae un módulo de bodega completo", "y la delimitación dejaba la bodega fuera."],
  ];
  const gap = 0.2;
  const w = (CW - gap * 2) / 3;
  rotas.forEach(([a, b], i) => {
    const x = M + i * (w + gap);
    rect(slide, x, 3.86, w, 1.74, C.white);
    rect(slide, x, 3.86, w, 0.06, C.red);
    addText(slide, "✗", { x: x + 0.2, y: 4.04, w: 0.4, h: 0.4, fontSize: 20, bold: true, color: C.red });
    addText(slide, a, { x: x + 0.64, y: 4.04, w: w - 0.84, h: 0.86, fontSize: 12.5, bold: true, color: C.ink, lineSpacingMultiple: 1.08 });
    addText(slide, b, { x: x + 0.64, y: 4.94, w: w - 0.84, h: 0.5, fontSize: 12, color: C.slate });
  });
  addTakeaway(slide, "Cada pieza puede estar bien hecha y el proyecto igual fallar: la pauta final evalúa la coherencia.", { y: 6.0 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 16 · Apertura del Bloque 2

function slideBloqueDos() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 3 · 25 minutos", C.gold, 5);
  addText(slide, "El recorrido de diez semanas", { x: M, y: 1.98, w: 11.4, h: 1.1, fontFace: TYPOGRAPHY.display, fontSize: 46, bold: true, color: C.white });
  rule(slide, M, 3.3, 4.2, C.red, 2.4);
  addText(slide, "Qué se entrega y cuándo, cuáles entregas llevan nota, con qué se revisa cada una y cómo es el examen final.", {
    x: M,
    y: 3.58,
    w: 10.4,
    h: 0.9,
    fontSize: 16,
    color: C.sand,
    lineSpacingMultiple: 1.2,
  });
  rutaBloques(slide, 2, 5.3);
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 17 · Como funcionan las entregas: avance, retroalimentacion, version con nota

function slideComoFunciona() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Las entregas", "Primero se mejora, después se califica");

  const pasos = [
    ["Avance", "Una parte de la entrega, adelantada", C.titleFill, "Sin nota"],
    ["Retroalimentación", "Comentarios concretos: qué está bien y qué mejorar", C.gold, "Evaluación formativa"],
    ["Versión completa", "Todas las partes, con las correcciones incorporadas", C.red, "Con nota · evaluación sumativa"],
  ];
  const w = 3.5;
  const gap = (CW - w * 3) / 2;
  pasos.forEach(([t, d, color, etiqueta], i) => {
    const x = M + i * (w + gap);
    rect(slide, x, 2.06, w, 2.0, C.white);
    rect(slide, x, 2.06, w, 0.08, color);
    addText(slide, t, { x: x + 0.28, y: 2.34, w: w - 0.5, h: 0.42, fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.ink });
    addText(slide, d, { x: x + 0.28, y: 2.86, w: w - 0.5, h: 0.7, fontSize: 13, color: C.slate, lineSpacingMultiple: 1.12 });
    addText(slide, etiqueta.toUpperCase(), { x: x + 0.28, y: 3.66, w: w - 0.5, h: 0.24, fontSize: 9.5, bold: true, color: color === C.gold ? C.ink : color, charSpacing: 1 });
    if (i < 2) arrow(slide, x + w + 0.12, 3.06, gap - 0.24, C.slate, 2);
  });

  const datos = [
    ["Equipos", "de hasta cinco integrantes"],
    ["Cada integrante", "sube una copia a su propia aula virtual"],
    ["Formato", "PDF, salvo que se indique otro"],
    ["Peso máximo", "30 MB por archivo; si pesa más, en ZIP"],
  ];
  const wd = (CW - 0.18 * 3) / 4;
  datos.forEach(([t, d], i) => {
    const x = M + i * (wd + 0.18);
    rect(slide, x, 4.5, wd, 1.2, C.softBlue);
    addText(slide, t, { x: x + 0.22, y: 4.62, w: wd - 0.4, h: 0.3, fontSize: 13, bold: true, color: C.navy });
    addText(slide, d, { x: x + 0.22, y: 4.96, w: wd - 0.4, h: 0.62, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.1 });
  });
  addTakeaway(slide, "La retroalimentación de un avance es la oportunidad de corregir antes de que cuente para la nota.", { y: 6.06 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 · El calendario sobre una linea de diez semanas

function slideCalendario() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · El calendario", "Ocho entregas en diez semanas");

  const x0 = M;
  const wSem = CW / 10;
  const yLinea = 3.5;
  for (let i = 0; i < 10; i++) {
    const x = x0 + i * wSem;
    rect(slide, x + 0.02, yLinea, wSem - 0.04, 0.34, i < 4 ? C.softBlue : C.softNeutral);
    addText(slide, `S${i + 1}`, { x: x + 0.06, y: yLinea + 0.05, w: wSem - 0.12, h: 0.24, fontSize: 10.5, bold: true, color: C.slate, align: "center" });
  }
  addText(slide, "UNIDAD 1", { x: x0, y: yLinea + 0.44, w: wSem * 4, h: 0.2, fontSize: 9, bold: true, color: C.titleFill, align: "center", charSpacing: 1.2 });
  addText(slide, "UNIDAD 2", { x: x0 + wSem * 4, y: yLinea + 0.44, w: wSem * 6, h: 0.2, fontSize: 9, bold: true, color: C.slate, align: "center", charSpacing: 1.2 });

  // [semana (1-10, con decimal para el dia), fecha, nombre, con nota, arriba]
  const hitos = [
    [2.9, "14 oct", "Entregable I · avance 1", false, true],
    [3.9, "21 oct", "Entregable I · avance 2", false, false],
    [4.5, "27 oct", "Elevator Pitch", false, true],
    [4.9, "28 oct", "Entregable I", true, false],
    [6.9, "11 nov", "Entregable II · avance 1", false, true],
    [8.9, "25 nov", "Entregable II", true, false],
    [9.9, "2 dic", "Portafolio", true, true],
    [10.9, "9 dic", "Examen final", true, false],
  ];
  hitos.forEach(([sem, fecha, nombre, nota, arriba]) => {
    const cx = x0 + (sem - 1) * wSem - 0.06;
    const color = nota ? C.red : C.titleFill;
    const wl = 1.1;
    const lx = Math.min(Math.max(cx - wl / 2, M), W - M - wl);
    if (arriba) {
      slide.addShape(SH.line, { x: cx, y: 2.86, w: 0, h: yLinea - 2.86, line: { color, pt: 1.4 } });
      rect(slide, lx, 1.96, wl, 0.9, nota ? C.red : C.white, nota ? C.red : C.border);
      addText(slide, fecha, { x: lx + 0.06, y: 2.02, w: wl - 0.12, h: 0.22, fontSize: 10.5, bold: true, color: nota ? C.white : color, align: "center" });
      addText(slide, nombre, { x: lx + 0.06, y: 2.26, w: wl - 0.12, h: 0.54, fontSize: 9.8, bold: true, color: nota ? C.white : C.ink, align: "center", valign: "mid" });
    } else {
      slide.addShape(SH.line, { x: cx, y: yLinea + 0.34, w: 0, h: 4.66 - yLinea - 0.34, line: { color, pt: 1.4 } });
      rect(slide, lx, 4.66, wl, 0.9, nota ? C.red : C.white, nota ? C.red : C.border);
      addText(slide, fecha, { x: lx + 0.06, y: 4.72, w: wl - 0.12, h: 0.22, fontSize: 10.5, bold: true, color: nota ? C.white : color, align: "center" });
      addText(slide, nombre, { x: lx + 0.06, y: 4.96, w: wl - 0.12, h: 0.54, fontSize: 9.8, bold: true, color: nota ? C.white : C.ink, align: "center", valign: "mid" });
    }
  });

  rect(slide, M, 5.86, 0.3, 0.22, C.red);
  addText(slide, "Lleva nota", { x: M + 0.4, y: 5.85, w: 1.6, h: 0.24, fontSize: 11, color: C.ink });
  rect(slide, M + 2.0, 5.86, 0.3, 0.22, C.white, C.border);
  addText(slide, "Recibe retroalimentación, sin nota", { x: M + 2.4, y: 5.85, w: 3.6, h: 0.24, fontSize: 11, color: C.ink });
  addText(slide, "Sin sesiones el lunes 12 de octubre ni el martes 8 de diciembre: son feriados.", { x: M + 6.2, y: 5.85, w: CW - 6.2, h: 0.24, fontSize: 11, color: C.slate, align: "right" });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · El Entregable I se arma en tres avances

function slideEntregableUno() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Entregable I", "Un documento de diez puntos, en tres avances");

  const avances = [
    ["Avance 1", "14 oct", ["1. Diagnóstico", "2. Fundamentación"], "Descubrimiento"],
    ["Avance 2", "21 oct", ["3. Definición y delimitación", "4. Objetivos", "5. Impacto esperado", "6. Producto esperado"], "Alcance"],
    ["Avance 3", "28 oct", ["7. Recursos y presupuesto", "8. Carta Gantt", "9. Organización", "10. Elevator Pitch"], "Planificación"],
  ];
  const w = (CW - 0.4) / 3;
  avances.forEach(([t, fecha, puntos, etapaNombre], i) => {
    const etapa = ETAPAS.find((e) => e.nombre === etapaNombre);
    const x = M + i * (w + 0.2);
    const y = 2.0 + (2 - i) * 0.34;
    const h = 3.6 - (2 - i) * 0.34;
    rect(slide, x, y, w, h, C.white);
    etapaChip(slide, x, y, w, 0.42, etapa, 11);
    addText(slide, t, { x: x + 0.26, y: y + 0.6, w: w - 1.8, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.ink });
    addText(slide, fecha, { x: x + w - 1.4, y: y + 0.66, w: 1.16, h: 0.3, fontSize: 12, bold: true, color: C.slate, align: "right" });
    puntos.forEach((pt, k) => {
      addText(slide, pt, { x: x + 0.26, y: y + 1.18 + k * 0.4, w: w - 0.5, h: 0.34, fontSize: 13, color: C.ink });
    });
  });
  addTakeaway(slide, "El avance 3 va con los avances 1 y 2 corregidos: esa versión completa es la nota de la Unidad 1.", { y: 6.02, fontSize: 13.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 · El Elevator Pitch

function slidePitch() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Martes 27 de octubre", "El proyecto en un viaje en ascensor");

  rect(slide, M, 1.96, 3.6, 3.9, C.navy);
  addText(slide, "90", { x: M, y: 2.2, w: 3.6, h: 1.6, fontFace: TYPOGRAPHY.display, fontSize: 96, bold: true, color: C.white, align: "center", valign: "mid" });
  addText(slide, "segundos como máximo", { x: M, y: 3.84, w: 3.6, h: 0.36, fontSize: 15, bold: true, color: C.gold, align: "center" });
  rule(slide, M + 1.2, 4.4, 1.2, C.red, 2.4);
  addText(slide, "Un pitch por proyecto, y exponen todos los integrantes.", { x: M + 0.3, y: 4.62, w: 3.0, h: 0.9, fontSize: 13, color: C.softBlue, align: "center", lineSpacingMultiple: 1.12 });

  const xg = M + 3.9;
  const wg = CW - 3.9;
  rect(slide, xg, 1.96, wg, 0.86, C.paleRed);
  addText(slide, "GANCHO", { x: xg + 0.26, y: 2.06, w: 2, h: 0.2, fontSize: 9.5, bold: true, color: C.red, charSpacing: 1.2 });
  addText(slide, "«¿Cuántas ventas pierde una ferretería por un cuaderno mal llenado?»", { x: xg + 0.26, y: 2.3, w: wg - 0.5, h: 0.4, fontSize: 14, italic: true, bold: true, color: C.ink });

  const guion = [
    ["Quiénes son", "Nombre, carrera y escuela"],
    ["A quién ayudan", "El público objetivo"],
    ["Su formación", "Experiencia y formación"],
    ["Qué aplican", "Herramientas o soluciones"],
    ["Con qué", "El producto o servicio"],
    ["Cómo contactarlos", "Teléfono, web, correo"],
  ];
  const wc = (wg - 0.2) / 2;
  guion.forEach(([t, d], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = xg + col * (wc + 0.2);
    const y = 3.0 + row * 0.98;
    rect(slide, x, y, wc, 0.84, C.white);
    addText(slide, String(i + 1), { x: x + 0.14, y: y + 0.14, w: 0.5, h: 0.56, fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.titleFill, align: "center", valign: "mid" });
    addText(slide, t, { x: x + 0.76, y: y + 0.12, w: wc - 0.9, h: 0.3, fontSize: 13.5, bold: true, color: C.ink });
    addText(slide, d, { x: x + 0.76, y: y + 0.44, w: wc - 0.9, h: 0.28, fontSize: 11.5, color: C.slate });
  });
  addFuente(slide, 6.12, "La pauta también evalúa el dominio, el manejo de la voz y una vestimenta acorde a la idea presentada.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · Entregable II y portafolio

function slideEntregableDosPortafolio() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Unidad 2 y cierre", "Del valor del proyecto a la entrega final");

  const wl = 5.2;
  rect(slide, M, 1.96, wl, 3.9, C.white);
  rect(slide, M, 1.96, wl, 0.08, C.success);
  addKicker(slide, M + 0.3, 2.2, "Entregable II · 11 y 25 de noviembre", C.success, wl - 0.5);
  const piezas = [
    ["Lienzo Canvas", "El proyecto como negocio, en nueve bloques"],
    ["Cadena de valor", "Las nueve actividades con que se produce y entrega el valor"],
    ["Avance del sistema", "Evidencia de lo que ya funciona"],
  ];
  piezas.forEach(([t, d], i) => {
    const y = 2.62 + i * 1.02;
    addText(slide, t, { x: M + 0.3, y, w: wl - 0.6, h: 0.34, fontSize: 15, bold: true, color: C.ink });
    addText(slide, d, { x: M + 0.3, y: y + 0.36, w: wl - 0.6, h: 0.5, fontSize: 12, color: C.slate });
  });

  arrow(slide, M + wl + 0.14, 3.9, 0.6, C.slate, 2);

  const xr = M + wl + 0.9;
  const wr = CW - wl - 0.9;
  rect(slide, xr, 1.96, wr, 3.9, C.navy);
  addKicker(slide, xr + 0.3, 2.2, "Portafolio · 2 de diciembre", C.gold, wr - 0.5);
  const carpetas = [
    ["El sistema", "y su evidencia: código, video funcionando, capturas, manual"],
    ["La propuesta completa", "Entregables I y II en su versión final, corregidos"],
    ["Las evidencias", "Entrevistas, encuestas, cotizaciones, matriz FODA"],
  ];
  carpetas.forEach(([t, d], i) => {
    const y = 2.62 + i * 0.86;
    rect(slide, xr + 0.3, y + 0.06, 0.06, 0.6, C.red);
    addText(slide, t, { x: xr + 0.52, y, w: wr - 0.8, h: 0.32, fontSize: 15, bold: true, color: C.white });
    addText(slide, d, { x: xr + 0.52, y: y + 0.34, w: wr - 0.8, h: 0.4, fontSize: 12, color: C.softBlue });
  });
  addText(slide, "Más tres cuestionarios obligatorios de la carrera, que cada estudiante responde junto con el portafolio.", {
    x: xr + 0.3,
    y: 5.22,
    w: wr - 0.6,
    h: 0.5,
    fontSize: 11.5,
    color: C.sand,
    lineSpacingMultiple: 1.1,
  });
  addTakeaway(slide, "El portafolio va una semana antes del examen: su retroalimentación sirve para preparar la presentación.", { y: 6.06, fontSize: 13.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · El examen final: dos partes

function slideExamen() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Miércoles 9 de diciembre", "El examen final tiene dos partes");

  addText(slide, "Se llama Evaluación Integrada de Especialidad: mide si desarrollaste las competencias del perfil de egreso de tu carrera.", {
    x: M,
    y: 1.86,
    w: CW,
    h: 0.4,
    fontSize: 14.5,
    color: C.slate,
  });

  const partes = [
    ["Parte 1", "La presentación del Resumen Ejecutivo", "La hace el equipo: el proyecto completo, expuesto en 15 minutos ante quien podría invertir en él.", C.red],
    ["Parte 2", "La escala de apreciación de competencias", "La completa el docente por cada estudiante: qué tan preparado está para aplicar cada competencia en un trabajo real.", C.navy],
  ];
  const w = (CW - 1.4) / 2;
  partes.forEach(([n, t, d, color], i) => {
    const x = M + i * (w + 1.4);
    rect(slide, x, 2.6, w, 2.7, C.white);
    rect(slide, x, 2.6, 0.08, 2.7, color);
    addKicker(slide, x + 0.34, 2.84, n, color, 2);
    addText(slide, t, { x: x + 0.34, y: 3.16, w: w - 0.6, h: 0.8, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.ink, lineSpacingMultiple: 1.05 });
    addText(slide, d, { x: x + 0.34, y: 4.06, w: w - 0.6, h: 1.0, fontSize: 13, color: C.slate, lineSpacingMultiple: 1.14 });
  });
  addText(slide, "½ + ½", { x: M + w, y: 3.5, w: 1.4, h: 0.7, fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.red, align: "center", valign: "mid" });

  addTakeaway(slide, "Quien repruebe la presentación la repite en el examen de recalificación, con las mejoras indicadas.", { y: 5.7, fill: C.softBlue, color: C.ink, fontSize: 13.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · El Resumen Ejecutivo: siete laminas y su tiempo

function slideResumenEjecutivo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · El Resumen Ejecutivo", "Siete láminas en 15 minutos");

  const laminas = [
    ["Portada", 0, "Nombre del proyecto"],
    ["Información general", 1, "Integrantes, carrera, sede, foto del equipo"],
    ["Desafío o necesidad", 2, "Con el objetivo general y los específicos"],
    ["Solución propuesta", 3, "Fundamentada en el diagnóstico, con el pitch y el Canvas"],
    ["Solución técnica", 6, "El sistema, con evidencia de que existe y funciona"],
    ["Conclusiones", 3, "Importancia, viabilidad y sostenibilidad"],
    ["Preguntas", 0, "Tres preguntas del docente"],
  ];
  const total = 15;
  const wFija = 1.0;
  const wVar = CW - wFija * 2 - 0.08 * 6;
  const anchos = laminas.map(([, min]) => (min === 0 ? wFija : (wVar * min) / total));
  const xs = anchos.map((_, i) => M + anchos.slice(0, i).reduce((a, b) => a + b + 0.08, 0));
  let x = M;
  laminas.forEach(([t, min, d], i) => {
    const w = anchos[i];
    const destacada = t === "Solución técnica";
    rect(slide, x, 2.1, w, 1.3, destacada ? C.red : min === 0 ? C.softNeutral : C.titleFill);
    addText(slide, String(i + 1), { x: x + 0.12, y: 2.18, w: 0.4, h: 0.3, fontSize: 12, bold: true, color: min === 0 ? C.slate : C.white });
    addText(slide, min === 0 ? "—" : `${min}'`, {
      x,
      y: 2.5,
      w,
      h: 0.7,
      fontFace: TYPOGRAPHY.display,
      fontSize: min >= 2 ? 26 : 20,
      bold: true,
      color: min === 0 ? C.slate : C.white,
      align: "center",
      valign: "mid",
    });
    const ty = i % 2 === 0 ? 3.62 : 4.72;
    rule(slide, x, ty - 0.08, Math.max(w, 0.6), destacada ? C.red : C.border, 1.4);
    const ultima = i === laminas.length - 1;
    const lx = ultima ? W - M - 1.8 : x;
    const lw = ultima ? 1.8 : Math.min(2.6, (i + 2 < xs.length ? xs[i + 2] : W - M) - x - 0.1);
    addText(slide, t, { x: lx, y: ty, w: lw, h: 0.3, fontSize: 12, bold: true, color: destacada ? C.red : C.ink, align: ultima ? "right" : "left" });
    addText(slide, d, { x: lx, y: ty + 0.32, w: lw, h: 0.6, fontSize: 11, color: C.slate, lineSpacingMultiple: 1.08, align: ultima ? "right" : "left" });
    x += w + 0.08;
  });
  addTakeaway(slide, "La lámina que más tiempo tiene es la del sistema: el software es la evidencia central del proyecto.", { y: 6.0, fontSize: 13.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24 · Las tres preguntas del examen, conocidas desde hoy

function slidePreguntasExamen() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.0, "Las tres preguntas del examen", C.gold, 6);
  addText(slide, "Se conocen desde hoy", { x: M, y: 1.38, w: 9, h: 0.7, fontFace: TYPOGRAPHY.display, fontSize: 34, bold: true, color: C.white });
  const preguntas = [
    ["¿Qué mejoras se le podrían hacer a la solución técnica?", "Con vocabulario técnico y con fundamento en las herramientas de la especialidad."],
    ["¿Qué aprendieron en todo el proceso del proyecto?", "Cómo se desarrolló, en la práctica, lo que el módulo se propone."],
    ["¿Por qué su propuesta es innovadora?", "Con al menos dos argumentos."],
  ];
  preguntas.forEach(([q, d], i) => {
    const y = 2.4 + i * 1.28;
    addText(slide, String(i + 1), { x: M, y, w: 0.8, h: 1.0, fontFace: TYPOGRAPHY.display, fontSize: 52, bold: true, color: C.red, valign: "mid" });
    addText(slide, q, { x: M + 1.0, y: y + 0.12, w: CW - 1.0, h: 0.46, fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.white });
    addText(slide, d, { x: M + 1.0, y: y + 0.6, w: CW - 1.0, h: 0.34, fontSize: 13.5, color: C.softBlue });
    if (i < 2) rule(slide, M + 1.0, y + 1.12, CW - 1.0, "2C4A66", 1);
  });
  addText(slide, "El docente puede dirigirlas al equipo completo o a un integrante en particular.", { x: M, y: 6.3, w: CW, h: 0.3, fontSize: 12.5, color: C.sand });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 25 · Como se revisa: niveles de la pauta y lo que se revisa siempre

function slidePautas() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Las pautas", "Cada entrega se revisa con una pauta");

  addText(slide, "Un indicador es un aspecto que se evalúa. Cada uno se ubica en uno de tres niveles:", { x: M, y: 1.84, w: CW, h: 0.34, fontSize: 14, color: C.slate });
  const niveles = [
    ["Avanzado", "86 – 100", C.success, 3.0],
    ["Adecuado", "60 – 85", C.gold, 2.3],
    ["En desarrollo", "1 – 59", C.red, 1.6],
  ];
  niveles.forEach(([t, r, color, h], i) => {
    const x = M + i * 1.9;
    const y = 2.4 + (3.0 - h);
    rect(slide, x, y, 1.7, h, color);
    addText(slide, r, { x, y: y + 0.18, w: 1.7, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: color === C.gold ? C.ink : C.white, align: "center" });
    addText(slide, t, { x, y: 5.5, w: 1.7, h: 0.3, fontSize: 12.5, bold: true, color: C.ink, align: "center" });
  });
  addText(slide, "puntos por indicador", { x: M, y: 5.84, w: 5.5, h: 0.26, fontSize: 11, color: C.slate, align: "center" });

  const xr = M + 6.2;
  const wr = CW - 6.2;
  addKicker(slide, xr, 2.4, "Lo que se revisa en todas las entregas", C.red, wr);
  const siempre = [
    ["El plazo", "Se entrega en la fecha o antes."],
    ["El formato oficial", "Se usa y se siguen sus instrucciones."],
    ["La redacción y la ortografía", "Permiten leer y entender el trabajo."],
    ["La sostenibilidad", "El proyecto puede seguir funcionando sin el equipo que lo creó."],
  ];
  siempre.forEach(([t, d], i) => {
    const y = 2.78 + i * 0.8;
    addText(slide, "✓", { x: xr, y: y + 0.02, w: 0.4, h: 0.4, fontSize: 18, bold: true, color: C.success });
    addText(slide, t, { x: xr + 0.46, y, w: wr - 0.46, h: 0.3, fontSize: 14, bold: true, color: C.ink });
    addText(slide, d, { x: xr + 0.46, y: y + 0.32, w: wr - 0.46, h: 0.34, fontSize: 12, color: C.slate });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 26 · Apertura del Bloque 3

function slideBloqueTres() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 3 · 45 minutos", C.gold, 5);
  addText(slide, "Con qué herramientas llegas", { x: M, y: 1.98, w: 11.4, h: 1.1, fontFace: TYPOGRAPHY.display, fontSize: 46, bold: true, color: C.white });
  rule(slide, M, 3.3, 4.2, C.red, 2.4);
  addText(slide, "El perfil de egreso de tu carrera, lo que te dejó cada asignatura, y para qué sirve saberlo: el desafío del proyecto.", {
    x: M,
    y: 3.58,
    w: 10.4,
    h: 0.9,
    fontSize: 16,
    color: C.sand,
    lineSpacingMultiple: 1.2,
  });
  rutaBloques(slide, 3, 5.3);
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · El perfil de egreso, leido como preguntas para el proyecto

function slidePerfilPreguntas() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · El perfil de egreso", "Cada frase del perfil, una pregunta");

  addText(slide, "El perfil de egreso es el criterio con que se evalúa el examen. Un proyecto que responde que sí a estas preguntas lo muestra.", {
    x: M,
    y: 1.84,
    w: CW,
    h: 0.5,
    fontSize: 14,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });
  const preguntas = [
    ["análisis de requerimientos", "¿Se analizó qué necesita la organización?", ETAPAS[1]],
    ["diseño", "¿Hay un diseño del sistema?", ETAPAS[3]],
    ["construcción, pruebas", "¿Se construyó y se probó?", ETAPAS[4]],
    ["implementación de soluciones", "¿Se instaló donde se va a usar?", ETAPAS[5]],
    ["soluciones informáticas seguras", "¿Protege los datos y el acceso?", { color: C.red }],
    ["requerimientos del cliente", "¿Responde a lo que pidió el cliente?", { color: C.gold }],
  ];
  const w = (CW - 0.2 * 2) / 3;
  preguntas.forEach(([frase, q, etapa], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * (w + 0.2);
    const y = 2.6 + row * 1.68;
    rect(slide, x, y, w, 1.5, C.white);
    rect(slide, x, y, w, 0.07, etapa.color);
    addText(slide, `«${frase}»`, { x: x + 0.24, y: y + 0.2, w: w - 0.44, h: 0.3, fontSize: 11.5, italic: true, bold: true, color: etapa.color === C.gold ? C.ink : etapa.color });
    addText(slide, q, { x: x + 0.24, y: y + 0.6, w: w - 0.44, h: 0.76, fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: C.ink, lineSpacingMultiple: 1.06 });
  });
  addFuente(slide, 6.12, "Frases del perfil profesional del Técnico de Nivel Superior en Programación y Análisis de Sistemas, malla de la carrera.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · De las asignaturas a las herramientas

function slideHerramientas() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · Lo que te dejó cada asignatura", "Tres semestres de herramientas");

  const semestres = [
    ["1.er semestre", [
      ["Fundamentos de Programación", "lógica y estructuras de datos"],
      ["Introducción a Requerimientos", "levantar requerimientos"],
      ["Bases de Datos Relacionales", "modelo relacional y SQL"],
    ]],
    ["2.º semestre", [
      ["Taller de Programación", "programas completos"],
      ["Taller de Bases de Datos", "una base de datos para un caso real"],
      ["Programación Segura", "validación y credenciales"],
      ["Metodologías de Desarrollo", "metodologías ágiles, historias de usuario"],
      ["Herramientas para la Innovación", "generar y evaluar ideas"],
      ["Herramientas de IA", "IA generativa en el trabajo"],
    ]],
    ["3.er semestre", [
      ["Taller de Aplicaciones para Internet", "aplicaciones web"],
      ["Modelamiento de Procesos", "mapas de proceso, BPMN"],
      ["Taller de Análisis de Sistemas", "casos de uso y diagramas de clases"],
      ["Certificado de Especialidad I", "servicios en la nube (AWS)"],
      ["Sostenibilidad Organizacional", "soluciones que se sostienen"],
    ]],
  ];
  const w = (CW - 0.3 * 2) / 3;
  semestres.forEach(([titulo, asignaturas], i) => {
    const x = M + i * (w + 0.3);
    rect(slide, x, 1.9, w, 0.44, [C.red, C.titleFill, C.success][i]);
    addText(slide, titulo, { x: x + 0.2, y: 1.94, w: w - 0.4, h: 0.36, fontSize: 13.5, bold: true, color: C.white, valign: "mid" });
    asignaturas.forEach(([a, h], k) => {
      const y = 2.44 + k * 0.62;
      rect(slide, x, y, w, 0.56, k % 2 === 0 ? C.white : C.warm);
      addText(slide, a, { x: x + 0.16, y: y + 0.04, w: w - 0.3, h: 0.24, fontSize: 11, bold: true, color: C.ink });
      addText(slide, h, { x: x + 0.16, y: y + 0.28, w: w - 0.3, h: 0.24, fontSize: 10.5, color: C.slate });
    });
  });
  addTakeaway(slide, "Es un punto de partida: súmale lo que sabes hacer por tu cuenta. Este semestre se agregan Móviles y Testing.", { y: 6.24, h: 0.54, fontSize: 13 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 29 · Que hace bueno a un desafio, venga de donde venga

function slideDesafio() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · El primer paso", "Qué hace bueno a un desafío");

  addText(slide, "El desafío es la necesidad real que va a resolver el proyecto. Venga de donde venga, un buen desafío cumple tres condiciones.", {
    x: M,
    y: 1.84,
    w: CW,
    h: 0.66,
    fontSize: 14,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  const condiciones = [
    ["Es una necesidad real de una organización", "Existe fuera de la sala y alguien la vive todos los días."],
    ["Se pueden reunir datos sobre ella", "Conversando con quienes la viven: entrevistas, encuestas, observación."],
    ["Deja ver las herramientas de la carrera", "Requerimientos, base de datos, una aplicación, pruebas."],
  ];
  condiciones.forEach(([t, d], i) => {
    const y = 2.8 + i * 0.9;
    rect(slide, M, y, 6.4, 0.76, C.white);
    addText(slide, "✓", { x: M + 0.18, y: y + 0.16, w: 0.44, h: 0.44, fontSize: 20, bold: true, color: C.success, align: "center", valign: "mid" });
    addText(slide, t, { x: M + 0.76, y: y + 0.08, w: 5.5, h: 0.3, fontSize: 14, bold: true, color: C.ink });
    addText(slide, d, { x: M + 0.76, y: y + 0.4, w: 5.5, h: 0.3, fontSize: 11.5, color: C.slate });
  });

  const xr = M + 6.8;
  const wr = CW - 6.8;
  rect(slide, xr, 2.8, wr, 1.24, C.paleRed);
  addText(slide, "No deja ver el perfil", { x: xr + 0.26, y: 2.9, w: wr - 0.5, h: 0.24, fontSize: 10, bold: true, color: C.red, charSpacing: 1 });
  addText(slide, "Un desafío que se resuelve con una planilla.", { x: xr + 0.26, y: 3.2, w: wr - 0.5, h: 0.7, fontSize: 15, bold: true, color: C.ink });
  rect(slide, xr, 4.2, wr, 1.24, C.successSoft);
  addText(slide, "Sí deja ver el perfil", { x: xr + 0.26, y: 4.3, w: wr - 0.5, h: 0.24, fontSize: 10, bold: true, color: C.success, charSpacing: 1 });
  addText(slide, "Uno que pide levantar requerimientos, diseñar una base de datos y construir una aplicación.", { x: xr + 0.26, y: 4.6, w: wr - 0.5, h: 0.74, fontSize: 13.5, bold: true, color: C.ink, lineSpacingMultiple: 1.06 });

  addTakeaway(slide, "El desafío es el punto de partida del diagnóstico, la primera parte de la propuesta.", { y: 6.0 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · Cierre

function slideCierre() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.0, "Cierre", C.gold, 4);
  addText(slide, "Tres ideas para llevarse", { x: M, y: 1.38, w: 9, h: 0.7, fontFace: TYPOGRAPHY.display, fontSize: 34, bold: true, color: C.white });
  const ideas = [
    ["Se construye un sistema para alguien real", "recorriendo el ciclo completo: del descubrimiento a la puesta en marcha."],
    ["La propuesta es ese mismo desarrollo escrito", "y lo que dice tiene que poder verse en el sistema."],
    ["Cada entrega se apoya en la anterior", "y el examen presenta el proyecto completo ante quien podría decidir hacerlo."],
  ];
  const w = (CW - 0.4) / 3;
  ideas.forEach(([t, d], i) => {
    const x = M + i * (w + 0.2);
    rect(slide, x, 2.4, w, 2.4, "1D3A57");
    rect(slide, x, 2.4, w, 0.07, [C.red, C.gold, C.success][i]);
    addText(slide, t, { x: x + 0.28, y: 2.62, w: w - 0.56, h: 1.2, fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: C.white, lineSpacingMultiple: 1.04 });
    addText(slide, d, { x: x + 0.28, y: 3.9, w: w - 0.56, h: 0.8, fontSize: 12.5, color: C.softBlue, lineSpacingMultiple: 1.1 });
  });
  tiraEtapas(slide, M, 5.2, CW, 0.42, { fontSize: 10.5, outline: C.softBlue });
  addText(slide, "Lo que sigue: definir el desafío de cada proyecto.", { x: M, y: 5.86, w: CW, h: 0.4, fontSize: 16, bold: true, color: C.gold, align: "center" });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------

slideCover();
slideObjetivo();
slideMapa();
slideDistinto();
slideCaso();
slideDiagnostico();
slideBloqueUno();
slideAlguienReal();
slideCiclo();
slideCicloFerreteria();
slidePerfilCiclo();
slideQuienDecide();
slidePartesUno();
slidePartesDos();
slideRegla();
slideBloqueDos();
slideComoFunciona();
slideCalendario();
slideEntregableUno();
slidePitch();
slideEntregableDosPortafolio();
slideExamen();
slideResumenEjecutivo();
slidePreguntasExamen();
slidePautas();
slideBloqueTres();
slidePerfilPreguntas();
slideHerramientas();
slideDesafio();
slideCierre();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
