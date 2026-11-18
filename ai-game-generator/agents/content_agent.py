import re

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama

from config.settings import (
    CONTENT_MODEL,
    get_recent_failures,
    get_top_few_shot_examples,
)
from agents.state import GameState

content_llm = ChatOllama(model=CONTENT_MODEL, temperature=0.75)


def content_agent_node(state: GameState) -> dict[str, str]:
    print(f"[Content Agent] Designing {state['level']} {state['subject']} game...")
    past_winners = get_top_few_shot_examples(state["subject"])
    past_mistakes = get_recent_failures()

    system_prompt = f"""You are an educational game architect designing rich, interactive HTML5 games that teach through simulation.

BANNED: Static multiple-choice quizzes, flashcards, and simple one-button clickers.
REQUIRED: Multi-variable gameplay where player decisions directly alter live simulation physics, resource budgets, or system states, plus live telemetry that explains why a strategy succeeds or fails.
Do not include emoji characters in the game design or player-facing text.

LEARN FROM HIGH-REWARD EPISODES:
{past_winners}

AVOID THESE RECENT CRITIQUE FAILURES:
{past_mistakes}

Output only a valid raw JSON object with exactly this schema:
{{
  "game_title": "A concise domain-specific title",
  "core_concept": "The exact principle being simulated",
  "simulation_mechanics": "Multi-variable mechanics, controls, rules, trade-offs, and progression",
  "hud_and_telemetry": "Live metrics and real-time concept feedback shown during play",
  "win_condition": "A specific measurable goal",
  "lose_condition": "A specific failure threshold"
}}"""
    user_prompt = (
        f"Student subject: {state['subject']}\n"
        f"Academic level: {state['level']}\n"
        f"Game request: {state['user_prompt']}"
    )
    response = content_llm.invoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
    )
    clean = re.sub(
        r"^\s*```(?:json)?\s*|\s*```\s*$",
        "",
        str(response.content),
        flags=re.IGNORECASE,
    ).strip()
    return {"game_design": clean}
