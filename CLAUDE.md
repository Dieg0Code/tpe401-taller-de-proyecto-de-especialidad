# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este repo usa la guía de agentes en **`AGENTS.md`**: es lo primero que se debe leer. Las
convenciones del framework están en `docs/estandares.md` y `docs/audiencias.md`, las reglas del
docente en `docs/criterios-docentes.md`, y las skills en `.agent/skills/` (`clase-design`,
`slides-aiep`, `infografias-aiep`, `evaluacion-design`, `cohort-comms`, `reuniones-vcm`).

Este archivo no repite esas guías: agrega lo operativo que solo se descubre trabajando. Viene de
lo aprendido en el módulo anterior (PRO402, mismo framework).

## Qué es este repo

No es una aplicación: es el material de un módulo docente de AIEP, y su código existe para
**generar artefactos**. La unidad de trabajo es la carpeta-clase (`clases/semana-NN/NN/`), que
contiene su `README.md`, su deck en `ppt/` y los complementos `infografia/` y `podcast/`.

> **El `.pptx` es un artefacto, no una fuente.** Se regenera entero desde `ppt/source/<Deck>.js`.
> Nunca se edita el `.pptx`; se edita el `.js` y se vuelve a generar.

Jerarquía de verdad, que decide qué gana cuando dos documentos se contradicen:

```
docs/  >  cronograma/README.md  >  clases/.../README.md  >  el deck
```

## Comandos

Instalar las dependencias del sistema de slides (una vez):

```bash
cd tools/slides-system && npm ci
```

Generar un deck (escribe el `.pptx` en la carpeta `ppt/` de su clase):

```bash
node clases/semana-01/01/ppt/source/Clase-01-<Tema>.js
```

Validar la integridad estructural del `.pptx`, obligatorio antes de cerrarlo:

```bash
dotnet run --project tools/pptx-validator -- <archivo>.pptx
```

(`docs/estandares.md` §7 dice `packages/pptx-validator`; en este repo la ruta real es `tools/`.)

Revisar el render, que es donde aparecen los errores que ningún validador ve:

```bash
soffice --headless --convert-to pdf <archivo>.pptx --outdir <dir>
```

…y **leer las páginas del PDF como imágenes**. Sin este paso no se cierra un deck.

Tocar `tools/slides-system` (TypeScript, `src/` compila a `dist/`) obliga a su propia suite:

```bash
cd tools/slides-system
npm run test:all        # typecheck + build + vitest + mojibake/cspell
npm run test -- <patrón> # un solo test con vitest
npm run build           # solo si se modificó src/ y el deck consume dist/
```

Generar el PDF de un feedback de evaluación:

```bash
uv run --with reportlab python tools/feedback-pdf/generar_pdf.py <feedback.md> <salida.pdf> \
  --estudiante <Nombre> --evaluacion "Evaluación Parcial 1" [--commit <hash>]
```

## Convenciones de carpetas

- `clases/semana-NN/01` es la primera sesión de esa semana, `02` la segunda y así sucesivamente.
  La fecha de una clase sale de su carpeta y del cronograma.
- El número `NN` del nombre del deck (`Clase-NN-...`) es el número global de clase del módulo, no
  el de la semana.

## Escribir un deck

El fuente se construye sobre `tools/slides-system`, nunca a mano. Detalles que cuestan tiempo si no
se saben de antemano:

- **`addCodePanel(slide, SH, opts)` y `addTerminalPanel(slide, SH, opts)`** reciben `SH`
  (`pptx.ShapeType`) como segundo argumento posicional. Pasarles solo `(slide, opts)` falla con
  «Missing/Invalid shape parameter».
- **`addCodePanel` colorea con `opts.lang || "html"`**: sin declarar `lang: "python"` (o el que
  corresponda) el panel sale monocromo.
- **Esos paneles dibujan una barra de título dentro**, así que recortan la última línea si la
  altura se calcula solo por cantidad de líneas. La fórmula derivada del componente es
  `0.82 + líneas × (cuerpo / 72 × 1.26) + 0.08`; como piso seguro, `0.86 + líneas × 0.22` a cuerpo
  9,6–10,4. La línea que se pierde es siempre la que importa (el `assert`, el `return`).
- **Ningún validador detecta ese recorte.** `validateSlide` encuentra solapes y desbordes; el
  validador .NET encuentra XML corrupto. El recorte solo aparece en el render.
- `validateSlide` marca como severo el texto centrado que cubre **exactamente** su rectángulo de
  fondo: las pastillas necesitan margen interno, como hace `addTakeaway`.
- Si un panel de código se arma a mano con `makeCodeSvgData`: el SVG impone un alto mínimo de
  80 px (1/3 de pulgada), así que una línea en una caja más baja se ve diminuta; y `charW 0.55`
  subestima el ancho real de Consolas, así que hay que dejar ~5 % de holgura en el ancho.
- **Color siempre desde `TOKENS`**, nunca un hex suelto. En la práctica el token `guide`
  (`96A3B2`) no se usa: es un gris frío sobre papel cálido y proyectado parece un color que falló.
- El lienzo es 13.333 × 7.5 pulgadas; el margen del módulo es `M = 0.72`.
- Cada lámina termina en `validateSlide(slide, pptx)`.
- Si un patrón se repite entre decks, se migra a `slides-system`; no se copia local.

**Al parchear un `.js` de deck, usar un script de Python (`pathlib` + `str.replace` con `assert`),
no un heredoc de bash.** Los `\n` dentro de las cadenas JS se convierten en saltos literales y
rompen el archivo con `SyntaxError: Invalid or unexpected token`.

## Evaluaciones

- Material nominal (clones de repos de estudiantes, hojas de defensa, feedback, notas) en
  `evaluaciones/<evaluacion>/<nombre>/`, y los PDF en `output/pdf/<evaluacion>/`. Ambas carpetas
  están en `.gitignore`.
- Para revisar el repositorio de un estudiante: clonarlo, fijar el commit evaluado, ejecutar lo que
  su README promete (tres veces si son pruebas) y verificar cada evidencia que afirma.
- Si el docente es colaborador del repositorio y la evaluación incluye un defecto en vivo, se abre
  en una rama con un solo cambio y un título neutro, se observa el pipeline con el estudiante
  presente y, al terminar, el `pull request` se cierra sin fusionar y la rama se borra.
- En Windows, leer `.docx` y `.pdf` con `uv run --with python-docx` / `--with pymupdf`, usando la
  ruta de Windows y `PYTHONIOENCODING=utf-8`; las rutas `/c/...` de Git Bash no las encuentra Python.

## Cosas que sorprenden

- **Las rúbricas están en `.gitignore`** (`**/rubrica_eval_*.md`): son instrumento interno y no se
  distribuyen. Las instrucciones de evaluación sí se versionan.
- Los previews de render (`**/ppt/rendered*/`) también están ignorados: son regenerables.
- `tools/pbip-validator` es para Power BI y no participa del flujo de clases.
- El material de cara al estudiante (`README.md` de una clase, deck, cronograma) **no lleva rutas
  del repo, notas al docente ni comentarios meta**. Los ejercicios viven en el README, nunca en el
  deck.
