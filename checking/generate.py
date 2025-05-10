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
    citation = """
        {
        "name of the element": "name",
        "document_name": "Sample PDF",
        "extracted_result": "John doe",
        "page": 1,
        "line": 1,
        }
    """
    prompt = f"""
    You are a specialized data extraction system for document analysis. You will analyze text extracted from PDF documents and find specific information related to loans.

INPUT:
1. Text content already extracted from a PDF document
2. Document filename for citation purposes

EXTRACTION TASK:
Extract the following specific loan-related data elements:
- loan approver
- Sanctioned Loan amount
- loan type
- Re-pricing Fees

RESPONSE FORMAT:
Return ONLY a valid JSON array containing objects with these exact fields:
- "name of the data element": The name of the requested field (e.g., "loan approver")
- "name of the document": The filename of the source document
- "extracted data": The actual extracted information
- "Page number": The approximate page number where the information appears in the text
- "line number": The approximate line number where the information appears in the text


IMPORTANT GUIDELINES:
- Be precise and extract only the specific information requested
- Calculate line numbers by counting newline characters
- If a data element cannot be found, use null for "extracted data" but include the other fields
- Return ONLY the JSON array without any explanations or additional text
- Ensure your response is valid JSON that can be parsed programmatically

Here is the document text:
[DOCUMENT_TEXT]
{pdf_text}
[/DOCUMENT_TEXT]

Document filename: {pdf_path}
    
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
