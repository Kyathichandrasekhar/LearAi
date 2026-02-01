import os
from app.ai.tools.llm_tool import LLMTool

class CodeAgent:
    def __init__(self):
        self.model = os.getenv("MODEL_CODE", "codellama")

    def explain(self, code: str) -> str:
        prompt = f"""
        You are an expert Software Engineer.
        Explain the following code line-by-line.
        
        Code:
        ```
        {code}
        ```
        
        Explanation:
        """
        return LLMTool.generate(self.model, prompt)

    def debug(self, code: str) -> str:
        prompt = f"""
        You are an expert Software Engineer.
        Analyze the following code for bugs and errors.
        If you find any, explain them and provide the corrected code.
        
        Code:
        ```
        {code}
        ```
        
        Analysis:
        """
        return LLMTool.generate(self.model, prompt)

    def optimize(self, code: str) -> str:
        prompt = f"""
        You are an expert Software Engineer.
        Suggest optimizations for the following code (performance, readability, best practices).
        
        Code:
        ```
        {code}
        ```
        
        Optimizations:
        """
        return LLMTool.generate(self.model, prompt)

    def dry_run(self, code: str, inputs: str = "") -> str:
        prompt = f"""
        You are an expert Software Engineer.
        Simulate a dry run of the code. 
        Trace the execution step-by-step.
        
        Code:
        ```
        {code}
        ```
        
        Inputs (if any): {inputs}
        
        Dry Run Trace:
        """
        return LLMTool.generate(self.model, prompt)
