from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
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

@app.route('/api/ocr', methods=['POST'])
def ocr():
    # For testing purposes, let's just return a fixed response
    # try:
    #     # Ensure that we are returning a serializable object, such as a dictionary or list
    #     return jsonify({'message': 'This is for testing the API'}), 200
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

    # The following code is commented out for testing purposes
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
        results = reader.readtext(file_path)
        extracted_text = [{"text": text, "confidence": confidence} for _, text, confidence in results]

        # Return results
        return jsonify({'results': extracted_text}), 200
        # return jsonify({'results': "this is sick"}), 200
    except Exception as e:
        return jsonify({'error': "this is exception"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
