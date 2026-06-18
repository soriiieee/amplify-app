from fastapi import APIRouter
from pydantic import BaseModel
from services import claude_client
import database

router = APIRouter()


class SuggestRequest(BaseModel):
    name: str
    persona: dict
    stages: int
    situation: str
    collapse_type: str
    provider: str = "claude"


@router.post("/suggest")
def suggest_metsu(req: SuggestRequest):
    result = claude_client.suggest_metsu(
        req.name, req.persona, req.stages, req.situation, req.collapse_type, req.provider
    )
    database.log_battle(req.name, req.stages, [{"title": req.situation, "final_blow": result.get("final_blow")}])
    return result
