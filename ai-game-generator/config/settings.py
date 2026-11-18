import os
import sqlite3
from contextlib import closing
from datetime import datetime
from typing import Any

USE_DOCKER = True
CONTAINER_NAME = "game-factory"
DB_PATH = "agent_memory.db"
OUTPUT_DIR = "generated_games"
CONTENT_MODEL = "llama3.1"
CODER_MODEL = "qwen2.5-coder"
JUDGE_MODEL = "llama3.1"
MAX_RETRIES = 3

os.makedirs(OUTPUT_DIR, exist_ok=True)


def init_db() -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn, conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS episodes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                subject TEXT,
                level TEXT,
                user_prompt TEXT,
                game_design TEXT,
                html_file TEXT,
                content_score REAL,
                dev_score REAL,
                validator_score REAL,
                human_reward REAL,
                critique_notes TEXT
            )
            """
        )


def get_top_few_shot_examples(subject: str, limit: int = 2) -> str:
    with closing(sqlite3.connect(DB_PATH)) as conn, conn:
        rows = conn.execute(
            """
            SELECT user_prompt, game_design,
                   (content_score + dev_score + COALESCE(human_reward, 0)) AS total_reward
            FROM episodes
            WHERE content_score >= 4.0 AND dev_score >= 4.0
            ORDER BY (subject = ?) DESC, total_reward DESC
            LIMIT ?
            """,
            (subject, limit),
        ).fetchall()
    if not rows:
        return "No prior high-reward episodes yet."
    return "\n\n".join(
        f"--- HIGH-REWARD EXAMPLE {index} (Reward: {reward:.1f}) ---\n"
        f"User Request: {prompt}\nWinning Design JSON:\n{design}"
        for index, (prompt, design, reward) in enumerate(rows, 1)
    )


def get_recent_failures(limit: int = 3) -> str:
    with closing(sqlite3.connect(DB_PATH)) as conn, conn:
        rows = conn.execute(
            """
            SELECT critique_notes
            FROM episodes
            WHERE critique_notes IS NOT NULL AND critique_notes != ''
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    if not rows:
        return "None recorded yet."
    return "\n".join(f"- {row[0]}" for row in rows)


def log_episode(state: dict[str, Any]) -> int:
    with closing(sqlite3.connect(DB_PATH)) as conn, conn:
        cursor = conn.execute(
            """
            INSERT INTO episodes (
                timestamp, subject, level, user_prompt, game_design, html_file,
                content_score, dev_score, validator_score, human_reward, critique_notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
            """,
            (
                datetime.now().isoformat(),
                state["subject"],
                state["level"],
                state["user_prompt"],
                state["game_design"],
                state["html_filename"],
                state["content_score"],
                state["dev_score"],
                state["validator_score"],
                state["critique_notes"],
            ),
        )
        return int(cursor.lastrowid)


def save_human_reward(episode_id: int, reward: float) -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn, conn:
        cursor = conn.execute(
            "UPDATE episodes SET human_reward = ? WHERE id = ?",
            (reward, episode_id),
        )
        if cursor.rowcount == 0:
            raise ValueError(f"No episode exists with id {episode_id}.")
