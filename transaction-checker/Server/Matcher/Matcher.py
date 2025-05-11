from .MatchGenerator import ValueMatcher
import os
import json
import re

def executeMatcher():
    #need to give the data to the matcher in the folloiwing format
    # data = {
    #     "Price": {
    #         "expectedValue": "5000",
    #         "extractedValue": "Upto 5010",
    #     },
    #     "Name": {
    #         "expectedValue": "John Doe",
    #         "extractedValue": "John Doe",
    #     },
    # }
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'src', 'components', 'Extraction'))

    
    # Load the data elements from the JSON file
    data_elements_path = os.path.join(base_path, 'extractedDataElements.json')
    with open(data_elements_path, 'r') as f:
        data = json.load(f)
    
    # Extract the data elements
    extracted_data = []
    for element in data['dataElements']:
        extracted_element = {
            element['name']: {
                "expectedValue": element['expectedValue'],
                "extractedValue": element['extractedValue']
            }
        }
        extracted_data.append(extracted_element)
    
        
    matcher = ValueMatcher()

    result = matcher.generate(extracted_data)
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
    
def runMatcher():
    result = executeMatcher()
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'src', 'components', 'Extraction'))
    
    # Load the data elements from the JSON file
    data_elements_path = os.path.join(base_path, 'extractedDataElements.json')
    with open(data_elements_path, 'r') as f:
        data = json.load(f)
        
    for element in data['dataElements']:
            element_name = element['name']
            if element_name in result:
                element['match'] = result[element_name]
    
    with open(data_elements_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    return data['dataElements']