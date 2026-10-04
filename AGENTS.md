# Guía para agentes — tpe401-taller-de-proyecto-de-especialidad

Módulo de clases de AIEP. Aquí se produce material docente (contenido, decks, infografías,
evaluaciones, comunicación) con las skills instaladas en `.agent/skills/`. El idioma es español
neutro, con tildes y ñ.

## El módulo

TPE401 · Taller de Proyecto de Especialidad (Ingeniería de Ejecución en Informática mención
Desarrollo de Sistemas / Técnico en Programación y Análisis de Sistemas), semestre IV. Fuente
oficial en `docs/`:

- `TPE401-PL- PEV PED-2025-2.docx`: planificación lectiva, 90 horas en 10 semanas.
  - **Unidad 1, «Generación de un Proyecto de Especialidad Innovador»** (36 h): necesidades del
    entorno, Design Thinking, objetivos SMART, problemática, factibilidad e impacto, recursos,
    presupuesto, financiamiento, cronograma, hitos y pitch.
  - **Unidad 2, «Propuesta de Valor»** (54 h): Canvas, propuesta de valor y diferenciador, plan
    integral, cadena de valor, insumos y recursos, hitos de control, plan de socialización, formas
    de comunicación e implementación.
  - **Cierre:** examen final obligatorio, la Evaluación Integrada de Especialidad (EIE), que
    consiste en presentar el resumen ejecutivo del proyecto. El examen de recalificación repite esa
    presentación con las mejoras indicadas.
- `TPE401-OD-...pdf`: orientaciones disciplinares. La estrategia es Aprendizaje Basado en Proyectos,
  con problemáticas reales (sistemas de información, automatización, web con base de datos,
  datos sensibles, mejora de sistemas existentes). Los productos esperados son historias de
  usuario, diagramas de arquitectura, código comentado, pruebas funcionales, informes de
  implementación y presentaciones.

Los instrumentos oficiales del aula virtual también están en `docs/`: la Ficha de Actividad N.º 1
(primera clase y elección del desafío), la plantilla «Entregable Parte I», el Anexo Carta Gantt, los
instructivos (Elevator Pitch, Canvas y cadena de valor, Entregable II, Portafolio, Resumen
Ejecutivo), los formatos (Canvas, cadena de valor, pitch, Resumen Ejecutivo) y las cinco pautas de
revisión. **Son guías: el docente puede maniobrar sobre ellos**, pero el material propio no los
contradice sin que él lo decida. Donde la planificación y los instrumentos difieren, mandan los
instrumentos, porque con ellos se evalúa. Ejemplos ya resueltos:

- Los objetivos son **1 general y 2 específicos** (plantilla y pauta), no 2 y 4 como dice la
  planificación.
- El **Resumen Ejecutivo es solo la presentación del examen** (7 láminas, 15 minutos). El documento
  que se construye todo el módulo es la **propuesta de proyecto**: el Entregable I (Word de 10
  puntos en tres avances), el Entregable II (Canvas, cadena de valor de Porter y avance del producto)
  y el portafolio que los reúne con el producto y sus evidencias.
- La pauta del Entregable II solo califica el Canvas y la cadena de valor; el avance del producto se
  sube pero no tiene indicador propio.

Es un ramo de proyecto, no de temario técnico, y el proyecto **es un software** (decisión del
docente; los instrumentos admiten prototipos como producto). El módulo recorre el ciclo de desarrollo
completo sobre un sistema para una organización real, y la propuesta no es un documento aparte del
software: cada parte documenta una etapa del mismo desarrollo (diagnóstico = descubrimiento,
delimitación = alcance, objetivos = lo que el software debe lograr, producto esperado = el sistema,
carta Gantt = las etapas del desarrollo, Canvas = el valor del producto, cadena de valor = cómo el
equipo produce y entrega ese valor). Nunca tratarlos como líneas paralelas. La etapa de cada semana
está en `cronograma/README.md`.

Material de cara al estudiante fuera de las clases:

- `cronograma/README.md`: el calendario (información general, enfoque, planificación por semana) y
  la tabla de entregas con su fecha y **qué debe contener cada una**. No lleva definiciones de
  conceptos: los términos en negrita remiten al vocabulario.
- `guias/propuesta-de-proyecto.md`: cada parte de la propuesta (qué responde, extensión, etapa del
  desarrollo), las nueve actividades de la cadena de valor, el portafolio y el formato del Resumen
  Ejecutivo.
- `guias/evaluacion.md`: avances, pautas e indicadores de cada entrega y el examen final.
- `guias/vocabulario.md`: los términos, en orden de aparición.

Todos usan el mismo ejemplo conductor: una ferretería de Osorno con pedidos por WhatsApp en un
cuaderno.

Cada documento cumple una sola función; no mezclar calendario, conceptos y evaluación en el mismo
archivo.

## Antes de producir cualquier cosa

