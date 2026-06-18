from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from services import claude_client
import database

router = APIRouter()


class RefineRequest(BaseModel):
    name: str
    current_persona: dict
    user_answer: str
    provider: str = "claude"


@router.post("/analyze")
async def analyze_persona(
    name: str = Form(...),
    memo: str = Form(""),
    image: UploadFile | None = File(None),
    provider: str = Form("claude"),
):
    if image:
        image_bytes = await image.read()
        media_type = image.content_type or "image/jpeg"
        result = claude_client.analyze_persona_from_image(name, image_bytes, media_type, provider)
    else:
        result = claude_client.analyze_persona_from_text(name, memo, provider)
    database.log_persona(name, result, has_image=bool(image))
    return result


@router.post("/refine")
def refine_persona(req: RefineRequest):
    result = claude_client.refine_persona(req.name, req.current_persona, req.user_answer, req.provider)
    return result
