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

La planificación remite a instructivos, formatos y pautas del aula virtual (Ficha de Actividad
N.º 1, instructivos del Entregable I, del Elevator Pitch, del Canvas y la cadena de valor, del
Portafolio y del Resumen Ejecutivo). Al inicio del módulo esa aula todavía no está disponible, así
que las guías y plantillas propias se derivan **solo de lo que dice la planificación**: cada parte
del Resumen Ejecutivo con los elementos que ahí se enumeran (por ejemplo, 2 objetivos generales y 4
específicos). Cuando lleguen los documentos oficiales, van a `docs/`, mandan sobre lo propio, y lo
propio se ajusta a ellos.

Es un ramo de proyecto, no de temario técnico, y el proyecto **es un software**. El módulo recorre el
ciclo de desarrollo completo (descubrimiento, análisis, requerimientos, planificación, diseño,
construcción, puesta en marcha) sobre un sistema para una organización real. El Resumen Ejecutivo
no es un documento aparte del software: cada una de sus seis partes documenta una fase del mismo
desarrollo (el diagnóstico es el levantamiento; los objetivos son lo que el software debe lograr;
la carta Gantt son las iteraciones; el Canvas es el valor del producto; la cadena de valor es el
proceso que lo construye y lo entrega; la socialización es la puesta en marcha). Nunca tratarlos
como líneas paralelas. La fase de cada semana está en `cronograma/README.md`.

Material de cara al estudiante fuera de las clases:

- `cronograma/README.md`: solo el calendario (información general, enfoque, fechas de entrega y
  planificación por semana). No lleva explicaciones de conceptos ni detalle de evaluación.
- `guias/resumen-ejecutivo.md`, `guias/evaluacion.md` y `guias/vocabulario.md`: qué es el Resumen
  Ejecutivo y sus seis partes, cómo se evalúa cada entrega, y el vocabulario del módulo. Todos usan
  el mismo ejemplo conductor (una ferretería de Osorno con pedidos por WhatsApp en un cuaderno).

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
