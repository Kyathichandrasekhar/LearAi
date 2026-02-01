from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.agents.code_agent import CodeAgent

router = APIRouter()
agent = CodeAgent()

class CodeRequest(BaseModel):
    code: str
    language: str = "python" # Optional hint
    context: str = "" # Optional context

class DryRunRequest(BaseModel):
    code: str
    inputs: str = ""

@router.post("/explain")
def explain_code(request: CodeRequest):
    result = agent.explain(request.code)
    return {"explanation": result}

@router.post("/debug")
def debug_code(request: CodeRequest):
    result = agent.debug(request.code)
    return {"analysis": result}

@router.post("/optimize")
def optimize_code(request: CodeRequest):
    result = agent.optimize(request.code)
    return {"optimizations": result}

@router.post("/dry-run")
def dry_run_code(request: DryRunRequest):
    result = agent.dry_run(request.code, request.inputs)
    return {"trace": result}
