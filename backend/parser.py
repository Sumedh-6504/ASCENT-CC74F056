import pdfplumber
import docx
import io


def extract_text(file_bytes: bytes, content_type: str, filename: str = "") -> str:
    fname = (filename or "").lower()

    if content_type == "application/pdf" or fname.endswith(".pdf"):
        return _parse_pdf(file_bytes)

    if (
        content_type
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        or fname.endswith(".docx")
    ):
        return _parse_docx(file_bytes)

    try:
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return file_bytes.decode("latin-1", errors="replace")


def _parse_pdf(data: bytes) -> str:
    parts = []
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                parts.append(t)
    return "\n".join(parts)


def _parse_docx(data: bytes) -> str:
    doc = docx.Document(io.BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
