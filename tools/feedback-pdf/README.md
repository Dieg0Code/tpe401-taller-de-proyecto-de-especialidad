# feedback-pdf

Genera el PDF de un feedback de evaluación desde su Markdown, con la maqueta que se usó en el módulo
anterior: puntaje total, nota y exigencia en la primera página, encabezado con curso, evaluación y
estudiante, y pie con el commit evaluado (si la entrega es un repositorio) y el número de página.

```bash
uv run --with reportlab python tools/feedback-pdf/generar_pdf.py \
  evaluaciones/parcial-1/<nombre>/feedback-eval-<nombre>.md \
  output/pdf/parcial-1/feedback-eval-<nombre>.pdf \
  --estudiante <Nombre> --evaluacion "Evaluación Parcial 1" [--commit <hash>]
```

El Markdown sigue la forma de `plantilla-feedback.md`. La sección «Resultado final» tiene que
incluir la tabla de puntajes y las líneas `- **Nota:**` y `- **Exigencia:**`: de ahí sale el
resumen de la primera página.

Después de generarlo, revisar cada página como imagen antes de enviarlo:

```bash
uv run --with pymupdf python -c "import pymupdf; [p.get_pixmap(dpi=80).save(f'p{i+1}.png') for i, p in enumerate(pymupdf.open('<archivo>.pdf'))]"
```
