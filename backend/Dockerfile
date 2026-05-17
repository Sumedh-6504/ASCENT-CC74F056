FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port 8000 for Cloud Run
EXPOSE 8000

# Command to run the application using Uvicorn
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
