# Stage 1: Build environment
FROM python:3.9-slim AS builder

# Set working directory
WORKDIR /app

# Copy the source code into the container
COPY app .
COPY requirements.txt .

# Install the dependencies using requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the application
CMD ["python", "/app/main.py"]