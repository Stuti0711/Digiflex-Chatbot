from flask import Flask, request, jsonify
from query_ai import get_response  # Ensure this file is uploaded

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    bot_response = get_response(user_message)
    return jsonify({"response": bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)  # Use port 7860 for Hugging Face
