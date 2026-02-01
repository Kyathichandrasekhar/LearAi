import re

class CodeTool:
    @staticmethod
    def format_code(code: str) -> str:
        """
        Simple formatter or cleaner if needed.
        """
        return code.strip()

    @staticmethod
    def detect_language(code: str) -> str:
        """
        Heuristic detection.
        """
        if "def " in code or "import " in code:
            return "python"
        if "function " in code or "const " in code or "let " in code:
            return "javascript"
        if "#include" in code:
            return "cpp"
        if "public class" in code:
            return "java"
        return "unknown"