1. **Declarar la audiencia** y leer `docs/audiencias.md`. El registro cambia: a los alumnos
   técnicos se les habla con código y jerga; a directiva, otros docentes o externos, claro y sin
   tecnicismo.
2. Respetar la **jerarquía de verdad**: `docs/` (oficial AIEP) > `cronograma/README.md` >
   `clases/.../README.md` > el deck. El deck DERIVA del README; no inventa otra versión.
3. Leer `docs/estandares.md` para nombres, estructura de la carpeta-unidad, idioma/tono y el flujo
   de validación.
4. Leer `docs/criterios-docentes.md`: las reglas de contenido, decks y evaluación que el docente
   fijó corrigiendo material real. Tienen prioridad sobre los defaults de las skills.

## Las skills (`.agent/skills/`)

- `clase-design` — estructurar y redactar la unidad (README, bloques, ejercicios, cierre).
- `slides-aiep` — identidad visual del deck (paleta, logo, densidad según audiencia). Leer su
  `SKILL.md` y `references/slide-patterns.md` **antes** de componer, no después.
- `infografias-aiep` — infografías estilo AIEP con GPT Image (brief + revisión; sin API).
- `evaluacion-design` — evaluaciones y rúbricas.
- `cohort-comms` — mensajes a la cohorte (WhatsApp).
- `reuniones-vcm` — decks de Vinculación con el Medio, útil si un proyecto involucra a una
  organización externa.

## Tooling (`tools/`)

- `slides-system` — tema + componentes PptxGenJS. Construir los decks reutilizándolo, no a mano.
- `pptx-validator` (.NET) — integridad del `.pptx`. Antes de cerrar un deck:
  `dotnet run --project tools/pptx-validator -- archivo.pptx`.
- `feedback-pdf` — genera el PDF de feedback de una evaluación desde su Markdown (ver su README).

## Densidad pedagógica y uso del espacio

- En materiales visuales, cada zona relevante del lienzo debe cumplir una función pedagógica:
  jerarquizar, relacionar, ejemplificar, orientar la atención o facilitar una explicación.
- No dejar grandes áreas vacías por resolver una diapositiva con una lista o dos cajas flotantes si
  ese espacio puede mostrar conexiones, contrastes, pasos, evidencia o una síntesis útil.
- Aprovechar el espacio no significa rellenarlo ni reducir márgenes. El aire también es funcional
  cuando mejora el foco y la lectura; la meta es evitar tanto el vacío accidental como la saturación.
- Antes de cerrar una pieza, preguntar: **¿el espacio disponible está ayudando a enseñar o solo está
  quedando sin usar?**

## Modalidad pedagógica y función del README

- **Este ramo es práctico, no expositivo.** Es la antesala de la práctica y la titulación: cada
  sesión es un taller en que los grupos avanzan su proyecto, y el docente asesora. La exposición se
  limita a un encuadre breve de lo que hay que producir ese día y de cómo hacerlo. A diferencia de
  los módulos anteriores, no se planifica una clase como un deck que se dicta.
- El trabajo es **en grupos de proyecto**, según la planificación oficial. Cada avance se desarrolla
  en grupo y lo sube cada integrante.
- El `README.md` de una clase es la fuente conceptual y pedagógica desde la que se deriva el deck:
  debe contener explicaciones, ejemplos, ejercicios, preguntas, pistas y evidencias esperadas.
- No redactar el `README.md` como guion privado de facilitación. Evitar coreografías del docente,
  instrucciones de manejo de la sala, decisiones internas de producción y comentarios meta.
- Sí incluir duración, horarios y ritmos sugeridos cuando ayuden al estudiante a anticipar el
  recorrido, administrar su trabajo o comprender qué se espera durante la sesión.
- El `README.md` es material de cara al estudiante: no incluir notas internas para el docente,
  rutas del repositorio ni referencias al andamiaje usado para producir la clase.

## Marca AIEP en presentaciones

- Mantener el logo AIEP completo en todas las diapositivas.
- Sobre fondos claros, usar el logo institucional a color con transparencia.
- Sobre fondos oscuros, usar la variante transparente con símbolo rojo y letras/bajada blancas;
  no resolver el contraste encerrando el logo en una caja o placa blanca.

## Código y microalineación en presentaciones

- El código es contenido principal: las funciones relevantes deben verse completas, incluido su
  `return`, con sintaxis legible y sin recortes de líneas esenciales.
- Las anotaciones deben señalar tokens o líneas precisas y conectarse por pasillos externos, sin
  tapar ni atravesar el código.
- Todo texto o número dentro de un círculo debe usar la misma caja de la figura, centrado horizontal
  y verticalmente; revisar también su centrado óptico en el render.

## Flujo típico de una unidad

`cronograma` → `README.md` de la unidad → `ppt/` (deck) → validar → `infografia/` + `podcast/`.
No cerrar un deck con overflow, mojibake o si PowerPoint intenta repararlo.
