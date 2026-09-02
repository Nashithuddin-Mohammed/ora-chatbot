import os
import requests
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://ora-chatbot.vercel.app",
    "https://ora-chatbot-7dv7y7n8o-me-0086.vercel.app"
])

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

AVAILABLE_MODELS = [
    {"id": "openai/gpt-3.5-turbo", "name": "GPT-3.5 Turbo"},
    {"id": "openai/gpt-4o-mini", "name": "GPT-4o Mini"},
    {"id": "anthropic/claude-3-haiku", "name": "Claude 3 Haiku"},
    {"id": "nvidia/nemotron-3-ultra-550b-a55b:free", "name": "Nvidia Nemotron 3 Ultra (Free)"},
    {"id": "google/gemini-flash-1.5", "name": "Gemini Flash 1.5"},
    {"id": "google/gemini-2.0-flash-exp:free", "name": "Gemini 2.0 Flash (Free)"},
    {"id": "deepseek/deepseek-r1:free", "name": "DeepSeek R1 (Free)"},
    {"id": "meta-llama/llama-3.1-8b-instruct:free", "name": "Llama 3.1 8B (Free)"},
    {"id": "mistralai/mistral-7b-instruct:free", "name": "Mistral 7B (Free)"},
]

@app.route("/api/models", methods=["GET"])
def get_models():
    return jsonify({"models": AVAILABLE_MODELS})

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    model = data.get("model", "meta-llama/llama-3-8b-instruct:free")
    stream = data.get("stream", False)

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Chatbot Interface"
    }

    payload = {
        "model": model,
        "messages": messages,
        "stream": stream
    }

    if stream:
        def generate():
            with requests.post(
                OPENROUTER_BASE_URL,
                headers=headers,
                json=payload,
                stream=True
            ) as r:
                for chunk in r.iter_lines():
                    if chunk:
                        yield f"{chunk.decode('utf-8')}\n\n"

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
    else:
        response = requests.post(
            OPENROUTER_BASE_URL,
            headers=headers,
            json=payload
        )
        return jsonify(response.json())

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "AI Chatbot Backend is running!"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)