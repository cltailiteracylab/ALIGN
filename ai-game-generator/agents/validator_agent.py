import json
import math
import re
from datetime import datetime
from typing import Any

from langchain_core.messages import HumanMessage
from langchain_ollama import ChatOllama

from agents.state import GameState
from config.settings import JUDGE_MODEL
from sandbox.docker_runner import execute_html_in_sandbox

judge_llm = ChatOllama(model=JUDGE_MODEL, temperature=0.0)


def _strip_json_fence(text: str) -> str:
    return re.sub(
        r"^\s*```(?:json)?\s*|\s*```\s*$",
        "",
        text,
        flags=re.IGNORECASE,
    ).strip()


def _read_score(scores: dict[str, Any], key: str) -> float:
    try:
        score = float(scores[key])
    except (KeyError, TypeError, ValueError) as error:
        raise ValueError(f"Judge response is missing a valid {key}.") from error
    if not math.isfinite(score) or not 1.0 <= score <= 5.0:
        raise ValueError(f"Judge response {key} must be between 1.0 and 5.0.")
    return score


def validator_agent_node(state: GameState) -> dict[str, Any]:
    retries = state["retry_count"]
    print(f"[Validator] Checking generated game (attempt {retries + 1}).")
    code = state["generated_code"]
    lower_code = code.lower()
    structural_issues = []
    if "<html" not in lower_code:
        structural_issues.append("Missing <html> element.")
    if "<canvas" not in lower_code:
        structural_issues.append("Missing <canvas> element.")
    if "<script" not in lower_code:
        structural_issues.append("Missing <script> element.")
    if "</html>" not in lower_code:
        structural_issues.append("Missing </html> closing tag.")

    filename = f"game_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
    sandbox_passed, sandbox_feedback = execute_html_in_sandbox(filename, code)
    if structural_issues:
        structural_feedback = "StructuralError: " + " ".join(structural_issues)
        sandbox_feedback = (
            f"{structural_feedback}\n{sandbox_feedback}".strip()
            if sandbox_feedback
            else structural_feedback
        )
        sandbox_passed = False

    rubric_prompt = f"""You are an objective educational-game QA grader. Grade the design and generated code from 1.0 to 5.0.

USER REQUEST: Subject={state['subject']}, Level={state['level']}, Prompt={state['user_prompt']}
DESIGN JSON: {state['game_design']}
HTML CODE (first 6000 characters): {code[:6000]}
SANDBOX RESULT: {"passed" if sandbox_passed else "failed"}
SANDBOX FEEDBACK: {sandbox_feedback}

Rubric:
1. content_score: Pedagogical alignment, meaningful simulation mechanics, and clear learning takeaways.
2. dev_score: Complete, interactive code with controls, telemetry, win/lose states, and no placeholders.
3. validator_score: Technical stability and runtime validation results.

Return only valid raw JSON with numeric scores in the range 1.0 to 5.0 and a concise critique_notes string:
{{"content_score": 4.5, "dev_score": 4.2, "validator_score": 5.0, "critique_notes": "One concise improvement note."}}"""
    judge_response = judge_llm.invoke([HumanMessage(content=rubric_prompt)])
    scores = json.loads(_strip_json_fence(str(judge_response.content)))
    if not isinstance(scores, dict):
        raise ValueError("Judge response must be a JSON object.")

    content_score = _read_score(scores, "content_score")
    dev_score = _read_score(scores, "dev_score")
    validator_score = _read_score(scores, "validator_score")
    critique_notes = scores.get("critique_notes")
    if not isinstance(critique_notes, str):
        raise ValueError("Judge response must include string critique_notes.")

    if content_score < 3.5 or dev_score < 3.5:
        sandbox_feedback = (
            f"{sandbox_feedback}\nQualityRubricReject: {critique_notes}".strip()
        )
    passed = sandbox_passed and content_score >= 3.5 and dev_score >= 3.5
    return {
        "sandbox_passed": passed,
        "sandbox_feedback": sandbox_feedback if not passed else "PASS",
        "html_filename": filename,
        "retry_count": retries if passed else retries + 1,
        "content_score": content_score,
        "dev_score": dev_score,
        "validator_score": validator_score,
        "critique_notes": critique_notes,
    }
