from typing import TypedDict


class GameState(TypedDict):
    subject: str
    level: str
    user_prompt: str
    game_design: str
    generated_code: str
    html_filename: str
    sandbox_passed: bool
    sandbox_feedback: str
    content_score: float
    dev_score: float
    validator_score: float
    critique_notes: str
    retry_count: int
