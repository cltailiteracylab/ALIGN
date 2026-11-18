# AI Game Builder - Project Setup Guide

This guide covers the setup for the multi-agent AI game generator pipeline using local LLMs (Llama 3.1 & Qwen 2.5-Coder) and Docker for Playwright QA.

## Prerequisites
1. Python 3.11+
2. Ollama 
3. Docker Desktop

## 1. Download Local AI Models
Open your terminal and pull the required models into Ollama:

```bash
ollama pull llama3.1
ollama pull qwen2.5-coder
```

## 2. Install Python Dependencies

Set up your environment and install the required packages:

```bash
pip install -r requirements.txt
```

## 3. Spin Up the Docker QA Sandbox
The pipeline uses a Dockerized Playwright container to test generated JavaScript code. Run these commands sequentially (separated for Windows PowerShell compatibility) in the project root:

```bash
docker stop game-factory
docker rm game-factory
docker compose up -d --build
```
This builds and starts the `game-factory` container in the background using `docker-compose.yml`.

## 4. Run the Web Studio
Start the LangGraph pipeline and launch the Flask UI:

```bash
python main.py
```
Open a browser and navigate to `http://127.0.0.1:5000`.

## Project Structure
To prevent Git merge conflicts and organize the architecture, the project uses the following modular structure:

* `/config/`: Stores major presets, difficulty rubrics, and game styles.
* `/agents/`: Contains the prompts and logic for the Content, Developer, and Validator agents.
* `/frontend/`: Contains the React/Web UI wrapper for hosting the games.
* `/generated_games/`: The output folder for compiled HTML files (add this to your `.gitignore`).

## Local Fallback Testing (No Docker)
If Docker is consuming too much RAM or you want to rapidly test prompt modifications without the browser QA loop, you can bypass the sandbox. 

Open `main.py` and modify the top configuration toggle:
```python
USE_DOCKER = False
```
When set to `False`, the Validator agent skips Playwright execution and automatically passes the generated HTML game directly to the UI.