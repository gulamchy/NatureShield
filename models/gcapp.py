
from flask import Flask, request, render_template_string
from google.cloud import vision
import os, unicodedata

# Normalize text so that it can check if invasive
def normalize(text):
    text = unicodedata.normalize('NFD', text)
    text = ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn')
    return text.lower().strip()

# Load the invasive species list
with open('invasive_species.txt', 'r', encoding='utf-8') as f:
    INVASIVE_LIST = {normalize(line) for line in f if line.strip()}

app = Flask(__name__)
client = vision.ImageAnnotatorClient()

# HTML for the home page, just upload an image from device
INDEX_HTML = '''
<!doctype html>
<title>NatureShield</title>
<form method="post" action="/detect" enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*" required>
  <button type="submit">Identify</button>
</form>
'''
# HTML for the results page, will show if there is an invasive species
RESULT_HTML = '''
<!doctype html>
<title>NatureShield</title>
<p>{{ label }}{% if invasive %} — Invasive Species{% endif %}</p>
'''

@app.route('/')
def home():
    return INDEX_HTML

# Google Vision Stuff, will only return the models best guess
@app.route('/detect', methods=['POST'])
def detect():
    img_bytes = request.files['image'].read()
    image = vision.Image(content=img_bytes)
    context = vision.ImageContext(language_hints=['en'])

    web_resp = client.web_detection(image=image, image_context=context)
    best_guesses = web_resp.web_detection.best_guess_labels or []
    if best_guesses:
        label = best_guesses[0].label.split(',')[0].strip().title()
    else:
        labels = client.label_detection(image=image, image_context=context).label_annotations
        label = labels[0].description.title() if labels else 'No species detected'

    # Check if the species is in the Washington invasive species list
    invasive = normalize(label) in INVASIVE_LIST

    return render_template_string(RESULT_HTML, label=label, invasive=invasive)

if __name__ == '__main__':
    app.run(debug=True)