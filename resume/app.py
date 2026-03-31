from flask import Flask, render_template, request, jsonify
import PyPDF2
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)

# Download NLTK data
nltk.download("punkt")
nltk.download("stopwords")

# Functions 

def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text()
    return text

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text)
    return " ".join([w for w in words if w not in stop_words])

def calculate_similarity(resume, job):
    resume = remove_stopwords(clean_text(resume))
    job = remove_stopwords(clean_text(job))

    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume, job])

    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0] * 100
    return round(score, 2)

#Routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['resume']
    job_desc = request.form['job_description']

    if not file or not job_desc:
        return jsonify({"error": "Missing data"})

    resume_text = extract_text_from_pdf(file)
    score = calculate_similarity(resume_text, job_desc)

    return jsonify({"score": score})

# Run

if __name__ == '__main__':
    app.run(debug=True)