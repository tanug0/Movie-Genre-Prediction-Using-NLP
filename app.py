import os
import re
import joblib
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS

# Initialize Flask application
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)  # Enable Cross-Origin Resource Sharing for development

# Define paths for the model, vectorizer, and plots
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "movie_genre_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")

# Load the pre-trained Machine Learning model and vectorizer
print("Loading model and vectorizer...")
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and vectorizer loaded successfully!")
except Exception as e:
    print(f"Error loading model/vectorizer: {e}")
    model = None
    vectorizer = None

def preprocess_text(text):
    """
    Preprocesses the input text exactly as done in movie_genre.py:
    1. Convert text to lowercase.
    2. Remove punctuation.
    """
    if not text:
        return ""
    cleaned = text.lower()
    cleaned = re.sub(r"[^\w\s]", "", cleaned)
    return cleaned

@app.route("/")
def index():
    """Route to serve the main HTML page."""
    return render_template("index.html")

@app.route("/api/predict", methods=["POST"])
def predict():
    """
    API endpoint to predict the genre of a movie based on its description.
    Expects a JSON payload: { "description": "movie plot description..." }
    """
    if not model or not vectorizer:
        return jsonify({"error": "Model or Vectorizer is not loaded on the server."}), 500

    data = request.get_json()
    if not data or "description" not in data:
        return jsonify({"error": "Missing 'description' in request body."}), 400

    description = data["description"].strip()
    if not description:
        return jsonify({"error": "Description cannot be empty."}), 400

    try:
        # Preprocess the input text using the exact same logic as movie_genre.py
        cleaned_text = preprocess_text(description)

        # Vectorize the cleaned text
        vectorized_input = vectorizer.transform([cleaned_text])

        # Predict the genre
        prediction = model.predict(vectorized_input)
        predicted_genre = prediction[0]

        # Return the prediction response
        return jsonify({
            "success": True,
            "description": description,
            "cleaned_description": cleaned_text,
            "predicted_genre": predicted_genre
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

@app.route("/api/plots/<filename>")
def get_plot(filename):
    """
    Serve the pre-generated plots directly from the project root.
    Avoids duplicating the files into the static folder.
    """
    allowed_plots = ["genre_distribution.png", "confusion_matrix.png", "heatmap.png"]
    if filename in allowed_plots:
        return send_from_directory(BASE_DIR, filename)
    else:
        return jsonify({"error": "File not found or access denied."}), 404

if __name__ == "__main__":
    
    app.run(host="127.0.0.1", port=5000, debug=True)
