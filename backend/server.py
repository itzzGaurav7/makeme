from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import requests
from werkzeug.utils import secure_filename
import os

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all origins, or specify your own origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Set upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])  # Add other languages if needed

# Helper function to send extracted text to the other server
def send_to_other_server(text):
    url = "http://192.168.0.112:3000"  # The URL of the other server
    headers = {"Content-Type": "application/json"}
    payload = {"raw_text": text}
    

    try:
        response = requests.post(url, json=payload, headers=headers)
        # If the request is successful, return the response
        if response.status_code == 200:
            return response.json()  # Return the response from the other server
        else:
            return {"error": "Failed to send data to the other server"}
    except requests.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

@app.route('/api/ocr', methods=['POST'])
def ocr():
    # Check if an image file is provided
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded image
    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Perform OCR
       # Perform OCR
        results = reader.readtext(file_path)
        extracted_text = [{"text": text, "confidence": confidence} for _, text, confidence in results]

        # Join all extracted text into a single string
        extracted_text_str = " ".join([text for _, text, _ in results])

        print(extracted_text_str)

        
        server_response = send_to_other_server(extracted_text_str)

        # Return the response from the other server to the client
        return jsonify(server_response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
