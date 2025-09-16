from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import pillow_avif


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow React frontend

# Load pre-trained model
model = tf.keras.models.load_model("models/cats_dogs_model.h5")
IMG_SIZE = 128

def preprocess_image(image):
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        image = Image.open(file.stream)
    except Exception as e:
        return jsonify({"error": f"Cannot open image: {str(e)}"}), 400

    processed = preprocess_image(image)
    prediction = model.predict(processed)[0][0]
    result = "Dog" if prediction > 0.5 else "Cat"
    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)
