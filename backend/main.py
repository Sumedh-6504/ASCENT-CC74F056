import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parser import extract_text
from detective import run_detective
from judge import run_judge
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LexGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/octet-stream",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}


class AnalyzeRequest(BaseModel):
    contract_text: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "LexGuard API"}


@app.post("/parse")
async def parse_file(file: UploadFile = File(...)):
    name = file.filename or ""
    ext = ("." + name.rsplit(".", 1)[-1].lower()) if "." in name else ""

    if file.content_type not in ALLOWED_TYPES and ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Unsupported file type. Accepted: PDF, DOCX, TXT")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Uploaded file is empty.")

    text = extract_text(contents, file.content_type or "", name)

    if len(text.strip()) < 50:
        raise HTTPException(
            422,
            "Could not extract readable text. The file may be scanned or image-based.",
        )

    return {"text": text}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    if len(request.contract_text.strip()) < 50:
        raise HTTPException(400, "Contract text is too short or empty.")

    try:
        detective_findings = run_detective(request.contract_text)
    except Exception as e:
        raise HTTPException(500, f"Detective agent failed: {e}")

    try:
        analysis = run_judge(request.contract_text, detective_findings)
    except Exception as e:
        raise HTTPException(500, f"Judge agent failed: {e}")

    return analysis


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
