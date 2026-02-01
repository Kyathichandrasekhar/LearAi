import os
from app.ai.tools.llm_tool import LLMTool

class RoadmapAgent:
    def __init__(self):
        self.model = os.getenv("MODEL_ROADMAP", "mistral")

    def generate_roadmap(self, goal: str) -> str:
        prompt = f"""
        You are an expert Career Coach and Mentor.
        Create a detailed learning roadmap for: "{goal}".
        
        Structure the roadmap from Beginner -> Intermediate -> Advanced.
        For each step, suggest:
        1. Topic
        2. Description
        3. Free Resources (YouTube, Documentation)
        
        Format the output clearly.
        """
        return LLMTool.generate(self.model, prompt)
