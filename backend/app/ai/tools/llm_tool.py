import ollama
from typing import Optional, List, Dict, Any

class LLMTool:
    @staticmethod
    def generate(model: str, prompt: str, system: Optional[str] = None) -> str:
        """
        Generate a response from the LLM.
        """
        try:
            # Simple generate call
            options = None
            if system:
                # If system prompt is needed, we might need to use chat or prepend it.
                # Ollama python lib generate usually takes 'system' as param in newer versions
                # checking docs: ollama.generate(model='llama2', prompt='Why is the sky blue?')
                response = ollama.generate(model=model, prompt=prompt, system=system)
            else:
                response = ollama.generate(model=model, prompt=prompt)
            
            return response['response']
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            return f"Error connecting to local LLM: {str(e)}"

    @staticmethod
    def chat(model: str, messages: List[Dict[str, str]]) -> str:
        """
        Chat with the LLM.
        messages format: [{'role': 'user', 'content': '...'}, ...]
        """
        try:
            response = ollama.chat(model=model, messages=messages)
            return response['message']['content']
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            return f"Error connecting to local LLM: {str(e)}"
