"""Genera el PDF de un feedback de evaluación desde su Markdown (formato AIEP)."""

from __future__ import annotations

import argparse
import html
import re
import textwrap
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


RED = colors.HexColor("#D71920")
DARK = colors.HexColor("#202833")
SLATE = colors.HexColor("#4B5563")
LIGHT = colors.HexColor("#F3F4F6")
PALE_RED = colors.HexColor("#FFF1F2")
GRID = colors.HexColor("#D1D5DB")
WHITE = colors.white


def register_fonts() -> tuple[str, str]:
    candidates = [
        (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf")),
        (Path("C:/Windows/Fonts/calibri.ttf"), Path("C:/Windows/Fonts/calibrib.ttf")),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("EvalRegular", str(regular)))
            pdfmetrics.registerFont(TTFont("EvalBold", str(bold)))
            return "EvalRegular", "EvalBold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()
COURSE = "TPE401"
BASE = getSampleStyleSheet()


class EvaluationPageTemplate(PageTemplate):
    def __init__(self, *args, overlay, **kwargs):
        super().__init__(*args, **kwargs)
        self._overlay = overlay

    def afterDrawPage(self, canvas, doc) -> None:
        self._overlay(canvas, doc)


def styles() -> dict[str, ParagraphStyle]:
    body = ParagraphStyle(
        "EvalBody",
        parent=BASE["BodyText"],
        fontName=FONT,
        fontSize=8.6,
        leading=11.8,
        textColor=DARK,
        spaceAfter=2.1 * mm,
    )
    return {
        "title": ParagraphStyle(
            "EvalTitle",
            parent=BASE["Title"],
            fontName=FONT_BOLD,
            fontSize=19,
            leading=23,
            alignment=TA_LEFT,
            textColor=DARK,
            spaceAfter=4.5 * mm,
        ),
        "h2": ParagraphStyle(
            "EvalH2",
            parent=BASE["Heading1"],
            fontName=FONT_BOLD,
            fontSize=14.2,
            leading=17,
            textColor=DARK,
            spaceBefore=4.5 * mm,
            spaceAfter=2.2 * mm,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "EvalH3",
            parent=BASE["Heading2"],
            fontName=FONT_BOLD,
            fontSize=10.8,
            leading=13.5,
            textColor=RED,
            spaceBefore=3.2 * mm,
            spaceAfter=1.7 * mm,
            keepWithNext=True,
        ),
        "body": body,
        "small": ParagraphStyle(
            "EvalSmall", parent=body, fontSize=7.6, leading=9.8, textColor=SLATE
        ),
        "bullet": ParagraphStyle(
            "EvalBullet",
            parent=body,
            leftIndent=5 * mm,
            firstLineIndent=-3.5 * mm,
            bulletIndent=0,
            spaceAfter=1.2 * mm,
        ),
        "quote": ParagraphStyle(
            "EvalQuote",
            parent=body,
            leftIndent=5 * mm,
            rightIndent=3 * mm,
            borderPadding=(4, 7, 4, 8),
            backColor=PALE_RED,
            textColor=DARK,
        ),
        "code": ParagraphStyle(
            "EvalCode",
            parent=BASE["Code"],
            fontName="Courier",
            fontSize=6.1,
            leading=7.8,
            leftIndent=2.5 * mm,
            rightIndent=2.5 * mm,
            borderColor=GRID,
            borderWidth=0.5,
            borderPadding=5,
            backColor=colors.HexColor("#F8FAFC"),
            textColor=colors.HexColor("#111827"),
            spaceBefore=1.2 * mm,
            spaceAfter=2.5 * mm,
        ),
        "code_line": ParagraphStyle(
            "EvalCodeLine",
            parent=BASE["BodyText"],
            fontName="Courier",
            fontSize=6.1,
            leading=7.4,
            leftIndent=3 * mm,
            rightIndent=3 * mm,
            textColor=colors.HexColor("#374151"),
            spaceBefore=0,
            spaceAfter=0,
        ),
        "meta_key": ParagraphStyle(
            "EvalMetaKey", parent=body, fontName=FONT_BOLD, fontSize=7.7, leading=9.8, textColor=WHITE
        ),
        "meta_value": ParagraphStyle(
            "EvalMetaValue", parent=body, fontSize=7.7, leading=9.8, textColor=DARK
        ),
        "table_header": ParagraphStyle(
            "EvalTableHeader", parent=body, fontName=FONT_BOLD, fontSize=7.2, leading=9.2, textColor=WHITE
        ),
        "table_cell": ParagraphStyle(
            "EvalTableCell", parent=body, fontSize=7.1, leading=9.1, textColor=DARK
        ),
        "banner": ParagraphStyle(
            "EvalBanner",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=8.8,
            leading=10.5,
            alignment=TA_CENTER,
            textColor=DARK,
        ),
        "score_value": ParagraphStyle(
            "EvalScoreValue",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=18,
            leading=21,
            alignment=TA_CENTER,
            textColor=DARK,
            spaceAfter=0,
        ),
        "score_label": ParagraphStyle(
            "EvalScoreLabel",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=7.2,
            leading=9,
            alignment=TA_CENTER,
            textColor=SLATE,
            spaceAfter=0,
        ),
    }


def clean_text(value: str) -> str:
    return (
        value.replace("\u2011", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("→", "->")
        .replace("×", "x")
    )


def inline(value: str) -> str:
    value = clean_text(value.strip())
    code_parts: list[str] = []

    def hold_code(match: re.Match[str]) -> str:
        code_parts.append(html.escape(match.group(1)))
        return f"@@CODE{len(code_parts) - 1}@@"

    value = re.sub(r"`([^`]+)`", hold_code, value)
    value = html.escape(value)
    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(
        r"\[([^\]]+)\]\((https?://[^)]+)\)",
        r'<a href="\2" color="#B3131B">\1</a>',
        value,
    )
    for index, part in enumerate(code_parts):
        value = value.replace(
            f"@@CODE{index}@@", f'<font name="Courier" color="#A3151B">{part}</font>'
        )
    return value


def wrap_code(value: str, width: int = 108) -> str:
    wrapped_lines: list[str] = []
    for raw in clean_text(value).splitlines() or [""]:
        if len(raw) <= width:
            wrapped_lines.append(raw)
            continue
        leading = len(raw) - len(raw.lstrip(" "))
        indent = raw[:leading]
        parts = textwrap.wrap(
            raw,
            width=width,
            subsequent_indent=indent + "  ",
            replace_whitespace=False,
            drop_whitespace=False,
            break_long_words=True,
            break_on_hyphens=False,
        )
        wrapped_lines.extend(parts or [raw])
    return "\n".join(wrapped_lines)


def parse_metadata(lines: list[str], start: int) -> tuple[list[list[str]], int]:
    rows: list[list[str]] = []
    index = start
    while index < len(lines):
        match = re.match(r"^- \*\*(.+?):\*\*\s*(.*)$", lines[index].strip())
        if not match:
            break
        rows.append([match.group(1), match.group(2)])
        index += 1
    return rows, index


def parse_table(lines: list[str], start: int) -> tuple[list[list[str]], int]:
    rows: list[list[str]] = []
    index = start
    while index < len(lines) and lines[index].strip().startswith("|"):
        cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
        if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            rows.append(cells)
        index += 1
    return rows, index


def extract_feedback_result(markdown: str) -> tuple[str, str, str] | None:
    total_match = re.search(
        r"\|\s*\*\*Total\*\*\s*\|\s*\*\*(\d+\s*/\s*100)\*\*\s*\|",
        markdown,
        re.IGNORECASE,
    )
    note_match = re.search(r"^-\s*\*\*Nota:\*\*\s*`?([^`\r\n]+)`?\s*$", markdown, re.MULTILINE)
    requirement_match = re.search(
        r"^-\s*\*\*Exigencia:\*\*\s*`?([^`\r\n]+)`?\s*$",
        markdown,
        re.MULTILINE,
    )
    if not (total_match and note_match and requirement_match):
        return None
    return (
        re.sub(r"\s+", " ", total_match.group(1)).strip(),
        note_match.group(1).strip(),
        requirement_match.group(1).strip(),
    )


def make_score_summary(
    result: tuple[str, str, str],
    width: float,
    st: dict[str, ParagraphStyle],
) -> Table:
    total, note, requirement = result
    data = [
        [
            Paragraph(inline(total), st["score_value"]),
            Paragraph(inline(note), st["score_value"]),
            Paragraph(inline(requirement), st["score_value"]),
        ],
        [
            Paragraph("PUNTAJE TOTAL", st["score_label"]),
            Paragraph("NOTA", st["score_label"]),
            Paragraph("EXIGENCIA", st["score_label"]),
        ],
    ]
    table = Table(data, colWidths=[width / 3] * 3)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                ("LINEABOVE", (0, 0), (-1, 0), 2.2, RED),
                ("BOX", (0, 0), (-1, -1), 0.6, GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, GRID),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, 0), 7),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
                ("TOPPADDING", (0, 1), (-1, 1), 1),
                ("BOTTOMPADDING", (0, 1), (-1, 1), 6),
            ]
        )
    )
    return table


