from flask import Flask, send_from_directory

app = Flask(__name__, static_folder=None)

DOCS_FOLDER = "docs"


@app.route("/")
def home():
    return send_from_directory(DOCS_FOLDER, "index.html")


@app.route("/<path:filename>")
def serve_docs(filename):
    return send_from_directory(DOCS_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)