#!/bin/sh

echo "[LexGuard] Starting FastAPI backend on port 8000..."
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Give the backend 3 seconds to boot up before starting the frontend
sleep 3

# Check if backend is still alive (catches import errors, crashes, etc.)
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "[LexGuard] ERROR: Backend failed to start! Check Python logs above."
  exit 1
fi

echo "[LexGuard] Backend is running (PID $BACKEND_PID). Starting Next.js frontend..."
cd /app/frontend
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export BACKEND_URL=http://localhost:8000
exec node server.js
