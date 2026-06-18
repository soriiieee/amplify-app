from services.llm_manager import LLMRouter, LLMProfile
from schemas import MetsuProcess, PersonaOutput
import prompt_factory

PROVIDER_MAP = {"claude": "anthropic", "openai": "openai"}
MODEL_MAP    = {"claude": "claude-haiku-4-5-20251001", "openai": "gpt-4o-mini"}


def _llm(provider: str, max_tokens: int = 1024):
    return LLMRouter.build(LLMProfile(
        provider=PROVIDER_MAP[provider],
        model=MODEL_MAP[provider],
        max_tokens=max_tokens,
    ))


def analyze_persona_from_text(name: str, memo: str, provider: str = "claude") -> dict:
    result = _llm(provider).with_structured_output(PersonaOutput).invoke(
        prompt_factory.persona_from_text(name, memo)
    )
    return result.model_dump()


def analyze_persona_from_image(name: str, image_bytes: bytes, media_type: str, provider: str = "claude") -> dict:
    result = _llm(provider).with_structured_output(PersonaOutput).invoke(
        prompt_factory.persona_from_image(name, image_bytes, media_type)
    )
    return result.model_dump()


def refine_persona(name: str, current_persona: dict, user_answer: str, provider: str = "claude") -> dict:
    result = _llm(provider).with_structured_output(PersonaOutput).invoke(
        prompt_factory.refine_persona(name, current_persona, user_answer)
    )
    return result.model_dump()


def suggest_metsu(
    name: str,
    persona: dict,
    stages: int,
    situation: str,
    collapse_type: str,
    provider: str = "claude",
) -> dict:
    result = _llm(provider, max_tokens=2048).with_structured_output(MetsuProcess).invoke(
        prompt_factory.suggest_metsu_process(name, persona, stages, situation, collapse_type)
    )
    return result.model_dump()
