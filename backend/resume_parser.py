import os
import pdfplumber
import docx


def extract_text(file_path: str) -> str:
    """
    Extract text from PDF or DOCX resume file.

    Args:
        file_path (str): Absolute or relative file path.

    Returns:
        str: Extracted text content.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError("Resume file not found.")

    text = ""

    try:
        # -----------------------------
        # PDF Extraction
        # -----------------------------
        if file_path.lower().endswith(".pdf"):
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"

        # -----------------------------
        # DOCX Extraction
        # -----------------------------
        elif file_path.lower().endswith(".docx"):
            document = docx.Document(file_path)
            for para in document.paragraphs:
                if para.text:
                    text += para.text + "\n"

        else:
            raise ValueError("Unsupported file format.")

    except Exception as e:
        raise RuntimeError(f"Error extracting resume text: {str(e)}")

    # -----------------------------
    # Validate Extracted Content
    # -----------------------------
    if not text.strip():
        raise ValueError(
            "Resume appears empty or contains unreadable content (possibly scanned image PDF)."
        )

    return text.strip()