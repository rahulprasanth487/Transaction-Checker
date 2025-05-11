# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import os
from google import genai
from google.genai import types
from PyPDF2 import PdfReader


def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def generate(pdf_path):
    pdf_text = extract_text_from_pdf(pdf_path)
    pdf_path2 = "./smaple.pdf"
    pdf_text2 = extract_text_from_pdf(pdf_path2)
    pdf_path3 = "./Slice.pdf"
    pdf_text3 = extract_text_from_pdf(pdf_path3)    
    citation = """
        {
            "name_of_the_data_element": "single_data_element",
            "name_of_the_document": "",
            "line_number": "",
            "page_number": "",
            "extracted_result": ""
        }
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
    [DOCUMENT: {pdf_path}]
    {pdf_text}
    [/DOCUMENT]

    [DOCUMENT: { pdf_path2}]
    {pdf_text2}
    [/DOCUMENT]
    
    [DOCUMENT: { pdf_path3}]
    {pdf_text3}
    [/DOCUMENT]

    ... additional documents as needed ...
    [DOCUMENTS_END]

    DATA ELEMENT TO EXTRACT:
    [DATA_ELEMENT]
    
    data element = "Re-pricing fee"
    
    [/DATA_ELEMENT]

    RESPONSE FORMAT:
    Return EXACTLY ONE JSON object with this structure:
    {
        citation
    }

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

    client = genai.Client(
        api_key="AIzaSyDwxNAwqzTyQFGG6hUlXR9A7i5IGccXvRU",
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")


if __name__ == "__main__":
    generate("./loan-agreement-form.pdf")
