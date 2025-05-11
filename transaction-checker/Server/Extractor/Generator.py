import base64
import os
from google import genai
from google.genai import types
from PyPDF2 import PdfReader

class DocumentExtractor:
    def __init__(self):
        API_KEY = "AIzaSyDwxNAwqzTyQFGG6hUlXR9A7i5IGccXvRU"
        self.client = genai.Client(api_key=API_KEY)
        self.model = "gemini-2.0-flash"
        self.citation_template = """
        {
            "name_of_the_data_element": "single_data_element",
            "name_of_the_document": "",
            "line_number": "",
            "page_number": "",
            "extracted_result": ""
        }
        """

    def extract_text_from_pdf(self, pdf_path):
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

    def create_prompt(self, pdf_documents, data_element):
        documents_text = ""
        for pdf_path in pdf_documents:
            pdf_text = self.extract_text_from_pdf(pdf_path)
            documents_text += f"""
            [DOCUMENT: {os.path.basename(pdf_path)}]
            {pdf_text}
            [/DOCUMENT]
            \n---------------------------------------------------------------------------------------------------------------\n
            """

        prompt = f"""
        You are a document data extraction specialist. Extract ONE specific data element from multiple PDF documents (provided as text).

        TASK:
        1. Process all provided documents thoroughly
        2. Extract ONLY the specific data element requested
        3. Identify the BEST instance of this data element across ALL documents
        4. Return a single JSON object with proper citation

        DOCUMENTS:
        [DOCUMENTS_START]
        {documents_text}
        [DOCUMENTS_END]

        DATA ELEMENT TO EXTRACT:
        [DATA_ELEMENT]
        data element = "{data_element}"
        [/DATA_ELEMENT]

        RESPONSE FORMAT:
        Return EXACTLY ONE JSON object with this structure:
        {self.citation_template}

        IMPORTANT GUIDELINES:
        - Extract ONLY the ONE specific data element requested
        - Search through ALL documents and find the BEST instance
        - Return ONLY ONE result - the clearest, most definitive instance found
        - If the data element is not found in any document, return "extracted data": null
        - Calculate line number by counting newline characters
        - Include the specific document name where the data was found
        - Return ONLY the JSON object without explanations
        - Ensure your response is valid, parseable JSON

        Do not explain your reasoning or provide any text outside the JSON object.
        """
        return prompt

    def generate(self, pdf_documents, data_element="Re-pricing fee"):
        prompt = self.create_prompt(pdf_documents, data_element)
        
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