import io
import re
import zipfile
import xml.etree.ElementTree as ET
import PyPDF2
import logging
from app.core.exceptions import ValidationException

logger = logging.getLogger("app")

def clean_text(text: str) -> str:
    """Remove unnecessary blank spaces, tabs, and duplicate newlines."""
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    return text.strip()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PyPDF2.PdfReader(pdf_file)

        pages_text = []

        for page in reader.pages:
            t = page.extract_text()
            if t:
                pages_text.append(t)

        extracted = "\n".join(pages_text)

        if not extracted.strip():
            raise ValidationException(
                "The PDF file appears to have no readable text content."
            )

        return extracted

    except Exception as e:
        if isinstance(e, ValidationException):
            raise e

        logger.error("Failed to parse PDF file: %s", str(e))
        raise ValidationException(
            f"Failed to process PDF resume document: {str(e)}"
        )


def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        docx_file = io.BytesIO(file_bytes)

        with zipfile.ZipFile(docx_file) as docx:
            xml_content = docx.read("word/document.xml")

        root = ET.fromstring(xml_content)

        namespaces = {
            "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        }

        text_elements = root.findall(".//w:t", namespaces)

        text = [el.text for el in text_elements if el.text]

        extracted = "\n".join(text)

        if not extracted.strip():
            raise ValidationException(
                "The DOCX file contains no readable text layout."
            )

        return extracted

    except Exception as e:
        if isinstance(e, ValidationException):
            raise e

        logger.error("Failed to parse DOCX file: %s", str(e))

        raise ValidationException(
            f"Failed to process DOCX resume document: {str(e)}"
        )


def extract_text_from_txt(file_bytes: bytes) -> str:
    try:
        extracted = file_bytes.decode("utf-8")

        if not extracted.strip():
            raise ValidationException(
                "The text file content is empty."
            )

        return extracted

    except UnicodeDecodeError:
        try:
            extracted = file_bytes.decode("latin-1")

            if not extracted.strip():
                raise ValidationException(
                    "The text file content is empty."
                )

            return extracted

        except Exception as e:
            logger.error("Failed to parse TXT file: %s", str(e))

            raise ValidationException(
                f"Failed to decode text file content: {str(e)}"
            )


def parse_resume_bytes(file_bytes: bytes, filename: str) -> str:
    """Parse and validate uploaded resume."""

    ext = filename.split(".")[-1].lower() if "." in filename else ""

    if ext == "pdf":
        raw_text = extract_text_from_pdf(file_bytes)

    elif ext == "docx":
        raw_text = extract_text_from_docx(file_bytes)

    elif ext == "doc":
        raise ValidationException(
            "Legacy .doc files are not supported. Please upload PDF or DOCX."
        )

    elif ext in ["txt", "text"]:
        raw_text = extract_text_from_txt(file_bytes)

    else:
        raise ValidationException(
            "Unsupported file type. Only PDF, DOCX and TXT are supported."
        )

    cleaned = clean_text(raw_text)

    # Minimum content length
    if len(cleaned) < 300:
        raise ValidationException(
            "The uploaded document is too short to be a valid resume."
        )

    # Resume keyword validation
    resume_keywords = [
        "education",
        "skills",
        "experience",
        "projects",
        "internship",
        "objective",
        "summary",
        "certification",
        "achievement",
        "technical skills",
        "work experience",
        "contact",
        "email",
        "phone"
    ]

    text = cleaned.lower()

    keyword_count = 0

    for keyword in resume_keywords:
        if keyword in text:
            keyword_count += 1

    if keyword_count < 3:
        raise ValidationException(
            "The uploaded document does not appear to be a resume."
        )

    return cleaned