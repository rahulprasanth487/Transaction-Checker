from .Generator import DocumentExtractor
import os
import json
import re

def getExtractedData(element):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.abspath(os.path.join(current_dir, "..", "uploads"))
    # print(f"Uploads directory: {uploads_dir}")
    
    pdf_documents = []
    for file in os.listdir(uploads_dir):
        if file.lower().endswith('.pdf'):
            pdf_documents.append(os.path.join(uploads_dir, file))
    
    for pdf_path in pdf_documents:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
    extractor = DocumentExtractor()
    result = extractor.generate(pdf_documents, data_element=element)
    # Extract JSON content from the result string
    json_match = re.search(r'```json\s*(.*?)\s*```', result, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
        # Parse the JSON string into a Python dictionary
        json_data = json.loads(json_str)
        print("Extraction result:", json.dumps(json_data, indent=2))
        return json_data
    else:
        print("No JSON content found in the result")
        return None
    
    
def runExtraction():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'src', 'components', 'Extraction'))
    
    # Load the data elements from the JSON file
    data_elements_path = os.path.join(base_path, 'dataElements.json')
    with open(data_elements_path, 'r') as f:
        data = json.load(f)
    
    # Extract the data elements
    extracted_data = []
    for element in data['dataElements']:
        extracted_element = getExtractedData(element['name'])
        if extracted_element:
            extracted_data.append(extracted_element)
    

    extracted_elements_path = os.path.join(base_path, 'extractedDataElements.json')
    with open(extracted_elements_path, 'r') as f:
        e_data = json.load(f)
        
    # Update the original data with extracted values
    for extracted_item in extracted_data:
        for element in e_data['dataElements']:
            if element['name'] == extracted_item['name_of_the_data_element']:
                element['extractedValue'] = extracted_item['extracted_result']
                element['citations'] = [{
                    'document_name': extracted_item['name_of_the_document'],
                    'line_number': str(extracted_item['line_number']),
                    'page_number': str(extracted_item['page_number'])
                }]
                element['match'] = ""
                
    # Write the updated data back to the JSON file
    with open(extracted_elements_path, 'w') as f:
        json.dump({'dataElements': e_data['dataElements']}, f, indent=2)
        
    return e_data['dataElements']

runExtraction()
    
