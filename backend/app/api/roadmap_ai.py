from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.agents.roadmap_agent import RoadmapAgent

router = APIRouter()
agent = RoadmapAgent()

class RoadmapRequest(BaseModel):
    goal: str

@router.post("/generate")
def generate_roadmap(request: RoadmapRequest):
    result = agent.generate_roadmap(request.goal)
    return {"roadmap": result}
