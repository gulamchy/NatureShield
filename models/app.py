from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import csv
import os
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

MODEL_CONFIG = {
    "plants":  ("plants/model.tflite",  "plants/labels.csv"),
    "birds":   ("birds/model.tflite",   "birds/labels.csv"),
    "insects": ("insects/model.tflite", "insects/labels.csv"),
    "mammals": ("mammals/model.tflite", "mammals/labels.csv"),
}

def load_labels(label_path):
    for enc in ('utf-8-sig', 'utf-16'):
        try:
            with io.open(label_path, 'r', encoding=enc) as f:
                reader = csv.reader(f)
                labels = {}
                for row in reader:
                    if not row:
                        continue
                    try:
                        idx = int(row[0])
                    except ValueError:
                        continue
                    if len(row) >= 3:
                        sci, com = row[1], row[2]
                    else:
                        sci, com = row[1], ''
                    labels[idx] = (sci, com)
            return labels
        except UnicodeError:
            continue
    return labels

def preprocess(image_bytes, input_size, interpreter):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = img.size
    m = min(w, h)
    img = img.crop(((w - m) // 2, (h - m) // 2, (w + m) // 2, (h + m) // 2))
    img = img.resize(input_size, Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32)
    inp_det = interpreter.get_input_details()[0]
    dtype = inp_det["dtype"]
    scale, zp = inp_det["quantization"]
    if dtype == np.uint8:
        arr = (arr / 255.0 / scale + zp).round().clip(0, 255).astype(np.uint8)
    else:
        arr = (arr / 255.0).astype(np.float32)
    return np.expand_dims(arr, axis=0)

def infer(interpreter, input_data):
    inp_det = interpreter.get_input_details()[0]
    out_det = interpreter.get_output_details()[0]
    interpreter.set_tensor(inp_det["index"], input_data)
    interpreter.invoke()
    raw = interpreter.get_tensor(out_det["index"])[0]
    idx = int(np.argmax(raw))
    return idx

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        category = request.form.get('category', 'plants').lower()
        if category not in MODEL_CONFIG:
            return jsonify({'error': 'Invalid category'}), 400

        file = request.files.get('image')
        if not file:
            return jsonify({'error': 'No image uploaded'}), 400

        model_path, label_path = MODEL_CONFIG[category]
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        _, H, W, _ = interpreter.get_input_details()[0]['shape']
        input_data = preprocess(file.read(), (W, H), interpreter)
        idx = infer(interpreter, input_data)
        labels = load_labels(label_path)
        sci, com = labels.get(idx, ("Unknown", "Unknown"))

        return jsonify({
            'scientific_name': sci,
            'common_name': com,
            'filename': f"{com or sci or 'unknown'}.jpg"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)


