import os
import io
import json
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "paudhamitra_model.keras")

model = None

CLASS_NAMES = [
    "Bacterial Spot",
    "Early Blight",
    "Late Blight",
    "Leaf Mold",
    "Septoria Leaf Spot",
    "Spider Mites",
    "Target Spot",
    "Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus",
    "Healthy",
    "Powdery Mildew",
    "Leaf Spot",
    "Rust",
    "Downy Mildew",
    "Anthracnose",
    "Botrytis Blight"
]

DISEASE_INFO = {
    "Bacterial Spot": {
        "treatment": "Apply copper-based bactericides. Remove infected plant material. Avoid overhead irrigation. Use disease-free seeds.",
        "symptoms": "Small water-soaked spots on leaves that turn brown with yellow halos. Spots may merge causing leaf blight."
    },
    "Early Blight": {
        "treatment": "Remove infected leaves immediately. Apply copper fungicide every 10 days. Mulch soil to prevent spore splash.",
        "symptoms": "Brown spots with concentric rings on lower leaves, yellow halos around spots."
    },
    "Late Blight": {
        "treatment": "Remove infected plant parts. Use fungicides containing chlorothalonil or mancozeb. Improve air circulation.",
        "symptoms": "Water-soaked spots on leaves, white fungal growth on undersides, rapid spread in cool wet weather."
    },
    "Leaf Mold": {
        "treatment": "Improve air circulation. Reduce humidity. Apply fungicides. Remove affected leaves.",
        "symptoms": "Yellow patches on upper leaf surface with olive-green to grayish fungal growth underneath."
    },
    "Septoria Leaf Spot": {
        "treatment": "Remove and destroy infected leaves. Apply fungicide at first sign of disease. Avoid overhead watering.",
        "symptoms": "Small circular spots with dark borders and lighter centers, tiny black dots in center of spots."
    },
    "Spider Mites": {
        "treatment": "Apply insecticidal soap or neem oil. Increase humidity. Introduce predatory mites. Spray water on undersides.",
        "symptoms": "Fine webbing on leaves, yellowing and stippling of leaves, small moving dots visible on undersides."
    },
    "Target Spot": {
        "treatment": "Apply appropriate fungicides. Improve air circulation. Remove debris. Rotate crops.",
        "symptoms": "Brown lesions with concentric rings resembling a target, yellow halos around affected areas."
    },
    "Tomato Yellow Leaf Curl Virus": {
        "treatment": "Control whitefly vectors with insecticides. Use reflective mulches. Remove infected plants.",
        "symptoms": "Yellowing and upward curling of leaves, stunted plant growth, flower drop."
    },
    "Tomato Mosaic Virus": {
        "treatment": "Remove infected plants. Control aphids. Use virus-free seeds. Wash hands and tools.",
        "symptoms": "Mosaic pattern of light and dark green on leaves, leaf distortion, stunted growth."
    },
    "Healthy": {
        "treatment": "Continue regular watering, fertilizing, and pruning. Monitor for any signs of disease or pests.",
        "symptoms": "No visible signs of disease or stress. Green, vibrant foliage with no spots or discoloration."
    },
    "Powdery Mildew": {
        "treatment": "Apply sulfur dust or neem oil every 7 days. Ensure good air circulation. Remove affected leaves. Avoid overhead watering.",
        "symptoms": "White powdery coating on leaves, stems, and flowers."
    },
    "Leaf Spot": {
        "treatment": "Remove affected leaves. Apply fungicide weekly. Avoid overhead irrigation. Disinfect tools between plants.",
        "symptoms": "Circular brown or black spots with yellow halos on leaves."
    },
    "Rust": {
        "treatment": "Apply sulfur or neem-based fungicide. Remove infected leaves. Improve air circulation around plants.",
        "symptoms": "Yellow-orange or reddish pustules on leaf undersides, yellowing of upper surface."
    },
    "Downy Mildew": {
        "treatment": "Apply copper-based fungicides. Improve air circulation. Avoid overhead watering. Remove infected plants.",
        "symptoms": "Yellow angular spots on upper leaf surface, grayish-purple downy growth on lower surface."
    },
    "Anthracnose": {
        "treatment": "Apply fungicide. Remove infected fruit and plant material. Avoid overhead irrigation.",
        "symptoms": "Sunken, dark, circular lesions on fruit. Dark spots on leaves and stems."
    },
    "Botrytis Blight": {
        "treatment": "Remove infected plant parts. Improve air circulation. Reduce humidity. Apply appropriate fungicide.",
        "symptoms": "Gray fuzzy mold on affected tissues, brown lesions on leaves, stems and flowers."
    }
}

def load_model():
    global model
    if model is None:
        try:
            import keras
            model = keras.models.load_model(MODEL_PATH)
            print(f"Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    return model

def preprocess_image(image_data):
    if image_data.startswith("data:"):
        image_data = image_data.split(",")[1]
    
    image_bytes = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400
        
        m = load_model()
        if m is None:
            return jsonify({"error": "Model not available"}), 500
        
        img_array = preprocess_image(data["image"])
        
        predictions = m.predict(img_array, verbose=0)
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_idx]) * 100
        
        if predicted_idx < len(CLASS_NAMES):
            disease_name = CLASS_NAMES[predicted_idx]
        else:
            disease_name = f"Class {predicted_idx}"
        
        info = DISEASE_INFO.get(disease_name, {
            "treatment": "Consult a plant disease specialist for proper diagnosis and treatment.",
            "symptoms": "Please refer to a plant pathology guide for details."
        })
        
        top_predictions = []
        sorted_indices = np.argsort(predictions[0])[::-1][:3]
        for idx in sorted_indices:
            name = CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else f"Class {idx}"
            top_predictions.append({
                "name": name,
                "confidence": float(predictions[0][idx]) * 100
            })
        
        return jsonify({
            "disease": disease_name,
            "confidence": round(confidence, 1),
            "treatment": info["treatment"],
            "symptoms": info["symptoms"],
            "topPredictions": top_predictions
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/healthz", methods=["GET"])
def health():
    m = load_model()
    return jsonify({
        "status": "ok",
        "model_loaded": m is not None
    })

if __name__ == "__main__":
    port = int(os.environ.get("ML_PORT", 5001))
    print(f"Starting PaudhaMitra ML server on port {port}")
    load_model()
    app.run(host="0.0.0.0", port=port, debug=False)
