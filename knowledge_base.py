import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the knowledge base from data.json
def load_knowledge_base():
    """Loads knowledge base from data.json file."""
    try:
        with open("data.json", "r", encoding="utf-8") as file:
            data = json.load(file)
            logging.info("Knowledge base loaded successfully.")
            return data
    except Exception as e:
        logging.error(f"Failed to load knowledge base: {e}")
        return {"paragraphs": [], "headings": {}, "links": {}}

knowledge_base = load_knowledge_base()

def search_knowledge_base(query):
    """Search knowledge base for relevant information."""
    try:
        for para in knowledge_base.get("paragraphs", []):
            if query.lower() in para.lower():
                return para
        for heading_list in knowledge_base.get("headings", {}).values():
            for heading in heading_list:
                if query.lower() in heading.lower():
                    return heading
        return None
    except Exception as e:
        logging.error(f"Error searching knowledge base: {e}")
        return None

def save_to_knowledge_base(question, answer):
    """Save new Gemini AI responses to the knowledge base."""
    try:
        knowledge_base["paragraphs"].append(answer)
        with open("data.json", "w", encoding="utf-8") as file:
            json.dump(knowledge_base, file, indent=4, ensure_ascii=False)
        logging.info("New data saved to knowledge base.")
    except Exception as e:
        logging.error(f"Failed to save data to knowledge base: {e}")