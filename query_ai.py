import google.generativeai as genai
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)

# Set up Gemini API Key (Replace with your API Key)
  # Store key in environment variables for security
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
def load_company_data(file_path="digiflex_chatbot_complete_data.txt"):
    """Load company data from a local text file."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        logging.error("Company data file not found.")
        return "Company-specific data is not available."

def query_gemini(prompt, query_type="default", file_path="company_data.txt"):
    """
    Queries Gemini AI using local company data and returns a formatted response.
    """
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")  # Use latest model
        company_info = load_company_data(file_path)  # Load company data

        # Modify the prompt to include company knowledge
        full_prompt = f"{company_info}\n\nUser Query: {prompt}\n\nAI Response:"

        # Generate response
        response = model.generate_content(full_prompt)
        response_text = response.text.strip() if hasattr(response, "text") else "I couldn't generate a response."

        return format_response(response_text, query_type)

    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        return "Sorry, an error occurred while generating a response."

def format_response(response_text, query_type="default"):
    """
    Formats AI responses based on the query type using content.py rules.
    """
    try:
        from content import get_response_format
        response_template = get_response_format(query_type)
        
        if not isinstance(response_template, str):
            logging.error("Invalid response format: response_templates should be a dictionary string.")
            return response_text  # Return unformatted response as fallback

        formatted_response = response_template.replace("{response}", response_text)

        # Preserve new lines for bullet points
        if query_type in ["bullet_points", "points_with_paragraph"]:
            formatted_response = formatted_response.replace("\\n", "\n")

        return formatted_response

    except ImportError:
        logging.error("content.py module not found, returning raw response.")
        return response_text

# Example Usage
if __name__ == "__main__":
    print(query_gemini("What services does your company offer?"))
