from flask import Flask, request, jsonify, render_template,send_from_directory
from flask_cors import CORS
import logging
from query_ai import query_gemini
from knowledge_base import search_knowledge_base, save_to_knowledge_base
from prompts import get_prompt
import os
from speech_to_text import recognize_speech

# Initialize Flask app
app = Flask(__name__, static_folder="Static")
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/")
def home():
    # return "Chatbot is running"
    return render_template("index.html")

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get("message", "").strip()
        query_type = data.get("format", "default")

        if not user_input:
            return jsonify({"response": "Please provide a valid message."})

        # 🔹 Step 1: Check predefined prompts
        prompt_response = get_prompt(user_input.lower()) or "Let me find an answer for you."

        # 🔹 Step 2: Search the knowledge base
        kb_response = search_knowledge_base(user_input)

        # 🔹 Step 3: Construct final prompt
        final_prompt = f"{prompt_response}\n\nUser Query: {user_input}"
        if kb_response:
            final_prompt = f"{prompt_response}\n\nBased on the knowledge base: {kb_response}\n\nUser Query: {user_input}"

        # 🔹 Step 4: Generate AI response
        response = query_gemini(final_prompt, query_type=query_type)

        # 🔹 Step 5: Save response if it's new
        if not kb_response:
            save_to_knowledge_base(user_input, response)

        return jsonify({"response": response})

    except Exception as e:
        logging.error(f"Error in /chat endpoint: {e}")
        return jsonify({"response": "An error occurred while processing your request."})

@app.route("/script/chatbot.js")
def chatbot_script():
    return send_from_directory("static", "chatbot.js")

@app.route('/speech', methods=['GET'])
def speech_to_text():
    """Endpoint to recognize speech and return text."""
    text = recognize_speech()
    return jsonify({"recognized_text": text})

if __name__ == '__main__':
    # port = int(os.environ.get("PORT", 10000))  # Use Render's default port
    app.run(host="0.0.0.0",port=5000, debug=True)
