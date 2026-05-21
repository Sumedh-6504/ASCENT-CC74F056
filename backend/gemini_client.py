"""
Shared Gemini client factory + retry helper.
All three agents import from here — no duplicate setup.

Model selection (in priority order):
  1. GEMINI_MODEL env var          — explicit override, always wins
  2. USE_VERTEX_AI=true            — gemini-2.5-flash (Vertex AI, pay-per-use, no daily quota)
  3. API key (local / Render)      — gemini-2.0-flash (1 500 req/day free tier)

Why two defaults:
  gemini-2.5-flash on Vertex AI   — full capability, billed per token, no daily cap
  gemini-2.0-flash on API key     — 75× more free-tier quota than 2.5-flash (1500 vs 20/day)
"""

import os
import re
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types  # re-exported so importers only need this file

load_dotenv()

_MODEL_VERTEX_DEFAULT = "gemini-2.5-flash"   # Cloud Run / Vertex AI
_MODEL_APIKEY_DEFAULT = "gemini-2.0-flash"   # local dev / Render free tier


def get_client() -> genai.Client:
    if os.environ.get("USE_VERTEX_AI") == "true":
        return genai.Client(
            vertexai=True,
            project=os.environ.get("GOOGLE_CLOUD_PROJECT"),
            location=os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1"),
        )
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set. Add it to backend/.env")
    return genai.Client(api_key=api_key)


def get_model() -> str:
    # Explicit override always wins
    if override := os.environ.get("GEMINI_MODEL"):
        return override
    # Auto-select based on runtime
    if os.environ.get("USE_VERTEX_AI") == "true":
        return _MODEL_VERTEX_DEFAULT   # gemini-2.5-flash
    return _MODEL_APIKEY_DEFAULT       # gemini-2.0-flash


def call_gemini(client: genai.Client, contents: str, config: types.GenerateContentConfig,
                max_retries: int = 3):
    """
    Wraps generate_content with a robust Exponential Backoff retry strategy.
    - Handles short per-minute 429 rate limits seamlessly.
    - Retries up to 3 times with progressive delays (2s, 4s, 8s).
    - If a specific 'retry in X seconds' header is given, respects that duration instead.
    """
    model = get_model()
    last_err = None

    for attempt in range(max_retries + 1):
        try:
            return client.models.generate_content(
                model=model,
                contents=contents,
                config=config,
            )
        except Exception as exc:
            last_err = exc
            msg = str(exc)
            
            # Check if this is a 429 Rate Limit error
            if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
                # Do not retry if the error explicitly says daily quota is exhausted
                if any(k in msg.lower() for k in ("per day", "daily quota", "daily limit")):
                    raise exc
                
                if attempt < max_retries:
                    # Look for specific "retry in X.X s" from the Google API
                    match = re.search(r"retry in\s+(\d+(?:\.\d+)?)\s*s", msg, re.IGNORECASE)
                    if match:
                        delay = float(match.group(1)) + 0.5
                    else:
                        # Exponential backoff: 2s, 4s, 8s
                        delay = 2 ** (attempt + 1)
                    
                    print(f"[Gemini Client] Rate limit hit (429). Retrying attempt {attempt + 1}/{max_retries} in {delay:.2f}s...")
                    time.sleep(delay)
                    continue
            
            raise exc  # Re-raise immediately for all non-429 or final failures

    raise last_err  # Fallback
