from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, notes_ai, code_ai, roadmap_ai
from app.api.deps import get_current_user
import uvicorn

app = FastAPI(title="Code Companion AI Backend")

# CORS Setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*" # For local development flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ruok", "message": "Code Companion AI Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(
    notes_ai.router, 
    prefix="/api/ai/notes", 
    tags=["Notes AI"], 
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    code_ai.router, 
    prefix="/api/ai/code", 
    tags=["Code AI"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    roadmap_ai.router, 
    prefix="/api/ai/roadmap", 
    tags=["Roadmap AI"],
    dependencies=[Depends(get_current_user)]
)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
