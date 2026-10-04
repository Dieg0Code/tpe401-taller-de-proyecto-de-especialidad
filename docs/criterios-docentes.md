# Criterios docentes

Reglas que el docente fijó corrigiendo material real del módulo PRO402 (agosto–septiembre de 2026).
No son preferencias de estilo: cada una salió de un error concreto que se vio en clase o en una
revisión. Valen para todo el material de este módulo y tienen prioridad sobre los defaults de las
skills. Las reglas internas de coordinación y de corrección están en
`docs/interno_criterios-docentes.md`, que no se versiona.

PRO402 era un ramo expositivo y TPE401 es un taller de proyecto, así que las reglas de la sección 1
aplican a los decks que sí existan, que aquí son breves: un encuadre al inicio de cada sesión.
Las reglas de claridad (secciones 2 a 6) valen igual para las guías de taller y para los
instructivos, que en este ramo son el material principal.

---

## 1. El deck es la clase

- El docente **lee el README en voz alta mientras proyecta el deck**. El deck no es un resumen del
  README: dice lo mismo **con menos texto y más lenguaje visual**. Tampoco el extremo contrario:
  láminas vacías que no enseñan nada.
- **Los estudiantes vuelven a ver el deck después, solos.** Tiene que ser autosuficiente:
  - Ninguna lámina se refiere a algo que no esté explicado en el propio deck. Prohibido «lo que
    pasó el martes» o «el hallazgo de la clase anterior»: se nombra la cosa, no la fecha ni la
    sesión.
  - Todo lo que aparece en una lámina se explica, aunque sea una fila de una tabla o un dato
    suelto.
- **El deck cuenta el procedimiento.** No presenta resultados de una preparación (una exploración,
  un agente, unas mediciones) como si los estudiantes la hubieran vivido. Cada bloque dice qué se
  quería averiguar, qué se hizo, con qué herramienta, en qué orden y qué salió. Un agente o una
  herramienta se presenta la primera vez que aparece: qué es, qué se le pidió y con qué permisos.
- **Voz impersonal.** Nada de «le pedimos a un agente» o «apliquemos»: «a un agente se le pidió»,
  «ahora se aplica». La primera persona solo aparece dentro de una cita textual. Los imperativos
  dirigidos al estudiante sí valen («mira», «piensa»).
- **Los ejercicios van en el README, nunca en el deck.** Proyectar un ejercicio lo convierte en
  lectura en pantalla en vez de trabajo.

## 2. Nada ambiguo

- Definir **cada término, cada símbolo y cada valor literal** antes de que aparezca haciendo
  trabajo. Los tres huecos típicos: términos usados como sinónimos que no lo son, notación dada por
  sabida (`<` contra `<=`) y valores literales sin significado.
- Si la definición está en el README de otra clase, no cuenta: hay que traerla.
- El orden que funciona es mostrar la cosa primero y nombrarla después.
- La revisión se hace como alguien que no sabe nada. El docente tiene el contexto completo y
  rellena los huecos sin darse cuenta: «si no lo puedo leer y entender yo de una, menos ellos».
- **Enseñar, no mostrar.** Si algo solo apareció en un ejemplo, sin explicar qué es cada parte,
  cuenta como no enseñado. Y nada se evalúa sin haberse enseñado antes.
- Todo código que aparezca en una lámina tiene que poder leerlo una persona: nada elidido,
  abreviado ni recortado. Si una notación críptica es inevitable, se explica en la misma lámina.

## 3. Preguntas guía y respuestas

- **Tres preguntas guía por bloque**, cada una con una **pista** que orienta hacia dónde mirar sin
  dar la respuesta.
- Las preguntas se responden **solo con lo que está proyectado**: se asume que los estudiantes no
  leyeron el README.
- Cada bloque cierra con un **par**: la lámina de preguntas y, justo después, la de respuestas. Esa
  segunda lámina comparte estructura con la primera (mismo número, color y orden por fila, sobre
  fondo blanco). Cada fila tiene la etiqueta de lo que se preguntaba, la respuesta en negrita y una
  línea rotulada **LO QUE REVELA**, que dice algo que el bloque no dijo con esas palabras. El título
  es «Lo que tenía que aparecer en tu respuesta», no «la respuesta correcta».

