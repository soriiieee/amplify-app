import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

_DB_PATH = os.environ.get("DB_PATH", "data/app.db")


def _connect() -> sqlite3.Connection:
    path = Path(_DB_PATH)
    path.parent.mkdir(parents=True, exist_ok=True)
    return sqlite3.connect(path)


def init_db() -> None:
    with _connect() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS persona_logs (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at    TEXT    NOT NULL,
                boss_name     TEXT    NOT NULL,
                traits        TEXT,
                catchphrase   TEXT,
                weakness      TEXT,
                annoyance_level INTEGER,
                has_image     INTEGER NOT NULL DEFAULT 0
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS battle_logs (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at     TEXT    NOT NULL,
                boss_name      TEXT    NOT NULL,
                click_count    INTEGER NOT NULL,
                pattern_title  TEXT,
                final_blow     TEXT
            )
        """)


def log_persona(name: str, persona: dict, has_image: bool) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO persona_logs
                (created_at, boss_name, traits, catchphrase, weakness, annoyance_level, has_image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datetime.now(timezone.utc).isoformat(),
                name,
                json.dumps(persona.get("traits"), ensure_ascii=False),
                persona.get("catchphrase"),
                persona.get("weakness"),
                persona.get("annoyance_level"),
                int(has_image),
            ),
        )


def log_battle(name: str, click_count: int, patterns: list) -> None:
    first = patterns[0] if patterns else {}
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO battle_logs
                (created_at, boss_name, click_count, pattern_title, final_blow)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                datetime.now(timezone.utc).isoformat(),
                name,
                click_count,
                first.get("title"),
                first.get("final_blow"),
            ),
        )
