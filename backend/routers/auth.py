import os
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

_SESSION_TOKEN = str(uuid.uuid4())


class LoginRequest(BaseModel):
    login_id: str
    password: str


@router.post("/login")
def login(req: LoginRequest):
    valid_id = os.environ.get("LOGIN_ID", "")
    valid_pw = os.environ.get("LOGIN_PASSWORD", "")
    if not valid_id or not valid_pw:
        raise HTTPException(status_code=500, detail="サーバーの認証設定がありません")
    if req.login_id == valid_id and req.password == valid_pw:
        return {"token": _SESSION_TOKEN}
    raise HTTPException(status_code=401, detail="IDまたはパスワードが違います")
