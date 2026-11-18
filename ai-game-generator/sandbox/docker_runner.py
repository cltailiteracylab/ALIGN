import json
import os

import docker

from config.settings import CONTAINER_NAME, OUTPUT_DIR, USE_DOCKER


def execute_html_in_sandbox(filename: str, html_code: str) -> tuple[bool, str]:
    if not filename or os.path.basename(filename) != filename:
        return False, "Invalid game filename; only a filename without directories is allowed."

    filepath = os.path.join(OUTPUT_DIR, filename)
    try:
        with open(filepath, "w", encoding="utf-8") as game_file:
            game_file.write(html_code)
    except OSError as error:
        return False, f"Could not save generated game: {error}"

    if not USE_DOCKER:
        return True, "Local fallback active (USE_DOCKER=False): Saved file without Docker QA."

    game_url = f"file:///app/{OUTPUT_DIR}/{filename}"
    playwright_check = f"""
from playwright.sync_api import sync_playwright
import sys

errors = []
with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={{"width": 1100, "height": 800}})
    page.on("pageerror", lambda error: errors.append(f"PageError: {{error}}"))
    page.on(
        "console",
        lambda message: errors.append(f"ConsoleError: {{message.text}}")
        if message.type == "error" else None,
    )
    page.goto({json.dumps(game_url)}, wait_until="load")
    page.wait_for_timeout(400)

    canvas = page.locator("canvas:visible")
    visible_text = page.locator("body").inner_text().strip()
    if canvas.count() == 0 and not visible_text:
        errors.append("RenderError: No visible canvas or body text was found.")

    buttons = page.locator("button:visible")
    if buttons.count() > 0:
        try:
            buttons.first.click(timeout=1000)
            page.wait_for_timeout(300)
        except Exception as error:
            errors.append(f"ButtonClickError: {{error}}")

    try:
        for key in ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"]:
            page.keyboard.press(key)
            page.wait_for_timeout(40)
        if canvas.count() > 0:
            bounds = canvas.first.bounding_box()
            if bounds:
                page.mouse.click(
                    bounds["x"] + bounds["width"] / 2,
                    bounds["y"] + bounds["height"] / 2,
                )
                page.wait_for_timeout(250)
    except Exception as error:
        errors.append(f"GameplaySimulationError: {{error}}")

    browser.close()

if errors:
    print("\\n".join(errors))
    sys.exit(1)
print("Canvas rendering and interaction checks passed with no JavaScript errors.")
"""

    try:
        client = docker.from_env()
        container = client.containers.get(CONTAINER_NAME)
        exit_code, output = container.exec_run(["python", "-c", playwright_check])
        decoded_output = (
            output.decode("utf-8", errors="replace")
            if isinstance(output, bytes)
            else str(output)
        ).strip()
        return exit_code == 0, decoded_output
    except docker.errors.DockerException as error:
        return False, f"Docker sandbox error: {error}"
