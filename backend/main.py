import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parser import extract_text
from detective import run_detective
from judge import run_judge
from simulate import run_simulation
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


class SimulateRequest(BaseModel):
    findings: list[dict]
    contract_summary: str


def _raise_for_agent_error(exc: Exception, agent: str) -> None:
    """Map agent exceptions to the correct HTTP status code and a human-readable message."""
    msg = str(exc)
    if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
        if any(k in msg.lower() for k in ("per day", "free tier", "daily")):
            raise HTTPException(
                429,
                "API daily quota exhausted. The free tier allows 1,500 requests/day. "
                "Try again tomorrow or set GEMINI_MODEL=gemini-2.0-flash-lite in backend/.env for a lower quota model."
            )
        raise HTTPException(429, "API rate limit hit. Wait ~30 seconds and try again.")
    if "API_KEY" in msg or "api key" in msg.lower() or "401" in msg:
        raise HTTPException(401, "Invalid or missing GEMINI_API_KEY. Check backend/.env.")
    raise HTTPException(500, f"{agent} failed: {msg[:300]}")


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
        raise HTTPException(422, "Could not extract readable text. The file may be scanned or image-based.")

    return {"text": text}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    if len(request.contract_text.strip()) < 50:
        raise HTTPException(400, "Contract text is too short or empty.")

    try:
        detective_findings = run_detective(request.contract_text)
    except Exception as e:
        _raise_for_agent_error(e, "Detective agent")

    try:
        analysis = run_judge(request.contract_text, detective_findings)  # type: ignore[possibly-undefined]
    except Exception as e:
        _raise_for_agent_error(e, "Judge agent")

    return analysis  # type: ignore[possibly-undefined]


@app.post("/simulate")
async def simulate(request: SimulateRequest):
    if not request.findings:
        raise HTTPException(400, "No findings provided for simulation.")

    try:
        result = run_simulation(request.findings, request.contract_summary)
    except Exception as e:
        _raise_for_agent_error(e, "Simulator agent")

    return result  # type: ignore[possibly-undefined]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
