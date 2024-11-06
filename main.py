# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import re
import io

app = FastAPI()

# Define regex patterns to match document details
NAME_REGEX = r"Name:\s*([A-Za-z ]+)"
DOC_NUM_REGEX = r"Document\s*Number:\s*(\w+)"
EXPIRY_DATE_REGEX = r"Expiration\s*Date:\s*([\d/-]+)"

def extract_text(image: Image.Image) -> str:
    """Extract text from an image using Tesseract OCR."""
    return pytesseract.image_to_string(image)

def parse_document_details(text: str):
    """Parse details like name, document number, and expiration date from text."""
    name = re.search(NAME_REGEX, text)
    doc_num = re.search(DOC_NUM_REGEX, text)
    expiry_date = re.search(EXPIRY_DATE_REGEX, text)

    return {
        "name": name.group(1) if name else None,
        "document_number": doc_num.group(1) if doc_num else None,
        "expiration_date": expiry_date.group(1) if expiry_date else None
    }

@app.post("/extract-info/")
async def extract_info(file: UploadFile = File(...)):
    """API endpoint to extract document information from an uploaded image."""
    try:
        image = Image.open(io.BytesIO(await file.read()))
        print(image)
        text = extract_text(image)
        details = parse_document_details(text)
        name_match = re.search(r"Name\s*:\s*([A-Z\s]+)", text)
        doc_number_match = re.search(r"UP\d{2} \d{12}", text)  # Match document number starting with "UP" followed by a space and then 12 digits
        issue_date_match = re.search(r"Issue Date\s*:\s*(\d{2}-\d{2}-\d{4})", text)
        expiry_date_match = re.search(r"Validity \(NT\)\s*:\s*(\d{2}-\d{2}-\d{4})", text)
        address_match = re.search(r"Address\s*:\s*([\w\s,]+)", text)
        print(name_match, doc_number_match, issue_date_match, expiry_date_match, address_match)
        
        # Validate if all details were found
        if not all(details.values()):
            return JSONResponse(status_code=400, content={"message": "Some details could not be extracted."})
        
        return details
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "An error occurred while processing the image."})

# Run the app using: uvicorn main:app --reload
