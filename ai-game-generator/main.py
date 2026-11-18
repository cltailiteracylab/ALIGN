import threading
import webbrowser
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request, send_from_directory
from langgraph.graph import END, StateGraph

from agents.content_agent import content_agent_node
from agents.developer_agent import developer_agent_node
from agents.state import GameState
from agents.validator_agent import validator_agent_node
from config.settings import (
    MAX_RETRIES,
    OUTPUT_DIR,
    init_db,
    log_episode,
    save_human_reward,
)

app = Flask(__name__)
FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"


def route_after_validation(state: GameState) -> str:
    if state["sandbox_passed"] or state["retry_count"] >= MAX_RETRIES:
        return END
    return "developer_agent"


workflow = StateGraph(GameState)
workflow.add_node("content_agent", content_agent_node)
workflow.add_node("developer_agent", developer_agent_node)
workflow.add_node("validator_agent", validator_agent_node)
workflow.set_entry_point("content_agent")
workflow.add_edge("content_agent", "developer_agent")
workflow.add_edge("developer_agent", "validator_agent")
workflow.add_conditional_edges("validator_agent", route_after_validation)
game_pipeline = workflow.compile()


@app.get("/")
def index():
    return send_from_directory(str(FRONTEND_DIR), "index.html")


@app.get("/games/<path:filename>")
def serve_game(filename: str):
    return send_from_directory(OUTPUT_DIR, filename)


@app.post("/api/generate")
def api_generate():
    data: Any = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400
    subject = data.get("subject")
    level = data.get("level")
    prompt = data.get("prompt")
    if not all(isinstance(value, str) and value.strip() for value in (subject, level, prompt)):
        return jsonify({"error": "Subject, level, and prompt are required strings."}), 400

    initial_state: GameState = {
        "subject": subject.strip(),
        "level": level.strip(),
        "user_prompt": prompt.strip(),
        "game_design": "",
        "generated_code": "",
        "html_filename": "",
        "sandbox_passed": False,
        "sandbox_feedback": "",
        "content_score": 0.0,
        "dev_score": 0.0,
        "validator_score": 0.0,
        "critique_notes": "",
        "retry_count": 0,
    }
    try:
        final = game_pipeline.invoke(initial_state)
        episode_id = log_episode(final)
    except Exception as error:
        app.logger.exception("Game generation failed.")
        return jsonify({"error": f"Game generation failed: {error}"}), 500

    return jsonify(
        {
            "episode_id": episode_id,
            "filename": final["html_filename"],
            "status": final["sandbox_feedback"],
            "content_score": final["content_score"],
            "dev_score": final["dev_score"],
            "validator_score": final["validator_score"],
            "critique_notes": final["critique_notes"],
        }
    )


@app.post("/api/reward")
def api_reward():
    data: Any = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400
    episode_id = data.get("episode_id")
    reward = data.get("reward")
    if isinstance(episode_id, bool) or not isinstance(episode_id, int):
        return jsonify({"error": "episode_id must be an integer."}), 400
    if isinstance(reward, bool) or not isinstance(reward, (int, float)) or reward not in (1, 3, 5):
        return jsonify({"error": "reward must be one of 1, 3, or 5."}), 400
    try:
        save_human_reward(episode_id, float(reward))
    except ValueError as error:
        return jsonify({"error": str(error)}), 404
    return jsonify({"ok": True})


if __name__ == "__main__":
    init_db()
    url = "http://127.0.0.1:5000"
    print(f"Launching Educational Game Studio at {url}")
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    app.run(port=5000, debug=False)
