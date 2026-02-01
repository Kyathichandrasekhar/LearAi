from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.ai.agents.notes_agent import NotesAgent
from app.ai.tools.pdf_tool import PDFTool

router = APIRouter()
agent = NotesAgent()

@router.post("/summarize")
async def summarize(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    content = ""
    if file:
        if file.content_type == "application/pdf":
            content = PDFTool.extract_text_from_bytes(await file.read())
        else:
            # Assume text file
            content = (await file.read()).decode("utf-8")
    elif text:
        content = text
    else:
        raise HTTPException(status_code=400, detail="No text or file provided")

    result = agent.summarize(content)
    return {"summary": result}

@router.post("/concepts")
async def extract_concepts(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    content = ""
    if file:
        if file.content_type == "application/pdf":
            content = PDFTool.extract_text_from_bytes(await file.read())
        else:
            content = (await file.read()).decode("utf-8")
    elif text:
        content = text
    else:
        raise HTTPException(status_code=400, detail="No text or file provided")

    result = agent.extract_concepts(content)
    return {"concepts": result}
