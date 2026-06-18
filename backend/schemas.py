from pydantic import BaseModel, Field


class PersonaOutput(BaseModel):
    traits: list[str] = Field(description="上司の特徴リスト（3つ程度）")
    catchphrase: str = Field(description="この上司が言いそうな口癖や決めセリフ")
    weakness: str = Field(description="この上司の弱点や嫌がること")
    annoyance_level: int = Field(description="嫌さレベル（1〜10の整数）", ge=1, le=10)
    question: str | None = Field(default=None, description="ペルソナをさらに深掘りする質問（最終ラリーはnull）")


class MetsuStage(BaseModel):
    text: str = Field(description="このステージの物語テキスト（50文字程度）")


class MetsuProcess(BaseModel):
    stages: list[MetsuStage] = Field(description="滅に至るプロセスの各ステージ（stages件数必須）")
    final_blow: str = Field(description="最後のトドメのセリフ（20文字程度）")