def make_table(rows: list[list[str]], width: float, st: dict[str, ParagraphStyle]) -> Table:
    count = max(len(row) for row in rows)
    normalized = [row + [""] * (count - len(row)) for row in rows]
    data = [
        [
            Paragraph(inline(cell), st["table_header"] if row_index == 0 else st["table_cell"])
            for cell in row
        ]
        for row_index, row in enumerate(normalized)
    ]
    if count == 2:
        widths = [width * 0.37, width * 0.63]
    elif count == 3:
        widths = [width * 0.36, width * 0.31, width * 0.33]
    elif count == 4:
        widths = [width * 0.20, width * 0.29, width * 0.32, width * 0.19]
    else:
        widths = [width / count] * count
    table = Table(data, colWidths=widths, repeatRows=1, splitByRow=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DARK),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
                ("GRID", (0, 0), (-1, -1), 0.4, GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4.5),
                ("TOPPADDING", (0, 0), (-1, -1), 4.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
            ]
        )
    )
    return table


def build_pdf(
    source: Path,
    output: Path,
    student: str,
    evaluation: str,
    commit: str | None = None,
    label: str = "Feedback de evaluación",
    course: str = COURSE,
) -> None:
    st = styles()
    output.parent.mkdir(parents=True, exist_ok=True)
    markdown = source.read_text(encoding="utf-8")
    lines = markdown.splitlines()
    feedback_result = extract_feedback_result(markdown) if "feedback" in label.lower() else None

    def footer(canvas, doc) -> None:
        canvas.saveState()
        canvas.resetTransforms()
        page_width, page_height = A4
        if doc.page > 1:
            canvas.setFont(FONT_BOLD, 8.2)
            canvas.setFillColor(DARK)
            canvas.drawString(18 * mm, page_height - 12 * mm, f"{course} | {label} | {student}")
            canvas.setStrokeColor(RED)
            canvas.setLineWidth(1.1)
            canvas.line(18 * mm, page_height - 15 * mm, page_width - 18 * mm, page_height - 15 * mm)
        canvas.setStrokeColor(GRID)
        canvas.line(18 * mm, 14 * mm, page_width - 18 * mm, 14 * mm)
        canvas.setFont(FONT, 7.2)
        canvas.setFillColor(SLATE)
        if commit:
            canvas.drawString(18 * mm, 8.5 * mm, f"Commit {commit}")
        canvas.drawRightString(page_width - 18 * mm, 8.5 * mm, f"Página {doc.page}")
        canvas.restoreState()

    doc = BaseDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=23 * mm,
        bottomMargin=20 * mm,
        title=clean_text(lines[0].lstrip("# ") if lines else label),
        author="Diego Obando",
        subject=f"{course} - {evaluation}",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(
        EvaluationPageTemplate(id="evaluation", frames=[frame], overlay=footer)
    )

    story = [
        Paragraph(f"{course} | {evaluation} | {student}", st["banner"]),
        HRFlowable(width="100%", thickness=2.2, color=RED, spaceBefore=2 * mm, spaceAfter=5 * mm),
    ]
    index = 0
    in_code = False
    code_lines: list[str] = []
    paragraph_lines: list[str] = []

    def append_code_block(value: str) -> None:
        wrapped_lines = wrap_code(value).splitlines() or [""]
        story.append(Spacer(1, 1.2 * mm))
        for line in wrapped_lines:
            escaped = html.escape(clean_text(line)).replace(" ", "&nbsp;") or "&nbsp;"
            story.append(Paragraph(escaped, st["code_line"]))
        story.append(Spacer(1, 2.5 * mm))

    def flush_paragraph() -> None:
        if paragraph_lines:
            story.append(Paragraph(inline(" ".join(line.strip() for line in paragraph_lines)), st["body"]))
            paragraph_lines.clear()

    while index < len(lines):
        raw = lines[index]
        stripped = raw.strip()
        if stripped.startswith("```"):
            flush_paragraph()
            if not in_code:
                in_code = True
                code_lines = []
            else:
                append_code_block("\n".join(code_lines))
                in_code = False
            index += 1
            continue
        if in_code:
            code_lines.append(raw)
            index += 1
            continue
        if index == 0 and stripped.startswith("# "):
            story.append(Paragraph(inline(stripped[2:]), st["title"]))
            if feedback_result:
                story.extend(
                    [
                        make_score_summary(feedback_result, doc.width, st),
                        Spacer(1, 3 * mm),
                    ]
                )
            index += 1
            while index < len(lines) and not lines[index].strip():
                index += 1
            metadata, index = parse_metadata(lines, index)
            if metadata:
                data = [
                    [Paragraph(inline(key), st["meta_key"]), Paragraph(inline(value), st["meta_value"])]
                    for key, value in metadata
                ]
                table = Table(data, colWidths=[50 * mm, doc.width - 50 * mm])
                table.setStyle(
                    TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (0, -1), DARK),
                            ("GRID", (0, 0), (-1, -1), 0.4, GRID),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 5.5),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 5.5),
                            ("TOPPADDING", (0, 0), (-1, -1), 4.5),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
                        ]
                    )
                )
                story.extend([table, Spacer(1, 2.5 * mm)])
            continue
        if stripped.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(inline(stripped[3:]), st["h2"]))
            index += 1
            continue
        if stripped.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline(stripped[4:]), st["h3"]))
            index += 1
            continue
        if stripped == "---":
            flush_paragraph()
            story.append(HRFlowable(width="100%", thickness=0.8, color=GRID, spaceBefore=2 * mm, spaceAfter=2 * mm))
            index += 1
            continue
        if stripped.startswith("|"):
            flush_paragraph()
            rows, index = parse_table(lines, index)
            story.extend([make_table(rows, doc.width, st), Spacer(1, 2.2 * mm)])
            continue
        if stripped.startswith("> "):
            flush_paragraph()
            quote_lines: list[str] = []
            while index < len(lines) and lines[index].strip().startswith(">"):
                quote_lines.append(lines[index].strip().lstrip(">").strip())
                index += 1
            story.append(Paragraph(inline(" ".join(quote_lines)), st["quote"]))
            continue
        if re.match(r"^- \[[ xX]\] ", stripped):
            flush_paragraph()
            checked = stripped[3].lower() == "x"
            story.append(Paragraph(inline(f"[{'x' if checked else ' '}] {stripped[6:]}"), st["bullet"]))
            index += 1
            continue
        if stripped.startswith("- ") or re.match(r"^\d+\. ", stripped):
            flush_paragraph()
            item = stripped
            index += 1
            # Las lineas sangradas que siguen continuan el mismo punto de la lista.
            while index < len(lines) and lines[index].startswith("  ") and lines[index].strip() and not re.match(r"^(- |\d+\. )", lines[index].strip()):
                item += " " + lines[index].strip()
                index += 1
            story.append(Paragraph(inline(item), st["bullet"]))
            continue
        if not stripped:
            flush_paragraph()
            index += 1
            continue
        paragraph_lines.append(raw)
        index += 1

    flush_paragraph()
    if in_code and code_lines:
        append_code_block("\n".join(code_lines))
    doc.build(story)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--estudiante", required=True)
    parser.add_argument("--evaluacion", required=True, help='Ej.: "Evaluación Parcial 1"')
    parser.add_argument("--commit", help="Commit evaluado, si la entrega es un repositorio")
    parser.add_argument("--etiqueta", default="Feedback de evaluación")
    parser.add_argument("--curso", default=COURSE)
    args = parser.parse_args()
    build_pdf(
        args.source,
        args.output,
        args.estudiante,
        args.evaluacion,
        commit=args.commit,
        label=args.etiqueta,
        course=args.curso,
    )
    print(args.output)


if __name__ == "__main__":
    main()
