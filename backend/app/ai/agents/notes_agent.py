import os
from app.ai.tools.llm_tool import LLMTool

class NotesAgent:
    def __init__(self):
        self.model = os.getenv("MODEL_CHAT", "llama2")

    def summarize(self, text: str) -> str:
        """
        Summarize the provided text.
        """
        prompt = f"""
        You are an expert Note Taker.
        Please provide a concise summary of the following text.
        
        Text:
        {text}
        
        Summary:
        """
        return LLMTool.generate(self.model, prompt)

    def extract_concepts(self, text: str) -> str:
        """
        Extract key concepts and explain them.
        """
        prompt = f"""
        You are an expert Note Taker.
        Extract the key concepts from the text below.
        For each concept, provide a simple explanation and a real-world example.
        
        Text:
        {text}
        
        Key Concepts:
        """
        return LLMTool.generate(self.model, prompt)