## 4. Composición visual

- La composición se elige según la **función de la idea**: comparar, secuenciar, contener, medir,
  abrir o cerrar. Una contención se dibuja con cajas anidadas; una secuencia, con dirección; una
  cifra, como cifra grande.
- Errores que ya se cometieron: resolver casi todas las láminas con dos o tres cajas de texto
  corrido, y repetir el mismo esqueleto cambiando solo el texto. Si una lámina se puede intercambiar
  con otra de otra clase cambiando solo el texto, el diseño quedó genérico.
- **Identidad visual por clase.** La paleta, el logo, la tipografía y los componentes no se tocan.
  Lo que cambia en cada clase es la composición de los divisores, el dispositivo visual recurrente y
  la lámina tipo, que salen de la idea central de esa clase. Nunca arrancar copiando el deck
  anterior.
- **Citas en otro idioma: traducidas** en la lámina, con el sello «traducción del original en
  inglés» en la fuente. Los literales en el idioma original se quedan en el README. Solo queda en
  inglés lo que se entiende peor traducido: términos técnicos consagrados e identificadores de
  código.
- **Nada de gris apagado** para texto que hay que leer: un neutro claro en cursiva y a cuerpo chico
  es ilegible proyectado. Para restarle énfasis a algo, se destaca lo otro.

## 5. Contenido con fuente

- El fundamento clásico de cada tema primero, completo y bien enseñado.
- Toda cifra o afirmación heredada se **audita hasta su fuente primaria**. Si está recortada, mal
  citada o no tiene datos, se muestra el rastro y se deja un argumento que no dependa de ella.
- Lo que cambia con los agentes de IA se **deriva** del fundamento, no se pega como apéndice.
- Las discusiones abiertas se presentan abiertas, con las dos posiciones y los límites de su
  evidencia.
- Toda demostración se ejecuta y se cita su salida literal. Nada se afirma de memoria. Antes de
  afirmar que algo no existe (una versión, una función), se verifica en la fuente, no en una
  herramienta local que puede estar desactualizada.

## 6. Audiencias y documentos

- `cronograma/README.md` también es **de cara al estudiante**: no lleva contexto interno (horas
  adeudadas, recuperaciones, motivos de ausencia). Cada sesión se nombra por su contenido.

## 7. Evaluaciones y corrección

- Las evaluaciones parciales se pueden desarrollar al ritmo del estudiante, con una **fecha de
  corte** como forzante, sin ocupar sesiones de aula. Un día de entrega se trata como sesión de
  contenido disponible.
- **No agregar requisitos ni compromisos** que no estén en lo que ya se envió a los estudiantes. Lo
  publicado manda.
- Toda parte oral (defensa, presentación) tiene un **respaldo escrito** que el estudiante entrega
  antes, para contrastar lo dicho con lo escrito.
- **Escala de la rúbrica:** Excelente 100 %, Logrado 60 %, Insuficiente 20 %, No entregado 0 %.
  Nota chilena con 60 % de exigencia.
- **Formato del feedback:** el puntaje, la nota y la exigencia van en la primera página. Después,
  la evaluación general, la reproducción de lo revisado, el desglose por criterio (evidencia,
  decisión y qué falta para el nivel siguiente), el resultado, las fortalezas, los aspectos a
  mejorar y el cierre. Sin comentarios meta. El PDF se genera con `tools/feedback-pdf` y se revisa
  página por página antes de enviarlo.
- El material nominal de corrección (nombres, repositorios, notas, hojas de defensa) vive en
  `evaluaciones/` y `output/`, que **nunca van a git**. Las rúbricas tampoco se versionan
  (`rubrica_eval_*.md`); las instrucciones sí.
- Antes de una defensa: una hoja interna por estudiante, que contraste lo escrito con lo
  entregado, con las preguntas ya adaptadas a su proyecto.
- Toda evidencia que afirme el estudiante (una medición, una prueba, un commit) se verifica en el
  repositorio: los resultados documentados sin la prueba que los produce no cuentan como evidencia.
