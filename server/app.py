from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import logging
import google.generativeai as genai
from flask_cors import CORS 

# Load environment variables
load_dotenv()

# Get API key from .env file
API_KEY = os.getenv("GOOGLE_GENAI_API_KEY")

if not API_KEY:
    raise EnvironmentError("GOOGLE_GENAI_API_KEY is not set in the .env file.")

# Configure the GenAI client
genai.configure(api_key=API_KEY)

# Initialize Flask app
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ""}})

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/generate', methods=['POST'])
def generate_content():
    """
    API endpoint to generate a multiple-choice question using Google Generative AI.
    Expects a JSON payload with a "raw_text" field.
    """
    data = request.get_json()

    if not data or 'raw_text' not in data:
        return jsonify({"error": "Invalid request. 'raw_text' field is required."}), 400

    raw_text = data['raw_text']

    # Create the prompt template
    prompt = f"""
    Here is a raw text:
    {raw_text}

    Read the text carefully and create a multiple-choice question based on its content. The question should have one correct answer and three wrong options. Ensure the options are related but clearly distinguishable. Format the output as follows:

    Question: [Insert the question here]
    Options:
    a) [Option A]
    b) [Option B]
    c) [Option C]
    d) [Option D]
    e) [Option E]
    f) [Option F]
    Correct Answer: [Indicate the correct option letter, e.g., 'b']
    """

    try:
        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash-8b")
        
        # Generate response
        response = model.generate_content(prompt)

        # Parse the response into JSON format
        output_lines = response.text.strip().split("\n")
        question = output_lines[0].replace("Question: ", "").strip()
        options = {
            "a": output_lines[1].replace("a) ", "").strip(),
            "b": output_lines[2].replace("b) ", "").strip(),
            "c": output_lines[3].replace("c) ", "").strip(),
            "d": output_lines[4].replace("d) ", "").strip(),
            "e": output_lines[5].replace("e) ", "").strip(),
            "f": output_lines[6].replace("f) ", "").strip(),
        }
        correct_answer = output_lines[5].replace("Correct Answer: ", "").strip()

        # Format the data for the Google Forms API
        form_data = {
            "requests": [
                {
                    "createItem": {
                        "item": {
                            "title": question,
                            "questionItem": {
                                "question": {
                                    "questionId": "question-1",
                                    "questionType": "RADIO",
                                    "options": [
                                        {"value": options["a"]},
                                        {"value": options["b"]},
                                        {"value": options["c"]},
                                        {"value": options["d"]},
                                        {"value": options["e"]},
                                        {"value": options["f"]}
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        }

        # Assuming you will send form_data to the Google Forms API here

        return jsonify({
            "question": question,
            "options": options,
            "correct_answer": correct_answer,
            "form_data": form_data  # This is the data to be sent to Google Forms API
        })

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
