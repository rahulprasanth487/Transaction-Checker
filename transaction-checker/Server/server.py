from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

PORT = 3001


def transform_data_for_extraction(data):
    """Transform the data to include extraction fields"""
    transformed_elements = []
    for element in data:
        transformed_element = {
            "name": element["name"],
            "expectedValue": element["expectedValue"],
            "extractedValue": "",
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

if __name__ == '__main__':
    app.run(port=PORT)