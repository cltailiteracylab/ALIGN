import re

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama

from agents.state import GameState
from config.settings import CODER_MODEL

coder_llm = ChatOllama(model=CODER_MODEL, temperature=0.15)


def developer_agent_node(state: GameState) -> dict[str, str]:
    system_prompt = """You are a senior HTML5 canvas and JavaScript game engineer. Build a complete, deeply playable, single-file browser game.

Requirements:
1. Return only complete raw HTML5, starting with <!DOCTYPE html> and ending with </html>. Do not use markdown fences.
2. Put all CSS in a style element and all JavaScript in a script element. Use no external URLs, images, or audio files.
3. Use an 800x560 interactive canvas and a side telemetry/control panel with live readouts and a dynamic Concept Insight box that updates during play.
4. Implement a smooth 60fps requestAnimationFrame loop using delta time, plus clear player controls and game state.
5. Support both keyboard controls and mouse interaction.
6. Synthesize sound effects with the Web Audio API inside try/catch so unsupported audio does not break the game.
7. Include a Start overlay, pause/reset controls, and Victory/Game Over modal states with a Play Again button and performance breakdown.
8. Avoid undefined variables, placeholder functions, and JavaScript runtime errors."""
    system_prompt += "\n9. Do not include emoji characters in source code or player-facing UI text."

    if state.get("sandbox_feedback") and not state.get("sandbox_passed", False):
        print("[Developer Agent] Revising the game from validator feedback.")
        user_prompt = (
            "The previous build did not pass validation. Fix the issues in the "
            "feedback and return the complete corrected HTML file.\n\n"
            f"Validation feedback:\n{state['sandbox_feedback']}\n\n"
            f"Game design JSON:\n{state['game_design']}"
        )
    else:
        print("[Developer Agent] Building the HTML5 canvas simulation.")
        user_prompt = (
            "Build the complete playable HTML5 game from this design:\n"
            f"{state['game_design']}"
        )

    response = coder_llm.invoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
    )
    raw = re.sub(
        r"^\s*```(?:html)?\s*|\s*```\s*$",
        "",
        str(response.content),
        flags=re.IGNORECASE,
    ).strip()
    return {"generated_code": raw}
