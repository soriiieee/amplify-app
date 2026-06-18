import os
from typing import Literal, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models.chat_models import BaseChatModel

from dotenv import load_dotenv
# .envファイルから環境変数をロード
load_dotenv()

# 1. プロファイル定義 (Pydantic Model)
class LLMProfile(BaseModel):
    # プロバイダーを制限
    provider: Literal["openai", "anthropic"]
    model: str
    temperature: float = Field(default=0.7, ge=0.0, le=1.0)
    max_tokens: Optional[int] = None
    api_key: Optional[str] = None
    # その他のカスタムパラメータを受け入れ可能にする設定
    model_config = ConfigDict(extra='allow')

# 2. ルータークラス
class LLMRouter:
    @staticmethod
    def build(profile: LLMProfile) -> BaseChatModel:
        """
        Pydanticモデルを受け取り、LangChainのモデルインスタンスを生成する
        """
        # 共通設定
        common_kwargs = {
            "model": profile.model,
            "temperature": profile.temperature,
            "max_tokens": profile.max_tokens,
        }
        
        # 追加のパラメータ（model_configで許可した分）を取得
        extra_kwargs = profile.model_dump(exclude={"provider", "model", "temperature", "max_tokens", "api_key"})
        settings = {**common_kwargs, **extra_kwargs}

        if profile.provider == "openai":
            if not os.environ.get("OPENAI_API_KEY"):
                raise ValueError("環境変数 'OPENAI_API_KEY' が設定されていません。")
            return ChatOpenAI(**settings, api_key=os.environ.get("OPENAI_API_KEY"))
        
        elif profile.provider == "anthropic":
            if not os.environ.get("ANTHROPIC_API_KEY"):
                raise ValueError("環境変数 'ANTHROPIC_API_KEY' が設定されていません。")
            
            # print(settings)
            # exit()
            return ChatAnthropic(
                **settings, 
                api_key= os.environ.get("ANTHROPIC_API_KEY").strip()
                )
        
        else:
            # Literalで制限しているため通常ここには来ないが、型安全のために記述
            raise ValueError(f"Unsupported provider: {profile.provider}")
        

if __name__ == "__main__":
    # テスト用のプロファイル
    profile = LLMProfile(
        provider="anthropic",
        model="claude-sonnet-4-5",
        # temperature=0.5,
        max_tokens=1024,
        # その他のカスタムパラメータも追加可能
        # top_p=0.9/
    )
    
    llm = LLMRouter.build(profile)
    print(llm.invoke("Hello, world!"))