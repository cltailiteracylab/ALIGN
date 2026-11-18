# Educational HTML5 Game Studio

Generate and validate interactive educational games using local Ollama models, LangGraph, Flask, and a Dockerized Playwright browser.

## Prerequisites

- Python 3.11 or newer
- Ollama with the `llama3.1` and `qwen2.5-coder` models
- Docker Desktop

Pull the models before starting the application:

```text
ollama pull llama3.1
ollama pull qwen2.5-coder
```

Install the Python dependencies:

```text
pip install -r requirements.txt
```

Build and start the browser sandbox:

```text
docker compose up -d --build
```

By default, `USE_DOCKER` in `config/settings.py` is `True`. Set it to `False` to save generated games without Docker-based browser validation.

Start the web studio:

```text
python main.py
```

The app opens at `http://127.0.0.1:5000`.
