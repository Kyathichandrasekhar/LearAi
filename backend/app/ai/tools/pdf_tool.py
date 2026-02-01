from pypdf import PdfReader
import io

class PDFTool:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> str:
        """
        Extract text from PDF file bytes.
        """
        try:
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
