import base64
import os
from google import genai
from google.genai import types
from PyPDF2 import PdfReader

class ValueMatcher:
    def __init__(self):
        API_KEY = "AIzaSyDwxNAwqzTyQFGG6hUlXR9A7i5IGccXvRU"
        self.client = genai.Client(api_key=API_KEY)
        self.model = "gemini-2.0-flash"

    def create_prompt(self, data):
        
        sample_data = """
            {
                "Mobile number": {
                    "expectedValue": "1234567890",
                    "extractedValue": "1234567890",
                }
            }
        """
        
        sample_output = """
            {
                "Mobile number" : "Match",
            }
        """

        prompt = f"""
        You are a value matcher. Your task is to match the extracted values from the documents with the expected values contextually.
        You will be provided with a list of data elements, each containing an expected value and an extracted value.
        Your job is to determine if the extracted value matches the expected value contextually.
        If the extracted value matches the expected value, respond with "Match" else "No Match".
        
        Example:
        Input data: {sample_data}
        Output: {sample_output}
        
        Note: The output should be in JSON format.
        The keys should be the names of the data elements, and the values should be "Match" or "No Match".
        
        You can use the following format:
        {{
            "data_element_name": "Match" or "No Match"
        }}
        
        The input data will be provided in the same format as the example.
        Please provide the output in the same format as the example.
        Input data: {data}
        """
        return prompt

    def generate(self,data):
        prompt = self.create_prompt(data)
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )

        response = ""
        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=generate_content_config,
        ):
            response += chunk.text
            # print(chunk.text, end="")
        
        return response


#tesing\
    
if __name__ == "__main__":
    matcher = ValueMatcher()
    result = matcher.generate(
        {
            "Price": {
                "expectedValue": "5000",
                "extractedValue": "Upto 5010",
            },
            "Name": {
                "expectedValue": "John Doe",
                "extractedValue": "John Doe",
            },
        }
    )
    print(result)