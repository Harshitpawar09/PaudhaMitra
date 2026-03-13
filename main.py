import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "PaudhaMitra Backend is successfully running!"

# Agar aapke paas koi AI model hai, toh aap uski API yahan bana sakte hain
@app.route('/predict', methods=['POST'])
def predict():
    return {"message": "Here you will add your plant prediction logic!"}

if __name__ == "__main__":
    # Render automatically $PORT environment variable assign karta hai
    port = int(os.environ.get("PORT", 5000))
    # host="0.0.0.0" likhna Render ke liye bahut zaroori hai
    app.run(host="0.0.0.0", port=port)
