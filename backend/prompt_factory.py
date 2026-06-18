import base64


def persona_from_text(name: str, memo: str) -> list[dict]:
    return [
        {
            "role": "user",
            "content": (
                f"以下は「{name}」という上司についてのメモです。\n"
                "このメモをもとに、上司のペルソナを構造化・深掘りしてください。\n\n"
                f"【メモ】\n{memo}"
            ),
        }
    ]


def persona_from_image(name: str, image_bytes: bytes, media_type: str) -> list[dict]:
    image_data = base64.standard_b64encode(image_bytes).decode("utf-8")
    return [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{media_type};base64,{image_data}"},
                },
                {
                    "type": "text",
                    "text": (
                        f"この写真の人物「{name}」は嫌な上司です。\n"
                        "表情・雰囲気から性格を推定してペルソナを構築してください。"
                    ),
                },
            ],
        }
    ]


def refine_persona(name: str, current_persona: dict, user_answer: str) -> list[dict]:
    return [
        {
            "role": "user",
            "content": (
                f"上司「{name}」のペルソナ精緻化の続きです。\n\n"
                f"【現在のペルソナ】\n{current_persona}\n\n"
                f"【AIからの質問への回答】\n{user_answer}\n\n"
                "回答を踏まえてペルソナを更新してください。これが最終ラリーなので question は null にしてください。"
            ),
        }
    ]


def suggest_metsu_process(name: str, persona: dict, stages: int, situation: str, collapse_type: str) -> list[dict]:
    return [
        {
            "role": "user",
            "content": (
                f"嫌な上司「{name}」が「滅」に至るまでの物語を{stages}段階で生成してください。\n\n"
                f"【上司のペルソナ】\n{persona}\n\n"
                f"【シチュエーション】{situation}\n"
                f"【崩壊するもの】{collapse_type}\n\n"
                f"ルール:\n"
                f"- stages リストは必ず {stages} 件\n"
                f"- 各ステージのテキストは50文字程度\n"
                f"- 段階が進むにつれて「滅」に近づく展開（序章→緊張→崩壊→消滅）\n"
                f"- 上司の口癖・弱点を活かした笑えて痛快な内容\n"
                f"- final_blow は10〜20文字で印象的なひとこと"
            ),
        }
    ]
