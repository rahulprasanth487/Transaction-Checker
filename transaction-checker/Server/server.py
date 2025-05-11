from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
from Extractor import Extraction

app = Flask(__name__)
CORS(app)

PORT = 3001
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def transform_data_for_extraction(data):
    """Transform the data to include extraction fields"""
    transformed_elements = []
    for element in data:
        transformed_element = {
            "name": element["name"],
            "expectedValue": element["expectedValue"],
            "extractedValue": "",
            "match": "",
            "citations": {
                "document_name": "",
                "line_number": "",
                "page_number": ""
            }
        }
        transformed_elements.append(transformed_element)
    return transformed_elements


@app.post('/api/updateJson')
def update_json():
    try:
        # Get the current directory and construct file path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        base_path = os.path.join(current_dir, '..', 'src', 'components', 'Extraction')
        
        data_elements_path = os.path.join(base_path, 'dataElements.json')
        extracted_elements_path = os.path.join(base_path, 'extractedDataElements.json')
        
        # Get the data from request
        data = request.get_json()
        
        # Write to dataElements.json
        with open(data_elements_path, 'w') as f:
            json.dump({'dataElements': data}, f, indent=2)
            
        # Transform and write to extractedDataElements.json
        transformed_data = transform_data_for_extraction(data)
        with open(extracted_elements_path, 'w') as f:
            json.dump({'dataElements': transformed_data}, f, indent=2)
            
        return jsonify({'success': True})
    
    except Exception as error:
        print('Error updating JSON file:', str(error))
        return jsonify({'success': False, 'error': str(error)}), 500


@app.route('/api/extract', methods=['POST'])
def extract_pdfs():
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'}), 400

        files = request.files.getlist('files')
        saved_files = []
        
        upload_dir = os.path.abspath(app.config['UPLOAD_FOLDER'])
        print(f"Upload directory: {upload_dir}")

        for file in files:
            print(f"Processing file: {file.filename}")
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(upload_dir, filename)
                print(f"Saving file to: {filepath}")
                file.save(filepath)
                saved_files.append(filepath)
            else:
                print(f"File {file.filename} is not allowed or is missing")
                return jsonify({'success': False, 'error': f'File {file.filename} is not allowed'}), 400

        if not saved_files:
            return jsonify({'success': False, 'error': 'No valid PDF files uploaded'}), 400

        print(f"Successfully saved {len(saved_files)} files")
        
        # Call the extraction function.
        extracted_content = Extraction.runExtraction()
        
        return jsonify({
            'success': True,
            'message': f'Successfully received {len(saved_files)} files',
            'files': saved_files,
            'extracted_content': extracted_content
        })

    except Exception as error:
        print('Error processing PDF files:', str(error))
        return jsonify({'success': False, 'error': str(error)}), 500
    
@app.route('/uploads/<path:filename>')
def serve_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as error:
        return jsonify({'success': False, 'error': str(error)}), 404
      
if __name__ == '__main__':
    app.run(port=PORT)
    