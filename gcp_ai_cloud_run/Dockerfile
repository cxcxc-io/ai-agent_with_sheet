# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/requirements.txt

# Install the dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application code to the container
COPY . /app

# Expose the port that the app runs on
EXPOSE 8080

# Command to run the app using gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "app:app"]